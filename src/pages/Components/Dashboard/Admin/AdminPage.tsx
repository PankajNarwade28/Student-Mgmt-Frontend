import React from 'react';
import { HiOutlineUsers, HiOutlineUserAdd, HiOutlineShieldCheck, HiOutlineDatabase, HiSearch,  HiChevronDown } from 'react-icons/hi';

const AdminPage: React.FC = () => {
  const stats = [
    { id: 'total-users', label: 'TOTAL USERS', value: '1,284', icon: <HiOutlineUsers />, color: 'text-teal-600', bg: 'bg-teal-50' },
    { id: 'new-this-week', label: 'NEW THIS WEEK', value: '+42', icon: <HiOutlineUserAdd />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'active-admins', label: 'ACTIVE ADMINS', value: '5', icon: <HiOutlineShieldCheck />, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'db-capacity', label: 'DB CAPACITY', value: '82%', icon: <HiOutlineDatabase />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-md">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search users or logs..." 
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 outline-none text-sm"
          />
        </div>
        <button className="w-full sm:w-auto px-6 py-2.5 bg-[#00796b] text-white rounded-xl font-semibold flex items-center gap-2 shadow-md">
          Generate Report <HiChevronDown />
        </button>
      </div>

      {/* Grid Layout for Stats and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} text-xl`}>{stat.icon}</div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">{stat.label}</p>
                <h4 className="text-xl font-bold text-gray-800">{stat.value}</h4>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800">Registration Velocity</h3>
            <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-1 rounded">Last 7 Days</span>
          </div>
          <div className="h-48 flex items-end justify-between px-2 gap-3">
            {[45, 60, 40, 85, 55, 75, 90].map((height, i) => (
              <div key={i} className="group relative w-full bg-slate-100 rounded-t-lg transition-all hover:bg-teal-500" style={{ height: `${height}%` }}></div>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;