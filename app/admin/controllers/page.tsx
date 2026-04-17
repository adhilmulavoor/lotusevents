import { getControllers } from '@/app/actions/admin';
import ControllersClient from './ControllersClient';

export default async function AdminControllersPage() {
  let controllers: any[] = [];
  
  try {
    controllers = await getControllers();
  } catch (e) {
    console.error('Error loading controllers:', e);
  }
  
  return <ControllersClient initialControllers={controllers} />;
}
