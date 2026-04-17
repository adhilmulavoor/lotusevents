'use server'

import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

export type EarningsFilter = 'this_week' | 'this_month' | 'all_time'

export async function getMemberDashboardData(filter: EarningsFilter = 'this_month') {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized', data: null }

  // Get worker record (using workers table instead of members)
  const { data: workerRecord, error: workerErr } = await supabaseAdmin
    .from('workers')
    .select('*')
    .eq('user_id', session.id)
    .single()

  if (workerErr || !workerRecord) {
    return { error: 'Worker record not found.', data: null }
  }

  // Date filter
  const now = new Date()
  let fromDate: string | null = null

  if (filter === 'this_week') {
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1) // Monday
    const monday = new Date(now.setDate(diff))
    monday.setHours(0, 0, 0, 0)
    fromDate = monday.toISOString()
  } else if (filter === 'this_month') {
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    fromDate = firstDay.toISOString()
  }

  // Discover actual column names in event_workers table
  const { data: sampleData } = await supabaseAdmin
    .from('event_workers')
    .select('*')
    .limit(1)

  const columns = sampleData && sampleData.length > 0 ? Object.keys(sampleData[0]) : []
  console.log('[getMemberDashboardData] Discovered columns:', columns)
  
  // Find the correct column for worker/member ID
  const workerCol = columns.find(c => c.toLowerCase().includes('worker') || c.toLowerCase().includes('member')) || 'worker_id'
  console.log('[getMemberDashboardData] Using workerCol:', workerCol)

  // Fetch event_workers for this worker with event details
  let query = supabaseAdmin
    .from('event_workers')
    .select(`
      *,
      events(id, event_name, date, location, status)
    `)
    .eq(workerCol, workerRecord.id)

  const { data: eventWorkersRaw, error: ewError } = await query

  if (ewError) {
    return { error: ewError.message, data: null }
  }

  // Map work_units to ta_amount for frontend compatibility
  const eventWorkers = (eventWorkersRaw || []).map(ew => ({
    ...ew,
    ta_amount: ew.work_units || 0,
  }))

  // Calculate filtered totals
  const filteredEarnings = eventWorkers.reduce((acc, ew) => {
    return acc + (ew.wage_amount || 0) + (ew.ta_amount || 0)
  }, 0)

  const filteredTaTotal = eventWorkers.reduce((acc, ew) => {
    return acc + (ew.ta_amount || 0)
  }, 0)

  const filteredSalaryTotal = eventWorkers.reduce((acc, ew) => {
    return acc + (ew.wage_amount || 0)
  }, 0)

  const filteredPaid = eventWorkers.reduce((acc, ew) => {
    return acc + (ew.paid_amount || 0)
  }, 0)

  const filteredPending = filteredEarnings - filteredPaid

  // Calculate overall totals
  let allQuery = supabaseAdmin
    .from('event_workers')
    .select('wage_amount, work_units, paid_amount')
    .eq(workerCol, workerRecord.id)

  const { data: allWorkers } = await allQuery

  const totalEarned = (allWorkers || []).reduce((acc, ew) => {
    return acc + (ew.wage_amount || 0) + (ew.work_units || 0)
  }, 0)

  const totalPaid = (allWorkers || []).reduce((acc, ew) => {
    return acc + (ew.paid_amount || 0)
  }, 0)

  const pendingAmount = totalEarned - totalPaid

  return {
    data: {
      member: workerRecord,
      eventWorkers,
      totalEarned,
      totalPaid,
      pendingAmount,
      advanceTaken: 0,
      filteredEarnings,
      filteredSalaryTotal,
      filteredTaTotal,
      filteredPaid,
      filteredPending,
    },
    error: null,
  }
}

export async function getMemberPaymentHistory() {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized', data: null }

  console.log('[getMemberPaymentHistory] session:', session.id, session.email)

  const { data: workerRecord, error: workerErr } = await supabaseAdmin
    .from('workers')
    .select('id, user_id, job_type')
    .eq('user_id', session.id)
    .single()

  console.log('[getMemberPaymentHistory] workerRecord:', workerRecord, 'error:', workerErr)

  if (!workerRecord) return { error: 'Worker not found. Please contact admin.', data: null }

  // Discover actual column names
  const { data: sampleData } = await supabaseAdmin
    .from('event_workers')
    .select('*')
    .limit(1)

  const columns = sampleData && sampleData.length > 0 ? Object.keys(sampleData[0]) : []
  console.log('[getMemberPaymentHistory] event_workers columns:', columns)
  
  const workerCol = columns.find(c => c.toLowerCase().includes('worker') || c.toLowerCase().includes('member')) || 'worker_id'
  console.log('[getMemberPaymentHistory] Using workerCol:', workerCol, 'workerId:', workerRecord.id)

  const { data: eventWorkers, error } = await supabaseAdmin
    .from('event_workers')
    .select(`
      id,
      wage_amount,
      work_units,
      paid_amount,
      pending_amount,
      attendance,
      events(id, event_name, date, location, status, controller_id)
    `)
    .eq(workerCol, workerRecord.id)

  console.log('[getMemberPaymentHistory] eventWorkers:', eventWorkers?.length, 'error:', error)

  if (error) {
    return { error: error.message, data: null }
  }

  // Get controller IDs from events
  const controllerIds = [...new Set((eventWorkers || []).map((ew: any) => ew.events?.controller_id).filter(Boolean))]
  
  let controllersMap: Record<string, string> = {}
  if (controllerIds.length > 0) {
    const { data: controllers } = await supabaseAdmin
      .from('controllers')
      .select('id, users(name)')
      .in('id', controllerIds)
    
    if (controllers) {
      for (const c of controllers) {
        controllersMap[c.id] = (c as any).users?.name || 'Unknown'
      }
    }
  }

  // Map work_units to ta_amount
  const mappedData = (eventWorkers || []).map((ew: any) => ({
    ...ew,
    ta_amount: ew.work_units || 0,
    total: (ew.wage_amount || 0) + (ew.work_units || 0),
    pending: (ew.wage_amount || 0) + (ew.work_units || 0) - (ew.paid_amount || 0),
    controller_name: controllersMap[ew.events?.controller_id] || 'Unknown',
  }))

  return { data: mappedData || [], error: null }
}
