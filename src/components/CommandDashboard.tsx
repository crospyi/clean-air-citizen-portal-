import { useState, useEffect } from 'react';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Trash2, 
  Radio, 
  Users, 
  TrendingUp, 
  MapPin, 
  Send,
  Building,
  Check
} from 'lucide-react';
import { db } from '../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  doc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  increment,
  getDoc
} from 'firebase/firestore';

interface CommandDashboardProps {
  onShowToast: (msg: string) => void;
}

interface ReportData {
  id: string;
  userId: string;
  senderName: string;
  senderId: string;
  state: string;
  city: string;
  category: string;
  description: string;
  imageUrl?: string | null;
  aqi: number;
  timestamp: string;
  createdAt: string;
  verified: boolean;
  votesCount?: number;
  lat?: number;
  lon?: number;
}

export default function CommandDashboard({ onShowToast }: CommandDashboardProps) {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [broadcastText, setBroadcastText] = useState('');
  const [broadcasting, setBroadcasting] = useState(false);
  const [grapLevel, setGrapLevel] = useState<number>(1);

  // Real-time Firestore sync for all reports
  useEffect(() => {
    const qSnap = query(collection(db, 'reports'), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribe = onSnapshot(qSnap, (snapshot) => {
      const list: ReportData[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as ReportData);
      });
      setReports(list);
      setLoading(false);
    }, (err) => {
      console.error("Firestore reports dashboard sync failed:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Action: Verify a report
  const handleVerify = async (reportId: string, submitterId: string) => {
    try {
      const reportDocRef = doc(db, 'reports', reportId);
      await updateDoc(reportDocRef, {
        verified: true
      });

      // Reward the submitter +100 points
      if (submitterId) {
        const userDocRef = doc(db, 'users', submitterId);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          await updateDoc(userDocRef, {
            points: increment(100)
          });
        }
      }

      onShowToast("✅ Report officially verified! Submitter rewarded +100 points.");
    } catch (err) {
      console.error("Failed to verify report:", err);
      onShowToast("❌ Failed to verify report.");
    }
  };

  // Action: Delete/Dismiss a report
  const handleDelete = async (reportId: string) => {
    if (!window.confirm("Are you sure you want to dismiss and delete this hazard report?")) return;
    try {
      await deleteDoc(doc(db, 'reports', reportId));
      onShowToast("🗑️ Hazard report dismissed and deleted.");
    } catch (err) {
      console.error("Failed to delete report:", err);
      onShowToast("❌ Failed to delete report.");
    }
  };

  // Action: Broadcast official alert message
  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;

    setBroadcasting(true);
    const alertId = `broadcast-${Date.now()}`;
    const cleanMsg = broadcastText.trim();

    const broadcastData = {
      id: alertId,
      communityId: 'municipal_general',
      senderName: 'CPCB Official',
      senderId: 'cpcb_official_broadcast',
      state: 'Delhi NCR',
      city: 'National Board',
      text: `🛡️ [OFFICIAL ADVISORY] ${cleanMsg} (GRAP Level ${grapLevel} Protocols Active)`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      avatar: '🏛️',
      createdAt: Date.now(),
      isUser: false
    };

    try {
      await setDoc(doc(collection(db, 'community_messages')), broadcastData);
      setBroadcastText('');
      onShowToast("📢 Official Broadcast advisory sent to all community channels!");
    } catch (err) {
      console.error("Broadcast failed:", err);
      onShowToast("❌ Failed to broadcast message.");
    } finally {
      setBroadcasting(false);
    }
  };

  // Metrics calculation
  const totalReports = reports.length;
  const verifiedReports = reports.filter(r => r.verified).length;
  const pendingReports = totalReports - verifiedReports;
  const avgAqiMod = totalReports > 0 
    ? Math.round(reports.reduce((sum, r) => sum + (r.aqi || 0), 0) / totalReports) 
    : 0;

  // Breakdown by category
  const categoryCounts = reports.reduce((acc: Record<string, number>, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});

  const getEmoji = (cat: string) => {
    switch (cat) {
      case 'Trash': return '🗑️';
      case 'Leaf': return '🍂';
      case 'Factory': return '🏭';
      case 'Smoke': return '💨';
      case 'Dust': return '🏗️';
      case 'Vehicular': return '🚗';
      default: return '🚨';
    }
  };

  return (
    <div className="w-full max-w-3xl h-[650px] bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col gap-5 overflow-y-auto text-slate-100 font-sans backdrop-blur-xl shrink-0">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-slate-850">
        <div>
          <h1 className="text-sm font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
            <Shield className="w-5 h-5 text-sky-400 animate-pulse" />
            CLEAN-AIR INCIDENT COMMAND
          </h1>
          <p className="text-[9.5px] font-mono text-slate-400 mt-0.5">National Air Pollution Intake & Dispatch (Live Sync)</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 flex items-center gap-1.5 text-[9px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>LIVE SYNCED</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-2.5 flex flex-col justify-between">
          <span className="text-[8.5px] font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Activity className="w-3 h-3 text-sky-400" /> Active
          </span>
          <div className="flex justify-between items-baseline mt-1.5">
            <span className="text-xl font-extrabold tracking-tight">{totalReports}</span>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-2.5 flex flex-col justify-between">
          <span className="text-[8.5px] font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-400" /> Verified
          </span>
          <div className="flex justify-between items-baseline mt-1.5">
            <span className="text-xl font-extrabold tracking-tight text-emerald-400">{verifiedReports}</span>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-2.5 flex flex-col justify-between">
          <span className="text-[8.5px] font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" /> Pending
          </span>
          <div className="flex justify-between items-baseline mt-1.5">
            <span className="text-xl font-extrabold tracking-tight text-amber-400">{pendingReports}</span>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-2.5 flex flex-col justify-between">
          <span className="text-[8.5px] font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-rose-400" /> Avg Impact
          </span>
          <div className="flex justify-between items-baseline mt-1.5">
            <span className="text-xl font-extrabold tracking-tight text-rose-400">+{avgAqiMod}</span>
          </div>
        </div>
      </div>

      {/* Main Panel layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1 min-h-0">
        
        {/* Incident Intake Feed */}
        <div className="md:col-span-3 flex flex-col bg-slate-950/40 border border-slate-850 rounded-2xl p-3 min-h-0 overflow-hidden">
          <h2 className="text-[10px] font-extrabold font-mono text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-850 flex items-center gap-1.5">
            📥 INTAKE FEED ({totalReports})
          </h2>

          <div className="flex-1 overflow-y-auto space-y-2.5 mt-2.5 pr-1">
            {loading ? (
              <div className="h-full flex items-center justify-center flex-col gap-2 py-10">
                <span className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></span>
                <span className="text-[10px] font-mono text-slate-500">Syncing...</span>
              </div>
            ) : reports.length === 0 ? (
              <div className="h-full flex items-center justify-center py-10 text-slate-500 font-mono text-[10px] text-center leading-relaxed">
                🍃 No hazard reports in Firestore.<br/>Submit a report on the phone emulator!
              </div>
            ) : (
              reports.map((report) => (
                <div 
                  key={report.id} 
                  className={`p-3 rounded-xl border transition-all flex flex-col gap-2 ${
                    report.verified 
                      ? 'bg-slate-900/30 border-emerald-950/50' 
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base leading-none">{getEmoji(report.category)}</span>
                      <div>
                        <h4 className="text-[11px] font-extrabold text-slate-200">{report.category}</h4>
                        <p className="text-[9.5px] font-mono text-slate-400 flex items-center gap-1.5 flex-wrap">
                          <MapPin className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                          <span>{report.city}, {report.state}</span>
                          {report.lat && report.lon && (
                            <a 
                              href={`https://www.google.com/maps/search/?api=1&query=${report.lat},${report.lon}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sky-400 hover:underline hover:text-sky-300 font-bold flex items-center gap-0.5 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700 font-mono text-[7.5px]"
                              title="Open exact GPS coords on Google Maps"
                            >
                              📍 {report.lat.toFixed(4)}, {report.lon.toFixed(4)}
                            </a>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] font-mono text-slate-500">{report.timestamp}</span>
                      <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                        report.verified 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                      }`}>
                        {report.verified ? 'VERIFIED ✓' : 'PENDING'}
                      </span>
                    </div>
                  </div>

                  {/* Description & Image block */}
                  <div className="flex gap-2.5 items-start">
                    {report.imageUrl && (
                      <img 
                        src={report.imageUrl} 
                        alt="Evidence" 
                        className="w-12 h-12 object-cover rounded-lg border border-slate-700 shrink-0 shadow-inner"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-[11px] text-slate-300 leading-normal font-sans">{report.description}</p>
                      <div className="mt-1 flex items-center gap-2 text-[8.5px] font-mono text-slate-500">
                        <span>By: <strong className="text-slate-400">{report.senderName || 'Anonymous'}</strong></span>
                        <span>•</span>
                        <span className="text-rose-400 font-bold">+{report.aqi} AQI</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  {!report.verified && (
                    <div className="flex gap-1.5 justify-end pt-1.5 border-t border-slate-850 mt-1">
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="px-2 py-1 rounded-lg border border-slate-800 hover:border-rose-950/60 hover:bg-rose-950/20 text-slate-500 hover:text-rose-400 text-[9px] font-bold font-mono transition-all flex items-center gap-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> DISMISS
                      </button>
                      <button
                        onClick={() => handleVerify(report.id, report.userId)}
                        className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 text-[9px] font-bold font-mono transition-all flex items-center gap-0.5 cursor-pointer"
                      >
                        <Check className="w-3 h-3" /> VERIFY (+100)
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Control Panel / Broadcast */}
        <div className="md:col-span-2 flex flex-col gap-4">
          
          {/* CPCB Broadcast Form */}
          <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-3">
            <h2 className="text-[10px] font-extrabold font-mono text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-850 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-sky-400" /> BROADCAST PANEL
            </h2>

            <form onSubmit={handleBroadcast} className="space-y-3 mt-3">
              <div className="space-y-1">
                <label className="text-[8.5px] font-bold font-mono text-slate-400 uppercase tracking-wide">
                  🚨 GRAP Level
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setGrapLevel(level)}
                      className={`py-1 rounded-lg text-[10px] font-mono font-bold border transition-all ${
                        grapLevel === level 
                          ? 'bg-rose-500/25 border-rose-500 text-rose-400 shadow-md' 
                          : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      Lvl {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[8.5px] font-bold font-mono text-slate-400 uppercase tracking-wide">
                  Advisory Message
                </label>
                <textarea
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value)}
                  placeholder="e.g. Construction activities halted inside Noida under GRAP Level 3 protocols."
                  rows={3}
                  className="w-full text-[11px] bg-slate-950 border border-slate-800 rounded-xl p-2.5 focus:outline-none focus:border-sky-500 text-slate-300 placeholder-slate-600 font-sans resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={broadcasting || !broadcastText.trim()}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-slate-950 font-extrabold text-[10px] tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-sky-500/10 hover:shadow-sky-400/20 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {broadcasting ? (
                  <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> BROADCAST ALERT
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Incident Categories Stats */}
          <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-3 flex-1">
            <h2 className="text-[10px] font-extrabold font-mono text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-850 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-sky-400" /> HAZARDS
            </h2>

            <div className="space-y-2 mt-2">
              {['Trash', 'Leaf', 'Factory', 'Smoke', 'Dust', 'Vehicular'].map((cat) => {
                const count = categoryCounts[cat] || 0;
                const percentage = totalReports > 0 ? (count / totalReports) * 100 : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-400 flex items-center gap-1">
                        <span>{getEmoji(cat)}</span>
                        {cat}
                      </span>
                      <span className="text-slate-200 font-bold">{count}</span>
                    </div>
                    <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${percentage}%` }} 
                        className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-300"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
