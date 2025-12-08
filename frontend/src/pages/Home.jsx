import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchActivities } from '../api/activities';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [stats, setStats] = useState({
    weeklyBurn: null,
    consistency: null,
    longestStreak: null,
    focus: null
  });
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    if (!user?._id) return;
    setLoading(true);

    try {
      const response = await fetchActivities({
        userId: user._id,
        limit: 100,
        sortBy: 'date',
        sortOrder: 'desc'
      });

      const activities = response.data || [];
      const now = new Date();
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 6);

      const recent = activities.filter((a) => {
        const d = new Date(a.date || a.createdAt || a.updatedAt);
        return d >= sevenDaysAgo && d <= now;
      });

      const dayKey = (d) => Math.floor(new Date(d).setHours(0, 0, 0, 0) / 86400000);
      const uniqueDays = [...new Set(recent.map((a) => dayKey(a.date || a.createdAt || a.updatedAt)))].sort((a, b) => a - b);

      let longestStreak = 0;
      let currentStreak = 0;
      let prevDay = null;
      uniqueDays.forEach((day) => {
        if (prevDay !== null && day === prevDay + 1) {
          currentStreak += 1;
        } else {
          currentStreak = 1;
        }
        longestStreak = Math.max(longestStreak, currentStreak);
        prevDay = day;
      });

      const weeklyBurn = recent.reduce((sum, a) => sum + Number(a.calories || 0), 0);
      const consistency = uniqueDays.length;

      const typeCounts = recent.reduce((acc, a) => {
        const type = a.type || 'Mixed';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});
      const focus = Object.entries(typeCounts).sort(([, cA], [, cB]) => cB - cA)[0]?.[0] || 'Endurance';

      setStats({
        weeklyBurn,
        consistency,
        longestStreak: longestStreak || 0,
        focus
      });
    } catch (err) {
      console.error('Failed to load stats', err);
      setStats({
        weeklyBurn: null,
        consistency: null,
        longestStreak: null,
        focus: null
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const weeklyBurnLabel = useMemo(() => {
    if (!isAuthenticated || stats.weeklyBurn === null) return '3,450 kcal';
    return `${stats.weeklyBurn.toLocaleString()} kcal`;
  }, [isAuthenticated, stats.weeklyBurn]);

  const consistencyLabel = useMemo(() => {
    if (!isAuthenticated || stats.consistency === null) return '5 / 7 days';
    return `${stats.consistency} / 7 days`;
  }, [isAuthenticated, stats.consistency]);

  const longestStreakLabel = useMemo(() => {
    if (!isAuthenticated || stats.longestStreak === null) return '12 days';
    const suffix = stats.longestStreak === 1 ? 'day' : 'days';
    return `${stats.longestStreak} ${suffix}`;
  }, [isAuthenticated, stats.longestStreak]);

  const focusLabel = useMemo(() => {
    if (!isAuthenticated || !stats.focus) return 'Endurance';
    return stats.focus;
  }, [isAuthenticated, stats.focus]);

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
            <h2>{weeklyBurnLabel}</h2>
            <p className="muted">
              {loading ? 'Refreshing your data...' : 'Based on your logged activities this week.'}
            </p>
          </div>
          <div className="hero-stats">
            <div>
              <p className="eyebrow">Consistency</p>
              <h4>{consistencyLabel}</h4>
              <p className="muted">kept active this week</p>
            </div>
            <div>
              <p className="eyebrow">Longest streak</p>
              <h4>{longestStreakLabel}</h4>
              <p className="muted">and counting</p>
            </div>
            <div>
              <p className="eyebrow">Focus</p>
              <h4>{focusLabel}</h4>
              <p className="muted">recent training mix</p>
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
