import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, verifyLogin } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const initialForm = { username: '', email: '', password: '' };

const Auth = () => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [otp, setOtp] = useState('');
  const [awaitingOtp, setAwaitingOtp] = useState(false);
  const [pendingLogin, setPendingLogin] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { saveSession, isAuthenticated } = useAuth();

  // If already signed in, skip the auth screen.
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/activities', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const next = {};
    if (mode === 'register' && form.username.trim().length < 3) {
      next.username = 'Username must be at least 3 characters.';
    }

    if (!form.email.match(/^\S+@\S+\.\S+$/)) {
      next.email = 'Enter a valid email address.';
    }

    const needsPassword = mode === 'register' || !awaitingOtp;
    if (needsPassword && form.password.length < 6) {
      next.password = 'Password must be at least 6 characters.';
    }

    if (mode === 'login' && awaitingOtp && otp.trim().length !== 6) {
      next.otp = 'Enter the 6-digit code sent to your email.';
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
      if (mode === 'register') {
        const { message } = await register({ ...form });
        setStatus({ type: 'success', message: message || 'Account created. Please login to continue.' });
        setForm(initialForm);
        setOtp('');
        setAwaitingOtp(false);
        setPendingLogin(null);
        setMode('login');
        return;
      }

      if (awaitingOtp) {
        const email = pendingLogin?.email || form.email;
        const { user, token } = await verifyLogin({ email, otp: otp.trim() });
        saveSession(user, token);
        setStatus({ type: 'success', message: 'Login verified. Redirecting to activities...' });
        setForm(initialForm);
        setOtp('');
        setAwaitingOtp(false);
        setPendingLogin(null);
        navigate('/activities');
        return;
      }

      await login({ email: form.email, password: form.password });
      setPendingLogin({ email: form.email, password: form.password });
      setAwaitingOtp(true);
      setStatus({ type: 'success', message: 'OTP sent to your email. Enter it below to finish login.' });
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
    setAwaitingOtp(false);
    setOtp('');
    setPendingLogin(null);
  };

  const handleResendOtp = async () => {
    if (!pendingLogin) return;

    setLoading(true);
    setStatus(null);

    try {
      await login(pendingLogin);
      setStatus({ type: 'success', message: 'New OTP sent to your email.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Unable to resend code right now.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth">
      <div className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Account</p>
            <h2>{mode === 'login' ? 'Login' : 'Create account'}</h2>
            <p className="muted">Email/password plus OTP verification and JWT-backed sessions.</p>
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
              value={pendingLogin?.email || form.email}
              onChange={(e) => !awaitingOtp && setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
              disabled={awaitingOtp}
            />
            {awaitingOtp && <small className="muted">We sent a code to this address.</small>}
            {errors.email && <small className="error">{errors.email}</small>}
          </label>

          {mode === 'login' && awaitingOtp ? (
            <label>
              <span>One-time password</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit code"
                required
                autoComplete="one-time-code"
              />
              {errors.otp && <small className="error">{errors.otp}</small>}
            </label>
          ) : (
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
          )}

          <div className="actions">
            <button type="submit" className="primary" disabled={loading}>
              {loading ? 'Please wait...' : mode === 'register' ? 'Register' : awaitingOtp ? 'Verify OTP' : 'Send OTP'}
            </button>
            {awaitingOtp && (
              <>
                <button type="button" className="ghost" onClick={handleResendOtp} disabled={loading}>
                  Resend code
                </button>
                <button type="button" className="ghost" onClick={() => switchMode('login')} disabled={loading}>
                  Use a different account
                </button>
              </>
            )}
          </div>
        </form>

        <p className="muted small">
          Secure login now uses email + password plus a 6-digit OTP. Successful verification stores a JWT for
          authenticated API calls.
        </p>
      </div>
    </div>
  );
};

export default Auth;
