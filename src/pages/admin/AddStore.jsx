import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { Alert } from '../../components/UI';

const AddStore = () => {
  const [form, setForm] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [owners, setOwners] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/admin/users', { params: { role: 'store_owner' } })
      .then(res => setOwners(res.data.users))
      .catch(() => {});
  }, []);

  const validate = () => {
    const errs = {};
    if (form.name.length < 20 || form.name.length > 60) errs.name = 'Store name must be 20–60 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address';
    if (form.address && form.address.length > 400) errs.address = 'Address max 400 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setServerError('');
    setLoading(true);
    try {
      await api.post('/admin/stores', { ...form, owner_id: form.owner_id || null });
      setSuccess('Store created successfully!');
      setTimeout(() => navigate('/admin/stores'), 1500);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create store');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-fade-in-up">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/stores" className="btn-ghost text-sm">← Back</Link>
        <div>
          <h1 className="text-3xl font-display text-slate-100">Add New Store</h1>
          <p className="text-slate-400 text-sm font-body mt-1">Register a new store on the platform</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Alert type="error" message={serverError} />
          <Alert type="success" message={success} />

          <div>
            <label className="label">Store Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className={`input-field ${errors.name ? 'border-red-700' : ''}`} placeholder="Store name (20–60 characters)" />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div>
            <label className="label">Store Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              className={`input-field ${errors.email ? 'border-red-700' : ''}`} placeholder="store@example.com" />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div>
            <label className="label">Address</label>
            <textarea rows={3} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
              className="input-field resize-none" placeholder="Store address (optional)" />
            {errors.address && <p className="error-text">{errors.address}</p>}
          </div>

          <div>
            <label className="label">Store Owner (optional)</label>
            <select value={form.owner_id} onChange={e => setForm({ ...form, owner_id: e.target.value })} className="input-field">
              <option value="">No owner assigned</option>
              {owners.map(o => (
                <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
              ))}
            </select>
            {owners.length === 0 && (
              <p className="text-slate-500 text-xs mt-1">No store owners available. Create a user with store_owner role first.</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Creating...' : 'Create Store'}
            </button>
            <Link to="/admin/stores" className="btn-secondary text-center flex-1">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStore;
