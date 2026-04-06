import { useState, useEffect } from 'react';
import { NETFLIX_SHOWS, SUBSCRIPTION_PLANS, MOCK_USERS, MOCK_WATCH_HISTORY } from '../data/shows';
import { Play, Info, ChevronRight, ChevronLeft, Receipt, X, Download, Plus, Check, Volume2, VolumeX, Star } from 'lucide-react';

const CURRENT_USER_ID = 'USR001';

function getUserProgress(showId) {
  const record = MOCK_WATCH_HISTORY.find(h => h.user_id === CURRENT_USER_ID && h.show_id === showId);
  return record ? record.completion_percent : 0;
}

function generateInvoice(user, plan) {
  const basePrice = plan.price;
  const gstRate = 0.18;
  const loyaltyDiscountRate = plan.duration >= 365 ? 0.15 : 0;
  const discount = Math.round(basePrice * loyaltyDiscountRate * 100) / 100;
  const taxableAmount = basePrice - discount;
  const gst = Math.round(taxableAmount * gstRate * 100) / 100;
  const grandTotal = Math.round((taxableAmount + gst) * 100) / 100;
  const paymentDate = new Date();
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + plan.duration);
  return {
    invoiceNo: `INV-${Date.now().toString(36).toUpperCase()}`,
    user, plan, basePrice, discount, taxableAmount, gst, grandTotal,
    paymentDate: paymentDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    expiryDate: expiryDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    loyaltyApplied: plan.duration >= 365,
  };
}

