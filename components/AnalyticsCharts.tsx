
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ChartDataPoint, TimeSeriesDataPoint } from '../types';
import { BarChart2, PieChart as PieChartIcon } from 'lucide-react';

interface AnalyticsChartsProps {
  vectorData: ChartDataPoint[];
  trafficData: TimeSeriesDataPoint[];
}

const COLORS = ['#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4'];

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ vectorData, trafficData }) => {
  
  const hasVectorData = vectorData && vectorData.length > 0;
  const hasTrafficData = trafficData && trafficData.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Chart 1: Donut (Vectors) */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 lg:col-span-1 flex flex-col min-h-[400px]">
        <h3 className="text-slate-200 font-semibold mb-6 flex items-center">
           <span className="w-2 h-6 bg-cyan-500 mr-2 rounded-full"></span>
           Attack Vectors
        </h3>
        <div className="w-full h-[300px] relative">
            {hasVectorData ? (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={vectorData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {vectorData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                            itemStyle={{ color: '#f1f5f9' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                    <PieChartIcon size={48} className="mb-2 opacity-20" />
                    <span className="text-sm">No Attack Data Available</span>
                </div>
            )}
        </div>
      </div>

      {/* Chart 2: Stacked Area (Traffic vs Threats) */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 lg:col-span-2 flex flex-col min-h-[400px]">
         <h3 className="text-slate-200 font-semibold mb-6 flex items-center">
           <span className="w-2 h-6 bg-indigo-500 mr-2 rounded-full"></span>
           Traffic vs. Threat Volume
        </h3>
        <div className="w-full h-[300px] relative">
            {hasTrafficData ? (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trafficData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5}/>
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis 
                            dataKey="time" 
                            stroke="#475569" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                            minTickGap={30}
                        />
                        <YAxis 
                            stroke="#475569" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                            tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                        />
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <Tooltip 
                             contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="traffic" 
                            stackId="1" 
                            stroke="#06b6d4" 
                            fill="url(#colorTraffic)" 
                            name="Normal Traffic"
                            animationDuration={1000}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="threats" 
                            stackId="2" 
                            stroke="#ef4444" 
                            fill="url(#colorThreats)" 
                            name="Detected Threats"
                            animationDuration={1000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                    <BarChart2 size={48} className="mb-2 opacity-20" />
                    <span className="text-sm">No Traffic Data Available</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
