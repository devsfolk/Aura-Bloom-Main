const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = (process.env.VITE_SUPABASE_URL || '').replace(/\/rest\/v1\/?$/, '');
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const adminEmail = process.env.SUPABASE_ADMIN_EMAIL || 'devsfolk@gmail.com';
const adminPassword = process.env.SUPABASE_ADMIN_PASSWORD || 'lTCBkXW0HA4rNh0r';

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase configuration in .env');
  process.exit(1);
}

async function createAdmin() {
  console.log(`Attempting to create/update admin user: ${adminEmail}`);
  
  const authUrl = `${supabaseUrl}/auth/v1/admin/users`;
  
  const response = await fetch(authUrl, {
    method: 'POST',
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true
    })
  });

  const result = await response.json();

  if (!response.ok) {
    if (result.message && result.message.includes('already registered')) {
      console.log('User already exists. Updating password...');
      
      // First find the user to get their ID
      const listResponse = await fetch(`${authUrl}`, {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`
        }
      });
      const users = await listResponse.json();
      const user = users.find(u => u.email === adminEmail);
      
      if (user) {
        const updateResponse = await fetch(`${authUrl}/${user.id}`, {
          method: 'PUT',
          headers: {
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            password: adminPassword
          })
        });
        
        if (updateResponse.ok) {
          console.log('Password updated successfully.');
        } else {
          const updateError = await updateResponse.json();
          console.error('Error updating password:', updateError.message);
        }
      } else {
        console.error('User not found in list despite "already registered" error.');
      }
    } else {
      console.error('Error:', result.message || JSON.stringify(result));
    }
  } else {
    console.log('Admin user created successfully!');
  }
}

createAdmin();
