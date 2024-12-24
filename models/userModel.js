// Этот файл можно использовать для любых дополнительных методов работы с пользователями, если потребуется
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function createUser(email, password) {
  // Функция для создания пользователя в Supabase
  const { data, error } = await supabase
    .from('users')
    .insert([{ email, password }]);

  return { data, error };
}

module.exports = { createUser };
