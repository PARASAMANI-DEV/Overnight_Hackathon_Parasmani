
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './Sidebar';
import UploadZone from './UploadZone';
import HudCards from './HudCards';
import AnalyticsCharts from './AnalyticsCharts';
import LiveTraffic from './LiveTraffic';
import ThreatMap from './ThreatMap';
import Settings from './Settings';
import { ImpactLevel, AttackType, ChartDataPoint, TimeSeriesDataPoint, LogEntry, MetricStats } from '../types';
import { generateMockLogs } from '../constants';
import { clsx } from 'clsx';
import { Activity, Pause, Play } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Shared Data State
  const [breachOnly, setBreachOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLive, setIsLive] = useState(true);
  
  // Application Data: Start with some mock data for initial impact
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Live Traffic Simulation
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const mockBatch = generateMockLogs(1);
      const newLog = { 
        ...mockBatch[0], 
        id: `live-${Date.now()}`,
        timestamp: new Date().toISOString() 
      };

      setLogs(prev => {
        const updated = [newLog, ...prev];
        return updated.slice(0, 2000); // Keep buffer manageable
      });
    }, 2000); // Add a log every 2 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  // --- Derived Metrics ---

  // 1. Calculate General Stats (HUD Cards)
  const stats: MetricStats = useMemo(() => {
    if (logs.length === 0) return {
       totalRequests: 0, threatsBlocked: 0, criticalBreaches: 0, trafficVolume: []
    };

    let blocked = 0;
    let breaches = 0;
    
    // Sparkline bucket map
    const volumeMap = new Map<string, number>();

    logs.forEach(log => {
      if (log.impact === ImpactLevel.Attempt) blocked++;
      if (log.impact === ImpactLevel.Breach) breaches++;

      // Use a consistent time format key
      const date = new Date(log.timestamp);
      const h = date.getHours().toString().padStart(2, '0');
      const m = date.getMinutes().toString().padStart(2, '0');
      const timeKey = `${h}:${m}`;
      
      volumeMap.set(timeKey, (volumeMap.get(timeKey) || 0) + 1);
    });

    const volumeArray = Array.from(volumeMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0])) // Simple sort by string time
        .map(([time, value]) => ({ time, value })) // Raw values (No multiplier)
        .slice(-20);

    return {
      totalRequests: logs.length,
      threatsBlocked: blocked,
      criticalBreaches: breaches,
      trafficVolume: volumeArray.length > 0 ? volumeArray : [{time: 'Now', value: 0}]
    };
  }, [logs]);

  // 2. Calculate Vector Data (Pie Chart)
  const vectorData: ChartDataPoint[] = useMemo(() => {
    // Initialize counts for all known attack types
    const counts: Record<string, number> = {
      [AttackType.SQLi]: 0,
      [AttackType.XSS]: 0,
      [AttackType.RCE]: 0,
      [AttackType.DDoS]: 0,
    };

    let hasAttacks = false;
    logs.forEach(log => {
      if (log.attackType && log.attackType !== AttackType.None) {
         counts[log.attackType] = (counts[log.attackType] || 0) + 1;
         hasAttacks = true;
      }
    });

    if (!hasAttacks) return [];

    return Object.entries(counts)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  }, [logs]);

  // 3. Calculate Traffic vs Threats (Area Chart)
  const trafficData: TimeSeriesDataPoint[] = useMemo(() => {
    // Always generate a baseline timeline even if logs are empty
    const timeMap = new Map<string, { traffic: number; threats: number; order: number }>();
    const now = new Date();
    const currentHour = now.getHours();

    // Initialize the last 12 hours with 0 to ensure the chart has width/shape
    for (let i = 11; i >= 0; i--) {
        let h = currentHour - i;
        if (h < 0) h += 24;
        const key = `${h.toString().padStart(2, '0')}:00`;
        timeMap.set(key, { traffic: 0, threats: 0, order: 12 - i }); 
    }

    // Populate with Log Data
    logs.forEach(log => {
        const date = new Date(log.timestamp);
        const h = date.getHours().toString().padStart(2, '0');
        const timeKey = `${h}:00`;

        if (timeMap.has(timeKey)) {
            const entry = timeMap.get(timeKey)!;
            entry.traffic += 1;
            if (log.attackType !== AttackType.None) {
                entry.threats += 1;
            }
            timeMap.set(timeKey, entry);
        }
    });

    return Array.from(timeMap.entries())
        .map(([time, data]) => ({ 
            time, 
            traffic: data.traffic, // Raw actual traffic
            threats: data.threats, // Raw actual threats
            order: data.order 
        }))
        .sort((a, b) => a.order - b.order) 
        .map(({ time, traffic, threats }) => ({ time, traffic, threats }));
  }, [logs]);


  const handleUploadComplete = (newLogs: LogEntry[]) => {
    // Stop live feed when manual data is uploaded to prevent overwriting/pushing down file data
    setIsLive(false);
    // Append new logs and re-sort
    setLogs(prev => [...newLogs, ...prev].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  };

  const handleClearHistory = () => {
    setLogs([]);
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (breachOnly && log.impact !== ImpactLevel.Breach) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          log.sourceIp.includes(term) ||
          log.url.toLowerCase().includes(term) ||
          log.attackType.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [logs, breachOnly, searchTerm]);

  // Mode Effect
  useEffect(() => {
    if (breachOnly) {
      document.body.classList.add('breach-mode-active');
    } else {
      document.body.classList.remove('breach-mode-active');
    }
  }, [breachOnly]);

  const renderContent = () => {
    switch(currentView) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Mission Control</h1>
                <p className="text-slate-500 mt-1">Overview of system status and recent alerts.</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                 <button 
                    onClick={() => setIsLive(!isLive)}
                    className={clsx(
                      "px-3 py-1 rounded-full flex items-center transition-all duration-300 border",
                      isLive 
                        ? "bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20" 
                        : "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20"
                    )}
                 >
                    {isLive ? (
                      <>
                        <span className="relative flex h-2 w-2 mr-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-wide">Live Feed Active</span>
                      </>
                    ) : (
                      <>
                        <Pause size={12} className="mr-2 text-amber-500" />
                        <span className="text-xs font-bold text-amber-500 uppercase tracking-wide">Feed Paused</span>
                      </>
                    )}
                 </button>
              </div>
            </div>

            <UploadZone onUploadComplete={handleUploadComplete} />
            <HudCards stats={stats} />
            <AnalyticsCharts vectorData={vectorData} trafficData={trafficData} />
          </div>
        );
      
      case 'traffic':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <LiveTraffic 
               logs={filteredLogs} 
               breachOnly={breachOnly} 
               setBreachOnly={setBreachOnly} 
               searchTerm={searchTerm} 
               setSearchTerm={setSearchTerm} 
             />
          </div>
        );

      case 'map':
        return (
          <div className="animate-in fade-in zoom-in-95 duration-500 h-full">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Global Threat Map</h1>
                <p className="text-slate-500 mt-1">Real-time visualization of attack vectors and origin points.</p>
            </div>
            <ThreatMap />
          </div>
        );

      case 'settings':
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <Settings onClearHistory={handleClearHistory} />
          </div>
        );

      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      {/* "Investigator Mode" Red Overlay */}
      <div className={clsx(
          "fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]",
          breachOnly ? "opacity-30 from-red-900/40 via-transparent to-transparent" : "opacity-0"
      )} />

      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        onLogout={onLogout} 
        currentView={currentView}
        onNavigate={setCurrentView}
      />

      <main className={clsx(
        "relative z-10 transition-all duration-300 ease-in-out p-4 md:p-8 pt-20 lg:ml-64 min-h-screen",
        breachOnly && "border-l-4 border-red-500/50 pl-6" 
      )}>
        <div className="max-w-7xl mx-auto h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
