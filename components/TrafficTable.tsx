import React, { useState } from 'react';
import { LogEntry, AttackType, ImpactLevel } from '../types';
import { ChevronDown, ChevronRight, AlertCircle, Shield, AlertOctagon, Code } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface TrafficTableProps {
  logs: LogEntry[];
  breachOnly: boolean;
}

const TrafficTable: React.FC<TrafficTableProps> = ({ logs, breachOnly }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getAttackBadge = (type: AttackType) => {
    switch (type) {
      case AttackType.SQLi: return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-900/50 text-purple-400 border border-purple-800">SQLi</span>;
      case AttackType.XSS: return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-900/50 text-yellow-400 border border-yellow-800">XSS</span>;
      case AttackType.RCE: return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-900/50 text-red-400 border border-red-800">RCE</span>;
      case AttackType.DDoS: return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-900/50 text-orange-400 border border-orange-800">DDoS</span>;
      default: return <span className="text-slate-600">-</span>;
    }
  };

  const getImpactBadge = (impact: ImpactLevel) => {
     switch(impact) {
        case ImpactLevel.Breach:
            return (
                <div className="flex items-center space-x-1 text-red-500 font-bold animate-pulse">
                    <AlertOctagon size={14} />
                    <span className="uppercase text-[10px] tracking-wider">BREACH</span>
                </div>
            );
        case ImpactLevel.Attempt:
            return (
                <div className="flex items-center space-x-1 text-amber-500">
                    <Shield size={14} />
                    <span className="uppercase text-[10px] tracking-wider">BLOCKED</span>
                </div>
            );
        default:
            return <span className="text-emerald-500 text-[10px]">SAFE</span>;
     }
  };

  const getMethodColor = (method: string) => {
      switch(method) {
          case 'GET': return 'text-blue-400';
          case 'POST': return 'text-green-400';
          case 'DELETE': return 'text-red-400';
          case 'PUT': return 'text-orange-400';
          default: return 'text-slate-400';
      }
  };

  if (logs.length === 0) {
      return (
          <div className="w-full h-64 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
              <p className="text-slate-500 font-mono">No logs matching criteria.</p>
          </div>
      )
  }

  return (
    <div className={clsx("rounded-xl overflow-hidden border transition-colors duration-300", breachOnly ? "border-red-900/50" : "border-slate-800")}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-500 uppercase tracking-wider">
              <th className="p-4 w-10"></th>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Source IP</th>
              <th className="p-4">Method</th>
              <th className="p-4">URL</th>
              <th className="p-4">Status</th>
              <th className="p-4">Attack Type</th>
              <th className="p-4 text-right">Impact</th>
            </tr>
          </thead>
          <tbody className="text-sm font-mono">
            {logs.map((log) => {
               const isBreach = log.impact === ImpactLevel.Breach;
               const isExpanded = expandedId === log.id;

               return (
                  <React.Fragment key={log.id}>
                    <tr 
                        onClick={() => toggleRow(log.id)}
                        className={clsx(
                            "cursor-pointer transition-colors border-b border-slate-800/50 hover:bg-slate-800/50",
                            isBreach && "bg-red-950/10 hover:bg-red-950/20",
                            isExpanded && "bg-slate-800"
                        )}
                    >
                      <td className="p-4 text-slate-500">
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </td>
                      <td className="p-4 text-slate-400 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="p-4 text-cyan-300 whitespace-nowrap">{log.sourceIp}</td>
                      <td className={clsx("p-4 font-bold", getMethodColor(log.method))}>{log.method}</td>
                      <td className="p-4 text-slate-300 max-w-xs truncate" title={log.url}>{log.url}</td>
                      <td className={clsx("p-4", log.statusCode >= 400 ? "text-amber-500" : "text-emerald-500")}>
                          {log.statusCode}
                      </td>
                      <td className="p-4">{getAttackBadge(log.attackType)}</td>
                      <td className="p-4 text-right">{getImpactBadge(log.impact)}</td>
                    </tr>
                    
                    {/* Expanded Details */}
                    <AnimatePresence>
                        {isExpanded && (
                            <tr>
                                <td colSpan={8} className="p-0 border-b border-slate-800">
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden bg-slate-950/50 shadow-inner"
                                    >
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center">
                                                    <Code size={12} className="mr-1" /> Request Headers
                                                </h4>
                                                <pre className="text-xs bg-slate-900 p-4 rounded-lg border border-slate-800 text-slate-400 overflow-x-auto">
                                                    {JSON.stringify(log.details?.headers, null, 2)}
                                                </pre>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center">
                                                    <AlertCircle size={12} className="mr-1" /> Payload Analysis
                                                </h4>
                                                 <div className="text-xs bg-slate-900 p-4 rounded-lg border border-slate-800 text-slate-300 font-mono">
                                                    <p className="mb-2 text-slate-500">User-Agent: {log.details?.userAgent}</p>
                                                    {log.details?.payload && (
                                                        <div className="mt-2">
                                                            <span className="text-red-400 font-bold block mb-1">Suspicious Payload Detected:</span>
                                                            <code className="block bg-red-950/30 text-red-200 p-2 rounded border border-red-900/50 break-all">
                                                                {log.details.payload}
                                                            </code>
                                                        </div>
                                                    )}
                                                 </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </td>
                            </tr>
                        )}
                    </AnimatePresence>
                  </React.Fragment>
               );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrafficTable;