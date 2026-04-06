import { useState } from 'react';
import { Plus, Trash2, Edit2, Star } from 'lucide-react';
import { MOCK_REVIEWS as initial, MOCK_USERS, NETFLIX_SHOWS } from '../data/shows';

function StarDisplay({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
      ))}
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState(initial);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ review_id: '', user_id: '', show_id: '', rating: 5, comment: '' });

  const openAdd = () => { setEditing(null); setForm({ review_id: `REV${String(reviews.length+1).padStart(3,'0')}`, user_id: '', show_id: '', rating: 5, comment: '' }); setShowModal(true); };
  const openEdit = (r) => { setEditing(r); setForm({ ...r }); setShowModal(true); };
  const handleDelete = (id) => setReviews(reviews.filter(r => r.review_id !== id));
  const handleSave = () => {
    const entry = { ...form, rating: Number(form.rating) };
    if (editing) setReviews(reviews.map(r => r.review_id === editing.review_id ? entry : r));
    else setReviews([...reviews, entry]);
    setShowModal(false);
  };

  const getUserName = (id) => MOCK_USERS.find(u => u.user_id === id)?.name || id;
  const getShowTitle = (id) => NETFLIX_SHOWS.find(s => s.show_id === id)?.title || id;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div><h1 className="text-2xl font-bold text-white mb-1">User Reviews</h1><p className="text-[#a3aac4]">Manage ratings and comments for shows.</p></div>
        <button onClick={openAdd} className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:shadow-lg hover:shadow-red-600/20 transition-all"><Plus className="w-4 h-4 mr-2" />Add Review</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map(r => (
          <div key={r.review_id} className="glass-panel p-5 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-white font-bold">{getShowTitle(r.show_id)}</h3>
                <p className="text-gray-400 text-sm">by {getUserName(r.user_id)}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(r)} className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-md transition"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(r.review_id)} className="text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 p-1.5 rounded-md transition"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <StarDisplay rating={r.rating} />
            <p className="text-gray-300 text-sm leading-relaxed">"{r.comment}"</p>
            <span className="text-xs text-gray-500 font-mono">{r.review_id}</span>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md border border-white/10" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">{editing ? 'Edit Review' : 'Add Review'}</h3>
            <div className="space-y-3">
              <select value={form.user_id} onChange={e => setForm({...form, user_id: e.target.value})} disabled={!!editing} className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm disabled:opacity-50 focus:outline-none focus:border-[#E50914]/50">
                <option value="">Select User</option>
                {MOCK_USERS.map(u => <option key={u.user_id} value={u.user_id}>{u.name}</option>)}
              </select>
              <select value={form.show_id} onChange={e => setForm({...form, show_id: e.target.value})} disabled={!!editing} className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm disabled:opacity-50 focus:outline-none focus:border-[#E50914]/50">
                <option value="">Select Show</option>
                {NETFLIX_SHOWS.map(s => <option key={s.show_id} value={s.show_id}>{s.title}</option>)}
              </select>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Rating</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <button key={i} type="button" onClick={() => setForm({...form, rating: i})} className="p-1">
                      <Star className={`w-6 h-6 ${i <= form.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea value={form.comment} onChange={e => setForm({...form, comment: e.target.value})} placeholder="Write your review..." rows={3} className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm resize-none focus:outline-none focus:border-[#E50914]/50" />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-[#E50914] hover:bg-[#b20710] text-white rounded-lg text-sm font-bold transition">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
