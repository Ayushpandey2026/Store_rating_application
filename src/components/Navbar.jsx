import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { RoleBadge } from './UI';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardPath = {
    admin: '/admin',
    user: '/stores',
    store_owner: '/owner',
  }[user?.role] || '/';

  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={dashboardPath} className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span className="font-display text-xl text-slate-100 tracking-tight">RateStore</span>
          </Link>

          {/* Nav links */}
          {user && (
            <div className="flex items-center gap-2">
              {user.role === 'admin' && (
                <>
                  <Link to="/admin" className="btn-ghost text-sm">Dashboard</Link>
                  <Link to="/admin/users" className="btn-ghost text-sm">Users</Link>
                  <Link to="/admin/stores" className="btn-ghost text-sm">Stores</Link>
                </>
              )}
              {user.role === 'user' && (
                <>
                  <Link to="/stores" className="btn-ghost text-sm">Stores</Link>
                  <Link to="/profile" className="btn-ghost text-sm">Profile</Link>
                </>
              )}
              {user.role === 'store_owner' && (
                <>
                  <Link to="/owner" className="btn-ghost text-sm">Dashboard</Link>
                  <Link to="/profile" className="btn-ghost text-sm">Profile</Link>
                </>
              )}

              {/* User info */}
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-800">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-slate-200 font-body truncate max-w-32">{user.name}</div>
                  <RoleBadge role={user.role} />
                </div>
                <button onClick={handleLogout} className="btn-ghost text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20">
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
