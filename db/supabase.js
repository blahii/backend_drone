   const { createClient } = require('@supabase/supabase-js');

   const supabaseUrl = 'https://phinithgmplmostxqhkm.supabase.co';
   const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoaW5pdGhnbXBsbW9zdHhxaGttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NzIyMzMsImV4cCI6MjA1MDA0ODIzM30.Mdq51fVkE5BkfLsP8cUaTYMcMfD4kKAZYnUoR5N411k';

   const supabase = createClient(supabaseUrl, supabaseAnonKey);

   module.exports = { supabase };