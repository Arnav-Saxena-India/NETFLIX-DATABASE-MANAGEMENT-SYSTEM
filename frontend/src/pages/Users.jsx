import { useState } from 'react';
import DataTable from '../components/DataTable';
import { Search, Plus, Edit2, Trash2, Mail } from 'lucide-react';
import { MOCK_USERS as initialUsers } from '../data/shows';

export default function Users() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState(initialUsers);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ user_id: '', name: '', email: '', age: '', created_at: '' });

  const openAdd = () => { setEditing(null); setForm({ user_id: `USR${String(users.length+1).padStart(3,'0')}`, name: '', email: '', age: '', created_at: new Date().toISOString().split('T')[0] }); setShowModal(true); };
  const openEdit = (u) => { setEditing(u); setForm({ ...u, age: String(u.age) }); setShowModal(true); };
  const handleDelete = (id) => setUsers(users.filter(u => u.user_id !== id));
  const handleSave = () => {
    const entry = { ...form, age: Number(form.age) };
    if (editing) setUsers(users.map(u => u.user_id === editing.user_id ? entry : u));
    else setUsers([...users, entry]);
    setShowModal(false);
  };

  const columns = [
    { header: 'ID', accessor: 'user_id', render: (r) => <span className="text-[#E50914] font-mono bg-[#E50914]/10 px-2 py-1 rounded text-xs">{r.user_id}</span> },
    { header: 'Name', accessor: 'name', render: (r) => <span className="text-white font-medium">{r.name}</span> },
    { header: 'Email', accessor: 'email', render: (r) => <span className="flex items-center text-gray-400"><Mail className="w-3 h-3 mr-2" />{r.email}</span> },
    { header: 'Age', accessor: 'age', render: (r) => <span className="text-gray-300">{r.age}</span> },
    { header: 'Joined', accessor: 'created_at', render: (r) => <span className="text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span> },
    { header: 'Actions', render: (r) => (
      <div className="flex gap-2">
        <button onClick={() => openEdit(r)} className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-md transition"><Edit2 className="w-4 h-4" /></button>
        <button onClick={() => handleDelete(r.user_id)} className="text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 p-1.5 rounded-md transition"><Trash2 className="w-4 h-4" /></button>
      </div>
    )}
  ];

  const filteredData = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div><h1 className="text-2xl font-bold text-white mb-1">Subscriber Matrix</h1><p className="text-[#a3aac4]">Manage platform users, profiles, and associated data.</p></div>
        <button onClick={openAdd} className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:shadow-lg hover:shadow-red-600/20 transition-all"><Plus className="w-4 h-4 mr-2" />Onboard User</button>
      </div>
      <div className="glass-panel p-4 flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search users by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#222] border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-red-600/50 text-white placeholder-gray-500 transition-colors" />
        </div>
      </div>
      <DataTable columns={columns} data={filteredData} total={filteredData.length} page={page} setPage={setPage} />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md border border-white/10" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">{editing ? 'Edit User' : 'Add User'}</h3>
            <div className="space-y-3">
              <input value={form.user_id} onChange={e => setForm({...form, user_id: e.target.value})} placeholder="User ID" disabled={!!editing} className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm disabled:opacity-50 focus:outline-none focus:border-[#E50914]/50" />
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Full Name" className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#E50914]/50" />
              <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email Address" type="email" className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#E50914]/50" />
              <input value={form.age} onChange={e => setForm({...form, age: e.target.value})} placeholder="Age" type="number" className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#E50914]/50" />
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
