import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { Spinner, Alert, RoleBadge, SortHeader, EmptyState, SearchInput } from '../../components/UI';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ sortBy: 'name', sortOrder: 'asc' });
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, ...sort };
      const res = await api.get('/admin/users', { params });
      setUsers(res.data.users);
    } catch {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSort = (field) => {
    setSort(prev => ({
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-display text-slate-100 mb-1">Users</h1>
          <p className="text-slate-400 font-body text-sm">{users.length} users found</p>
        </div>
        <Link to="/admin/users/add" className="btn-primary text-sm">+ Add User</Link>
      </div>

      <Alert type="error" message={error} />

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SearchInput value={filters.name} onChange={v => setFilters(f => ({ ...f, name: v }))} placeholder="Filter by name..." />
          <SearchInput value={filters.email} onChange={v => setFilters(f => ({ ...f, email: v }))} placeholder="Filter by email..." />
          <SearchInput value={filters.address} onChange={v => setFilters(f => ({ ...f, address: v }))} placeholder="Filter by address..." />
          <select
            value={filters.role}
            onChange={e => setFilters(f => ({ ...f, role: e.target.value }))}
            className="input-field"
          >
            <option value="">All roles</option>
            <option value="user">User</option>
            <option value="store_owner">Store Owner</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : users.length === 0 ? (
          <EmptyState icon="👤" title="No users found" description="Try adjusting your filters" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-800 bg-slate-900/50">
                <tr>
                  <SortHeader label="Name" field="name" {...sort} onSort={handleSort} />
                  <SortHeader label="Email" field="email" {...sort} onSort={handleSort} />
                  <SortHeader label="Address" field="address" {...sort} onSort={handleSort} />
                  <SortHeader label="Role" field="role" {...sort} onSort={handleSort} />
                  <th className="table-header">Store Rating</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="table-row">
                    <td className="table-cell font-medium text-slate-100">{u.name}</td>
                    <td className="table-cell text-slate-400">{u.email}</td>
                    <td className="table-cell max-w-xs truncate">{u.address || '—'}</td>
                    <td className="table-cell"><RoleBadge role={u.role} /></td>
                    <td className="table-cell">
                      {u.store_rating ? (
                        <span className="text-amber-400 font-mono">★ {u.store_rating}</span>
                      ) : '—'}
                    </td>
                    <td className="table-cell">
                      <button
                        onClick={() => navigate(`/admin/users/${u.id}`)}
                        className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors"
                      >
                        View
                      </button>
                    </td>
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

export default AdminUsers;
