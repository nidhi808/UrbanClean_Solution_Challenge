import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '00:00', detections: 12, resolved: 8 },
  { time: '04:00', detections: 8, resolved: 15 },
  { time: '08:00', detections: 45, resolved: 20 },
  { time: '12:00', detections: 78, resolved: 42 },
  { time: '16:00', detections: 65, resolved: 58 },
  { time: '20:00', detections: 34, resolved: 65 },
  { time: '24:00', detections: 18, resolved: 45 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-800 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-gray-400 text-xs mb-2 font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-semibold flex items-center gap-2" style={{ color: entry.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AnalyticsChart = () => {
  return (
    <div className="glass-panel p-5">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-base font-bold text-white">System Operations Trend</h2>
          <p className="text-xs text-gray-400 mt-1">Detections vs Resolutions (Last 24h)</p>
        </div>
        <select className="bg-dark-800 border border-white/10 text-xs text-gray-300 rounded-lg px-3 py-1.5 outline-none focus:border-brand-blue/50">
          <option>Today</option>
          <option>Last 7 Days</option>
          <option>This Month</option>
        </select>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorDetections" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="rgba(255,255,255,0.2)" 
              fontSize={11} 
              tickMargin={10} 
              axisLine={false}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.2)" 
              fontSize={11} 
              tickMargin={10} 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="detections" 
              name="New Detections"
              stroke="#8b5cf6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorDetections)" 
            />
            <Area 
              type="monotone" 
              dataKey="resolved" 
              name="Issues Resolved"
              stroke="#10b981" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorResolved)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;