function InvoiceModal({ invoice, onClose }) {
  if (!invoice) return null;
  return (
    <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#1a1a1a] rounded-xl max-w-lg w-full p-0 overflow-hidden border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-[#E50914] to-[#b20710] p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">APERTURE</h2>
            <p className="text-white/70 text-xs mt-1">Subscription Invoice</p>
          </div>
          <div className="text-right">
            <p className="text-white font-mono text-sm">{invoice.invoiceNo}</p>
            <p className="text-white/70 text-xs mt-1">{invoice.paymentDate}</p>
          </div>
        </div>
        <div className="px-6 pt-5 pb-4 border-b border-white/5">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Bill To</p>
          <p className="text-white font-semibold">{invoice.user.name}</p>
          <p className="text-gray-400 text-sm">{invoice.user.email}</p>
        </div>
        <div className="px-6 py-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Plan: {invoice.plan.plan_name}</span>
            <span className="text-white font-medium">₹{invoice.basePrice.toFixed(2)}</span>
          </div>
          {invoice.loyaltyApplied && (
            <div className="flex justify-between text-sm">
              <span className="text-emerald-400">Loyalty Discount (15%)</span>
              <span className="text-emerald-400 font-medium">- ₹{invoice.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-white font-medium">₹{invoice.taxableAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">GST @ 18%</span>
            <span className="text-white font-medium">₹{invoice.gst.toFixed(2)}</span>
          </div>
          <div className="h-px bg-white/10 my-2"></div>
          <div className="flex justify-between text-lg font-bold">
            <span className="text-white">Grand Total</span>
            <span className="text-[#E50914]">₹{invoice.grandTotal.toFixed(2)}</span>
          </div>
        </div>
        <div className="mx-6 mb-4 bg-white/5 rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-500">Valid From</p>
            <p className="text-white font-semibold text-sm">{invoice.paymentDate}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500" />
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-gray-500">Valid Until</p>
            <p className="text-white font-semibold text-sm">{invoice.expiryDate}</p>
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition">Close</button>
          <button className="flex-1 py-3 bg-[#E50914] hover:bg-[#b20710] text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

function PlayOverlay({ show, onClose }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setElapsed(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);
  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  return (
    <div className="fixed inset-0 z-[90] bg-black flex flex-col">
      <div className="absolute inset-0">
        <img src={show.poster} alt="" className="w-full h-full object-cover opacity-20 blur-md scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40"></div>
      </div>
      <div className="relative z-10 flex items-center justify-between px-8 py-4">
        <button onClick={onClose} className="text-white hover:text-gray-300 transition">
          <X className="w-8 h-8" />
        </button>
        <span className="text-white/60 text-sm font-medium">Now Playing</span>
        <div></div>
      </div>
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <div className="w-48 h-72 rounded-lg overflow-hidden shadow-2xl shadow-red-900/30 mb-8 border border-white/10">
          <img src={show.poster} alt={show.title} className="w-full h-full object-cover" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2">{show.title}</h2>
        <p className="text-gray-400 text-sm mb-6">{show.genres.join(' · ')} | {show.release_year} | {show.language}</p>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-mono text-white font-bold">{formatTime(elapsed)}</div>
            <div className="text-gray-500 text-xs mt-1">Elapsed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-mono text-gray-500 font-bold">{show.duration}:00</div>
            <div className="text-gray-500 text-xs mt-1">Total</div>
          </div>
        </div>
      </div>
      <div className="relative z-10 px-8 pb-8">
        <div className="w-full bg-white/10 rounded-full h-1.5 mb-4">
          <div className="bg-[#E50914] h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min((elapsed / (show.duration * 60)) * 100, 100)}%` }}></div>
        </div>
        <div className="flex justify-between text-gray-500 text-xs">
          <span>{formatTime(elapsed)}</span>
          <span>{show.duration}:00</span>
        </div>
      </div>
    </div>
  );
}

function ShowDetailModal({ show, onClose, onPlay }) {
  if (!show) return null;
  const progress = getUserProgress(show.show_id);
  const watchRecord = MOCK_WATCH_HISTORY.find(h => h.user_id === CURRENT_USER_ID && h.show_id === show.show_id);
  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#181818] rounded-xl max-w-2xl w-full overflow-hidden border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="relative h-80">
          <img src={show.poster} alt={show.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-black/30"></div>
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 bg-[#181818] rounded-full flex items-center justify-center hover:bg-white/20 transition">
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-3xl font-black text-white mb-3">{show.title}</h2>
            <div className="flex gap-3">
              <button onClick={() => onPlay(show)} className="bg-white text-black px-6 py-2.5 rounded flex items-center font-bold text-sm hover:bg-gray-300 transition">
                <Play className="w-4 h-4 mr-2 fill-black" /> {progress > 0 ? 'Resume' : 'Play'}
              </button>
              <button className="w-10 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition">
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4 text-sm">
            <span className="text-[#46d369] font-bold">{show.match}% Match</span>
            <span className="text-gray-400">{show.release_year}</span>
            <span className="border border-gray-500 px-1.5 py-0.5 text-[11px] text-gray-400 rounded">TV-MA</span>
            <span className="text-gray-400">{show.duration} min/ep</span>
          </div>
          {progress > 0 && (
            <div className="mb-4 bg-white/5 rounded-lg p-3">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-400">Your Progress</span>
                <span className="text-white font-medium">{progress}% Complete {watchRecord && `· S${watchRecord.season}:E${watchRecord.episode}`}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div className="bg-[#E50914] h-full rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}
          <p className="text-gray-300 text-sm leading-relaxed mb-4">{show.description}</p>
          <div className="flex flex-wrap gap-2">
            {show.genres.map(g => (
              <span key={g} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">{g}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SubscriptionSection() {
  const [invoice, setInvoice] = useState(null);
  const currentUser = MOCK_USERS[0];
  const handleGenerateBill = (plan) => {
    const inv = generateInvoice(currentUser, plan);
    setInvoice(inv);
  };
  return (
    <>
      <InvoiceModal invoice={invoice} onClose={() => setInvoice(null)} />
      <div className="mb-10 px-12">
        <h2 className="text-2xl font-bold text-[#e5e5e5] mb-2">Choose Your Plan</h2>
        <p className="text-gray-400 text-sm mb-6">Subscription Bill Generation with Tax and Loyalty Discount Computation</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div key={plan.plan_id} className={`rounded-xl p-5 flex flex-col justify-between border transition-all cursor-pointer group hover:scale-[1.03] ${
              plan.plan_name === 'Premium'
                ? 'bg-gradient-to-b from-[#E50914]/20 to-[#1a1a1a] border-[#E50914]/50 ring-1 ring-[#E50914]/30'
                : 'bg-[#1a1a1a] border-white/10 hover:border-white/20'
            }`}>
              {plan.plan_name === 'Premium' && (
                <span className="text-[10px] uppercase tracking-widest text-[#E50914] font-bold mb-2">Most Popular</span>
              )}
              <div>
                <h3 className="text-white font-bold text-lg">{plan.plan_name}</h3>
                <p className="text-gray-400 text-xs mt-1">{plan.duration} days</p>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-white">₹{plan.price}</span>
                <span className="text-gray-500 text-sm">/{plan.duration >= 365 ? 'yr' : 'mo'}</span>
              </div>
              {plan.duration >= 365 && (
                <span className="mt-2 text-emerald-400 text-xs font-medium">15% Loyalty Discount Applied</span>
              )}
              <button
                onClick={() => handleGenerateBill(plan)}
                className="mt-4 w-full py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 bg-white/10 hover:bg-[#E50914] text-white"
              >
                <Receipt className="w-4 h-4" /> Generate Bill
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ShowCard({ show, onShowDetail, onPlay }) {
  const progress = getUserProgress(show.show_id);
  const [imgError, setImgError] = useState(false);
  return (
    <div
      className="flex-none w-44 relative rounded-md overflow-hidden bg-[#1a1a1a] cursor-pointer transform transition duration-300 hover:scale-110 hover:z-20 hover:shadow-xl hover:shadow-black/50"
      onClick={() => onShowDetail(show)}
    >
      <div className="h-64 relative">
        {!imgError ? (
          <img
            src={show.poster}
            alt={show.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-gradient-to-b from-[#E50914]/30 to-[#1a1a1a]">
            <span className="font-bold text-white text-base leading-tight">{show.title}</span>
            <span className="text-gray-400 text-xs mt-2">{show.release_year}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 z-10">
          <div className="flex gap-2 mb-2">
            <button
              onClick={(e) => { e.stopPropagation(); onPlay(show); }}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition"
            >
              <Play className="w-4 h-4 fill-black text-black" />
            </button>
            <button onClick={(e) => e.stopPropagation()} className="w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center hover:border-white transition">
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>
          <h3 className="font-bold text-sm text-white leading-tight">{show.title}</h3>
          <div className="flex items-center space-x-2 text-[11px] font-semibold mt-1">
            <span className="text-[#46d369]">{show.match}% Match</span>
            <span className="text-gray-400">{show.release_year}</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">{show.genres.join(' · ')}</p>
        </div>
      </div>
      {progress > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 z-20">
          <div className="h-full bg-[#E50914]" style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
  );
}

function Row({ title, shows, onShowDetail, onPlay }) {
  return (
    <div className="mb-8 px-12">
      <h2 className="text-xl font-bold text-[#e5e5e5] mb-4">{title}</h2>
      <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
        {shows.map((show) => (
          <ShowCard key={show.show_id} show={show} onShowDetail={onShowDetail} onPlay={onPlay} />
        ))}
      </div>
    </div>
  );
}

export default function Browse({ activeTab }) {
  const [detailShow, setDetailShow] = useState(null);
  const [playingShow, setPlayingShow] = useState(null);
  const heroShow = NETFLIX_SHOWS[2];

  const watchedShowIds = MOCK_WATCH_HISTORY.filter(h => h.user_id === CURRENT_USER_ID).map(h => h.show_id);
  const myList = NETFLIX_SHOWS.filter(s => watchedShowIds.includes(s.show_id));

  const getFilteredShows = () => {
    if (activeTab === 'tvshows') return NETFLIX_SHOWS.filter(s => s.duration <= 60);
    if (activeTab === 'movies') return NETFLIX_SHOWS.filter(s => s.duration > 50 || s.genres.includes('Action'));
    if (activeTab === 'mylist') return myList;
    return NETFLIX_SHOWS;
  };

  const filtered = getFilteredShows();

  if (playingShow) {
    return <PlayOverlay show={playingShow} onClose={() => setPlayingShow(null)} />;
  }

  const continueWatching = NETFLIX_SHOWS.filter(
    s => MOCK_WATCH_HISTORY.some(h => h.user_id === CURRENT_USER_ID && h.show_id === s.show_id && h.completion_percent < 100)
  );

  return (
    <div className="relative w-full pb-16">
      <ShowDetailModal show={detailShow} onClose={() => setDetailShow(null)} onPlay={setPlayingShow} />

      {activeTab !== 'mylist' && (
        <div className="relative h-[90vh] w-full" style={{ marginTop: '-64px' }}>
          <div className="absolute inset-0 bg-[#131313]">
            <img src={heroShow.poster} alt="" className="w-full h-full object-cover opacity-40 scale-110 blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/70 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-[#131313]/60"></div>
          </div>
          <div className="absolute right-[10%] top-[25%] w-64 h-96 rounded-lg overflow-hidden shadow-2xl shadow-black/80 hidden lg:block transform rotate-2 border border-white/10">
            <img src={heroShow.poster} alt={heroShow.title} className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-[18%] left-12 max-w-xl z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[#E50914] font-black text-sm tracking-widest">A P E R T U R E</span>
              <span className="text-gray-400 text-sm">ORIGINAL</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight leading-none">
              {heroShow.title}
            </h1>
            <div className="flex items-center gap-3 mb-4 text-sm font-medium">
              <span className="text-[#46d369] font-bold">{heroShow.match}% Match</span>
              <span className="text-gray-400">{heroShow.release_year}</span>
              <span className="border border-gray-500 px-1.5 py-0.5 text-[11px] text-gray-400 rounded">TV-MA</span>
              <span className="text-gray-400">{heroShow.duration} min/ep</span>
            </div>
            <p className="text-base text-gray-200 mb-6 leading-relaxed max-w-md">{heroShow.description}</p>
            <div className="flex gap-3">
              <button onClick={() => setPlayingShow(heroShow)} className="bg-white text-black px-8 py-3 rounded flex items-center font-bold text-base hover:bg-gray-300 transition">
                <Play className="w-5 h-5 mr-2 fill-black" /> Play
              </button>
              <button onClick={() => setDetailShow(heroShow)} className="bg-gray-500/40 backdrop-blur-sm text-white px-8 py-3 rounded flex items-center font-bold text-base hover:bg-gray-500/60 transition">
                <Info className="w-5 h-5 mr-2" /> More Info
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`relative z-10 space-y-2 ${activeTab !== 'mylist' ? '-mt-32' : 'pt-24'}`}>
        {activeTab === 'mylist' ? (
          <div className="px-12">
            <h2 className="text-2xl font-bold text-white mb-6">My List</h2>
            {myList.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {myList.map(show => (
                  <ShowCard key={show.show_id} show={show} onShowDetail={setDetailShow} onPlay={setPlayingShow} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Plus className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Your list is empty</p>
                <p className="text-gray-500 text-sm mt-1">Browse shows and add them to your list</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {continueWatching.length > 0 && (
              <Row title="Continue Watching" shows={continueWatching} onShowDetail={setDetailShow} onPlay={setPlayingShow} />
            )}
            <Row title="Trending Now" shows={filtered} onShowDetail={setDetailShow} onPlay={setPlayingShow} />
            {activeTab === 'home' && (
              <>
                <Row title="Crime & Thriller" shows={NETFLIX_SHOWS.filter(s => s.genres.includes('Crime') || s.genres.includes('Thriller'))} onShowDetail={setDetailShow} onPlay={setPlayingShow} />
                <Row title="Sci-Fi Adventures" shows={NETFLIX_SHOWS.filter(s => s.genres.includes('Sci-Fi'))} onShowDetail={setDetailShow} onPlay={setPlayingShow} />
                <SubscriptionSection />
                <Row title="Action Packed" shows={NETFLIX_SHOWS.filter(s => s.genres.includes('Action'))} onShowDetail={setDetailShow} onPlay={setPlayingShow} />
                <Row title="Drama Originals" shows={NETFLIX_SHOWS.filter(s => s.genres.includes('Drama'))} onShowDetail={setDetailShow} onPlay={setPlayingShow} />
              </>
            )}
            {activeTab === 'tvshows' && (
              <>
                <Row title="Popular Series" shows={NETFLIX_SHOWS.filter(s => s.duration <= 55)} onShowDetail={setDetailShow} onPlay={setPlayingShow} />
                <Row title="International TV" shows={NETFLIX_SHOWS.filter(s => s.language !== 'English')} onShowDetail={setDetailShow} onPlay={setPlayingShow} />
              </>
            )}
            {activeTab === 'movies' && (
              <>
                <Row title="Action Blockbusters" shows={NETFLIX_SHOWS.filter(s => s.genres.includes('Action'))} onShowDetail={setDetailShow} onPlay={setPlayingShow} />
                <Row title="Award Winners" shows={NETFLIX_SHOWS.filter(s => s.match >= 90)} onShowDetail={setDetailShow} onPlay={setPlayingShow} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
