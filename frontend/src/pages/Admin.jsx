import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAdminStats, fetchUsers, updateUserAccount, deleteUserAccount } from '../api/auth';
import { createActivity, deleteActivity, fetchActivities, updateActivity } from '../api/activities';
import ActivityForm from '../components/ActivityForm';
import ActivityList from '../components/ActivityList';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [ready, setReady] = useState(false);
  const [pageNotice, setPageNotice] = useState(null);

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const [userFilters, setUserFilters] = useState({ search: '', role: '' });
  const [userLoading, setUserLoading] = useState(false);
  const [savingUserId, setSavingUserId] = useState(null);
  const [userFeedback, setUserFeedback] = useState(null);

  const [activities, setActivities] = useState([]);
  const [activityFilters, setActivityFilters] = useState({ search: '', intensity: '', userId: '' });
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityFeedback, setActivityFeedback] = useState(null);
  const [editing, setEditing] = useState(null);

  const userOptions = useMemo(() => users.map((u) => ({
    _id: u._id,
    username: u.username,
    email: u.email
  })), [users]);

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const data = await fetchAdminStats();
      setStats(data);
      setPageNotice(null);
    } catch (err) {
      setPageNotice({ type: 'error', message: err.message || 'Unable to load admin stats.' });
    } finally {
      setStatsLoading(false);
    }
  };

  const loadUsers = async () => {
    setUserLoading(true);
    setUserFeedback(null);
    try {
      const response = await fetchUsers({
        search: userFilters.search || undefined,
        role: userFilters.role || undefined,
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      setUsers(response.data || []);
      setPageNotice(null);
    } catch (err) {
      setUserFeedback({ type: 'error', message: err.message || 'Unable to load users right now.' });
    } finally {
      setUserLoading(false);
    }
  };

  const loadActivities = async () => {
    setActivityLoading(true);
    try {
      const response = await fetchActivities({
        search: activityFilters.search || undefined,
        intensity: activityFilters.intensity || undefined,
        userId: activityFilters.userId || undefined,
        sortBy: 'date',
        sortOrder: 'desc',
        limit: 30
      });
      setActivities(response.data || []);
      setActivityFeedback(null);
    } catch (err) {
      setActivityFeedback({ type: 'error', message: err.message || 'Unable to load activities.' });
    } finally {
      setActivityLoading(false);
    }
  };

  const handleRoleChange = async (id, nextRole) => {
    setSavingUserId(id);
    setUserFeedback(null);
    try {
      await updateUserAccount(id, { role: nextRole });
      setUserFeedback({ type: 'success', message: 'Role updated.' });
      await Promise.all([loadUsers(), loadStats()]);
    } catch (err) {
      setUserFeedback({ type: 'error', message: err.message || 'Unable to update role.' });
    } finally {
      setSavingUserId(null);
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmed = window.confirm('Delete this user and their data?');
    if (!confirmed) return;

    setSavingUserId(id);
    setUserFeedback(null);

    try {
      await deleteUserAccount(id);
      setUserFeedback({ type: 'success', message: 'User removed.' });
      await Promise.all([loadUsers(), loadActivities(), loadStats()]);
    } catch (err) {
      setUserFeedback({ type: 'error', message: err.message || 'Unable to delete user.' });
    } finally {
      setSavingUserId(null);
    }
  };

  const handleActivitySave = async (payload) => {
    try {
      if (editing) {
        await updateActivity(editing._id, payload);
        setActivityFeedback({ type: 'success', message: 'Activity updated.' });
      } else {
        await createActivity(payload);
        setActivityFeedback({ type: 'success', message: 'Activity created.' });
      }
      setEditing(null);
      await Promise.all([loadActivities(), loadStats()]);
    } catch (err) {
      setActivityFeedback({ type: 'error', message: err.message });
    }
  };

  const handleActivityDelete = async (id) => {
    const confirmed = window.confirm('Delete this activity?');
    if (!confirmed) return;

    try {
      await deleteActivity(id);
      setActivityFeedback({ type: 'success', message: 'Activity deleted.' });
      await Promise.all([loadActivities(), loadStats()]);
    } catch (err) {
      setActivityFeedback({ type: 'error', message: err.message });
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    setReady(true);
  }, [isAuthenticated, user?.role, navigate]);

  useEffect(() => {
    if (!ready) return;
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, userFilters.role, userFilters.search]);

  useEffect(() => {
    if (!ready) return;
    loadActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, activityFilters.intensity, activityFilters.search, activityFilters.userId]);

  return (
    <div className="page admin">
      <header className="page-header">
        <div>
          <p className="eyebrow">Admin console</p>
          <h2>Control room for FitLog Pro</h2>
          <p className="muted">Manage accounts, moderate activities, and keep data healthy.</p>
        </div>
        <span className="admin-badge">Admin</span>
      </header>

      {pageNotice && (
        <div className={pageNotice.type === 'error' ? 'banner error' : 'banner success'}>
          {pageNotice.message}
        </div>
      )}

      <section className="grid admin-stats">
        <div className="panel stat-card">
          <p className="eyebrow">Total users</p>
          <h3 className="stat-figure">{statsLoading ? 'Loading...' : stats?.totalUsers ?? '—'}</h3>
          <p className="muted small">Across admins and customers</p>
        </div>
        <div className="panel stat-card">
          <p className="eyebrow">Admins</p>
          <h3 className="stat-figure">{statsLoading ? 'Loading...' : stats?.admins ?? '—'}</h3>
          <p className="muted small">People who can moderate data</p>
        </div>
        <div className="panel stat-card">
          <p className="eyebrow">Customers</p>
          <h3 className="stat-figure">{statsLoading ? 'Loading...' : stats?.customers ?? '—'}</h3>
          <p className="muted small">Active fitness trackers</p>
        </div>
        <div className="panel stat-card">
          <p className="eyebrow">Activities logged</p>
          <h3 className="stat-figure">{statsLoading ? 'Loading...' : stats?.totalActivities ?? '—'}</h3>
          <p className="muted small">All users combined</p>
        </div>
      </section>

      <div className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Users</p>
            <h3>Manage roles and accounts</h3>
          </div>
          <div className="filters">
            <input
              type="search"
              placeholder="Search by name or email"
              value={userFilters.search}
              onChange={(e) => setUserFilters((prev) => ({ ...prev, search: e.target.value }))}
            />
            <select
              value={userFilters.role}
              onChange={(e) => setUserFilters((prev) => ({ ...prev, role: e.target.value }))}
            >
              <option value="">All roles</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
            <button className="ghost" onClick={loadUsers} disabled={userLoading}>
              {userLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {userFeedback && (
          <div className={userFeedback.type === 'success' ? 'banner success' : 'banner error'}>
            {userFeedback.message}
          </div>
        )}

        {userLoading ? (
          <p>Loading users...</p>
        ) : users.length ? (
          <div className="admin-list">
            {users.map((item) => (
              <div className="admin-row" key={item._id}>
                <div>
                  <p className="owner-name">{item.username}</p>
                  <p className="muted small">{item.email}</p>
                  <p className="muted small">Joined {new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="admin-actions">
                  <select
                    value={item.role}
                    onChange={(e) => handleRoleChange(item._id, e.target.value)}
                    disabled={savingUserId === item._id}
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => setActivityFilters((prev) => ({ ...prev, userId: item._id }))}
                  >
                    Filter activity
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => handleDeleteUser(item._id)}
                    disabled={savingUserId === item._id}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">No users found for this filter.</p>
        )}
      </div>

      <div className="layout-grid admin-activity">
        <div className="left">
          <ActivityForm
            userId={activityFilters.userId}
            initialData={editing}
            isAdmin
            userOptions={userOptions}
            onSubmit={handleActivitySave}
            onCancel={() => setEditing(null)}
          />
        </div>
        <div className="right">
          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Activity moderation</p>
                <h3>Search and clean up logs</h3>
              </div>
              <div className="filters">
                <input
                  type="search"
                  placeholder="Search by notes or type"
                  value={activityFilters.search}
                  onChange={(e) => setActivityFilters((prev) => ({ ...prev, search: e.target.value }))}
                />
                <select
                  value={activityFilters.userId}
                  onChange={(e) => setActivityFilters((prev) => ({ ...prev, userId: e.target.value }))}
                >
                  <option value="">All users</option>
                  {userOptions.map((opt) => (
                    <option key={opt._id} value={opt._id}>{opt.username}</option>
                  ))}
                </select>
                <select
                  value={activityFilters.intensity}
                  onChange={(e) => setActivityFilters((prev) => ({ ...prev, intensity: e.target.value }))}
                >
                  <option value="">All intensities</option>
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {activityFeedback && (
              <div className={activityFeedback.type === 'success' ? 'banner success' : 'banner error'}>
                {activityFeedback.message}
              </div>
            )}

            {activityLoading ? (
              <p>Loading activities...</p>
            ) : (
              <ActivityList
                items={activities}
                onEdit={setEditing}
                onDelete={handleActivityDelete}
                showUser
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
