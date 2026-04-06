import { useState } from 'react';
import { X, User, Shield, Bell, Monitor, Globe, CreditCard } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  const [activeSection, setActiveSection] = useState('profile');
  const [profile, setProfile] = useState({
    name: 'Arnav Saxena',
    email: 'arnav@aperture.io',
    phone: '+91 98765 43210',
    language: 'English',
    maturityRating: 'TV-MA',
    autoplay: true,
    dataUsage: 'Auto',
    notifications: true,
    emailUpdates: false,
  });

  if (!isOpen) return null;

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'playback', label: 'Playback', icon: Monitor },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'language', label: 'Language', icon: Globe },
  ];

  return (
    <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#141414] rounded-xl max-w-3xl w-full max-h-[85vh] overflow-hidden border border-white/10 shadow-2xl flex" onClick={e => e.stopPropagation()}>
        <div className="w-52 bg-[#0a0a0a] border-r border-white/5 py-4 flex-shrink-0">
          <div className="px-4 pb-4 border-b border-white/5 mb-2">
            <h2 className="text-lg font-bold text-white">Settings</h2>
          </div>
          {sections.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                  activeSection === s.id ? 'text-white bg-white/5 border-r-2 border-[#E50914]' : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <Icon className="w-4 h-4" /> {s.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h3 className="text-white font-bold capitalize">{activeSection} Settings</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition"><X className="w-5 h-5" /></button>
          </div>

          <div className="p-6 space-y-6">
            {activeSection === 'profile' && (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#E50914] to-[#b20710] flex items-center justify-center text-2xl font-black text-white">A</div>
                  <div>
                    <p className="text-white font-bold text-lg">{profile.name}</p>
                    <p className="text-gray-400 text-sm">{profile.email}</p>
                    <p className="text-gray-500 text-xs mt-1">Premium Member since Jan 2025</p>
                  </div>
                </div>
                <SettingField label="Full Name" value={profile.name} onChange={v => setProfile({...profile, name: v})} />
                <SettingField label="Email Address" value={profile.email} onChange={v => setProfile({...profile, email: v})} />
                <SettingField label="Phone Number" value={profile.phone} onChange={v => setProfile({...profile, phone: v})} />
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Change Password</label>
                  <input type="password" placeholder="Current Password" className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm mb-2 focus:outline-none focus:border-[#E50914]/50" />
                  <input type="password" placeholder="New Password" className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E50914]/50" />
                </div>
              </>
            )}

            {activeSection === 'playback' && (
              <>
                <SettingToggle label="Autoplay next episode" description="Automatically play the next episode in a series" checked={profile.autoplay} onChange={v => setProfile({...profile, autoplay: v})} />
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Data Usage Per Screen</label>
                  <div className="flex gap-3">
                    {['Auto', 'Low', 'Medium', 'High'].map(opt => (
                      <button key={opt} onClick={() => setProfile({...profile, dataUsage: opt})} className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${profile.dataUsage === opt ? 'bg-[#E50914]/20 border-[#E50914] text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Maturity Rating</label>
                  <select value={profile.maturityRating} onChange={e => setProfile({...profile, maturityRating: e.target.value})} className="bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E50914]/50">
                    {['TV-Y', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </>
            )}

            {activeSection === 'notifications' && (
              <>
                <SettingToggle label="Push Notifications" description="Receive alerts for new releases and recommendations" checked={profile.notifications} onChange={v => setProfile({...profile, notifications: v})} />
                <SettingToggle label="Email Updates" description="Get weekly digest of new content and offers" checked={profile.emailUpdates} onChange={v => setProfile({...profile, emailUpdates: v})} />
                <SettingToggle label="Social Notifications" description="Notify when friends rate or review shows" checked={true} onChange={() => {}} />
                <SettingToggle label="Subscription Reminders" description="Alert before subscription renewal" checked={true} onChange={() => {}} />
              </>
            )}

            {activeSection === 'subscription' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-[#E50914]/10 to-transparent border border-[#E50914]/30 rounded-xl p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#E50914] font-bold">Current Plan</span>
                      <h4 className="text-white font-bold text-xl mt-1">Premium</h4>
                      <p className="text-gray-400 text-sm mt-1">4K + HDR · 4 Screens · Downloads</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-black text-2xl">₹649</p>
                      <p className="text-gray-500 text-xs">/month</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between text-xs text-gray-400">
                    <span>Next billing: Apr 01, 2025</span>
                    <span>Payment: UPI</span>
                  </div>
                </div>
                <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition border border-white/10">Change Plan</button>
                <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-red-400 rounded-lg text-sm font-medium transition border border-white/10">Cancel Subscription</button>
              </div>
            )}

            {activeSection === 'privacy' && (
              <>
                <SettingToggle label="Viewing Activity" description="Allow Aperture to use your viewing activity for recommendations" checked={true} onChange={() => {}} />
                <SettingToggle label="Profile Visibility" description="Let other users see your profile and reviews" checked={false} onChange={() => {}} />
                <button className="text-[#E50914] text-sm font-medium hover:underline">Download My Data</button>
                <button className="text-red-400 text-sm font-medium hover:underline block mt-2">Delete Account</button>
              </>
            )}

            {activeSection === 'language' && (
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Display Language</label>
                <select value={profile.language} onChange={e => setProfile({...profile, language: e.target.value})} className="bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E50914]/50 w-full">
                  {['English', 'Hindi', 'Spanish', 'Korean', 'German', 'Japanese'].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <div className="mt-6">
                  <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Audio Language Preference</label>
                  <select className="bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E50914]/50 w-full">
                    {['Original', 'English', 'Hindi', 'Japanese'].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="mt-6">
                  <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Subtitle Language</label>
                  <select className="bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E50914]/50 w-full">
                    {['Off', 'English', 'Hindi', 'Spanish', 'Korean'].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-white/5">
              <button onClick={onClose} className="px-6 py-2.5 bg-[#E50914] hover:bg-[#b20710] text-white rounded-lg text-sm font-bold transition">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingField({ label, value, onChange }) {
  return (
    <div>
      <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E50914]/50" />
    </div>
  );
}

function SettingToggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        {description && <p className="text-gray-500 text-xs mt-0.5">{description}</p>}
      </div>
      <button onClick={() => onChange(!checked)} className={`w-11 h-6 rounded-full relative transition-colors ${checked ? 'bg-[#E50914]' : 'bg-gray-600'}`}>
        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`}></div>
      </button>
    </div>
  );
}
