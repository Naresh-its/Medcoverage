// server/db/supabase.js
// Supabase client configuration placeholder.
// The client is created using environment variables:
//   SUPABASE_URL – the Supabase project URL
//   SUPABASE_ANON_KEY – the public anonymous key
// Ensure the @supabase/supabase-js package is installed before running.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
