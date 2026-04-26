import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Spinner, Alert, StarRating, EmptyState } from '../../components/UI';

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/stores/owner/dashboard')
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center pt-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">
      <div className="mb-10">
        <h1 className="text-4xl font-display text-slate-100 mb-2">Store Dashboard</h1>
        <p className="text-slate-400 font-body">Monitor your store's performance and customer ratings</p>
      </div>

      <Alert type="error" message={error} />

      {data && (
        <>
          {/* Store overview */}
          <div className="card mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-display text-slate-100 mb-1">{data.store.name}</h2>
                <p className="text-slate-400 text-sm font-body">{data.store.address}</p>
                <p className="text-slate-500 text-sm font-body mt-1">{data.store.email}</p>
              </div>
              <div className="text-center sm:text-right">
                {data.store.avg_rating ? (
                  <>
                    <div className="text-5xl font-display text-amber-400 mb-1">{data.store.avg_rating}</div>
                    <StarRating value={Math.round(data.store.avg_rating)} readonly size="md" />
                    <div className="text-slate-500 text-sm mt-2 font-body">
                      Based on {data.store.total_ratings} rating{data.store.total_ratings !== '1' ? 's' : ''}
                    </div>
                  </>
                ) : (
                  <div className="text-slate-500 font-body">No ratings yet</div>
                )}
              </div>
            </div>
          </div>

          {/* Ratings table */}
          <div>
            <h2 className="text-2xl font-display text-slate-100 mb-4">Customer Ratings</h2>
            {data.ratings.length === 0 ? (
              <EmptyState icon="⭐" title="No ratings yet" description="Your store hasn't received any ratings yet. Share your store link!" />
            ) : (
              <div className="card p-0 overflow-hidden">
                <table className="w-full">
                  <thead className="border-b border-slate-800 bg-slate-900/50">
                    <tr>
                      <th className="table-header">Customer</th>
                      <th className="table-header">Email</th>
                      <th className="table-header">Rating</th>
                      <th className="table-header">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.ratings.map(r => (
                      <tr key={r.id} className="table-row">
                        <td className="table-cell font-medium text-slate-100">{r.name}</td>
                        <td className="table-cell text-slate-400">{r.email}</td>
                        <td className="table-cell">
                          <div className="flex items-center gap-2">
                            <StarRating value={r.rating} readonly size="sm" />
                            <span className="text-slate-400 text-sm font-mono">({r.rating})</span>
                          </div>
                        </td>
                        <td className="table-cell text-slate-500">
                          {new Date(r.updated_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OwnerDashboard;
