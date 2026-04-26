import { useState } from 'react';

// ── Star Rating Component ──
export const StarRating = ({ value, onChange, readonly = false, size = 'md' }) => {
  const [hovered, setHovered] = useState(0);
  const sizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${sizes[size]} ${readonly ? 'cursor-default' : ''}`}
          style={{ color: star <= (hovered || value) ? '#f97316' : '#334155' }}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          onClick={() => !readonly && onChange?.(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

// ── Sort Header ──
export const SortHeader = ({ label, field, sortBy, sortOrder, onSort }) => (
  <th className={`table-header`} onClick={() => onSort(field)}>
    <span className="flex items-center gap-1">
      {label}
      <span className="text-slate-600">
        {sortBy === field ? (sortOrder === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
      </span>
    </span>
  </th>
);

// ── Badge ──
export const RoleBadge = ({ role }) => {
  const map = {
    admin: <span className="badge-admin">Admin</span>,
    user: <span className="badge-user">User</span>,
    store_owner: <span className="badge-owner">Store Owner</span>,
  };
  return map[role] || null;
};

// ── Loading Spinner ──
export const Spinner = ({ size = 'md' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${sizes[size]} border-2 border-slate-700 border-t-brand-500 rounded-full animate-spin`} />
  );
};

// ── Alert ──
export const Alert = ({ type = 'error', message }) => {
  if (!message) return null;
  const styles = {
    error: 'bg-red-900/30 border-red-700/50 text-red-300',
    success: 'bg-green-900/30 border-green-700/50 text-green-300',
    info: 'bg-blue-900/30 border-blue-700/50 text-blue-300',
  };
  return (
    <div className={`border rounded-lg p-3 text-sm font-body ${styles[type]}`}>
      {message}
    </div>
  );
};

// ── Modal ──
export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display text-slate-100">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-100 text-2xl leading-none transition-colors">×</button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ── Empty State ──
export const EmptyState = ({ icon = '📭', title, description }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-lg font-display text-slate-300 mb-2">{title}</h3>
    {description && <p className="text-sm text-slate-500 font-body max-w-sm">{description}</p>}
  </div>
);

// ── Search Input ──
export const SearchInput = ({ value, onChange, placeholder = 'Search...' }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="input-field pl-9"
    />
  </div>
);
