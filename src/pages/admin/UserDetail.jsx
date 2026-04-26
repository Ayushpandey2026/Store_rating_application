import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { Spinner, Alert, RoleBadge } from '../../components/UI';

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/admin/users/${id}`)
      .then(res => setUser(res.data.user))
      .catch(() => setError('Failed to load user'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center pt-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-fade-in-up">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/users" className="btn-ghost text-sm">← Back to Users</Link>
      </div>

      <Alert type="error" message={error} />

      {user && (
        <div className="card space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-display text-slate-100 mb-2">{user.name}</h1>
              <RoleBadge role={user.role} />
            </div>
            <div className="text-5xl opacity-20">👤</div>
          </div>

          <div className="border-t border-slate-800 pt-6 space-y-4">
            <DetailRow label="Email" value={user.email} />
            <DetailRow label="Address" value={user.address || 'Not provided'} />
            <DetailRow label="Role" value={<RoleBadge role={user.role} />} />
            <DetailRow label="Member since" value={new Date(user.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })} />
            {user.role === 'store_owner' && (
              <DetailRow
                label="Store Rating"
                value={
                  user.store_rating ? (
                    <span className="text-amber-400 font-mono font-medium">★ {user.store_rating} / 5</span>
                  ) : 'No ratings yet'
                }
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
    <span className="text-sm text-slate-500 font-body w-36 shrink-0">{label}</span>
    <span className="text-sm text-slate-200 font-body">{value}</span>
  </div>
);

export default UserDetail;
