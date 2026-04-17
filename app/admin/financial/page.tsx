import { getAllIncome, getAllExpenses, getEventsForSelect } from '@/app/actions/accountant';
import FinancialClient from './FinancialClient';

export default async function FinancialPage() {
  const [income, expenses, events] = await Promise.all([
    getAllIncome(),
    getAllExpenses(),
    getEventsForSelect(),
  ]);

  return (
    <FinancialClient 
      initialIncome={income as any} 
      initialExpenses={expenses as any}
      events={events}
    />
  );
}
