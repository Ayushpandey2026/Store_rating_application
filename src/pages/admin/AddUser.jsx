import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { Alert } from '../../components/UI';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

const Field = ({ name, label, type = 'text', placeholder, rows, value, error, onChange }) => (
  <div>
    <label htmlFor={`field-${name}`} className="label">{label}</label>
    {rows ? (
      <textarea id={`field-${name}`} rows={rows} value={value} onChange={onChange}
        className="input-field resize-none" placeholder={placeholder} />
    ) : (
      <input id={`field-${name}`} type={type} value={value} onChange={onChange}
        className={`input-field ${error ? 'border-red-700' : ''}`} placeholder={placeholder} />
    )}
    {error && <p className="error-text">{error}</p>}
  </div>
);

const AddUser = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const validate = () => {
    const errs = {};
    if (form.name.length < 20 || form.name.length > 60) errs.name = 'Name must be 20–60 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address';
    if (!PASSWORD_REGEX.test(form.password)) errs.password = 'Password: 8-16 chars, 1 uppercase, 1 special char';
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
      await api.post('/admin/users', form);
      setSuccess('User created successfully!');
      setTimeout(() => navigate('/admin/users'), 1500);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const map = {};
        data.errors.forEach(e => { map[e.path] = e.msg; });
        setErrors(map);
      } else {
        setServerError(data?.message || 'Failed to create user');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-fade-in-up">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/users" className="btn-ghost text-sm">← Back</Link>
        <div>
          <h1 className="text-3xl font-display text-slate-100">Add New User</h1>
          <p className="text-slate-400 text-sm font-body mt-1">Create a new admin, user, or store owner account</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Alert type="error" message={serverError} />
          <Alert type="success" message={success} />

          <Field name="name" label="Full Name" placeholder="Full name (20–60 characters)"
            value={form.name} error={errors.name} onChange={handleChange('name')} />
          <Field name="email" label="Email Address" type="email" placeholder="user@example.com"
            value={form.email} error={errors.email} onChange={handleChange('email')} />
          <Field name="password" label="Password" type="password" placeholder="8-16 chars, uppercase + special char"
            value={form.password} error={errors.password} onChange={handleChange('password')} />
          <Field name="address" label="Address (optional)" placeholder="User's address" rows={3}
            value={form.address} error={errors.address} onChange={handleChange('address')} />

          <div>
            <label htmlFor="field-role" className="label">Role</label>
            <select id="field-role" value={form.role} onChange={handleChange('role')} className="input-field">
              <option value="user">Normal User</option>
              <option value="store_owner">Store Owner</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Creating...' : 'Create User'}
            </button>
            <Link to="/admin/users" className="btn-secondary text-center flex-1">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;

