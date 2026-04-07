import React, { useEffect, useState } from 'react';
import { AreaChart, Area,  YAxis, CartesianGrid, Tooltip, ResponsiveContainer, XAxis } from 'recharts';
import api from '../../../../../api/axiosInstance';
import { HiOutlineTrendingUp } from "react-icons/hi";

const RevenueChart: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/student/admin/revenue-stats');
        // Transform data for Recharts
        const formatted = res.data.data.map((item: { date: string; total_revenue: string }) => ({
          date: new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
          revenue: Number.parseFloat(item.total_revenue)
        }));
        setData(formatted);
      } catch (error) {
        console.error("Error fetching revenue stats:", error);  
        console.error("Failed to fetch revenue stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalRevenue = data.reduce((acc, curr: { revenue: number }) => acc + curr.revenue, 0);

  return (
   <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-xl shadow-teal-900/5 animate-in fade-in duration-500">
  {/* Header Section */}
  <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
    <div>
      <nav className="text-[10px] font-black text-[#00796b] uppercase tracking-[0.2em] mb-2">
        Financial Intelligence
      </nav>
      <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
        <HiOutlineTrendingUp className="text-[#00796b]" />
        Revenue Collection
      </h2>
      <p className="text-sm text-slate-400 font-medium mt-1">Audit of successful course acquisition payments</p>
    </div>
    
    <div className="text-left md:text-right bg-teal-50/50 p-4 rounded-2xl border border-teal-100/50">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rolling 30-Day Total</p>
      <p className="text-3xl font-black text-[#00796b] tracking-tighter">
        ₹{totalRevenue.toLocaleString('en-IN')}
      </p>
    </div>
  </div>

  {/* Chart Container */}
  <div className="h-[320px] w-full">
    {loading ? (
      <div className="h-full flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-teal-50 border-t-[#00796b] rounded-full animate-spin" />
        <span className="text-[10px] font-black text-[#00796b] uppercase tracking-widest text-center">Parsing Ledger Data...</span>
      </div>
    ) : (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00796b" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#00796b" stopOpacity={0.01}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="8 8" 
            vertical={false} 
            stroke="#f1f5f9" 
          />
          
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}}
            dy={15}
            // Format date for better readability if needed
            tickFormatter={(str) => {
               const date = new Date(str);
               return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            }}
          />
          
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}}
            tickFormatter={(value) => value >= 1000 ? `₹${value / 1000}k` : `₹${value}`}
          />
          
          <Tooltip 
            cursor={{ stroke: '#00796b', strokeWidth: 1, strokeDasharray: '4 4' }}
            contentStyle={{ 
              borderRadius: '20px', 
              border: '1px solid #f1f5f9', 
              boxShadow: '0 20px 25px -5px rgba(0, 121, 107, 0.1)',
              padding: '12px 16px'
            }}
            itemStyle={{
              fontSize: '12px',
              fontWeight: '900',
              color: '#0f172a',
              textTransform: 'uppercase'
            }}
            labelStyle={{
              fontSize: '10px',
              fontWeight: '700',
              color: '#64748b',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}
            formatter={(value) => {
              const numericValue = Number(value ?? 0);
              return [`₹${numericValue.toLocaleString('en-IN')}`, 'Collection'];
            }}
          />
          
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#00796b" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorRev)" 
            activeDot={{ 
              r: 6, 
              fill: '#00796b', 
              stroke: '#fff', 
              strokeWidth: 3,
              style: { filter: 'drop-shadow(0 4px 6px rgba(0, 121, 107, 0.2))' }
            }}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    )}
  </div>
  
  {/* Footer Detail */}
  <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-50">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-[#00796b]" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Direct Revenue</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-slate-200" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Target</span>
      </div>
    </div>
    <span className="text-[10px] font-black text-teal-600 bg-teal-50 px-3 py-1 rounded-lg border border-teal-100 uppercase tracking-tighter">
      Real-time Sync Active
    </span>
  </div>
</div>
  );
};

export default RevenueChart;