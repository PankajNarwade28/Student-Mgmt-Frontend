import React, { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  HiOutlineCreditCard, 
  HiOutlineDownload, 
  HiOutlineCheckCircle, 
  HiOutlineExclamationCircle,
  HiOutlineReceiptTax,
  HiOutlineCalendar
} from "react-icons/hi";


const FeesSection: React.FC = () => {
  // Static Data for UI demonstration
  const feeSummary = {
    total: "₹1,20,000",
    paid: "₹80,000",
    remaining: "₹40,000",
    dueDate: "Oct 15, 2026"
  };

  const paymentHistory = [
    { id: "RCP-8821", date: "Aug 12, 2025", amount: "₹40,000", method: "UPI", status: "Paid" },
    { id: "RCP-7742", date: "Jan 05, 2025", amount: "₹40,000", method: "Debit Card", status: "Paid" },
  ];
useEffect(() => {
  toast.success("This is a demo dashboard. Payment functionalities are not active.", {
    duration: 5000,
    position: "top-right",
  });
}, []);
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Fee Dashboard</h1>
          <p className="text-gray-500 text-sm">View your balance, download receipts, and make payments.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95">
          <HiOutlineCreditCard className="text-xl" />
          Pay Remaining Balance
        </button>
      </div>

      {/* 2. Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Course Fee</p>
          <p className="text-2xl font-black text-gray-800 mt-1">{feeSummary.total}</p>
        </div>
        <div className="bg-green-50 p-5 rounded-2xl border border-green-100 shadow-sm">
          <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Total Paid</p>
          <p className="text-2xl font-black text-green-700 mt-1">{feeSummary.paid}</p>
        </div>
        <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 shadow-sm">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Remaining Balance</p>
          <p className="text-2xl font-black text-amber-700 mt-1">{feeSummary.remaining}</p>
        </div>
        <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 shadow-sm">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Next Due Date</p>
          <div className="flex items-center gap-2 mt-1">
            <HiOutlineCalendar className="text-indigo-600" />
            <p className="text-lg font-bold text-indigo-900">{feeSummary.dueDate}</p>
          </div>
        </div>
      </div>

      {/* 3. Important Notice */}
      <div className="bg-blue-600 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        <div className="z-10">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <HiOutlineExclamationCircle className="text-2xl" />
            Scholarship Applied
          </h3>
          <p className="text-blue-100 text-sm mt-1">
            A 10% Merit Scholarship (₹12,000) has been deducted from your total annual tuition fee.
          </p>
        </div>
        <div className="absolute right-[-20px] top-[-20px] opacity-10">
          <HiOutlineReceiptTax className="text-9xl" />
        </div>
      </div>

      {/* 4. Payment History Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] uppercase tracking-wider font-bold text-gray-400">
                <th className="px-6 py-4">Receipt ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paymentHistory.map((history) => (
                <tr key={history.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-indigo-600 font-bold">{history.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{history.date}</td>
                  <td className="px-6 py-4 text-sm font-black text-gray-800">{history.amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{history.method}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-green-600 font-bold text-xs uppercase">
                      <HiOutlineCheckCircle className="text-lg" />
                      {history.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-bold text-sm bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                      onClick={() => alert('Downloading receipt...')}
                    >
                      <HiOutlineDownload className="text-lg" />
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <p className="text-center text-xs text-gray-400">
        In case of any payment discrepancy, please contact the accounts office at <span className="text-indigo-600 font-medium underline">finance@university.edu</span>
      </p>
    </div>
  );
};

export default FeesSection;