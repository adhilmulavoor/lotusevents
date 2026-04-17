import { createClient } from '@supabase/supabase-js';

const OLD_URL = 'https://mevertpazkjitrocmqac.supabase.co';
const OLD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ldmVydHBhemtqaXRyb2NtcWFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTg4MDA1MCwiZXhwIjoyMDkxNDU2MDUwfQ.ROWN3tGVDpklLKPbX7HKM07O8JpHP83PjFKUj_JH-CU';

const NEW_URL = 'https://tzsbanhkecgoevhpzile.supabase.co';
const NEW_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6c2JhbmhrZWNnb2V2aHB6aWxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjEwMjgwMCwiZXhwIjoyMDkxNjc4ODAwfQ.wBAnY9dlWh5YP1khapKTMO_CZxLNedAizXLnxd8OP4U';

const oldSupabase = createClient(OLD_URL, OLD_KEY);
const newSupabase = createClient(NEW_URL, NEW_KEY);

async function run() {
  console.log('Fetching buckets from old project...');
  const { data: buckets, error: bucketsErr } = await oldSupabase.storage.listBuckets();
  
  if (bucketsErr) {
    console.error('Failed to fetch buckets:', bucketsErr.message);
    return;
  }

  if (!buckets || buckets.length === 0) {
    console.log('No buckets found to transfer.');
    return;
  }

  console.log(`Found ${buckets.length} buckets:`, buckets.map(b => b.name).join(', '));

  for (const bucket of buckets) {
    console.log(`\n--- Processing Bucket: ${bucket.name} ---`);
    
    // Create bucket in new project
    const { error: createErr } = await newSupabase.storage.createBucket(bucket.name, {
      public: bucket.public
    });
    
    if (createErr && createErr.status !== 409 && !createErr.message.includes('already exists')) {
      console.error(`Failed to create bucket ${bucket.name}:`, createErr.message);
      continue;
    } else {
      console.log(`Bucket ${bucket.name} is ready.`);
    }

    // Make sure bucket is public if it was in the old project
    if (bucket.public) {
       await newSupabase.storage.updateBucket(bucket.name, { public: true });
    }

    // Function to recursively process directories
    async function processDirectory(path = '') {
      const { data: objects, error: objErr } = await oldSupabase.storage.from(bucket.name).list(path);
      if (objErr) {
        console.error(`Error listing path ${path}:`, objErr.message);
        return;
      }
  
      if (!objects || objects.length === 0) return;
  
      for (const obj of objects) {
        // Skip hidden files or empty objects sometimes returned
        if (obj.name === '.emptyFolderPlaceholder') continue;

        const fullPath = path ? `${path}/${obj.name}` : obj.name;
        
        // If it doesn't have an ID, it's a folder/directory (Supabase V2 Storage layout)
        if (!obj.id) {
          console.log(`📁 Entering directory: ${fullPath}`);
          await processDirectory(fullPath);
        } else {
          console.log(`📄 Migrating file: ${fullPath}`);
          const { data: fileData, error: downloadErr } = await oldSupabase.storage.from(bucket.name).download(fullPath);
          
          if (downloadErr) {
            console.error(`❌ Error downloading ${fullPath}:`, downloadErr.message);
            continue;
          }
  
          const { error: uploadErr } = await newSupabase.storage.from(bucket.name).upload(fullPath, fileData, {
            upsert: true,
            contentType: obj.metadata?.mimetype
          });
          
          if (uploadErr) {
            console.error(`❌ Error uploading ${fullPath}:`, uploadErr.message);
          } else {
            console.log(`✅ Success: ${fullPath}`);
          }
        }
      }
    }
    
    await processDirectory();
  }
  
  console.log('\n🎉 Bucket migration completed successfully!');
}

run().catch(console.error);
