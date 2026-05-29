(async () => {
  try {
    const ts = Date.now();
    const email = `testuser${ts}@example.com`;
    const username = `testuser${ts}`;
    console.log('REGISTER ->', email, username);

    const registerRes = await fetch('http://localhost:8000/api/v1/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ fullName: 'Test User', email, username, password: 'Passw0rd!' }),
    });

    console.log('register status', registerRes.status);
    const registerBody = await registerRes.json().catch(() => null);
    console.log('register body', registerBody);

    const loginRes = await fetch('http://localhost:8000/api/v1/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ username, password: 'Passw0rd!' }),
    });

    console.log('login status', loginRes.status);
    const loginBody = await loginRes.json().catch(() => null);
    console.log('login body', loginBody);

    // display set-cookie headers if present
    console.log('set-cookie headers:', loginRes.headers.get('set-cookie'));
  } catch (err) {
    console.error('ERROR', err.message || err);
  }
})();
