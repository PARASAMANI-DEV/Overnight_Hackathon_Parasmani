import React from 'react';
import { MetricStats } from '../types';
import { Activity, ShieldCheck, AlertTriangle, Database } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { clsx } from 'clsx';

interface HudCardsProps {
  stats: MetricStats;
}

const HudCards: React.FC<HudCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Card 1: Total Requests */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Processed Requests</p>
            <h3 className="text-2xl font-bold text-slate-100 mt-1">{stats.totalRequests.toLocaleString()}</h3>
          </div>
          <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
            <Database size={20} />
          </div>
        </div>
        <div className="text-xs text-emerald-500 flex items-center mt-2 font-mono">
            <Activity size={12} className="mr-1" />
            +12.5% from last hour
        </div>
      </div>

      {/* Card 2: Threats Blocked */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Threats Mitigated</p>
            <h3 className="text-2xl font-bold text-amber-400 mt-1">{stats.threatsBlocked.toLocaleString()}</h3>
          </div>
          <div className="p-2 bg-amber-950/30 border border-amber-900/50 rounded-lg text-amber-500">
            <ShieldCheck size={20} />
          </div>
        </div>
        <div className="text-xs text-amber-500/70 mt-2 font-mono">
           Firewall Active
        </div>
      </div>

      {/* Card 3: CRITICAL BREACHES */}
      <div className={clsx(
        "relative overflow-hidden rounded-xl p-5 flex flex-col justify-between transition-all duration-300",
        stats.criticalBreaches > 0 
          ? "bg-red-950/20 border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]" 
          : "bg-slate-900/50 border border-slate-800"
      )}>
        {stats.criticalBreaches > 0 && (
           <div className="absolute inset-0 bg-red-500/5 animate-pulse-fast pointer-events-none"></div>
        )}
        <div className="flex justify-between items-start mb-2 relative z-10">
          <div>
            <p className={clsx("text-xs font-mono uppercase tracking-widest", stats.criticalBreaches > 0 ? "text-red-400" : "text-slate-500")}>
              Critical Breaches
            </p>
            <h3 className={clsx("text-2xl font-bold mt-1", stats.criticalBreaches > 0 ? "text-red-500 animate-pulse" : "text-slate-100")}>
              {stats.criticalBreaches}
            </h3>
          </div>
          <div className={clsx("p-2 rounded-lg relative z-10", stats.criticalBreaches > 0 ? "bg-red-950 text-red-500 border border-red-900" : "bg-slate-800 text-slate-400")}>
            <AlertTriangle size={20} />
          </div>
        </div>
        {stats.criticalBreaches > 0 ? (
           <div className="text-xs text-red-400 mt-2 font-mono font-bold animate-pulse relative z-10">
               IMMEDIATE ACTION REQUIRED
           </div>
        ) : (
            <div className="text-xs text-emerald-500 mt-2 font-mono">
                System Secure
            </div>
        )}
      </div>

      {/* Card 4: Traffic Volume (Sparkline) */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-5 flex flex-col justify-between relative">
        <div className="absolute top-5 left-5 z-10 pointer-events-none">
             <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Traffic Volume</p>
             <h3 className="text-lg font-bold text-slate-200 mt-1">2.4 Gbps</h3>
        </div>
        <div className="h-full w-full pt-6">
           <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.trafficVolume}>
                 <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#06b6d4" 
                    strokeWidth={2} 
                    dot={false} 
                 />
              </LineChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HudCards;