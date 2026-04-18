import { 
  getAllIncome, 
  getAllExpenses, 
  getAllEventWorkersData, 
  getAllEventsWithControllers 
} from '@/app/actions/accountant';
import ReportsClient from './ReportsClient';

export default async function AccountantReportsPage() {
  const [income, expenses, workerData, eventData] = await Promise.all([
    getAllIncome(),
    getAllExpenses(),
    getAllEventWorkersData(),
    getAllEventsWithControllers(),
  ]);

  return (
    <ReportsClient 
      income={income}
      expenses={expenses}
      workerData={workerData}
      eventData={eventData}
    />
  );
}
