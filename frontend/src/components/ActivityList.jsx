const ActivityList = ({ items, onEdit, onDelete }) => {
  if (!items.length) {
    return (
      <div className="panel">
        <p className="eyebrow">No activity yet</p>
        <p>Add an entry to see it appear here.</p>
      </div>
    );
  }

  return (
    <div className="activity-grid">
      {items.map((activity) => (
        <article className="activity-card" key={activity._id}>
          <div className="card-header">
            <div>
              <p className="eyebrow">{new Date(activity.date).toLocaleDateString()}</p>
              <h4>{activity.type}</h4>
            </div>
            <span className="pill">{activity.intensity}</span>
          </div>

          <dl className="stats">
            <div>
              <dt>Duration</dt>
              <dd>{activity.duration} min</dd>
            </div>
            <div>
              <dt>Calories</dt>
              <dd>{activity.calories} kcal</dd>
            </div>
            {activity.distance !== undefined && activity.distance !== null && (
              <div>
                <dt>Distance</dt>
                <dd>{activity.distance} km</dd>
              </div>
            )}
          </dl>

          {activity.notes && <p className="notes">{activity.notes}</p>}

          <div className="card-actions">
            <button className="ghost" onClick={() => onEdit(activity)}>Edit</button>
            <button className="danger" onClick={() => onDelete(activity._id)}>Delete</button>
          </div>
        </article>
      ))}
    </div>
  );
};

export default ActivityList;
