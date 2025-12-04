
import React from 'react';
import FilterBar from './FilterBar';
import TrafficTable from './TrafficTable';
import { LogEntry } from '../types';

interface LiveTrafficProps {
  logs: LogEntry[];
  breachOnly: boolean;
  setBreachOnly: (val: boolean) => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

const LiveTraffic: React.FC<LiveTrafficProps> = ({ logs, breachOnly, setBreachOnly, searchTerm, setSearchTerm }) => {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Live Traffic Feed</h2>
            <p className="text-slate-500 mt-1">Raw packet inspection and access logs.</p>
          </div>
          <div className="hidden md:block text-right">
             <div className="text-xs font-mono text-cyan-500 animate-pulse">Scanning Port 443...</div>
             <div className="text-xs font-mono text-slate-600">Buffer: 45MB / 1GB</div>
          </div>
       </div>

      <FilterBar 
        breachOnly={breachOnly} 
        setBreachOnly={setBreachOnly} 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="bg-slate-950 border border-slate-800 rounded-xl p-1 min-h-[600px]">
         <TrafficTable logs={logs} breachOnly={breachOnly} />
      </div>
    </div>
  );
};

export default LiveTraffic;
