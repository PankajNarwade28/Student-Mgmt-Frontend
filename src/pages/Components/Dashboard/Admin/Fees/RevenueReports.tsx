import React from 'react';
import { HiOutlineTrendingUp, HiOutlineCash, HiOutlineUsers } from "react-icons/hi";

const RevenueReports: React.FC = () => {
  const stats = [
    { label: "Total Revenue", value: "₹12,40,000", icon: <HiOutlineCash />, color: "text-green-600", bg: "bg-green-100" },
    { label: "Pending Fees", value: "₹2,15,000", icon: <HiOutlineTrendingUp />, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Active Payers", value: "842", icon: <HiOutlineUsers />, color: "text-indigo-600", bg: "bg-indigo-100" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Revenue Analytics</h1>
        <p className="text-gray-500 text-sm">Financial overview and collection reports.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color} text-2xl`}>{stat.icon}</div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-20 flex flex-col items-center justify-center text-center">
         <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <HiOutlineTrendingUp className="text-gray-400 text-3xl" />
         </div>
         <h3 className="text-lg font-semibold text-gray-800">Charts coming soon</h3>
         <p className="text-gray-500 max-w-xs">Detailed monthly revenue breakdown and course-wise analytics are being prepared.</p>
      </div>
    </div>
  );
};

export default RevenueReports;