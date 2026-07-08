import { useState } from 'react';
import { Radio, X } from 'lucide-react';
import CitizenPortal from './components/CitizenPortal';

export default function App() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showNotificationToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  return (
    <div className="w-screen h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans antialiased selection:bg-sky-500/30 selection:text-white overflow-hidden relative">
      
      {/* Background radial glow & grid patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-40"></div>
      
      {/* Visual Toast Notification Overlay */}
      {toastMessage && (
        <div id="toast" className="fixed top-6 right-6 z-50 max-w-sm bg-slate-900/95 border-l-4 border-sky-500 text-sky-100 px-4 py-3 rounded-xl shadow-2xl flex items-start gap-3 animate-bounce backdrop-blur-md">
          <Radio className="w-5 h-5 shrink-0 text-sky-400 animate-pulse mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-300">CleanAir Broadcast</h4>
            <p className="text-xs font-mono leading-relaxed mt-1">{toastMessage}</p>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Centered Phone Simulator Container */}
      <main id="main-content" className="w-full h-full md:w-auto md:h-auto flex items-center justify-center relative z-10">
        <CitizenPortal
          onShowToast={showNotificationToast}
        />
      </main>
    </div>
  );
}

