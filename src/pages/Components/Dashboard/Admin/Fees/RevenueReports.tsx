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
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <HiOutlineTrendingUp className="text-indigo-600" />
            Revenue Collection
          </h2>
          <p className="text-sm text-gray-500">Daily breakdown of successful course payments</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-gray-400 uppercase">Total (30 Days)</p>
          <p className="text-2xl font-black text-indigo-600">₹{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="h-[300px] w-full">
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-400">Loading chart...</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: '#9ca3af'}}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: '#9ca3af'}}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                formatter={(value) => {
                  const numericValue = Array.isArray(value) ? Number(value[0]) : Number(value ?? 0);
                  return [`₹${numericValue.toLocaleString()}`, 'Revenue'];
                }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#4f46e5" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRev)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;