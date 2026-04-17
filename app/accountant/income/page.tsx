import { getAllIncome, getEventsForSelect } from '@/app/actions/accountant';
import IncomeClient from './IncomeClient';

export default async function IncomePage() {
  const [income, events] = await Promise.all([
    getAllIncome(),
    getEventsForSelect(),
  ]);
  return <IncomeClient initialIncome={income as any} events={events} />;
}
