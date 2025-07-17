const form = document.querySelector('.signup-form')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const email = form.email.value.trim()
  const password = form.password.value
  const confirmPassword = form['confirm-password'].value

  if (password !== confirmPassword) {
    alert('Passwords do not match.')
    return
  }

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (res.ok) {
      alert('Registration successful! You can now log in.')
      window.location.href = '/login.html'
    } else {
      alert(`Registration failed: ${data.error || 'Unknown error'}`)
    }
  } catch (err) {
    console.error('Signup error:', err)
    alert('Something went wrong. Please try again.')
  }
})