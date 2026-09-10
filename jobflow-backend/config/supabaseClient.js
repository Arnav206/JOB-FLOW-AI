// config/supabaseClient.js
// Central place that creates ONE Supabase client the whole backend reuses.
// Everyone on the team (Arpan Pandey, Arpan Yadav, Anurag Dev Mishra, Piyush)
// should import THIS file instead of creating their own client.

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in your .env file."
  );
}

// NOTE: We use the SERVICE ROLE key here because this key is only ever used
// on the server (never sent to the browser). It bypasses Row Level Security,
// which is fine because our Express routes do the auth checks themselves.
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

module.exports = supabase;
