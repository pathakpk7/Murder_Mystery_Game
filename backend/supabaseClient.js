import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://xxqrkcqplbdhutrxceqe.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'dummy_key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || supabaseAnonKey;

// Anon client for user operations (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Service role client for admin operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default supabase;
