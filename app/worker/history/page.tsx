import { getMemberPaymentHistory } from '@/app/actions/member';
import { getSession } from '@/lib/auth';
import { HistoryClient } from './HistoryClient';

export default async function WorkHistoryPage() {
  const session = await getSession();
  const result = await getMemberPaymentHistory();

  return (
    <HistoryClient
      session={session}
      workHistory={result.data || []}
      error={result.error}
    />
  );
}
