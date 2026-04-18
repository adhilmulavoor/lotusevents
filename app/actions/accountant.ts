'use server';

import { supabaseAdmin } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// ─── DASHBOARD STATS ────────────────────────────────────────────────────────
export async function getFinancialStats() {
  const [incomeRes, expenseRes] = await Promise.all([
    supabaseAdmin.from('events').select('total_income'),
    supabaseAdmin.from('events').select('total_expense'),
  ]);

  const totalIncome = (incomeRes.data ?? []).reduce((s: number, e: any) => s + (e.total_income ?? 0), 0);
  const totalExpense = (expenseRes.data ?? []).reduce((s: number, e: any) => s + (e.total_expense ?? 0), 0);

  return {
    totalIncome,
    totalExpense,
    netProfit: totalIncome - totalExpense,
  };
}

// ─── RECENT EXPENSES ────────────────────────────────────────────────────────
export async function getRecentExpenses(limit = 5) {
  const { data } = await supabaseAdmin
    .from('expenses')
    .select('id, description, amount, date, events(event_name)')
    .order('date', { ascending: false })
    .limit(limit);
  return data ?? [];
}

// ─── ALL EXPENSES ────────────────────────────────────────────────────────────
export async function getAllExpenses() {
  const { data, error } = await supabaseAdmin
    .from('expenses')
    .select('id, description, amount, date, events(id, event_name)')
    .order('date', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

// ─── ADD EXPENSE ─────────────────────────────────────────────────────────────
export async function addExpense(prevState: any, formData: FormData) {
  const description = formData.get('description') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const rawEventId = formData.get('event_id') as string;
  // Empty string or 'general' means no event
  const eventId = rawEventId && rawEventId !== 'general' ? rawEventId : null;

  if (!description || isNaN(amount) || amount <= 0) {
    return { error: 'Description and a valid amount are required.' };
  }

  const { error } = await supabaseAdmin
    .from('expenses')
    .insert({ description, amount, event_id: eventId, date: new Date().toISOString() });

  if (error) return { error: error.message };

  // Also update event total_expense if tied to an event
  if (eventId) {
    const { data: ev } = await supabaseAdmin.from('events').select('total_expense').eq('id', eventId).single();
    if (ev) {
      await supabaseAdmin.from('events').update({ total_expense: (ev.total_expense ?? 0) + amount }).eq('id', eventId);
    }
  }

  revalidatePath('/accountant/expenses');
  revalidatePath('/accountant/dashboard');
  return { success: 'Expense added successfully.' };
}

// ─── DELETE EXPENSE ──────────────────────────────────────────────────────────
export async function deleteExpense(id: string) {
  const { error } = await supabaseAdmin.from('expenses').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/accountant/expenses');
  return { success: true };
}

// ─── ALL EVENTS (for dropdowns) ──────────────────────────────────────────────
export async function getEventsForSelect() {
  const { data } = await supabaseAdmin.from('events').select('id, event_name').order('date', { ascending: false });
  return data ?? [];
}

// ─── INCOME — event income + general income ──────────────────────────────────
export async function getAllIncome() {
  const [eventsRes, generalRes] = await Promise.all([
    supabaseAdmin
      .from('events')
      .select('id, event_name, date, total_income, location')
      .gt('total_income', 0)
      .order('date', { ascending: false }),
    supabaseAdmin
      .from('general_income')
      .select('id, description, amount, date, note')
      .order('date', { ascending: false }),
  ]);

  const eventIncome = (eventsRes.data ?? []).map((e: any) => ({
    id: e.id,
    event_name: e.event_name,
    date: e.date,
    total_income: e.total_income,
    location: e.location,
    source: 'event' as const,
  }));

  const generalIncome = (generalRes.data ?? []).map((g: any) => ({
    id: g.id,
    event_name: g.description,
    date: g.date,
    total_income: g.amount,
    location: g.note ?? null,
    source: 'general' as const,
  }));

  return [...eventIncome, ...generalIncome].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// ─── ADD INCOME ───────────────────────────────────────────────────────────────
export async function addIncome(prevState: any, formData: FormData) {
  const rawEventId = formData.get('event_id') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const description = (formData.get('description') as string) || 'General Income';
  const note = (formData.get('note') as string) || '';
  const isGeneral = !rawEventId || rawEventId === 'general';

  if (isNaN(amount) || amount <= 0) {
    return { error: 'A valid amount is required.' };
  }

  if (isGeneral) {
    // Store in general_income table (not tied to any event)
    if (!description || description === 'General Income') {
      // require a description for general
    }
    const { error } = await supabaseAdmin
      .from('general_income')
      .insert({ description, amount, note, date: new Date().toISOString() });
    if (error) return { error: error.message };
  } else {
    // Tied to an event — update events.total_income
    const { data: ev, error: fetchErr } = await supabaseAdmin
      .from('events').select('total_income').eq('id', rawEventId).single();
    if (fetchErr || !ev) return { error: 'Event not found.' };
    const { error } = await supabaseAdmin
      .from('events')
      .update({ total_income: (ev.total_income ?? 0) + amount })
      .eq('id', rawEventId);
    if (error) return { error: error.message };
  }

  revalidatePath('/accountant/income');
  revalidatePath('/accountant/dashboard');
  return { success: 'Income recorded successfully.' };
}

// ─── ALL STOCK ITEMS ─────────────────────────────────────────────────────────
export async function getStockItems() {
  const { data, error } = await supabaseAdmin
    .from('rental_items')
    .select('*')
    .order('item_name');
  if (error) throw new Error(error.message);
  return data ?? [];
}

// ─── ADD STOCK ITEM ───────────────────────────────────────────────────────────
export async function addStockItem(prevState: any, formData: FormData) {
  const item_name = formData.get('item_name') as string;
  const total_quantity = parseInt(formData.get('total_quantity') as string);
  const price_per_unit = parseFloat(formData.get('price_per_unit') as string) || 0;
  const condition_status = (formData.get('condition_status') as string) || 'Good';

  if (!item_name || isNaN(total_quantity) || total_quantity < 0) {
    return { error: 'Item name and quantity are required.' };
  }

  const { error } = await supabaseAdmin.from('rental_items').insert({
    item_name,
    total_quantity,
    available_quantity: total_quantity,
    price_per_unit,
    condition_status,
  });

  if (error) return { error: error.message };

  revalidatePath('/accountant/stock');
  return { success: 'Stock item added.' };
}

// ─── DELETE STOCK ITEM ────────────────────────────────────────────────────────
export async function deleteStockItem(id: string) {
  const { error } = await supabaseAdmin.from('rental_items').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/accountant/stock');
  return { success: true };
}
// ─── DATA FOR REPORTS ────────────────────────────────────────────────────────
export async function getAllEventWorkersData() {
  const { data, error } = await supabaseAdmin
    .from('event_workers')
    .select('*, events(id, event_name, date), workers(*, users(*))')
    .order('id', { ascending: false });

  if (error) {
    console.error('getAllEventWorkersData error:', error);
    return [];
  }
  return data ?? [];
}

export async function getAllEventsWithControllers() {
  const { data, error } = await supabaseAdmin
    .from('events')
    .select('*, event_controllers(controllers(users(name)))')
    .order('date', { ascending: false });

  if (error) {
    console.error('getAllEventsWithControllers error:', error);
    return [];
  }
  return data ?? [];
}
