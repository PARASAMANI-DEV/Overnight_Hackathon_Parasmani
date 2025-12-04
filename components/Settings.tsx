
import React from 'react';
import { Save, Bell, Shield, Eye, Moon, Monitor, Trash2, Database } from 'lucide-react';

interface SettingsProps {
  onClearHistory: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClearHistory }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 border-b border-slate-800 pb-6">
        <h2 className="text-2xl font-bold text-slate-100">System Configuration</h2>
        <p className="text-slate-500 mt-1">Manage notification thresholds, display preferences, and API keys.</p>
      </div>

      <div className="space-y-6">
        {/* Section 1 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
           <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Shield className="mr-2 text-cyan-400" size={20} /> Security Thresholds
           </h3>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-slate-800/50">
                 <div>
                    <label className="text-sm font-medium text-slate-200">Auto-Ban Malicious IPs</label>
                    <p className="text-xs text-slate-500">Automatically block IPs triggering &gt;5 critical alerts/min</p>
                 </div>
                 <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                    <input type="checkbox" id="toggle1" className="peer absolute opacity-0 w-0 h-0" defaultChecked />
                    <label htmlFor="toggle1" className="block w-12 h-6 bg-slate-700 rounded-full cursor-pointer peer-checked:bg-cyan-600 transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:w-4 after:h-4 after:rounded-full after:transition-all peer-checked:after:left-7"></label>
                 </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-slate-800/50">
                 <div>
                    <label className="text-sm font-medium text-slate-200">Deep Packet Inspection</label>
                    <p className="text-xs text-slate-500">Enable WASM-based payload analysis (High CPU Usage)</p>
                 </div>
                 <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                    <input type="checkbox" id="toggle2" className="peer absolute opacity-0 w-0 h-0" defaultChecked />
                    <label htmlFor="toggle2" className="block w-12 h-6 bg-slate-700 rounded-full cursor-pointer peer-checked:bg-cyan-600 transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:w-4 after:h-4 after:rounded-full after:transition-all peer-checked:after:left-7"></label>
                 </div>
              </div>
           </div>
        </div>

        {/* Section 2 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
           <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Bell className="mr-2 text-amber-400" size={20} /> Notifications
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800/50">
                   <label className="block text-sm font-medium text-slate-300 mb-2">Alert Email</label>
                   <input type="email" defaultValue="admin@sentinel.sys" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
               </div>
               <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800/50">
                   <label className="block text-sm font-medium text-slate-300 mb-2">Webhook URL</label>
                   <input type="text" placeholder="https://..." className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
               </div>
           </div>
        </div>

        {/* Section 3 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
           <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Monitor className="mr-2 text-purple-400" size={20} /> Display
           </h3>
           <div className="flex space-x-4">
               <button className="flex-1 p-4 bg-slate-800 border-2 border-cyan-500 rounded-lg flex flex-col items-center justify-center opacity-100">
                  <Moon className="mb-2 text-cyan-400" />
                  <span className="text-sm font-medium text-white">Dark High-Contrast</span>
               </button>
               <button className="flex-1 p-4 bg-slate-950 border border-slate-800 rounded-lg flex flex-col items-center justify-center opacity-50 hover:opacity-100 transition-opacity">
                  <Eye className="mb-2 text-slate-400" />
                  <span className="text-sm font-medium text-slate-400">Cyberpunk Neon</span>
               </button>
           </div>
        </div>

        {/* Section 4: Data Management */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 border-l-4 border-l-red-500">
           <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Database className="mr-2 text-red-500" size={20} /> Data Management
           </h3>
           <p className="text-sm text-slate-400 mb-4">
             Manage the local session storage. Clearing history will remove all logs currently in memory.
           </p>
           <div className="flex space-x-4">
               <button 
                 onClick={onClearHistory}
                 className="flex items-center px-4 py-2 bg-red-950/30 text-red-400 border border-red-900/50 rounded-lg hover:bg-red-900/30 transition-colors"
               >
                  <Trash2 size={16} className="mr-2" /> Clear Event History
               </button>
           </div>
        </div>

        <div className="flex justify-end pt-4">
            <button className="flex items-center px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-cyan-500/20">
               <Save size={18} className="mr-2" /> Save Configuration
            </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

