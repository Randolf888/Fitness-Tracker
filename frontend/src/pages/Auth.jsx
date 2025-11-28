import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const initialForm = { username: '', email: '', password: '' };

const Auth = () => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { saveUser } = useAuth();

  const validate = () => {
    const next = {};
    if (mode === 'register' && form.username.trim().length < 3) {
      next.username = 'Username must be at least 3 characters.';
    }

    if (!form.email.match(/^\S+@\S+\.\S+$/)) {
      next.email = 'Enter a valid email address.';
    }

    if (form.password.length < 6) {
      next.password = 'Password must be at least 6 characters.';
    }

    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const issues = validate();
    setErrors(issues);
    if (Object.keys(issues).length) return;

    setLoading(true);
    setStatus(null);

    try {
      const payload = { ...form };
      const user = mode === 'login' ? await login(payload) : await register(payload);
      saveUser(user);
      setStatus({ type: 'success', message: `Welcome, ${user.username || 'athlete'}!` });
      setForm(initialForm);
      navigate('/activities');
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Unable to authenticate right now.' });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setForm(initialForm);
    setErrors({});
    setStatus(null);
  };

  return (
    <div className="page auth">
      <div className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Account</p>
            <h2>{mode === 'login' ? 'Login' : 'Create account'}</h2>
            <p className="muted">Authenticate against the Express API; no mock data.</p>
          </div>
          <div className="tab">
            <button className={mode === 'login' ? 'chip active' : 'chip'} onClick={() => switchMode('login')}>
              Login
            </button>
            <button className={mode === 'register' ? 'chip active' : 'chip'} onClick={() => switchMode('register')}>
              Register
            </button>
          </div>
        </div>

        {status && (
          <div className={status.type === 'success' ? 'banner success' : 'banner error'}>
            {status.message}
          </div>
        )}

        <form className="form-grid" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label>
              <span>Username</span>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="e.g., fitfan123"
                required={mode === 'register'}
              />
              {errors.username && <small className="error">{errors.username}</small>}
            </label>
          )}

          <label>
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
            />
            {errors.email && <small className="error">{errors.email}</small>}
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 6 characters"
              required
            />
            {errors.password && <small className="error">{errors.password}</small>}
          </label>

          <div className="actions">
            <button type="submit" className="primary" disabled={loading}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
            </button>
          </div>
        </form>

        <p className="muted small">
          Client-side validation checks email format, password length, and (for registration) username length
          before calling the API.
        </p>
      </div>
    </div>
  );
};

export default Auth;
