import { useState } from 'react';
import DataTable from '../components/DataTable';
import { Search, Plus, Edit2, Trash2, CreditCard } from 'lucide-react';
import { SUBSCRIPTION_PLANS as initialPlans } from '../data/shows';

export default function Subscriptions() {
  const [page, setPage] = useState(1);
  const [plans, setPlans] = useState(initialPlans);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ plan_id: '', plan_name: '', price: '', duration: '' });

  const openAdd = () => { setEditing(null); setForm({ plan_id: `PLAN${String(plans.length+1).padStart(3,'0')}`, plan_name: '', price: '', duration: '30' }); setShowModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({ ...p, price: String(p.price), duration: String(p.duration) }); setShowModal(true); };
  const handleDelete = (id) => setPlans(plans.filter(p => p.plan_id !== id));
  const handleSave = () => {
    const entry = { ...form, price: Number(form.price), duration: Number(form.duration) };
    if (editing) setPlans(plans.map(p => p.plan_id === editing.plan_id ? entry : p));
    else setPlans([...plans, entry]);
    setShowModal(false);
  };

  const columns = [
    { header: 'Plan ID', accessor: 'plan_id', render: (r) => <span className="font-mono text-[#E50914] bg-[#E50914]/10 px-2 py-1 rounded text-xs">{r.plan_id}</span> },
    { header: 'Plan Name', accessor: 'plan_name', render: (r) => <span className="text-white font-semibold flex items-center gap-2"><CreditCard className="w-4 h-4 text-[#E50914]" />{r.plan_name}</span> },
    { header: 'Price (₹)', accessor: 'price', render: (r) => <span className="text-emerald-400 font-bold">₹{r.price}</span> },
    { header: 'Duration', accessor: 'duration', render: (r) => <span className="text-gray-300">{r.duration} days</span> },
    { header: 'Actions', render: (r) => (
      <div className="flex gap-2">
        <button onClick={() => openEdit(r)} className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-md transition"><Edit2 className="w-4 h-4" /></button>
        <button onClick={() => handleDelete(r.plan_id)} className="text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 p-1.5 rounded-md transition"><Trash2 className="w-4 h-4" /></button>
      </div>
    )}
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div><h1 className="text-2xl font-bold text-white mb-1">Subscription Plans</h1><p className="text-[#a3aac4]">Manage subscription tiers, pricing, and durations.</p></div>
        <button onClick={openAdd} className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:shadow-lg hover:shadow-red-600/20 transition-all"><Plus className="w-4 h-4 mr-2" />Add Plan</button>
      </div>
      <DataTable columns={columns} data={plans} total={plans.length} page={page} setPage={setPage} />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md border border-white/10" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">{editing ? 'Edit Plan' : 'Add Plan'}</h3>
            <div className="space-y-3">
              <input value={form.plan_id} onChange={e => setForm({...form, plan_id: e.target.value})} placeholder="Plan ID" disabled={!!editing} className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm disabled:opacity-50 focus:outline-none focus:border-[#E50914]/50" />
              <input value={form.plan_name} onChange={e => setForm({...form, plan_name: e.target.value})} placeholder="Plan Name" className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#E50914]/50" />
              <input value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="Price (₹)" type="number" className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#E50914]/50" />
              <input value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="Duration (days)" type="number" className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#E50914]/50" />
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
