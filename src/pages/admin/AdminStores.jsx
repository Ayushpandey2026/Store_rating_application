import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Spinner, Alert, SortHeader, EmptyState, SearchInput } from '../../components/UI';

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sort, setSort] = useState({ sortBy: 'name', sortOrder: 'asc' });

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/stores', { params: { ...filters, ...sort } });
      setStores(res.data.stores);
    } catch { setError('Failed to load stores'); }
    finally { setLoading(false); }
  }, [filters, sort]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const handleSort = (field) => setSort(prev => ({
    sortBy: field,
    sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-display text-slate-100 mb-1">Stores</h1>
          <p className="text-slate-400 font-body text-sm">{stores.length} stores registered</p>
        </div>
        <Link to="/admin/stores/add" className="btn-primary text-sm">+ Add Store</Link>
      </div>

      <Alert type="error" message={error} />

      <div className="card mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SearchInput value={filters.name} onChange={v => setFilters(f => ({ ...f, name: v }))} placeholder="Filter by name..." />
          <SearchInput value={filters.email} onChange={v => setFilters(f => ({ ...f, email: v }))} placeholder="Filter by email..." />
          <SearchInput value={filters.address} onChange={v => setFilters(f => ({ ...f, address: v }))} placeholder="Filter by address..." />
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : stores.length === 0 ? (
          <EmptyState icon="🏪" title="No stores found" description="Add the first store to get started" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-800 bg-slate-900/50">
                <tr>
                  <SortHeader label="Name" field="name" {...sort} onSort={handleSort} />
                  <SortHeader label="Email" field="email" {...sort} onSort={handleSort} />
                  <SortHeader label="Address" field="address" {...sort} onSort={handleSort} />
                  <SortHeader label="Rating" field="avg_rating" {...sort} onSort={handleSort} />
                  <th className="table-header">Owner</th>
                </tr>
              </thead>
              <tbody>
                {stores.map(s => (
                  <tr key={s.id} className="table-row">
                    <td className="table-cell font-medium text-slate-100">{s.name}</td>
                    <td className="table-cell text-slate-400">{s.email}</td>
                    <td className="table-cell max-w-xs truncate">{s.address || '—'}</td>
                    <td className="table-cell">
                      {s.avg_rating ? (
                        <span className="text-amber-400 font-mono">★ {s.avg_rating} <span className="text-slate-500 text-xs">({s.rating_count})</span></span>
                      ) : <span className="text-slate-600 text-xs">No ratings</span>}
                    </td>
                    <td className="table-cell">{s.owner_name || <span className="text-slate-600 text-xs">Unassigned</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStores;
