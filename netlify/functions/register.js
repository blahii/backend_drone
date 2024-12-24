const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async function(event, context) {
  const { email, password, full_name, role, ...additionalFields } = JSON.parse(event.body);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase.from('users').insert([{
      email,
      password: hashedPassword,
      full_name,
      role,
      ...additionalFields,
    }]);

    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User registered successfully' }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
