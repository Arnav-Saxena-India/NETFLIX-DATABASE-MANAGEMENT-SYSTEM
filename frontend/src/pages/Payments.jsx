import { useState } from 'react';
import DataTable from '../components/DataTable';
import { Search, Plus, Trash2, DollarSign } from 'lucide-react';
import { MOCK_PAYMENTS as initialPayments, MOCK_USERS, SUBSCRIPTION_PLANS } from '../data/shows';

export default function Payments() {
  const [page, setPage] = useState(1);
  const [payments, setPayments] = useState(initialPayments);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ payment_id: '', user_id: '', plan_id: '', amount: '', mode: 'UPI', date: new Date().toISOString().split('T')[0] });

  const openAdd = () => { setForm({ payment_id: `PAY${String(payments.length+1).padStart(3,'0')}`, user_id: '', plan_id: '', amount: '', mode: 'UPI', date: new Date().toISOString().split('T')[0] }); setShowModal(true); };
  const handleDelete = (id) => setPayments(payments.filter(p => p.payment_id !== id));
  const handlePlanChange = (planId) => {
    const plan = SUBSCRIPTION_PLANS.find(p => p.plan_id === planId);
    setForm({ ...form, plan_id: planId, amount: plan ? String(plan.price) : '' });
  };
  const handleSave = () => {
    setPayments([...payments, { ...form, amount: Number(form.amount) }]);
    setShowModal(false);
  };

  const getUserName = (id) => MOCK_USERS.find(u => u.user_id === id)?.name || id;
  const getPlanName = (id) => SUBSCRIPTION_PLANS.find(p => p.plan_id === id)?.plan_name || id;

  const modeColors = { UPI: 'text-purple-400 bg-purple-400/10', Card: 'text-blue-400 bg-blue-400/10', NetBanking: 'text-cyan-400 bg-cyan-400/10', Wallet: 'text-amber-400 bg-amber-400/10' };

  const columns = [
    { header: 'ID', accessor: 'payment_id', render: (r) => <span className="font-mono text-[#E50914] bg-[#E50914]/10 px-2 py-1 rounded text-xs">{r.payment_id}</span> },
    { header: 'User', accessor: 'user_id', render: (r) => <span className="text-white font-medium">{getUserName(r.user_id)}</span> },
    { header: 'Plan', accessor: 'plan_id', render: (r) => <span className="text-gray-300">{getPlanName(r.plan_id)}</span> },
    { header: 'Amount', accessor: 'amount', render: (r) => <span className="text-emerald-400 font-bold flex items-center gap-1"><DollarSign className="w-3 h-3" />₹{r.amount}</span> },
    { header: 'Mode', accessor: 'mode', render: (r) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${modeColors[r.mode] || 'text-gray-400'}`}>{r.mode}</span> },
    { header: 'Date', accessor: 'date', render: (r) => <span className="text-gray-400">{new Date(r.date).toLocaleDateString()}</span> },
    { header: 'Actions', render: (r) => <button onClick={() => handleDelete(r.payment_id)} className="text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 p-1.5 rounded-md transition"><Trash2 className="w-4 h-4" /></button> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div><h1 className="text-2xl font-bold text-white mb-1">Payment Ledger</h1><p className="text-[#a3aac4]">Track all subscription payments and transactions.</p></div>
        <button onClick={openAdd} className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:shadow-lg hover:shadow-red-600/20 transition-all"><Plus className="w-4 h-4 mr-2" />Record Payment</button>
      </div>
      <DataTable columns={columns} data={payments} total={payments.length} page={page} setPage={setPage} />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md border border-white/10" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Record Payment</h3>
            <div className="space-y-3">
              <select value={form.user_id} onChange={e => setForm({...form, user_id: e.target.value})} className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E50914]/50">
                <option value="">Select User</option>
                {MOCK_USERS.map(u => <option key={u.user_id} value={u.user_id}>{u.name} ({u.user_id})</option>)}
              </select>
              <select value={form.plan_id} onChange={e => handlePlanChange(e.target.value)} className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E50914]/50">
                <option value="">Select Plan</option>
                {SUBSCRIPTION_PLANS.map(p => <option key={p.plan_id} value={p.plan_id}>{p.plan_name} — ₹{p.price}</option>)}
              </select>
              <select value={form.mode} onChange={e => setForm({...form, mode: e.target.value})} className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E50914]/50">
                {['UPI', 'Card', 'NetBanking', 'Wallet'].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <input value={form.date} onChange={e => setForm({...form, date: e.target.value})} type="date" className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E50914]/50" />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-[#E50914] hover:bg-[#b20710] text-white rounded-lg text-sm font-bold transition">Record</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
