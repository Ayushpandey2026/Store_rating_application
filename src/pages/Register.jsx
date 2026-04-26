import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/UI';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

const Field = ({ name, label, type = 'text', placeholder, rows, value, error, onChange }) => (
  <div>
    <label className="label">{label}</label>
    {rows ? (
      <textarea
        rows={rows}
        value={value}
        onChange={onChange}
        className="input-field resize-none"
        placeholder={placeholder}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`input-field ${error ? 'border-red-700' : ''}`}
        placeholder={placeholder}
      />
    )}
    {error && <p className="error-text">{error}</p>}
  </div>
);

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (form.name.length < 20 || form.name.length > 60) errs.name = 'Name must be 20–60 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address';
    if (!PASSWORD_REGEX.test(form.password)) errs.password = 'Password: 8-16 chars, 1 uppercase, 1 special character';

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
      await register(form);
      navigate('/stores');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const map = {};
        data.errors.forEach(e => { map[e.path] = e.msg; });
        setErrors(map);
      } else {
        setServerError(data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">⭐</div>
          <h1 className="text-4xl font-display text-slate-100 mb-2">Create account</h1>
          <p className="text-slate-400 font-body text-sm">Join RateStore as a regular user</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Alert type="error" message={serverError} />

            <Field 
              name="name" 
              label="Full Name" 
              placeholder="Your full name (20–60 characters)"
              value={form.name}
              error={errors.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <Field 
              name="email" 
              label="Email address" 
              type="email" 
              placeholder="you@example.com"
              value={form.email}
              error={errors.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
            <Field 
              name="password" 
              label="Password" 
              type="password" 
              placeholder="8-16 chars, uppercase + special char"
              value={form.password}
              error={errors.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6 font-body">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

      

export default Register;
