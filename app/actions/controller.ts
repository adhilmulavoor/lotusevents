'use server'

import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

// ─── GET PENDING EVENTS ──────────────────────────────────────────────────────
export async function getPendingEvents() {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized', data: null }

  const { data: controllerRecord } = await supabaseAdmin
    .from('controllers')
    .select('id')
    .eq('user_id', session.id)
    .single()

  let controllerRecordId: string | null = null;
  if (controllerRecord) {
    controllerRecordId = controllerRecord.id;
  }

  let eventsQuery = supabaseAdmin
    .from('events')
    .select('id, event_name, date, location, status, controller_id')
    .in('status', ['planned', 'ongoing'])
    .order('date', { ascending: true });

  if (controllerRecordId) {
    eventsQuery = eventsQuery.eq('controller_id', controllerRecordId);
  } else if (session.role !== 'ADMIN') {
    return { data: [], error: 'Controller profile not found. Please contact admin.' }
  }

  const { data: events, error } = await eventsQuery;

  if (error) {
    console.error('getPendingEvents error:', error);
    return { data: [], error: error.message };
  }

  return { data: events || [], error: null }
}

// ─── GET COMPLETED EVENTS ────────────────────────────────────────────────────
export async function getCompletedEvents() {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized', data: null }

  const { data: controllerRecord } = await supabaseAdmin
    .from('controllers')
    .select('id')
    .eq('user_id', session.id)
    .single()

  let controllerRecordId: string | null = null;
  if (controllerRecord) {
    controllerRecordId = controllerRecord.id;
  }

  let eventsQuery = supabaseAdmin
    .from('events')
    .select('id, event_name, date, location, status, controller_id')
    .eq('status', 'completed')
    .order('date', { ascending: false });

  if (controllerRecordId) {
    eventsQuery = eventsQuery.eq('controller_id', controllerRecordId);
  } else if (session.role !== 'ADMIN') {
    return { data: [], error: 'Controller profile not found. Please contact admin.' }
  }

  const { data: events, error } = await eventsQuery;

  if (error) {
    console.error('getCompletedEvents error:', error);
    return { data: [], error: error.message };
  }

  return { data: events || [], error: null }
}

// ─── GET EVENT WITH WORKERS ──────────────────────────────────────────────────
export async function getEventWithWorkers(eventId: string) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized', data: null }

  // Get event
  const { data: event, error: eventError } = await supabaseAdmin
    .from('events')
    .select('id, event_name, date, location, status, controller_id')
    .eq('id', eventId)
    .single()

  if (eventError) {
    return { error: eventError.message, data: null }
  }

  const { data: workers, error: workersError } = await supabaseAdmin
    .from('event_workers')
    .select('*, workers(*, users(*))')
    .eq('event_id', eventId)

  if (workersError) {
    return { error: workersError.message, data: null }
  }

  // Map backend schema to what the frontend expects
  const mappedWorkers = (workers || []).map(w => ({
    ...w,
    member_id: w.worker_id || w.member_id,
    members: w.workers || w.members,
    ta_amount: w.work_units || 0, // Repurpose work_units for TA since ta_amount column is missing
  }))

  return { data: { event, workers: mappedWorkers }, error: null }
}

// ─── ADD MEMBER TO EVENT ─────────────────────────────────────────────────────
export async function addMemberToEvent(prevState: any, formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const eventId = formData.get('event_id') as string
  const memberId = formData.get('member_id') as string
  const wageAmount = parseFloat(formData.get('wage_amount') as string) || 0
  const taAmount = parseFloat(formData.get('ta_amount') as string) || 0
  const hasTa = formData.get('has_ta') === 'true'

  if (!eventId || !memberId) {
    return { error: 'Event and member are required.' }
  }

  console.log('[ADD_MEMBER] Starting addMemberToEvent')
  console.log('[ADD_MEMBER] eventId:', eventId, 'memberId:', memberId, 'wageAmount:', wageAmount)

  const { data: sampleData, error: sampleError } = await supabaseAdmin
    .from('event_workers')
    .select('*')
    .limit(1)

  if (sampleError) {
    console.log('[ADD_MEMBER] Table error:', sampleError.message)
    return { error: `Table error: ${sampleError.message}` }
  }

  const columns = sampleData && sampleData.length > 0 ? Object.keys(sampleData[0]) : []
  console.log('[ADD_MEMBER] Discovered columns:', columns)

  const eventCol = columns.find(c => c.toLowerCase().includes('event')) || 'event_id'
  const workerCol = columns.find(c => c.toLowerCase().includes('worker') || c.toLowerCase().includes('member')) || 'worker_id'
  console.log('[ADD_MEMBER] Using eventCol:', eventCol, 'workerCol:', workerCol)

  const { data: existing } = await supabaseAdmin
    .from('event_workers')
    .select('id')
    .eq(eventCol, eventId)
    .eq(workerCol, memberId)
    .single()

  if (existing) {
    return { error: 'This member is already added to this event.' }
  }

  const insertObj: Record<string, any> = {
    [eventCol]: eventId,
    [workerCol]: memberId,
    wage_amount: wageAmount,
    paid_amount: 0,
    pending_amount: wageAmount + taAmount,
    work_units: taAmount,
  }

  if (columns.includes('attendance')) {
    insertObj.attendance = 'present';
  }

  console.log('[ADD_MEMBER] Inserting object:', JSON.stringify(insertObj, null, 2))

  const { error } = await supabaseAdmin
    .from('event_workers')
    .insert(insertObj)

  if (error) {
    return { error: `Failed to add member: ${error.message}` }
  }

  revalidatePath('/controller/pending')
  revalidatePath('/controller/completed')
  return { success: true }
}

