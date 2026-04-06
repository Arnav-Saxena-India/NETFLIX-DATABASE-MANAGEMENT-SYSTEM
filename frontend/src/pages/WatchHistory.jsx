import { useState } from 'react';
import DataTable from '../components/DataTable';
import { Plus, Trash2, Monitor, Smartphone, Tv, Tablet } from 'lucide-react';
import { MOCK_WATCH_HISTORY as initial, MOCK_USERS, NETFLIX_SHOWS } from '../data/shows';

const deviceIcons = { Mobile: Smartphone, Laptop: Monitor, TV: Tv, Tablet: Tablet };

export default function WatchHistory() {
  const [page, setPage] = useState(1);
  const [history, setHistory] = useState(initial);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ history_id: '', user_id: '', show_id: '', last_access_time: '', completion_percent: '', season: '', episode: '', duration_watched: '', device: 'Mobile' });

  const openAdd = () => { setForm({ history_id: `WH${String(history.length+1).padStart(3,'0')}`, user_id: '', show_id: '', last_access_time: '20:00', completion_percent: '0', season: '1', episode: '1', duration_watched: '0', device: 'Mobile' }); setShowModal(true); };
  const handleDelete = (id) => setHistory(history.filter(h => h.history_id !== id));
  const handleSave = () => {
    setHistory([...history, { ...form, completion_percent: Number(form.completion_percent), season: Number(form.season), episode: Number(form.episode), duration_watched: Number(form.duration_watched) }]);
    setShowModal(false);
  };

  const getUserName = (id) => MOCK_USERS.find(u => u.user_id === id)?.name || id;
  const getShowTitle = (id) => NETFLIX_SHOWS.find(s => s.show_id === id)?.title || id;

  const columns = [
    { header: 'ID', accessor: 'history_id', render: (r) => <span className="font-mono text-[#E50914] bg-[#E50914]/10 px-2 py-1 rounded text-xs">{r.history_id}</span> },
    { header: 'User', accessor: 'user_id', render: (r) => <span className="text-white font-medium">{getUserName(r.user_id)}</span> },
    { header: 'Show', accessor: 'show_id', render: (r) => <span className="text-gray-300">{getShowTitle(r.show_id)}</span> },
    { header: 'Progress', accessor: 'completion_percent', render: (r) => (
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-[#E50914] rounded-full" style={{width: `${r.completion_percent}%`}}></div></div>
        <span className="text-gray-400 text-xs">{r.completion_percent}%</span>
      </div>
    )},
    { header: 'S/E', render: (r) => <span className="text-gray-400">S{r.season}:E{r.episode}</span> },
    { header: 'Watched', accessor: 'duration_watched', render: (r) => <span className="text-gray-300">{r.duration_watched} min</span> },
    { header: 'Device', accessor: 'device', render: (r) => { const Icon = deviceIcons[r.device] || Monitor; return <span className="flex items-center gap-1.5 text-gray-400"><Icon className="w-4 h-4" />{r.device}</span>; }},
    { header: '', render: (r) => <button onClick={() => handleDelete(r.history_id)} className="text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 p-1.5 rounded-md transition"><Trash2 className="w-4 h-4" /></button> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div><h1 className="text-2xl font-bold text-white mb-1">Watch History</h1><p className="text-[#a3aac4]">Track user viewing sessions, devices, and completion rates.</p></div>
        <button onClick={openAdd} className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:shadow-lg hover:shadow-red-600/20 transition-all"><Plus className="w-4 h-4 mr-2" />Add Record</button>
      </div>
      <DataTable columns={columns} data={history} total={history.length} page={page} setPage={setPage} />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md border border-white/10" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Add Watch Record</h3>
            <div className="space-y-3">
              <select value={form.user_id} onChange={e => setForm({...form, user_id: e.target.value})} className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E50914]/50">
                <option value="">Select User</option>
                {MOCK_USERS.map(u => <option key={u.user_id} value={u.user_id}>{u.name}</option>)}
              </select>
              <select value={form.show_id} onChange={e => setForm({...form, show_id: e.target.value})} className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E50914]/50">
                <option value="">Select Show</option>
                {NETFLIX_SHOWS.map(s => <option key={s.show_id} value={s.show_id}>{s.title}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input value={form.season} onChange={e => setForm({...form, season: e.target.value})} placeholder="Season" type="number" className="bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E50914]/50" />
                <input value={form.episode} onChange={e => setForm({...form, episode: e.target.value})} placeholder="Episode" type="number" className="bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E50914]/50" />
              </div>
              <input value={form.duration_watched} onChange={e => setForm({...form, duration_watched: e.target.value})} placeholder="Duration Watched (min)" type="number" className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E50914]/50" />
              <input value={form.completion_percent} onChange={e => setForm({...form, completion_percent: e.target.value})} placeholder="Completion %" type="number" min="0" max="100" className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E50914]/50" />
              <select value={form.device} onChange={e => setForm({...form, device: e.target.value})} className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E50914]/50">
                {['Mobile', 'Laptop', 'TV', 'Tablet'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
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
