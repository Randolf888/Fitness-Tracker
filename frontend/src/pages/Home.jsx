import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">Fitness tracker · React + Express + MongoDB</p>
          <h1>Track movement, stay accountable, and keep your goals visible.</h1>
          <p className="lede">
            FitLog Pro now ships with a React frontend. Log workouts, tweak entries, and keep your
            data in sync with the Express + MongoDB API—no more hard-coded mock data.
          </p>
          <div className="cta-row">
            <Link className="primary" to={isAuthenticated ? '/activities' : '/auth'}>
              {isAuthenticated ? 'Go to activities' : 'Login or sign up'}
            </Link>
            <Link className="ghost" to="/activities">View activity board</Link>
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-metric">
            <p className="eyebrow">Weekly burn</p>
            <h2>3,450 kcal</h2>
            <p className="muted">Sample metric to show the UI direction.</p>
          </div>
          <div className="hero-stats">
            <div>
              <p className="eyebrow">Consistency</p>
              <h4>5 / 7 days</h4>
              <p className="muted">kept active this week</p>
            </div>
            <div>
              <p className="eyebrow">Longest streak</p>
              <h4>12 days</h4>
              <p className="muted">and counting</p>
            </div>
            <div>
              <p className="eyebrow">Focus</p>
              <h4>Endurance</h4>
              <p className="muted">cardio + tempo runs</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid">
        <div className="panel">
          <p className="eyebrow">Feature</p>
          <h3>End-to-end CRUD</h3>
          <p>Activities, goals, and progress records go straight to MongoDB via the Express API.</p>
        </div>
        <div className="panel">
          <p className="eyebrow">Validation</p>
          <h3>Client-side guardrails</h3>
          <p>Required fields, numeric checks, and inline feedback prevent bad submissions.</p>
        </div>
        <div className="panel">
          <p className="eyebrow">Routing</p>
          <h3>React Router navigation</h3>
          <p>Dedicated routes for auth and activities with persistent user context.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
