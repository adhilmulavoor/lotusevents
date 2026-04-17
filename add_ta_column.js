const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim();

async function addTaColumn() {
  // Use the Supabase Management API via fetch to run raw SQL
  const projectRef = url.replace('https://', '').replace('.supabase.co', '');
  
  // Try using the pg_net extension or direct SQL via PostgREST
  // Since we can't run DDL via PostgREST, let's try the Supabase SQL API
  const response = await fetch(`${url}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': key,
      'Authorization': `Bearer ${key}`,
    },
  });
  
  console.log('PostgREST response:', response.status);
  
  // Alternative: Create a temporary edge function or use supabase CLI
  // For now, let's check if we can use the supabase CLI
  console.log('\nPlease run this SQL in the Supabase SQL editor:');
  console.log('ALTER TABLE event_workers ADD COLUMN IF NOT EXISTS ta_amount DECIMAL(10,2) DEFAULT 0;');
  console.log('\nProject URL:', url);
  console.log('Dashboard:', `https://supabase.com/dashboard/project/${projectRef}/sql/new`);
}

addTaColumn().catch(console.error);
