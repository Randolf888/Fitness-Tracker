import { useEffect, useState } from 'react';
import { createActivity, deleteActivity, fetchActivities, updateActivity } from '../api/activities';
import ActivityForm from '../components/ActivityForm';
import ActivityList from '../components/ActivityList';
import { useAuth } from '../context/AuthContext';

const Activities = () => {
  const { user, isAuthenticated } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [editing, setEditing] = useState(null);
  const [filters, setFilters] = useState({ search: '', intensity: '' });

  const loadActivities = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const payload = {
        userId: user._id,
        search: filters.search || undefined,
        intensity: filters.intensity || undefined
      };

      const result = await fetchActivities(payload);
      setActivities(result.data || []);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, filters.intensity, filters.search]);

  const handleSave = async (payload) => {
    try {
      if (editing) {
        await updateActivity(editing._id, payload);
        setFeedback({ type: 'success', message: 'Activity updated successfully.' });
      } else {
        await createActivity(payload);
        setFeedback({ type: 'success', message: 'Activity created successfully.' });
      }
      setEditing(null);
      await loadActivities();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this activity?');
    if (!confirmed) return;

    try {
      await deleteActivity(id);
      setFeedback({ type: 'success', message: 'Activity deleted.' });
      await loadActivities();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="page activities">
      <header className="page-header">
        <div>
          <p className="eyebrow">Activity CRUD</p>
          <h2>Log, edit, and delete activities</h2>
          <p className="muted">All actions go to the Express API and MongoDB—no mock data involved.</p>
        </div>

        <div className="filters">
          <input
            type="search"
            placeholder="Search notes or type"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            value={filters.intensity}
            onChange={(e) => setFilters({ ...filters, intensity: e.target.value })}
          >
            <option value="">All intensities</option>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
          <button className="ghost" onClick={loadActivities} disabled={!isAuthenticated}>
            Refresh
          </button>
        </div>
      </header>

      {feedback && (
        <div className={feedback.type === 'success' ? 'banner success' : 'banner error'}>
          {feedback.message}
        </div>
      )}

      {!isAuthenticated && (
        <div className="panel">
          <p className="eyebrow">Login required</p>
          <p>Please sign in to create and view activities. The userId is required by the API.</p>
        </div>
      )}

      <div className="layout-grid">
        <div className="left">
          <ActivityForm
            userId={user?._id}
            initialData={editing}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
          />
        </div>
        <div className="right">
          {loading ? <p>Loading activities...</p> : <ActivityList items={activities} onEdit={setEditing} onDelete={handleDelete} />}
        </div>
      </div>
    </div>
  );
};

export default Activities;
