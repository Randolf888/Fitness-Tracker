import { useEffect, useState } from 'react';

const typeOptions = ['running', 'walking', 'cycling', 'swimming', 'weightlifting', 'yoga', 'other'];
const intensityOptions = ['low', 'moderate', 'high'];

const createDefaultForm = (userId = '') => ({
  userId,
  type: 'running',
  duration: '',
  calories: '',
  distance: '',
  intensity: 'moderate',
  date: new Date().toISOString().slice(0, 10),
  notes: ''
});

const ActivityForm = ({ userId, initialData, onSubmit, onCancel, isAdmin = false, userOptions = [] }) => {
  const [form, setForm] = useState(createDefaultForm(userId));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        userId: initialData.userId?._id || initialData.userId || userId || '',
        type: initialData.type || 'running',
        duration: initialData.duration ?? '',
        calories: initialData.calories ?? '',
        distance: initialData.distance ?? '',
        intensity: initialData.intensity || 'moderate',
        date: initialData.date ? initialData.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
        notes: initialData.notes || ''
      });
    } else {
      setForm(createDefaultForm(userId));
    }
  }, [initialData, userId]);

  const resolveUserId = () => {
    if (isAdmin) {
      return form.userId || initialData?.userId?._id || initialData?.userId || userId || '';
    }
    return userId;
  };

  const validate = () => {
    const nextErrors = {};

    if (!resolveUserId()) {
      nextErrors.user = isAdmin ? 'Pick which user owns this activity.' : 'Login first to link activities to your account.';
    }
    if (!form.type) nextErrors.type = 'Choose an activity type.';

    if (form.duration === '' || Number(form.duration) <= 0) {
      nextErrors.duration = 'Duration must be greater than 0 minutes.';
    }

    if (form.calories === '' || Number(form.calories) <= 0) {
      nextErrors.calories = 'Calories must be greater than 0.';
    }

    if (!form.date) {
      nextErrors.date = 'Pick a date.';
    }

    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length) return;

    setSubmitting(true);
    try {
      const targetUserId = resolveUserId();
      const payload = {
        ...form,
        userId: targetUserId,
        duration: Number(form.duration),
        calories: Number(form.calories),
        distance: form.distance === '' ? undefined : Number(form.distance)
      };

      await onSubmit(payload);

      if (!initialData) {
        setForm(createDefaultForm(targetUserId));
      }
    } catch (err) {
      setErrors((prev) => ({ ...prev, form: err.message || 'Unable to save activity' }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <div className="panel-header">
        <div>
          <p className="eyebrow">{initialData ? 'Update activity' : 'Log new activity'}</p>
          <h3>{initialData ? 'Edit activity' : 'Create activity'}</h3>
        </div>
        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? 'Saving...' : initialData ? 'Update' : 'Save'}
        </button>
      </div>

      {errors.form && <p className="error">{errors.form}</p>}

      {isAdmin && (
        <label>
          <span>User</span>
          <select
            value={form.userId}
            onChange={(e) => setForm({ ...form, userId: e.target.value })}
            required
          >
            <option value="">Select user</option>
            {userOptions.map((opt) => (
              <option key={opt._id} value={opt._id}>
                {opt.username} ({opt.email})
              </option>
            ))}
          </select>
          <small className="muted">Admins can assign or reassign activities.</small>
          {errors.user && <small className="error">{errors.user}</small>}
        </label>
      )}
      {!isAdmin && errors.user && <p className="error">{errors.user}</p>}

      <div className="form-grid">
        <label>
          <span>Type</span>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required>
            {typeOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          {errors.type && <small className="error">{errors.type}</small>}
        </label>

        <label>
          <span>Duration (minutes)</span>
          <input
            type="number"
            min="0"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            placeholder="e.g., 45"
            required
          />
          {errors.duration && <small className="error">{errors.duration}</small>}
        </label>

        <label>
          <span>Calories burned</span>
          <input
            type="number"
            min="0"
            value={form.calories}
            onChange={(e) => setForm({ ...form, calories: e.target.value })}
            placeholder="e.g., 300"
            required
          />
          {errors.calories && <small className="error">{errors.calories}</small>}
        </label>

        <label>
          <span>Distance (km)</span>
          <input
            type="number"
            min="0"
            value={form.distance}
            onChange={(e) => setForm({ ...form, distance: e.target.value })}
            placeholder="Optional"
          />
        </label>

        <label>
          <span>Intensity</span>
          <div className="chip-row">
            {intensityOptions.map((level) => (
              <button
                key={level}
                type="button"
                className={form.intensity === level ? 'chip active' : 'chip'}
                onClick={() => setForm({ ...form, intensity: level })}
              >
                {level}
              </button>
            ))}
          </div>
        </label>

        <label>
          <span>Date</span>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
          {errors.date && <small className="error">{errors.date}</small>}
        </label>
      </div>

      <label>
        <span>Notes</span>
        <textarea
          rows="3"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Any highlights, mood, or conditions worth noting..."
        />
      </label>

      {initialData && (
        <div className="actions">
          <button type="button" className="ghost" onClick={onCancel}>Cancel</button>
          <button type="submit" className="primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      )}
    </form>
  );
};

export default ActivityForm;
