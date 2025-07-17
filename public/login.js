const form = document.querySelector('.login-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = form.email.value.trim();
  const password = form.password.value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      // Store the token (consider sessionStorage for temporary sessions)
      localStorage.setItem('token', data.token);
      alert('Login successful!');
      window.location.href = '/index.html'; // Redirect to home or dashboard
    } else {
      alert(`Login failed: ${data.error}`);
    }

  } catch (err) {
    console.error('Error:', err);
    alert('Something went wrong. Please try again.');
  }
});