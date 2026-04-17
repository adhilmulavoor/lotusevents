import { getMemberDashboardData } from '@/app/actions/member';
import { getSession } from '@/lib/auth';
import { MemberDashboardClient } from './MemberDashboardClient';

export default async function MemberDashboard({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const filter = (params.filter as 'this_week' | 'this_month' | 'all_time') || 'this_month';
  
  const session = await getSession();
  const result = await getMemberDashboardData(filter);

  return (
    <MemberDashboardClient
      session={session}
      data={result.data}
      error={result.error}
      activeFilter={filter}
    />
  );
}
