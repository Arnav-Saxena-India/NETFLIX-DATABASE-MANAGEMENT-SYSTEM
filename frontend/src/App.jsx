import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Shows from './pages/Shows';
import Subscriptions from './pages/Subscriptions';
import Payments from './pages/Payments';
import WatchHistory from './pages/WatchHistory';
import Reviews from './pages/Reviews';
import Reports from './pages/Reports';
import Recommendations from './pages/Recommendations';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Splash from './components/Splash';
import Browse from './pages/Browse';
import Login from './pages/Login';
import SettingsModal from './components/SettingsModal';

function AdminLayout({ children, onLogout }) {
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden text-sm">
      <Sidebar onLogout={onLogout} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header isAdmin={true} onLogout={onLogout} />
        <main className="flex-1 overflow-auto p-6 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

function BrowseLayout({ children, onLogout, activeTab, setActiveTab, onOpenSettings }) {
  return (
    <div className="flex h-screen bg-[#131313] text-white flex-col overflow-hidden text-sm relative">
      <Header isAdmin={false} onLogout={onLogout} activeTab={activeTab} setActiveTab={setActiveTab} onOpenSettings={onOpenSettings} />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#131313]">
        {children}
      </main>
    </div>
  );
}

function App() {
  const [auth, setAuth] = useState(null);
  const [showSplash, setShowSplash] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogin = ({ email, password, role }) => {
    if (role === 'user') {
      setShowSplash(true);
      setTimeout(() => {
        setAuth({ email, role: 'user', name: 'Arnav Saxena' });
        setShowSplash(false);
      }, 3200);
    } else {
      setAuth({ email, role: 'admin', name: 'Admin' });
    }
  };

  const handleLogout = () => {
    setAuth(null);
    setActiveTab('home');
  };

  if (!auth && !showSplash) {
    return <Login onLogin={handleLogin} />;
  }

  if (showSplash) {
    return <Splash onComplete={() => {}} />;
  }

  if (auth.role === 'admin') {
    return (
      <Router>
        <Toaster position="top-right" toastOptions={{ style: { background: '#141414', color: '#fff', border: '1px solid #333' } }} />
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={<AdminLayout onLogout={handleLogout}><Dashboard /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout onLogout={handleLogout}><Users /></AdminLayout>} />
          <Route path="/admin/shows" element={<AdminLayout onLogout={handleLogout}><Shows /></AdminLayout>} />
          <Route path="/admin/subscriptions" element={<AdminLayout onLogout={handleLogout}><Subscriptions /></AdminLayout>} />
          <Route path="/admin/payments" element={<AdminLayout onLogout={handleLogout}><Payments /></AdminLayout>} />
          <Route path="/admin/history" element={<AdminLayout onLogout={handleLogout}><WatchHistory /></AdminLayout>} />
          <Route path="/admin/reviews" element={<AdminLayout onLogout={handleLogout}><Reviews /></AdminLayout>} />
          <Route path="/admin/reports" element={<AdminLayout onLogout={handleLogout}><Reports /></AdminLayout>} />
          <Route path="/admin/recommend" element={<AdminLayout onLogout={handleLogout}><Recommendations /></AdminLayout>} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ style: { background: '#141414', color: '#fff', border: '1px solid #333' } }} />
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <Routes>
        <Route path="/" element={
          <BrowseLayout onLogout={handleLogout} activeTab={activeTab} setActiveTab={setActiveTab} onOpenSettings={() => setSettingsOpen(true)}>
            <Browse activeTab={activeTab} />
          </BrowseLayout>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
