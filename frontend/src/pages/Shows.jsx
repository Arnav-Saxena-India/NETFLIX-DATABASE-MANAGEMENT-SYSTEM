import { useState } from 'react';
import DataTable from '../components/DataTable';
import { Search, Plus, Edit2, Trash2, PlayCircle, Filter } from 'lucide-react';
import { NETFLIX_SHOWS as initialShows, GENRES } from '../data/shows';

export default function Shows() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [shows, setShows] = useState(initialShows);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ show_id: '', title: '', release_year: '', language: 'English', duration: '', genres: [], poster: '', description: '', match: '' });

  const openAdd = () => { setEditing(null); setForm({ show_id: `SHW${String(shows.length+1).padStart(3,'0')}`, title: '', release_year: '', language: 'English', duration: '', genres: [], poster: '', description: '', match: '85' }); setShowModal(true); };
  const openEdit = (s) => { setEditing(s); setForm({ ...s, release_year: String(s.release_year), duration: String(s.duration), match: String(s.match) }); setShowModal(true); };
  const handleDelete = (id) => setShows(shows.filter(s => s.show_id !== id));
  const handleSave = () => {
    const entry = { ...form, release_year: Number(form.release_year), duration: Number(form.duration), match: Number(form.match) };
    if (editing) setShows(shows.map(s => s.show_id === editing.show_id ? entry : s));
    else setShows([...shows, entry]);
    setShowModal(false);
  };

  const toggleGenre = (g) => {
    setForm(prev => ({ ...prev, genres: prev.genres.includes(g) ? prev.genres.filter(x => x !== g) : [...prev.genres, g] }));
  };

  const columns = [
    { header: 'ID', accessor: 'show_id', render: (r) => <span className="text-[#E50914] font-mono bg-[#E50914]/10 px-2 py-1 rounded text-xs">{r.show_id}</span> },
    { header: 'Title', accessor: 'title', render: (r) => <span className="flex items-center text-white font-bold"><PlayCircle className="w-4 h-4 mr-2 text-[#E50914]" />{r.title}</span> },
    { header: 'Year', accessor: 'release_year', render: (r) => <span className="text-gray-300">{r.release_year}</span> },
    { header: 'Language', accessor: 'language', render: (r) => <span className="text-gray-400">{r.language}</span> },
    { header: 'Runtime', accessor: 'duration', render: (r) => <span className="text-gray-300">{r.duration} min</span> },
    { header: 'Genres', accessor: 'genres', render: (r) => (
      <div className="flex gap-1 flex-wrap">
        {r.genres.map(g => <span key={g} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-xs text-white">{g}</span>)}
      </div>
    )},
    { header: 'Actions', render: (r) => (
      <div className="flex gap-2">
        <button onClick={() => openEdit(r)} className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-md transition"><Edit2 className="w-4 h-4" /></button>
        <button onClick={() => handleDelete(r.show_id)} className="text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 p-1.5 rounded-md transition"><Trash2 className="w-4 h-4" /></button>
      </div>
    )}
  ];

  const filteredData = shows.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div><h1 className="text-2xl font-bold text-white mb-1">Content Library</h1><p className="text-[#a3aac4]">Manage movies, series, metadata, and genres.</p></div>
        <button onClick={openAdd} className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:shadow-lg hover:shadow-red-600/20 transition-all"><Plus className="w-4 h-4 mr-2" />Add Show</button>
      </div>
      <div className="glass-panel p-4 flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search shows by title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#222] border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-red-600/50 text-white placeholder-gray-500 transition-colors" />
        </div>
      </div>
      <DataTable columns={columns} data={filteredData} total={filteredData.length} page={page} setPage={setPage} />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-lg border border-white/10 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">{editing ? 'Edit Show' : 'Add Show'}</h3>
            <div className="space-y-3">
              <input value={form.show_id} onChange={e => setForm({...form, show_id: e.target.value})} placeholder="Show ID" disabled={!!editing} className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm disabled:opacity-50 focus:outline-none focus:border-[#E50914]/50" />
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Title" className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#E50914]/50" />
              <div className="grid grid-cols-3 gap-3">
                <input value={form.release_year} onChange={e => setForm({...form, release_year: e.target.value})} placeholder="Year" type="number" className="bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#E50914]/50" />
                <input value={form.language} onChange={e => setForm({...form, language: e.target.value})} placeholder="Language" className="bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#E50914]/50" />
                <input value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="Duration" type="number" className="bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#E50914]/50" />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Genres</label>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map(g => (
                    <button key={g.genre_id} type="button" onClick={() => toggleGenre(g.genre_name)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition ${form.genres.includes(g.genre_name) ? 'bg-[#E50914]/20 border-[#E50914] text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}>
                      {g.genre_name}
                    </button>
                  ))}
                </div>
              </div>
              <input value={form.poster} onChange={e => setForm({...form, poster: e.target.value})} placeholder="Poster URL" className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#E50914]/50" />
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description..." rows={3} className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm resize-none focus:outline-none focus:border-[#E50914]/50" />
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