// ─── UPDATE MEMBER PAYMENT ───────────────────────────────────────────────────
export async function updateMemberPayment(
  eventWorkerId: string,
  paidAmount: number,
  pendingAmount: number,
  taAmount: number,
) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const { error } = await supabaseAdmin
    .from('event_workers')
    .update({
      paid_amount: paidAmount,
      pending_amount: pendingAmount,
      work_units: taAmount,
    })
    .eq('id', eventWorkerId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/controller/pending')
  revalidatePath('/controller/completed')
  return { success: true }
}

// ─── REMOVE MEMBER FROM EVENT ────────────────────────────────────────────────
export async function removeMemberFromEvent(eventWorkerId: string) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const { error } = await supabaseAdmin
    .from('event_workers')
    .delete()
    .eq('id', eventWorkerId)

  if (error) return { error: error.message }

  revalidatePath('/controller/pending')
  revalidatePath('/controller/completed')
  return { success: true }
}

// ─── MARK EVENT AS COMPLETED ────────────────────────────────────────────────
export async function markEventCompleted(eventId: string) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const { error } = await supabaseAdmin
    .from('events')
    .update({ status: 'completed' })
    .eq('id', eventId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/controller/pending')
  revalidatePath('/controller/completed')
  return { success: true }
}

// ─── MARK EVENT AS PENDING ───────────────────────────────────────────────────
export async function markEventPending(eventId: string) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const { error } = await supabaseAdmin
    .from('events')
    .update({ status: 'ongoing' })
    .eq('id', eventId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/controller/pending')
  revalidatePath('/controller/completed')
  return { success: true }
}

// ─── GET AVAILABLE MEMBERS ───────────────────────────────────────────────────
export async function getAvailableMembers() {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized', data: null }
  
  const { data: workers, error } = await supabaseAdmin
    .from('workers')
    .select('*')

  console.log('[getAvailableMembers] raw workers:', workers?.length, 'cols:', workers?.[0] ? Object.keys(workers[0]) : [])
  if (error) return { data: [], error: error.message }
  if (!workers) return { data: [], error: null }

  const userIds = workers.map((w: any) => w.user_id).filter(Boolean)
  
  let usersMap = new Map()
  if (userIds.length > 0) {
    const { data: users } = await supabaseAdmin
      .from('users')
      .select('id, name, phone')
      .in('id', userIds)
    
    usersMap = new Map((users || []).map((u: any) => [u.id, u]))
  }

  const members = workers.map((w: any) => {
    const user = usersMap.get(w.user_id)
    return {
      id: w.id,
      user_id: w.user_id,
      role_type: w.job_type || w.role_type || 'Worker',
      daily_rate: w.daily_rate || 0,
      status: w.status || 'active',
      users: user ? { id: user.id, name: user.name, phone: user.phone } : { id: w.user_id, name: 'Unknown', phone: '' }
    }
  })

  console.log('[getAvailableMembers] returning:', members.length, JSON.stringify(members))
  return { data: members, error: null };
}

// ─── GET TEAM MEMBERS ────────────────────────────────────────────────────────
export async function getTeamMembers() {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized', data: [] }

  console.log('[getTeamMembers] session:', session.id)

  const { data: controllerRecord } = await supabaseAdmin
    .from('controllers')
    .select('id')
    .eq('user_id', session.id)
    .single()

  console.log('[getTeamMembers] controllerRecord:', controllerRecord)

  if (!controllerRecord) {
    return { data: [], error: null }
  }

  const { data: events } = await supabaseAdmin
    .from('events')
    .select('id')
    .eq('controller_id', controllerRecord.id)

  const eventIds = events?.map(e => e.id) || []
  console.log('[getTeamMembers] eventIds:', eventIds)

  if (eventIds.length === 0) {
    return { data: [], error: null }
  }

  const { data: sampleData } = await supabaseAdmin
    .from('event_workers')
    .select('*')
    .limit(1)

  const columns = sampleData && sampleData.length > 0 ? Object.keys(sampleData[0]) : []
  console.log('[getTeamMembers] Discovered columns:', columns)
  
  const workerCol = columns.find(c => c.toLowerCase().includes('worker') || c.toLowerCase().includes('member')) || 'worker_id'
  console.log('[getTeamMembers] Using workerCol:', workerCol)

  const { data: rows, error } = await supabaseAdmin
    .from('event_workers')
    .select(`*, workers(*, users(*))`)
    .in('event_id', eventIds)

  console.log('[getTeamMembers] rows:', rows?.length, 'error:', error)
  if (error) return { error: error.message, data: [] }

  const memberMap = new Map<string, {
    memberId: string, name: string, phone: string, jobType: string,
    totalWage: number, totalPaid: number, totalPending: number, totalTa: number,
    eventsWorked: number
  }>()

  for (const row of (rows ?? [])) {
    const w = row.workers
    const user = w?.users
    const mid = row[workerCol]
    const taAmount = Number(row.work_units ?? 0)

    if (!mid) continue

    if (!memberMap.has(mid)) {
      memberMap.set(mid, {
        memberId: mid,
        name: user?.name || 'Unknown',
        phone: user?.phone || '',
        jobType: w?.job_type || 'Worker',
        totalWage: 0, totalPaid: 0, totalPending: 0, totalTa: 0,
        eventsWorked: 0,
      })
    }
    const m = memberMap.get(mid)!
    m.totalWage += Number(row.wage_amount ?? 0)
    m.totalPaid += Number(row.paid_amount ?? 0)
    m.totalPending += Number(row.pending_amount ?? 0)
    m.totalTa += taAmount
    m.eventsWorked += 1
  }

  return { data: Array.from(memberMap.values()), error: null }
}
