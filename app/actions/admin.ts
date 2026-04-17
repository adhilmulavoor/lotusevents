'use server';

import { supabaseAdmin } from '@/lib/supabase';
import { hashPassword } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [eventsRes, membersRes, controllersRes] = await Promise.all([
    supabaseAdmin
      .from('events')
      .select('id', { count: 'exact' })
      .gte('date', today.toISOString())
      .lte('date', new Date(today.getTime() + 86400000).toISOString()),
    supabaseAdmin
      .from('users')
      .select('id', { count: 'exact' })
      .eq('role', 'WORKER'),
    supabaseAdmin
      .from('users')
      .select('id', { count: 'exact' })
      .eq('role', 'CONTROLLER'),
  ]);

  return {
    todayEvents: eventsRes.count ?? 0,
    totalMembers: membersRes.count ?? 0,
    totalControllers: controllersRes.count ?? 0,
  };
}

export async function getRecentEvents() {
  const { data } = await supabaseAdmin
    .from('events')
    .select('id, event_name, date, location, status')
    .order('date', { ascending: false })
    .limit(5);
  return data ?? [];
}

export async function getMembers() {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select(`
      id, name, phone, email, role, created_at,
      workers ( job_type, daily_rate, status )
    `)
    .eq('role', 'WORKER')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getControllers() {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select(`
      id, name, phone, email, created_at,
      controllers ( id, experience_level, assigned_events_count )
    `)
    .eq('role', 'CONTROLLER')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createMember(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const email = (formData.get('email') as string) || null;
  const password = formData.get('password') as string;
  const jobType = (formData.get('job_type') as string) || null;
  const dailyRate = parseFloat(formData.get('daily_rate') as string) || 0;

  if (!name || !phone || !password) {
    return { error: 'Name, phone, and password are required.' };
  }

  const hashed = await hashPassword(password);

  const { data: user, error: userErr } = await supabaseAdmin
    .from('users')
    .insert({ name, phone, email, password: hashed, role: 'WORKER' })
    .select('id')
    .single();

  if (userErr) return { error: `Failed to create user: ${userErr.message}` };

  const { error: workerErr } = await supabaseAdmin
    .from('workers')
    .insert({ user_id: user.id, job_type: jobType, daily_rate: dailyRate, status: 'active' });

  if (workerErr) return { error: `User created but worker profile failed: ${workerErr.message}` };

  revalidatePath('/admin/members');
  return { success: 'Member created successfully.' };
}

export async function createController(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const email = (formData.get('email') as string) || null;
  const password = formData.get('password') as string;
  const experienceLevel = (formData.get('experience_level') as string) || null;

  if (!name || !phone || !password) {
    return { error: 'Name, phone, and password are required.' };
  }

  const hashed = await hashPassword(password);

  const { data: user, error: userErr } = await supabaseAdmin
    .from('users')
    .insert({ name, phone, email, password: hashed, role: 'CONTROLLER' })
    .select('id')
    .single();

  if (userErr) return { error: `Failed to create user: ${userErr.message}` };

  const { error: ctrlErr } = await supabaseAdmin
    .from('controllers')
    .insert({ user_id: user.id, experience_level: experienceLevel });

  if (ctrlErr) return { error: `User created but controller profile failed: ${ctrlErr.message}` };

  revalidatePath('/admin/controllers');
  return { success: 'Controller created successfully.' };
}

export async function deleteUser(userId: string, redirectPath: string) {
  const { error } = await supabaseAdmin.from('users').delete().eq('id', userId);
  if (error) return { error: error.message };
  revalidatePath(redirectPath);
  return { success: true };
}

export async function getAllEvents() {
  const { data, error } = await supabaseAdmin
    .from('events')
    .select(`
      id, event_name, date, location, status,
      controllers ( users ( name ) )
    `)
    .order('date', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getControllersForSelect() {
  const { data } = await supabaseAdmin
    .from('users')
    .select('id, name, controllers(id)')
    .eq('role', 'CONTROLLER')
    .order('name');
  return data ?? [];
}

export async function createEvent(prevState: any, formData: FormData) {
  const event_name = formData.get('event_name') as string;
  const date = formData.get('date') as string;
  const location = (formData.get('location') as string) || null;
  const controller_id = (formData.get('controller_id') as string) || null;
  const status = (formData.get('status') as string) || 'planned';

  if (!event_name || !date) {
    return { error: 'Event name and date are required.' };
  }

  const { error } = await supabaseAdmin.from('events').insert({
    event_name,
    date: new Date(date).toISOString(),
    location,
    controller_id: controller_id || null,
    status,
  });

  if (error) return { error: error.message };

  revalidatePath('/admin/events');
  revalidatePath('/admin/dashboard');
  return { success: 'Event created.' };
}

export async function deleteEvent(eventId: string) {
  const { error } = await supabaseAdmin.from('events').delete().eq('id', eventId);
  if (error) return { error: error.message };
  revalidatePath('/admin/events');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function updateMember(prevState: any, formData: FormData) {
  const userId = formData.get('user_id') as string;
  const workerId = formData.get('worker_id') as string;
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const email = (formData.get('email') as string) || null;
  const jobType = (formData.get('job_type') as string) || null;
  const dailyRate = parseFloat(formData.get('daily_rate') as string) || 0;
  const status = (formData.get('status') as string) || 'active';
  const newPassword = (formData.get('password') as string) || '';

  if (!name || !phone) return { error: 'Name and phone are required.' };

  const userUpdate: Record<string, any> = { name, phone, email };
  if (newPassword) {
    userUpdate.password = await hashPassword(newPassword);
  }
  const { error: userErr } = await supabaseAdmin.from('users').update(userUpdate).eq('id', userId);
  if (userErr) return { error: userErr.message };

  if (workerId) {
    const { error: wErr } = await supabaseAdmin
      .from('workers')
      .update({ job_type: jobType, daily_rate: dailyRate, status })
      .eq('id', workerId);
    if (wErr) return { error: wErr.message };
  }

  revalidatePath('/admin/members');
  return { success: 'Member updated.' };
}

export async function updateController(prevState: any, formData: FormData) {
  const userId = formData.get('user_id') as string;
  const controllerId = (formData.get('controller_id') as string) || null;
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const email = (formData.get('email') as string) || null;
  const experienceLevel = (formData.get('experience_level') as string) || null;
  const newPassword = (formData.get('password') as string) || '';

  if (!name || !phone) return { error: 'Name and phone are required.' };

  const userUpdate: Record<string, any> = { name, phone, email };
  if (newPassword) {
    userUpdate.password = await hashPassword(newPassword);
  }
  const { error: userErr } = await supabaseAdmin.from('users').update(userUpdate).eq('id', userId);
  if (userErr) return { error: userErr.message };

  if (controllerId) {
    const { error: cErr } = await supabaseAdmin
      .from('controllers')
      .update({ experience_level: experienceLevel })
      .eq('id', controllerId);
    if (cErr) return { error: cErr.message };
  } else {
    await supabaseAdmin
      .from('controllers')
      .insert({ user_id: userId, experience_level: experienceLevel });
  }

  revalidatePath('/admin/controllers');
  return { success: 'Controller updated.' };
}

export async function fixControllerProfile(userId: string) {
  const { data: existing } = await supabaseAdmin
    .from('controllers')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (existing) {
    return { success: 'Controller profile already exists.', profileId: existing.id };
  }

  const { data: newProfile, error } = await supabaseAdmin
    .from('controllers')
    .insert({ user_id: userId })
    .select('id')
    .single();

  if (error) {
    return { error: `Failed to create controller profile: ${error.message}` };
  }

  revalidatePath('/admin/controllers');
  return { success: 'Controller profile created.', profileId: newProfile.id };
}

export async function fixAllMissingControllerProfiles() {
  const { data: controllerUsers } = await supabaseAdmin
    .from('users')
    .select('id, name')
    .eq('role', 'CONTROLLER');

  if (!controllerUsers) {
    return { error: 'No controller users found', created: 0 };
  }

  let created = 0;
  for (const user of controllerUsers) {
    const { data: existing } = await supabaseAdmin
      .from('controllers')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!existing) {
      await supabaseAdmin
        .from('controllers')
        .insert({ user_id: user.id });
      created++;
    }
  }

  revalidatePath('/admin/controllers');
  return { success: `Fixed ${created} missing controller profile(s).`, created };
}

// ─── CONTROLLER PERFORMANCE ──────────────────────────────────────────────────
export async function getControllerPerformance() {
  const { data: controllers, error } = await supabaseAdmin
    .from('controllers')
    .select('id, user_id, users(name, phone)')
    .order('created_at', { ascending: false });

  if (error) return { error: error.message, data: [] };

  const controllerData = await Promise.all((controllers || []).map(async (ctrl: any) => {
    const user = ctrl.users;
    const controllerId = ctrl.id;

    const { data: events } = await supabaseAdmin
      .from('events')
      .select('id')
      .eq('controller_id', controllerId);

    const eventIds = events?.map(e => e.id) || [];
    const totalPrograms = eventIds.length;

    let totalWage = 0;
    let totalPaid = 0;
    let totalPending = 0;
    let totalTa = 0;

    if (eventIds.length > 0) {
      const { data: workers } = await supabaseAdmin
        .from('event_workers')
        .select('wage_amount, paid_amount, pending_amount, work_units')
        .in('event_id', eventIds);

      if (workers) {
        totalWage = workers.reduce((sum, w) => sum + (w.wage_amount || 0), 0);
        totalPaid = workers.reduce((sum, w) => sum + (w.paid_amount || 0), 0);
        totalPending = workers.reduce((sum, w) => sum + (w.pending_amount || 0), 0);
        totalTa = workers.reduce((sum, w) => sum + (w.work_units || 0), 0);
      }
    }

    return {
      id: controllerId,
      name: user?.name || 'Unknown',
      phone: user?.phone || '',
      totalPrograms,
      totalWage,
      totalPaid,
      totalPending,
      totalTa,
    };
  }));

  return { data: controllerData, error: null };
}

export async function getSingleControllerPerformance(controllerId: string) {
  const { data: ctrl, error: ctrlErr } = await supabaseAdmin
    .from('controllers')
    .select('id, user_id, users(name, phone)')
    .eq('id', controllerId)
    .single();

  if (ctrlErr || !ctrl) return { error: ctrlErr?.message || 'Controller not found', data: null };

  const user = ctrl.users as any;
  const { data: events } = await supabaseAdmin
    .from('events')
    .select('id, event_name, date, location, status')
    .eq('controller_id', controllerId)
    .order('date', { ascending: false });

  const eventIds = events?.map(e => e.id) || [];
  const totalPrograms = eventIds.length;

  let totalWage = 0;
  let totalPaid = 0;
  let totalPending = 0;
  let totalTa = 0;

  if (eventIds.length > 0) {
    const { data: workers } = await supabaseAdmin
      .from('event_workers')
      .select('id, event_id, member_id, members(name)')
      .in('event_id', eventIds);

    const { data: wageData } = await supabaseAdmin
      .from('event_workers')
      .select('wage_amount, paid_amount, pending_amount, work_units')
      .in('event_id', eventIds);

    if (wageData) {
      totalWage = wageData.reduce((sum, w) => sum + (w.wage_amount || 0), 0);
      totalPaid = wageData.reduce((sum, w) => sum + (w.paid_amount || 0), 0);
      totalPending = wageData.reduce((sum, w) => sum + (w.pending_amount || 0), 0);
      totalTa = wageData.reduce((sum, w) => sum + (w.work_units || 0), 0);
    }

    const memberDetails: Record<string, { name: string; wage: number; paid: number; pending: number; events: string[] }> = {};
    if (workers) {
      for (const w of workers as any[]) {
        const memberId = w.member_id;
        const eventName = events?.find(e => e.id === w.event_id)?.event_name || 'Unknown';
        if (!memberDetails[memberId]) {
          memberDetails[memberId] = { name: (w as any).members?.name || 'Unknown', wage: 0, paid: 0, pending: 0, events: [] };
        }
      }
    }

    if (wageData && workers) {
      for (let i = 0; i < workers.length; i++) {
        const w = workers[i];
        const wd = wageData[i];
        if (wd && memberDetails[w.member_id]) {
          memberDetails[w.member_id].wage += wd.wage_amount || 0;
          memberDetails[w.member_id].paid += wd.paid_amount || 0;
          memberDetails[w.member_id].pending += wd.pending_amount || 0;
        }
      }
    }

    return {
      data: {
        id: controllerId,
        name: user?.name || 'Unknown',
        phone: user?.phone || '',
        totalPrograms,
        totalWage,
        totalPaid,
        totalPending,
        totalTa,
        events: events || [],
        memberPayments: Object.entries(memberDetails).map(([id, data]) => ({ memberId: id, ...data })),
      },
      error: null,
    };
  }

  return {
    data: {
      id: controllerId,
      name: user?.name || 'Unknown',
      phone: user?.phone || '',
      totalPrograms: 0,
      totalWage: 0,
      totalPaid: 0,
      totalPending: 0,
      totalTa: 0,
      events: [],
      memberPayments: [],
    },
    error: null,
  };
}
