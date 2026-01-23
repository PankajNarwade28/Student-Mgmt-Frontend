import React from 'react';
import { HiOutlineUsers, HiOutlineUserAdd, HiOutlineShieldCheck, HiOutlineDatabase } from 'react-icons/hi';

const AdminPage: React.FC = () => {
  const stats = [
    { label: 'Total Users', value: '1,284', icon: <HiOutlineUsers />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'New This Week', value: '+42', icon: <HiOutlineUserAdd />, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active Admins', value: '5', icon: <HiOutlineShieldCheck />, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'DB Capacity', value: '82%', icon: <HiOutlineDatabase />, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color} text-2xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <h4 className="text-2xl font-bold text-gray-800">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Mock Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">User Growth (Last 7 Days)</h3>
          <div className="h-48 bg-gray-50 rounded-lg flex items-end justify-between p-4 gap-2">
            {[40, 70, 45, 90, 65, 80, 95].map((height, i) => (
              <div key={i} className="w-full bg-indigo-500 rounded-t-sm transition-all hover:bg-indigo-600" style={{ height: `${height}%` }}></div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">System Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: `${item * 30}%` }}></div>
                </div>
                <span className="text-xs text-gray-500">{item * 30}%</span>
              </div>
            ))}
            <p className="text-xs text-gray-400 mt-4 italic">* All systems operational</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;