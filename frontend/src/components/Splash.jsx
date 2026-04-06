import { useEffect, useState } from 'react';

export default function Splash({ onComplete }) {
  const [stage, setStage] = useState('entering');

  useEffect(() => {
    const t1 = setTimeout(() => setStage('displaying'), 500);
    const t2 = setTimeout(() => setStage('leaving'), 2800);
    const t3 = setTimeout(() => onComplete(), 3500);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center overflow-hidden">
      <div className={`transition-all duration-700 ease-in-out transform flex flex-col items-center justify-center ${
        stage === 'entering' ? 'scale-50 opacity-0 blur-md' :
        stage === 'displaying' ? 'scale-110 opacity-100 blur-0' :
        'scale-150 opacity-0 blur-xl'
      }`}>
        <h1 className="text-6xl md:text-8xl font-black text-[#E50914] tracking-tighter drop-shadow-[0_0_40px_rgba(229,9,20,0.8)] translate-x-2">
          APERTURE
        </h1>
        <div className="w-full h-1 mt-2 bg-gradient-to-r from-transparent via-[#E50914] to-transparent animate-pulse opacity-50"></div>
      </div>
    </div>
  );
}
