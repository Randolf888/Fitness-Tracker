import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <Link to="/">FitLog Pro</Link>
          <span className="badge">Phase 4</span>
        </div>

        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : undefined}>Home</NavLink>
          <NavLink to="/activities" className={({ isActive }) => isActive ? 'active' : undefined}>Activities</NavLink>
          <NavLink to="/auth" className={({ isActive }) => isActive ? 'active' : undefined}>Auth</NavLink>
        </nav>

        <div className="user-meta">
          {isAuthenticated ? (
            <>
              <div className="user-chip">
                <span className="dot" />
                <div>
                  <p className="user-name">{user.username || 'User'}</p>
                  <p className="user-email">{user.email}</p>
                </div>
              </div>
              <button className="ghost" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link className="ghost" to="/auth">Login</Link>
          )}
        </div>
      </header>

      <main className="page-body">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
