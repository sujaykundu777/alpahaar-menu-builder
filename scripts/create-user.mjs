// Creates the (single) login for the app using the Supabase service-role key.
// Usage:  npm run create-user -- auntyji@example.com "a-strong-password"
import { createClient } from "@supabase/supabase-js";

const [email, password] = process.argv.slice(2);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!email || !password) {
  console.error('Usage: npm run create-user -- <email> "<password>"');
  process.exit(1);
}
if (!url || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local first.");
  process.exit(1);
}

const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
const { data, error } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (error) {
  console.error("Could not create user:", error.message);
  process.exit(1);
}
console.log(`✔ Created ${data.user.email} (${data.user.id}). You can now sign in at /login.`);
