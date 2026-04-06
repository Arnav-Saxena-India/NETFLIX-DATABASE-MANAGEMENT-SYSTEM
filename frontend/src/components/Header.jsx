import { Bell, Search, User, LogOut, Settings, X, ChevronDown } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { NETFLIX_SHOWS } from '../data/shows';

const NOTIFICATIONS = [
  { id: 1, title: 'New Release: Wednesday S2', time: '2 hours ago', read: false },
  { id: 2, title: 'Your subscription renews in 3 days', time: '5 hours ago', read: false },
  { id: 3, title: 'Stranger Things added new episodes', time: '1 day ago', read: true },
  { id: 4, title: 'Breaking Bad: Anniversary Special', time: '2 days ago', read: true },
  { id: 5, title: 'Arcane Season 2 now streaming', time: '3 days ago', read: true },
];

export default function Header({ isAdmin, onLogout, activeTab, setActiveTab, onOpenSettings }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notiOpen, setNotiOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef(null);
  const notiRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    if (isAdmin) return;
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAdmin]);

  useEffect(() => {
    const handleClick = (e) => {
      if (notiRef.current && !notiRef.current.contains(e.target)) setNotiOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const searchResults = searchQuery.length > 1
    ? NETFLIX_SHOWS.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  if (!isAdmin) {
    return (
      <>
        <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 px-12 py-4 flex items-center justify-between ${scrolled ? 'bg-[#131313]' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
          <div className="flex items-center space-x-8">
            <h1 className="text-3xl font-black text-[#E50914] tracking-tighter">APERTURE</h1>
            <nav className="hidden md:flex space-x-4 text-sm font-medium text-gray-300">
              <button onClick={() => setActiveTab('home')} className={`transition ${activeTab === 'home' ? 'text-white font-bold' : 'hover:text-gray-400'}`}>Home</button>
              <button onClick={() => setActiveTab('tvshows')} className={`transition ${activeTab === 'tvshows' ? 'text-white font-bold' : 'hover:text-gray-400'}`}>TV Shows</button>
              <button onClick={() => setActiveTab('movies')} className={`transition ${activeTab === 'movies' ? 'text-white font-bold' : 'hover:text-gray-400'}`}>Movies</button>
              <button onClick={() => setActiveTab('mylist')} className={`transition ${activeTab === 'mylist' ? 'text-white font-bold' : 'hover:text-gray-400'}`}>My List</button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center bg-black/90 border border-white/30 rounded px-3 py-1.5">
                  <Search className="w-4 h-4 text-white mr-2" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Titles, genres..."
                    className="bg-transparent text-white text-sm w-48 outline-none placeholder-gray-500"
                  />
                  <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                    <X className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#141414] border border-white/10 rounded-lg overflow-hidden shadow-2xl">
                      {searchResults.map(s => (
                        <div key={s.show_id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer transition">
                          <img src={s.poster} alt="" className="w-8 h-12 object-cover rounded" onError={(e) => { e.target.style.display='none'; }} />
                          <div>
                            <p className="text-white text-sm font-medium">{s.title}</p>
                            <p className="text-gray-500 text-xs">{s.release_year} · {s.genres.join(', ')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => setSearchOpen(true)}>
                  <Search className="w-5 h-5 text-white cursor-pointer hover:text-gray-300 transition" />
                </button>
              )}
            </div>

            <div className="relative" ref={notiRef}>
              <button onClick={() => { setNotiOpen(!notiOpen); setProfileOpen(false); }} className="relative">
                <Bell className="w-5 h-5 text-white cursor-pointer hover:text-gray-300 transition" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E50914] rounded-full text-[10px] text-white font-bold flex items-center justify-center">{unreadCount}</span>
                )}
              </button>
              {notiOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-[#141414] border border-white/10 rounded-lg overflow-hidden shadow-2xl">
                  <div className="px-4 py-3 border-b border-white/5">
                    <h3 className="text-white font-bold text-sm">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {NOTIFICATIONS.map(n => (
                      <div key={n.id} className={`px-4 py-3 hover:bg-white/5 cursor-pointer transition border-b border-white/5 last:border-0 ${!n.read ? 'bg-white/[0.02]' : ''}`}>
                        <div className="flex items-start gap-2">
                          {!n.read && <div className="w-2 h-2 bg-[#E50914] rounded-full mt-1.5 flex-shrink-0"></div>}
                          <div>
                            <p className={`text-sm ${!n.read ? 'text-white font-medium' : 'text-gray-400'}`}>{n.title}</p>
                            <p className="text-gray-500 text-xs mt-1">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button onClick={() => { setProfileOpen(!profileOpen); setNotiOpen(false); }} className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-[#E50914] to-[#b20710] flex items-center justify-center text-white font-bold text-sm border border-white/20">A</div>
                <ChevronDown className={`w-4 h-4 text-white transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-[#141414] border border-white/10 rounded-lg overflow-hidden shadow-2xl">
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="text-white font-semibold text-sm">Arnav Saxena</p>
                    <p className="text-gray-500 text-xs">arnav@aperture.io</p>
                  </div>
                  <div className="py-1">
                    <button onClick={() => { setProfileOpen(false); onOpenSettings && onOpenSettings(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition">
                      <Settings className="w-4 h-4" /> Account Settings
                    </button>
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
      </>
    );
  }

  const path = location.pathname;
  let breadcrumb = 'Dashboard';
  if (path !== '/admin') {
    breadcrumb = path.split('/')[2];
    breadcrumb = breadcrumb ? breadcrumb.charAt(0).toUpperCase() + breadcrumb.slice(1) : 'Dashboard';
  }

  return (
    <header className="h-16 bg-[#141414] border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center text-sm text-[#a3aac4] font-medium">
        <span>APERTURE <span className="mx-2">/</span> {breadcrumb}</span>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a3aac4]" />
          <input
            type="text"
            placeholder="Global search..."
            className="bg-[#0a0a0a] border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-red-600/50 text-white placeholder-gray-500 transition-colors w-64"
          />
        </div>
        <div className="relative" ref={notiRef}>
          <button onClick={() => setNotiOpen(!notiOpen)} className="text-[#a3aac4] hover:text-white relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full text-[10px] text-white font-bold flex items-center justify-center">2</span>
          </button>
          {notiOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden shadow-2xl">
              <div className="px-4 py-3 border-b border-white/5"><h3 className="text-white font-bold text-sm">Admin Alerts</h3></div>
              {[
                { title: '3 subscriptions expiring today', time: 'Just now' },
                { title: 'New user registration: Rohan Das', time: '10 min ago' },
                { title: 'Payment received: ₹649 Premium', time: '1 hour ago' },
                { title: 'Review flagged for moderation', time: '3 hours ago' },
              ].map((n, i) => (
                <div key={i} className="px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0">
                  <p className="text-white text-sm">{n.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{n.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </header>
  );
}
