// backend/src/controllers/authController.js
// (stub implementations until you wire up JWT/session logic)

export async function getMe(req, res) {
  try {
    // TODO: Replace with real auth lookup
    res.json({ id: 'guest', name: 'Guest User', email: 'guest@example.com' });
  } catch (err) {
    console.error('❌ getMe error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (email === 'guest@example.com' && password === 'password') {
      return res.json({ token: 'fake-token', user: { id: 'guest', email } });
    }
    res.status(401).json({ message: 'Invalid credentials' });
  } catch (err) {
    console.error('❌ login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;
    // TODO: Create user in DB
    res.status(201).json({ id: 'new-user', name, email });
  } catch (err) {
    console.error('❌ signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
