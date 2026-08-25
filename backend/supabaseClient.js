import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || supabaseAnonKey;

if (!supabaseUrl) {
  console.error('❌ CRITICAL ERROR: Missing SUPABASE_URL in environment variables.');
}

if (!supabaseAnonKey || supabaseAnonKey === 'dummy_key') {
  console.error('❌ CRITICAL ERROR: Missing valid SUPABASE_ANON_KEY in environment variables.');
}

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseAnonKey !== 'dummy_key');

// Public/Anon client for user operations (respects RLS)
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({}, {
      get() {
        throw new Error('Supabase client unconfigured: Set SUPABASE_URL and SUPABASE_ANON_KEY in environment variables.');
      }
    });

// Service role client for admin operations (bypasses RLS - server side only)
export const supabaseAdmin = (isConfigured && supabaseServiceKey && supabaseServiceKey !== 'dummy_key')
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase;

export default supabase;
