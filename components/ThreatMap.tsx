
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Shield, Wifi, Globe } from 'lucide-react';

const ThreatMap: React.FC = () => {
  const [pings, setPings] = useState<{ id: number; x: number; y: number; type: 'attack' | 'defense' }[]>([]);

  // Simulate random threat pings
  useEffect(() => {
    const interval = setInterval(() => {
      const newPing = {
        id: Date.now(),
        x: Math.random() * 100, // percentage
        y: Math.random() * 100, // percentage
        type: Math.random() > 0.7 ? 'defense' : 'attack' as 'attack' | 'defense',
      };

      setPings((prev) => [...prev.slice(-15), newPing]);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[calc(100vh-140px)] w-full bg-slate-900/50 border border-slate-800 rounded-xl relative overflow-hidden flex items-center justify-center">
      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      ></div>

      {/* World Map Silhouette (Simplified CSS representation) */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          {/* This SVG is a simplified placeholder for a world map */}
          <svg viewBox="0 0 1000 500" className="w-full h-full fill-slate-700">
             <path d="M150,150 Q200,100 250,150 T350,200 T450,150 T550,200 T650,150 T750,200 T850,150" stroke="none" />
             <rect x="100" y="100" width="200" height="150" rx="20" />
             <rect x="350" y="80" width="150" height="100" rx="20" />
             <rect x="600" y="100" width="300" height="200" rx="50" />
             <rect x="250" y="300" width="150" height="100" rx="20" />
             <circle cx="800" cy="400" r="30" />
             {/* Decorative lines */}
             <path d="M0,250 H1000" stroke="#1e293b" strokeWidth="2" />
             <path d="M500,0 V500" stroke="#1e293b" strokeWidth="2" />
          </svg>
      </div>

      {/* Radar Sweep Effect */}
      <div className="absolute inset-0 z-10 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,rgba(6,182,212,0.1)_360deg)] animate-[spin_4s_linear_infinite] opacity-50 w-[150vw] h-[150vw] -translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>

      {/* Live Pings */}
      {pings.map((ping) => (
        <motion.div
          key={ping.id}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: [0, 2, 3], opacity: [1, 0.5, 0] }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute z-20"
          style={{ top: `${ping.y}%`, left: `${ping.x}%` }}
        >
          {ping.type === 'attack' ? (
             <div className="relative">
                 <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444]"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-red-500 rounded-full opacity-50"></div>
             </div>
          ) : (
             <div className="relative">
                 <div className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-cyan-500 rounded-full opacity-50"></div>
             </div>
          )}
        </motion.div>
      ))}

      {/* HUD Overlay */}
      <div className="absolute top-6 left-6 z-30 bg-slate-950/80 backdrop-blur border border-slate-800 p-4 rounded-xl">
         <h3 className="text-slate-200 font-bold flex items-center mb-2">
            <Globe size={16} className="mr-2 text-cyan-400" /> Global Threat Feed
         </h3>
         <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between space-x-4">
               <span className="text-slate-400">Active Nodes</span>
               <span className="text-emerald-400">842</span>
            </div>
            <div className="flex items-center justify-between space-x-4">
               <span className="text-slate-400">Intercepted</span>
               <span className="text-amber-400">14,203</span>
            </div>
            <div className="flex items-center justify-between space-x-4">
               <span className="text-slate-400">Latency</span>
               <span className="text-cyan-400">24ms</span>
            </div>
         </div>
      </div>

      <div className="absolute bottom-6 right-6 z-30 flex space-x-2">
         <div className="flex items-center px-3 py-1 bg-slate-900/80 rounded border border-slate-800">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-xs text-slate-300 font-mono">ATTACK VECTOR</span>
         </div>
         <div className="flex items-center px-3 py-1 bg-slate-900/80 rounded border border-slate-800">
            <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>
            <span className="text-xs text-slate-300 font-mono">DEFENSE NODE</span>
         </div>
      </div>
    </div>
  );
};

export default ThreatMap;
