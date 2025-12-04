import React from 'react';
import { Search, Filter, Siren } from 'lucide-react';
import { clsx } from 'clsx';

interface FilterBarProps {
  breachOnly: boolean;
  setBreachOnly: (val: boolean) => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ breachOnly, setBreachOnly, searchTerm, setSearchTerm }) => {
  return (
    <div className={clsx(
      "sticky top-0 z-30 mb-6 p-4 rounded-xl border transition-all duration-300 flex flex-col md:flex-row gap-4 items-center justify-between",
      breachOnly 
        ? "bg-red-950/10 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)] backdrop-blur-xl" 
        : "bg-slate-900/80 border-slate-800 backdrop-blur-xl"
    )}>
      
      {/* Search Input */}
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input 
          type="text" 
          placeholder="Search IP, URL, or Payload..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg pl-10 pr-4 py-2 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none font-mono placeholder:font-sans"
        />
      </div>

      {/* Investigator Controls */}
      <div className="flex items-center space-x-4 w-full md:w-auto justify-end">
        <div className="flex items-center space-x-2">
           <span className={clsx("text-xs font-bold uppercase tracking-wider transition-colors", breachOnly ? "text-red-500" : "text-slate-500")}>
             {breachOnly ? 'Investigator Mode' : 'Standard View'}
           </span>
           
           {/* Custom Toggle Switch */}
           <button 
             onClick={() => setBreachOnly(!breachOnly)}
             className={clsx(
                "relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900",
                breachOnly ? "bg-red-600 focus:ring-red-500" : "bg-slate-700 focus:ring-cyan-500"
             )}
           >
              <span className={clsx(
                "inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200",
                breachOnly ? "translate-x-7" : "translate-x-1"
              )} />
              {breachOnly && (
                 <Siren size={12} className="absolute left-2 text-white animate-pulse" />
              )}
           </button>
        </div>
        
        <button className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700">
           <Filter size={18} />
        </button>
      </div>
    </div>
  );
};

export default FilterBar;