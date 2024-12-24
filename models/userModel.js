// Этот файл можно использовать для любых дополнительных методов работы с пользователями, если потребуется
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function createUser(email, password, role, additionalFields) {
  // Function to create a user in Supabase
  const { data, error } = await supabase
    .from('users')
    .insert([{ email, password, role, ...additionalFields }]); // Include role and additional fields

  return { data, error };
}

module.exports = { createUser };
