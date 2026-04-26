import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Spinner, Alert } from '../../components/UI';

const StatCard = ({ icon, label, value, color }) => (
  <div className="card flex items-center gap-5">
    <div className={`text-4xl w-14 h-14 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
    <div>
      <div className="text-3xl font-display text-slate-100">{value ?? '—'}</div>
      <div className="text-sm text-slate-400 font-body mt-0.5">{label}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setStats(res.data))
      .catch(() => setError('Failed to load dashboard stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-96">
      <Spinner size="lg" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">
      <div className="mb-10">
        <h1 className="text-4xl font-display text-slate-100 mb-2">Admin Dashboard</h1>
        <p className="text-slate-400 font-body">Platform overview and management</p>
      </div>

      <Alert type="error" message={error} />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard icon="👤" label="Total Users" value={stats?.totalUsers} color="bg-blue-900/30 text-blue-400" />
        <StatCard icon="🏪" label="Total Stores" value={stats?.totalStores} color="bg-amber-900/30 text-amber-400" />
        <StatCard icon="⭐" label="Total Ratings" value={stats?.totalRatings} color="bg-green-900/30 text-green-400" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-display text-slate-100 mb-4">User Management</h2>
          <p className="text-slate-400 text-sm font-body mb-5">View, search, and add users to the platform.</p>
          <div className="flex gap-3">
            <Link to="/admin/users" className="btn-primary text-sm">View All Users</Link>
            <Link to="/admin/users/add" className="btn-secondary text-sm">Add User</Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-display text-slate-100 mb-4">Store Management</h2>
          <p className="text-slate-400 text-sm font-body mb-5">Manage stores registered on the platform.</p>
          <div className="flex gap-3">
            <Link to="/admin/stores" className="btn-primary text-sm">View All Stores</Link>
            <Link to="/admin/stores/add" className="btn-secondary text-sm">Add Store</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
