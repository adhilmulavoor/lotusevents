import { getMembers } from '@/app/actions/admin';
import MembersClient from './MembersClient';

export default async function AdminMembersPage() {
  const members = await getMembers();
  return <MembersClient initialMembers={members as any} />;
}
