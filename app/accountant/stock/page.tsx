import { getStockItems } from '@/app/actions/accountant';
import StockClient from './StockClient';

export default async function StockPage() {
  const items = await getStockItems();
  return <StockClient initialItems={items as any} />;
}
