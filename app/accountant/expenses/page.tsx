import { getAllExpenses, getEventsForSelect } from '@/app/actions/accountant';
import ExpensesClient from './ExpensesClient';

export default async function ExpensesPage() {
  const [expenses, events] = await Promise.all([
    getAllExpenses(),
    getEventsForSelect(),
  ]);
  return <ExpensesClient initialExpenses={expenses as any} events={events} />;
}
