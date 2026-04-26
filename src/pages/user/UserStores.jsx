import { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';
import { Spinner, Alert, StarRating, SortHeader, EmptyState, SearchInput, Modal } from '../../components/UI';

const StoreCard = ({ store, onRate }) => {
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(store.user_rating || 0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!rating) return;
    setSubmitting(true);
    setError('');
    try {
      await api.post(`/stores/${store.id}/rate`, { rating });
      onRate();
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="card-hover">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-display text-lg text-slate-100 mb-0.5">{store.name}</h3>
            <p className="text-slate-500 text-sm font-body">{store.address || 'Address not available'}</p>
          </div>
          <div className="text-right">
            {store.avg_rating ? (
              <div>
                <div className="text-amber-400 font-mono font-medium text-lg">★ {store.avg_rating}</div>
                <div className="text-slate-600 text-xs">{store.rating_count} review{store.rating_count !== '1' ? 's' : ''}</div>
              </div>
            ) : (
              <div className="text-slate-600 text-xs">No ratings</div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
          <div>
            <div className="text-xs text-slate-500 mb-1">Your rating</div>
            {store.user_rating ? (
              <StarRating value={store.user_rating} readonly size="sm" />
            ) : (
              <span className="text-slate-600 text-xs">Not rated yet</span>
            )}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary text-sm py-2"
          >
            {store.user_rating ? 'Modify Rating' : 'Rate Store'}
          </button>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`Rate "${store.name}"`}>
        <div className="space-y-4">
          <Alert type="error" message={error} />
          <div className="text-center py-4">
            <p className="text-slate-400 text-sm mb-4 font-body">Select your rating</p>
            <div className="flex justify-center">
              <StarRating value={rating} onChange={setRating} size="lg" />
            </div>
            {rating > 0 && (
              <p className="text-slate-400 text-sm mt-3 font-body">
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]} — {rating}/5
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={handleSubmit} disabled={!rating || submitting} className="btn-primary flex-1">
              {submitting ? 'Submitting...' : 'Submit Rating'}
            </button>
            <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sort, setSort] = useState({ sortBy: 'name', sortOrder: 'asc' });

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/stores', { params: { ...filters, ...sort } });
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
      <div className="mb-8">
        <h1 className="text-4xl font-display text-slate-100 mb-2">Discover Stores</h1>
        <p className="text-slate-400 font-body">Browse and rate stores on our platform</p>
      </div>

      <Alert type="error" message={error} />

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SearchInput value={filters.name} onChange={v => setFilters(f => ({ ...f, name: v }))} placeholder="Search by store name..." />
          <SearchInput value={filters.address} onChange={v => setFilters(f => ({ ...f, address: v }))} placeholder="Search by address..." />
        </div>

        {/* Sort controls */}
        <div className="flex gap-3 mt-4 pt-4 border-t border-slate-800">
          <span className="text-slate-500 text-sm self-center">Sort by:</span>
          {[['name', 'Name'], ['address', 'Address'], ['avg_rating', 'Rating']].map(([field, label]) => (
            <button
              key={field}
              onClick={() => handleSort(field)}
              className={`text-sm px-3 py-1.5 rounded-lg transition-colors font-body ${sort.sortBy === field ? 'bg-brand-500 text-white' : 'btn-ghost'}`}
            >
              {label} {sort.sortBy === field ? (sort.sortOrder === 'asc' ? '↑' : '↓') : ''}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : stores.length === 0 ? (
        <EmptyState icon="🏪" title="No stores found" description="Try adjusting your search filters" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map(store => (
            <StoreCard key={store.id} store={store} onRate={fetchStores} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserStores;
