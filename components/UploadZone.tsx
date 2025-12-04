
import React, { useState } from 'react';
import { UploadCloud, CheckCircle, Loader2, AlertTriangle, FileText, ShieldAlert, ShieldCheck, Shield, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { LogEntry, AttackType, ImpactLevel } from '../types';

interface UploadZoneProps {
  onUploadComplete: (newLogs: LogEntry[]) => void;
}

interface AnalysisResult {
  score: number;
  risk: 'Safe' | 'Caution' | 'Critical';
  recommendation: string;
  stats: {
    breaches: number;
    attempts: number;
  }
}

const UploadZone: React.FC<UploadZoneProps> = ({ onUploadComplete }) => {
  const [status, setStatus] = useState<'idle' | 'dragging' | 'scanning' | 'complete' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // Unified Threat Detection Logic
  const detectThreat = (content: string, statusCode: number) => {
    let attackType = AttackType.None;
    let impact = ImpactLevel.Safe;
    const lower = content.toLowerCase();

    // Deterministic Rules
    if (lower.includes('union select') || lower.includes("' or '1'='1") || lower.includes('information_schema') || lower.includes('drop table')) {
        attackType = AttackType.SQLi;
    } else if (lower.includes('<script>') || lower.includes('javascript:') || lower.includes('onerror=') || lower.includes('onload=')) {
        attackType = AttackType.XSS;
    } else if (lower.includes('/etc/passwd') || lower.includes('cmd.exe') || lower.includes('whoami') || lower.includes('..') || lower.includes('exec(')) {
        attackType = AttackType.RCE;
    } else if ((lower.includes('dos') || lower.includes('flood') || lower.includes('ping')) && !lower.includes('windows')) {
        attackType = AttackType.DDoS;
    }

    if (attackType !== AttackType.None) {
        impact = (statusCode >= 200 && statusCode < 300) ? ImpactLevel.Breach : ImpactLevel.Attempt;
    }

    return { attackType, impact };
  };

  const calculateRisk = (logs: LogEntry[]): AnalysisResult => {
    let score = 100;
    let breaches = 0;
    let attempts = 0;
    let highRiskCount = 0;

    logs.forEach(log => {
      if (log.impact === ImpactLevel.Breach) {
        score -= 25;
        breaches++;
      } else if (log.impact === ImpactLevel.Attempt) {
        score -= 2;
        attempts++;
      } else if (log.attackType === AttackType.RCE || log.attackType === AttackType.SQLi) {
        score -= 5;
        highRiskCount++;
      }
    });

    score = Math.max(0, Math.round(score));

    let risk: 'Safe' | 'Caution' | 'Critical' = 'Safe';
    let recommendation = "";

    if (breaches > 0 || score < 50) {
      risk = 'Critical';
      recommendation = "DANGER: Critical breaches detected. Do not share or use this file without redaction. Immediate forensic analysis required.";
    } else if (attempts > 5 || highRiskCount > 0 || score < 85) {
      risk = 'Caution';
      recommendation = "WARNING: Suspicious activity found. Review logs carefully before sharing. Potential targeted attacks identified.";
    } else {
      risk = 'Safe';
      recommendation = "SAFE: No significant threats detected. File appears clean and safe to share.";
    }

    return {
      score,
      risk,
      recommendation,
      stats: { breaches, attempts }
    };
  };

  const processFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setStatus('scanning');
    
    try {
      // Artificial delay for UI effect
      await new Promise(resolve => setTimeout(resolve, 1500));

      const file = files[0];
      const text = await file.text();
      let newLogs: LogEntry[] = [];

      // Strategy 1: Attempt JSON parse
      try {
        const json = JSON.parse(text);
        if (Array.isArray(json)) {
           newLogs = json;
        } else if (json.logs) {
           newLogs = json.logs;
        }
      } catch (e) {
        // Not JSON, continue to other strategies
      }

      if (newLogs.length === 0) {
          const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
          
          if (lines.length > 0) {
              const firstLine = lines[0];
              
              // Strategy 2: CSV Parse (Header Heuristic)
              if (firstLine.includes(',') && lines.length > 1) {
                  const headers = firstLine.split(',').map(h => h.trim().toLowerCase().replace(/^"|"$/g, ''));
                  
                  // Helper to find column index
                  const findIdx = (keywords: string[]) => headers.findIndex(h => keywords.some(k => h.includes(k)));
                  
                  const idx = {
                      ts: findIdx(['time', 'date', 'created', 'timestamp']),
                      ip: findIdx(['ip', 'source', 'host', 'origin', 'client']),
                      method: findIdx(['method', 'verb', 'type', 'req']),
                      url: findIdx(['url', 'path', 'uri', 'request', 'target']),
                      status: findIdx(['status', 'code', 'sc', 'resp']),
                      payload: findIdx(['payload', 'body', 'data', 'content']),
                      agent: findIdx(['agent', 'browser', 'ua'])
                  };

                  newLogs = lines.slice(1).map((line, i) => {
                      const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
                      
                      const url = idx.url > -1 ? cols[idx.url] : '/';
                      const payload = idx.payload > -1 ? cols[idx.payload] : '';
                      const method = idx.method > -1 ? cols[idx.method].toUpperCase() : 'GET';
                      const status = idx.status > -1 ? parseInt(cols[idx.status]) || 200 : 200;
                      const sourceIp = idx.ip > -1 ? cols[idx.ip] : '0.0.0.0';
                      
                      const { attackType, impact } = detectThreat(url + payload, status);

                      let timestamp = new Date().toISOString();
                      if (idx.ts > -1 && cols[idx.ts]) {
                          const parsed = Date.parse(cols[idx.ts]);
                          if (!isNaN(parsed)) timestamp = new Date(parsed).toISOString();
                      }

                      return {
                          id: `csv-${i}-${Date.now()}`,
                          timestamp,
                          sourceIp,
                          method: method as any,
                          url,
                          statusCode: status,
                          attackType,
                          impact,
                          details: {
                              headers: {},
                              payload: payload || undefined,
                              userAgent: idx.agent > -1 ? cols[idx.agent] : 'CSV Import'
                          }
                      };
                  });
              } 
              // Strategy 3: Unstructured / Regex Log Parse (.txt/.log)
              else {
                  newLogs = lines.map((line, i) => {
                      // Extract IP
                      const ipMatch = line.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
                      const sourceIp = ipMatch ? ipMatch[0] : '0.0.0.0';

                      // Extract Method
                      const methodMatch = line.match(/\b(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)\b/i);
                      const method = methodMatch ? methodMatch[0].toUpperCase() as any : 'GET';

                      // Extract Status Code
                      const statusMatch = line.match(/\s([2-5]\d{2})\s/);
                      const status = statusMatch ? parseInt(statusMatch[1]) : 200;

                      // Extract URL (Heuristic: starts with / or http, inside quotes or after method)
                      // Looks for patterns like "GET /path/to/file HTTP" or just /path/to/file
                      const urlMatch = line.match(/(?:GET|POST|PUT|DELETE|PATCH)\s+((?:\/|http)[\w\-./?=&%#+']+)/i) || 
                                       line.match(/(?:\s)((?:\/|http)[\w\-./?=&%#+']+)(?:\s|$)/);
                      const url = urlMatch ? urlMatch[1] : '/';

                      // Determine Threats from the entire line content
                      const { attackType, impact } = detectThreat(line, status);
                      
                      // Attempt Timestamp (CLF format [dd/MMM/yyyy...] or ISO)
                      // fallback to decreasing time from now to keep order
                      let timestamp = new Date(Date.now() - i * 1000).toISOString();
                      
                      const clfMatch = line.match(/\[(.*?)\]/); // Common Log Format [10/Oct/2000:13:55:36 -0700]
                      const isoMatch = line.match(/(\d{4}-\d{2}-\d{2}T?\d{2}:\d{2}:\d{2})/);
                      
                      if (clfMatch) {
                           // Quick fix for CLF format to make it parsable by Date (replace first : with space)
                           const cleanDate = clfMatch[1].replace(':', ' '); 
                           const parsed = Date.parse(cleanDate);
                           if (!isNaN(parsed)) timestamp = new Date(parsed).toISOString();
                      } else if (isoMatch) {
                           const parsed = Date.parse(isoMatch[1]);
                           if (!isNaN(parsed)) timestamp = new Date(parsed).toISOString();
                      }

                      return {
                          id: `txt-${i}-${Date.now()}`,
                          timestamp,
                          sourceIp,
                          method,
                          url,
                          statusCode: status,
                          attackType,
                          impact,
                          details: {
                              headers: {},
                              payload: attackType !== AttackType.None ? "Detected via Raw Log Analysis" : undefined,
                              userAgent: 'Raw Log Import'
                          }
                      };
                  });
              }
          }
      }

      if (newLogs.length === 0) {
         throw new Error("No parseable data found. Ensure file contains JSON, CSV, or standard log entries.");
      }

      const analysis = calculateRisk(newLogs);
      setResult(analysis);
      setStatus('complete');
      onUploadComplete(newLogs);
      // No timeout for reset - user must dismiss or re-upload
    } catch (err) {
      console.error(err);
      setErrorMessage("Parsing failed. Check format.");
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (status === 'idle' || status === 'error') setStatus('dragging');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (status === 'dragging') setStatus('idle');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (status === 'scanning' || status === 'complete') return;
    processFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStatus('idle');
    setResult(null);
  };

  return (
    <div className="relative w-full mb-8">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={clsx(
          "relative h-48 rounded-xl border-2 border-dashed transition-all duration-300 overflow-hidden group flex flex-col items-center justify-center cursor-pointer",
          status === 'dragging' 
            ? "border-cyan-500 bg-cyan-950/20 shadow-[0_0_30px_rgba(6,182,212,0.3)]" 
            : status === 'scanning'
            ? "border-amber-500/50 bg-slate-900"
            : status === 'complete'
            ? (result?.risk === 'Critical' ? "border-red-500 bg-red-950/20" : result?.risk === 'Caution' ? "border-amber-500 bg-amber-950/20" : "border-emerald-500 bg-emerald-950/20")
            : status === 'error'
            ? "border-red-500 bg-red-950/20"
            : "border-slate-700 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-900"
        )}
      >
         <input 
            type="file" 
            className={clsx("absolute inset-0 w-full h-full opacity-0 z-20", status === 'complete' ? 'cursor-default pointer-events-none' : 'cursor-pointer')}
            onChange={handleFileInput}
            disabled={status === 'scanning' || status === 'complete'}
            accept=".json,.csv,.log,.txt"
         />

        <AnimatePresence mode='wait'>
          {status === 'scanning' ? (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center z-10"
            >
              <Loader2 className="animate-spin text-cyan-400 mb-2" size={32} />
              <p className="text-cyan-400 font-mono text-sm tracking-widest">ANALYZING LOG STREAMS...</p>
            </motion.div>
          ) : status === 'complete' && result ? (
             <motion.div
              key="complete"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center w-full h-full z-30 bg-slate-950/90 backdrop-blur-md p-6"
            >
              <div className="flex items-center w-full max-w-2xl gap-8">
                 {/* Score Gauge */}
                 <div className="relative flex-shrink-0">
                    <svg className="w-32 h-32 transform -rotate-90">
                       <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-slate-800"
                       />
                       <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={351.86}
                          strokeDashoffset={351.86 - (351.86 * result.score) / 100}
                          className={clsx(
                             "transition-all duration-1000 ease-out",
                             result.risk === 'Safe' ? "text-emerald-500" :
                             result.risk === 'Caution' ? "text-amber-500" : "text-red-600"
                          )}
                       />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className={clsx("text-3xl font-bold", 
                           result.risk === 'Safe' ? "text-emerald-400" :
                           result.risk === 'Caution' ? "text-amber-400" : "text-red-500"
                       )}>{result.score}</span>
                       <span className="text-[10px] text-slate-500 uppercase font-mono mt-1">Safety Score</span>
                    </div>
                 </div>

                 {/* Text Content */}
                 <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                       <h3 className={clsx("text-xl font-bold uppercase tracking-wide flex items-center gap-2",
                            result.risk === 'Safe' ? "text-emerald-400" :
                            result.risk === 'Caution' ? "text-amber-400" : "text-red-500"
                       )}>
                           {result.risk === 'Safe' ? <ShieldCheck size={24} /> : 
                            result.risk === 'Caution' ? <Shield size={24} /> : <ShieldAlert size={24} />}
                           {result.risk} Risk
                       </h3>
                       <button 
                          onClick={handleReset}
                          className="p-1 rounded-full hover:bg-slate-800 text-slate-500 transition-colors"
                        >
                          <X size={20} />
                       </button>
                    </div>
                    
                    <p className="text-sm text-slate-300 mb-4 leading-relaxed font-medium">
                       {result.recommendation}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs font-mono border-t border-slate-800 pt-3">
                       <div className="flex items-center text-red-400">
                          <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                          {result.stats.breaches} Breaches
                       </div>
                       <div className="flex items-center text-amber-400">
                          <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                          {result.stats.attempts} Attempts
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          ) : status === 'error' ? (
            <motion.div
             key="error"
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0.8, opacity: 0 }}
             className="flex flex-col items-center text-red-400 z-10 pointer-events-none"
           >
             <AlertTriangle size={40} className="mb-2" />
             <p className="font-bold text-lg">UPLOAD FAILED</p>
             <p className="text-red-500/70 text-sm font-mono max-w-xs text-center">{errorMessage}</p>
           </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-slate-400 z-10 pointer-events-none"
            >
              <div className={clsx("p-4 rounded-full bg-slate-800 mb-3 transition-colors", status === 'dragging' ? "bg-cyan-900/50" : "")}>
                 <UploadCloud size={32} className={clsx(status === 'dragging' ? "text-cyan-400" : "text-slate-400")} />
              </div>
              <h3 className="text-lg font-medium text-slate-200">Drop Log Files Here</h3>
              <p className="text-sm text-slate-500 mt-1">JSON, CSV, or Text Logs</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UploadZone;
