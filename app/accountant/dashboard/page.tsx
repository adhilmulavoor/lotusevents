import { getAllIncome, getAllExpenses } from '@/app/actions/accountant';
import AccountantDashboardClient from './AccountantDashboardClient';

export default async function AccountantDashboard() {
  const [income, expenses] = await Promise.all([
    getAllIncome(),
    getAllExpenses(),
  ]);

  return (
    <AccountantDashboardClient 
      initialIncome={income} 
      initialExpenses={expenses} 
    />
  );
}
