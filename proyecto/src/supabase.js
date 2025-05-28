// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ixqjtnfvnojrxxruseok.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cWp0bmZ2bm9qcnh4cnVzZW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzOTgwMDAsImV4cCI6MjA2Mzk3NDAwMH0.gangSZNiBtn7JmYpdUezyeDyCoKNFZk7JXbo_GyPl1Y';

export const supabase = createClient(supabaseUrl, supabaseKey);
