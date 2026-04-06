import { Users, Film, IndianRupee, Activity, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_USERS, NETFLIX_SHOWS, MOCK_PAYMENTS, SUBSCRIPTION_PLANS } from '../data/shows';

const revenueData = [
  { name: 'Jan', revenue: 4000, users: 2400 },
  { name: 'Feb', revenue: 3000, users: 1398 },
  { name: 'Mar', revenue: 5000, users: 3800 },
  { name: 'Apr', revenue: 7800, users: 4908 },
  { name: 'May', revenue: 4890, users: 3800 },
  { name: 'Jun', revenue: 10390, users: 6800 },
];

const totalRevenue = MOCK_PAYMENTS.reduce((sum, p) => sum + p.amount, 0);

const recentActivity = [
  { text: 'Arnav Saxena upgraded to Premium plan', time: '2 mins ago' },
  { text: 'New show added: Wednesday Season 2', time: '15 mins ago' },
  { text: 'Priya Sharma left a 5-star review on Squid Game', time: '1 hour ago' },
  { text: 'Payment received: ₹5999 from Vikram Singh', time: '3 hours ago' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Command Center</h1>
          <p className="text-[#a3aac4]">Overview of platform performance and metrics.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors">
            Export Report
          </button>
          <button className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-red-600/20 transition-all">
            Live Feed API
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="glass-panel p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-[#a3aac4]">Total Users</p>
              <h3 className="text-3xl font-bold text-white mt-1">{MOCK_USERS.length.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl"><Users className="w-5 h-5 text-primary" /></div>
          </div>
          <div className="flex items-center text-sm font-medium text-emerald-400">
            <TrendingUp className="w-4 h-4 mr-1" /><span>+12.5% this month</span>
          </div>
        </div>

        <div className="glass-panel p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-secondary/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-[#a3aac4]">Active Subscriptions</p>
              <h3 className="text-3xl font-bold text-white mt-1">{MOCK_PAYMENTS.length}</h3>
            </div>
            <div className="p-3 bg-secondary/10 rounded-xl"><Activity className="w-5 h-5 text-secondary" /></div>
          </div>
          <div className="flex items-center text-sm font-medium text-emerald-400">
            <TrendingUp className="w-4 h-4 mr-1" /><span>+8.2% this month</span>
          </div>
        </div>

        <div className="glass-panel p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-tertiary/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-[#a3aac4]">Total Shows</p>
              <h3 className="text-3xl font-bold text-white mt-1">{NETFLIX_SHOWS.length}</h3>
            </div>
            <div className="p-3 bg-tertiary/10 rounded-xl"><Film className="w-5 h-5 text-tertiary" /></div>
          </div>
          <div className="flex items-center text-sm font-medium text-[#a3aac4]">
            <span>+{NETFLIX_SHOWS.length} catalogued</span>
          </div>
        </div>

        <div className="glass-panel p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-[#a3aac4]">Total Revenue (INR)</p>
              <h3 className="text-3xl font-bold text-white mt-1">₹{totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl"><IndianRupee className="w-5 h-5 text-emerald-400" /></div>
          </div>
          <div className="flex items-center text-sm font-medium text-emerald-400">
            <TrendingUp className="w-4 h-4 mr-1" /><span>+18.4% YoY</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="glass-panel p-6 md:col-span-2 flex flex-col">
          <h2 className="text-lg font-bold text-white mb-6">Revenue Overview</h2>
          <div className="h-[300px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#333" tick={{fill: '#a3aac4', fontSize: 12}} />
                <YAxis stroke="#333" tick={{fill: '#a3aac4', fontSize: 12}} />
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <Tooltip contentStyle={{ backgroundColor: '#141414', borderColor: '#333', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                <Area type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-white">{item.text}</p>
                    <p className="text-xs text-primary mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="w-full mt-6 py-2 border-t border-white/5 text-sm text-[#a3aac4] hover:text-white transition-colors">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
}
