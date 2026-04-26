import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { Alert } from '../../components/UI';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

const AddUser = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const Field = ({ name, label, type = 'text', placeholder, rows }) => (
    <div>
      <label className="label">{label}</label>
      {rows ? (
        <textarea rows={rows} value={form[name]} onChange={e => setForm({ ...form, [name]: e.target.value })}
          className="input-field resize-none" placeholder={placeholder} />
      ) : (
        <input type={type} value={form[name]} onChange={e => setForm({ ...form, [name]: e.target.value })}
          className={`input-field ${errors[name] ? 'border-red-700' : ''}`} placeholder={placeholder} />
      )}
      {errors[name] && <p className="error-text">{errors[name]}</p>}
    </div>
  );

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

          <Field name="name" label="Full Name" placeholder="Full name (20–60 characters)" />
          <Field name="email" label="Email Address" type="email" placeholder="user@example.com" />
          <Field name="password" label="Password" type="password" placeholder="8-16 chars, uppercase + special char" />
          <Field name="address" label="Address (optional)" placeholder="User's address" rows={3} />

          <div>
            <label className="label">Role</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="input-field">
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
