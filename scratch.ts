import { supabase, supabaseAdmin } from './lib/supabase';

async function test() {
  console.log("Testing with admin...");
  const adminRes = await supabaseAdmin.from('events').select('*');
  console.log("Admin events count:", adminRes.data?.length, "Error:", adminRes.error?.message);

  console.log("Testing with anon...");
  const anonRes = await supabase.from('events').select('*');
  console.log("Anon events count:", anonRes.data?.length, "Error:", anonRes.error?.message);
}
test();
