import { useState } from 'react';
import { Sparkles, Film } from 'lucide-react';
import { MOCK_USERS, MOCK_WATCH_HISTORY, NETFLIX_SHOWS } from '../data/shows';

export default function Recommendations() {
  const [selectedUser, setSelectedUser] = useState('');
  const [results, setResults] = useState([]);

  const generateRecommendations = (userId) => {
    if (!userId) { setResults([]); return; }
    const watchedShowIds = MOCK_WATCH_HISTORY.filter(h => h.user_id === userId).map(h => h.show_id);
    const genreCounts = {};
    watchedShowIds.forEach(sid => {
      const show = NETFLIX_SHOWS.find(s => s.show_id === sid);
      if (show) show.genres.forEach(g => { genreCounts[g] = (genreCounts[g] || 0) + 1; });
    });
    const unwatched = NETFLIX_SHOWS.filter(s => !watchedShowIds.includes(s.show_id));
    const scored = unwatched.map(s => {
      let score = 0;
      const totalGenreWeight = Object.values(genreCounts).reduce((a,b) => a+b, 0) || 1;
      s.genres.forEach(g => { if (genreCounts[g]) score += genreCounts[g]; });
      return { ...s, matchPercent: Math.min(99, Math.round((score / totalGenreWeight) * 100)) };
    }).sort((a,b) => b.matchPercent - a.matchPercent).slice(0, 5);
    setResults(scored);
  };

  const handleSelect = (userId) => {
    setSelectedUser(userId);
    generateRecommendations(userId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2"><Sparkles className="w-6 h-6 text-amber-400" />Smart Recommendations</h1>
        <p className="text-[#a3aac4]">Genre-based recommendation engine. Select a user to generate their top 5 picks.</p>
      </div>

      <div className="glass-panel p-4">
        <select value={selectedUser} onChange={e => handleSelect(e.target.value)} className="w-full max-w-md bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E50914]/50">
          <option value="">Select a user...</option>
          {MOCK_USERS.map(u => <option key={u.user_id} value={u.user_id}>{u.name} ({u.user_id})</option>)}
        </select>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {results.map((show, i) => (
            <div key={show.show_id} className="glass-panel p-0 overflow-hidden group cursor-pointer hover:scale-[1.03] transition-transform">
              <div className="h-48 relative overflow-hidden">
                <img src={show.poster} alt={show.title} className="w-full h-full object-cover" referrerPolicy="no-referrer"
                  onError={(e) => { e.target.style.display='none'; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent"></div>
                <div className="absolute top-3 left-3 bg-[#E50914] text-white text-xs font-bold px-2 py-1 rounded">#{i+1}</div>
                <div className="absolute top-3 right-3 bg-black/60 text-[#46d369] text-xs font-bold px-2 py-1 rounded">{show.matchPercent}% Match</div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-bold text-sm">{show.title}</h3>
                <p className="text-gray-400 text-xs mt-1">{show.genres.join(' · ')}</p>
                <p className="text-gray-500 text-xs mt-1">{show.release_year} · {show.language} · {show.duration}min</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedUser && results.length === 0 && (
        <div className="glass-panel p-12 text-center">
          <Film className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No recommendations available. This user hasn't watched enough content yet.</p>
        </div>
      )}
    </div>
  );
}
