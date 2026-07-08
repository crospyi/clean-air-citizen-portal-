import { Wind, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onResetAll: () => void;
}

export default function Header({ onResetAll }: HeaderProps) {
  return (
    <header id="header" className="h-14 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-sky-500/20">
          <Wind className="w-4 h-4 text-white animate-spin-slow" />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
            CleanAir <span className="text-sky-400 font-normal">Nexus</span>
            <span className="text-[9px] font-mono tracking-widest uppercase bg-sky-950/80 text-sky-400 px-2 py-0.5 rounded border border-sky-900/40 hidden sm:inline-block">
              Mobile App Simulation
            </span>
          </h1>
          <p className="text-[10px] text-slate-500 font-mono hidden md:block">
            Intake Node: <span className="text-slate-400 font-semibold">soma_citizen_broadcast</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs font-mono">
        <div className="hidden lg:flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          PHONE_SIMULATOR_ACTIVE
        </div>
        <button
          type="button"
          onClick={onResetAll}
          title="Reset Grid to Defaults"
          className="px-3 py-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800/40 rounded-full transition-colors border border-slate-850 flex items-center gap-1 text-[11px] font-mono"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset App</span>
        </button>
      </div>
    </header>
  );
}
