import { createClient } from '@supabase/supabase-js';

// Load env vars from .env.local manually
const supabaseUrl = 'https://hkaidlwfnbzswejlhbhl.supabase.co';
const supabaseKey = 'sb_publishable_s_obbD-7mlp6M9qljxbaAw_JbIdj2u5';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 HIS Database Setup Verification\n');

// Check 1: Verify tables exist (migrations applied)
console.log('1️⃣ Checking if migrations are applied...');
try {
  const tables = ['students', 'donors', 'sponsorships', 'articles', 'ministries', 'donations', 'profiles', 'student_merge_log'];

  for (const table of tables) {
    const { error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`   ❌ Table '${table}' not found or not accessible`);
      console.log(`      Error: ${error.message}`);
    } else {
      console.log(`   ✅ Table '${table}' exists (${count} rows)`);
    }
  }
} catch (err) {
  console.error(`   ❌ Error checking tables: ${err.message}`);
}

console.log('');

// Check 2: Verify storage bucket exists
console.log('2️⃣ Checking storage buckets...');
try {
  const { data: buckets, error } = await supabase.storage.listBuckets();

  if (error) {
    console.log(`   ❌ Error listing buckets: ${error.message}`);
  } else {
    const imagesBucket = buckets.find(b => b.name === 'images');
    if (imagesBucket) {
      console.log(`   ✅ 'images' bucket exists (public: ${imagesBucket.public})`);
    } else {
      console.log(`   ❌ 'images' bucket not found`);
      console.log(`      Available buckets: ${buckets.map(b => b.name).join(', ') || 'none'}`);
    }
  }
} catch (err) {
  console.error(`   ❌ Error checking buckets: ${err.message}`);
}

console.log('');

// Check 3: Check for admin users
console.log('3️⃣ Checking for admin users...');
try {
  const { data: admins, error } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('role', 'admin');

  if (error) {
    console.log(`   ❌ Error querying profiles: ${error.message}`);
  } else if (admins && admins.length > 0) {
    console.log(`   ✅ Found ${admins.length} admin user(s)`);
  } else {
    console.log(`   ⚠️  No admin users found`);
    console.log(`      You'll need to manually update a user's role to 'admin' in the profiles table`);
  }
} catch (err) {
  console.error(`   ❌ Error checking admin users: ${err.message}`);
}

console.log('');

// Check 4: Verify duplicate detection function exists
console.log('4️⃣ Checking Phase 1 features (duplicate detection)...');
try {
  // Try to call the function with test data
  const { data, error } = await supabase.rpc('find_potential_duplicates', {
    name: 'Test',
    village: 'Test',
    region: 'Test',
    age: 10,
    exclude_id: '00000000-0000-0000-0000-000000000000'
  });

  if (error) {
    console.log(`   ❌ Function 'find_potential_duplicates' not found or errored`);
    console.log(`      Error: ${error.message}`);
  } else {
    console.log(`   ✅ Function 'find_potential_duplicates' exists and works`);
  }
} catch (err) {
  console.error(`   ❌ Error testing duplicate detection: ${err.message}`);
}

console.log('');
console.log('✨ Verification complete!\n');
