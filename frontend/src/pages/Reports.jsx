import { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, AlertTriangle } from 'lucide-react';
import { MOCK_PAYMENTS, MOCK_USERS, SUBSCRIPTION_PLANS } from '../data/shows';

const COLORS = ['#E50914', '#ff6b6b', '#ffa502', '#2ed573', '#1e90ff'];

export default function Reports() {
  const [fromDate, setFromDate] = useState('2025-01-01');
  const [toDate, setToDate] = useState('2025-12-31');

  const revenueByPlan = SUBSCRIPTION_PLANS.map(plan => {
    const planPayments = MOCK_PAYMENTS.filter(p => p.plan_id === plan.plan_id);
    return { name: plan.plan_name, revenue: planPayments.reduce((sum, p) => sum + p.amount, 0), count: planPayments.length };
  }).filter(p => p.count > 0);

  const planDistribution = SUBSCRIPTION_PLANS.map(plan => {
    const count = MOCK_PAYMENTS.filter(p => p.plan_id === plan.plan_id).length;
    return { name: plan.plan_name, value: count };
  }).filter(p => p.value > 0);

  const today = new Date();
  const expiryAlerts = MOCK_PAYMENTS.map(pay => {
    const plan = SUBSCRIPTION_PLANS.find(p => p.plan_id === pay.plan_id);
    const user = MOCK_USERS.find(u => u.user_id === pay.user_id);
    if (!plan || !user) return null;
    const payDate = new Date(pay.date);
    const expiry = new Date(payDate);
    expiry.setDate(expiry.getDate() + plan.duration);
    const daysLeft = Math.ceil((expiry - today) / (1000*60*60*24));
    if (daysLeft <= 7 && daysLeft >= -30) return { name: user.name, plan: plan.plan_name, expiry: expiry.toLocaleDateString(), daysLeft, expired: daysLeft < 0 };
    return null;
  }).filter(Boolean);

  const handleExport = () => {
    const csv = 'Plan,Revenue,Subscribers\n' + revenueByPlan.map(r => `${r.name},${r.revenue},${r.count}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'aperture_report.csv'; a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div><h1 className="text-2xl font-bold text-white mb-1">Reports & Analytics</h1><p className="text-[#a3aac4]">Revenue analysis, plan distribution, and subscription alerts.</p></div>
        <button onClick={handleExport} className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:shadow-lg hover:shadow-red-600/20 transition-all"><Download className="w-4 h-4 mr-2" />Export CSV</button>
      </div>

      <div className="glass-panel p-4 flex gap-4 items-center">
        <label className="text-gray-400 text-sm">From:</label>
        <input value={fromDate} onChange={e => setFromDate(e.target.value)} type="date" className="bg-[#222] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E50914]/50" />
        <label className="text-gray-400 text-sm">To:</label>
        <input value={toDate} onChange={e => setToDate(e.target.value)} type="date" className="bg-[#222] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E50914]/50" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h2 className="text-lg font-bold text-white mb-4">Revenue by Plan</h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByPlan}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#555" tick={{fill:'#a3aac4', fontSize:12}} />
                <YAxis stroke="#555" tick={{fill:'#a3aac4', fontSize:12}} />
                <Tooltip contentStyle={{ backgroundColor:'#1a1a1a', borderColor:'#333', borderRadius:'8px', color:'#fff' }} />
                <Bar dataKey="revenue" fill="#E50914" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h2 className="text-lg font-bold text-white mb-4">Plan Distribution</h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={planDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({name, value}) => `${name} (${value})`}>
                  {planDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor:'#1a1a1a', borderColor:'#333', borderRadius:'8px', color:'#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-400" />Subscription Expiry Alerts</h2>
        {expiryAlerts.length > 0 ? (
          <div className="space-y-3">
            {expiryAlerts.map((a, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${a.expired ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-amber-500/10 border border-amber-500/20'}`}>
                <div>
                  <span className="text-white font-medium">{a.name}</span>
                  <span className="text-gray-400 text-sm ml-3">{a.plan}</span>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${a.expired ? 'text-rose-400' : 'text-amber-400'}`}>{a.expired ? `Expired ${Math.abs(a.daysLeft)}d ago` : `${a.daysLeft}d left`}</span>
                  <span className="text-gray-500 text-xs ml-3">{a.expiry}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No subscriptions expiring within 7 days.</p>
        )}
      </div>
    </div>
  );
}
