import { getSingleControllerPerformance } from '@/app/actions/admin';
import ControllerPerformanceClient from './ControllerPerformanceClient';

export default async function ControllerPerformancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getSingleControllerPerformance(id);
  return (
    <ControllerPerformanceClient 
      data={result.data} 
      error={result.error} 
    />
  );
}