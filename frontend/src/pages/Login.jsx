import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e, role) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    onLogin({ email, password, role });
  };

  return (
    <div className="min-h-screen bg-[#000] relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-15">
        <div className="grid grid-cols-8 gap-1 rotate-[-5deg] scale-110 -translate-y-20">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="h-40 rounded bg-gradient-to-b from-[#E50914]/20 to-[#1a1a1a]"></div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40"></div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-[#E50914] tracking-tighter">APERTURE</h1>
          <p className="text-gray-400 text-sm mt-2">OTT Application Management System</p>
        </div>

        <div className="bg-[#141414]/90 backdrop-blur-xl rounded-xl p-8 border border-white/5">
          <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-600/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914]/50 transition text-sm"
              />
            </div>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-3.5 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914]/50 transition text-sm"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={(e) => handleSubmit(e, 'user')}
              className="w-full bg-[#E50914] hover:bg-[#b20710] text-white font-bold py-3.5 rounded-lg transition text-sm"
            >
              Sign In as User
            </button>
            <button
              onClick={(e) => handleSubmit(e, 'admin')}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3.5 rounded-lg transition text-sm"
            >
              Sign In as Admin
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs">Demo credentials: <span className="text-gray-400">arnav@aperture.io / admin123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
