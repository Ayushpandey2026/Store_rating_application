import { useState } from 'react';
import  {useAuth}  from '../context/AuthContext';
import api from '../utils/api';
import { Alert, RoleBadge } from '../components/UI';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.currentPassword) errs.currentPassword = 'Current password required';
    if (!PASSWORD_REGEX.test(form.password)) errs.password = 'Password: 8-16 chars, 1 uppercase, 1 special char';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setServerError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.put('/auth/update-password', {
        currentPassword: form.currentPassword,
        password: form.password
      });
      setSuccess('Password updated successfully!');
      setForm({ currentPassword: '', password: '', confirm: '' });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-fade-in-up">
      <h1 className="text-4xl font-display text-slate-100 mb-8">My Profile</h1>

      {/* User info */}
      <div className="card mb-8">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-2xl">
            👤
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-display text-slate-100">{user?.name}</h2>
              <RoleBadge role={user?.role} />
            </div>
            <p className="text-slate-400 text-sm font-body">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className="card">
        <h2 className="text-xl font-display text-slate-100 mb-6">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Alert type="error" message={serverError} />
          <Alert type="success" message={success} />

          <div>
            <label className="label">Current Password</label>
            <input type="password" value={form.currentPassword}
              onChange={e => setForm({ ...form, currentPassword: e.target.value })}
              className={`input-field ${errors.currentPassword ? 'border-red-700' : ''}`}
              placeholder="Your current password" />
            {errors.currentPassword && <p className="error-text">{errors.currentPassword}</p>}
          </div>

          <div>
            <label className="label">New Password</label>
            <input type="password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className={`input-field ${errors.password ? 'border-red-700' : ''}`}
              placeholder="8-16 chars, uppercase + special char" />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div>
            <label className="label">Confirm New Password</label>
            <input type="password" value={form.confirm}
              onChange={e => setForm({ ...form, confirm: e.target.value })}
              className={`input-field ${errors.confirm ? 'border-red-700' : ''}`}
              placeholder="Repeat new password" />
            {errors.confirm && <p className="error-text">{errors.confirm}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
