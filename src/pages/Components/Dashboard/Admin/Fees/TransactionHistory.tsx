import React from 'react';
import { HiOutlineDownload, HiOutlineSearch } from "react-icons/hi";

const TransactionHistory: React.FC = () => {
  const transactions = [
    { id: "TXN-9012", student: "Arjun Mehta", course: "B.Tech CS", date: "2024-03-20", amount: "₹45,000", status: "Completed" },
    { id: "TXN-9013", student: "Sneha Rao", course: "MBA", date: "2024-03-19", amount: "₹65,000", status: "Pending" },
    { id: "TXN-9014", student: "Rahul Verma", course: "B.Com", date: "2024-03-18", amount: "₹25,000", status: "Completed" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transaction Logs</h1>
          <p className="text-gray-500 text-sm">Monitor all incoming and outgoing payments.</p>
        </div>
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-3 text-gray-400" />
          <input type="text" placeholder="Search transactions..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Student Name</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-gray-50 transition-colors text-sm">
                <td className="px-6 py-4 font-mono text-indigo-600">{txn.id}</td>
                <td className="px-6 py-4 font-medium text-gray-800">{txn.student}<br/><span className="text-[10px] text-gray-400">{txn.course}</span></td>
                <td className="px-6 py-4 text-gray-500">{txn.date}</td>
                <td className="px-6 py-4 font-semibold text-gray-800">{txn.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${txn.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {txn.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-indigo-600"><HiOutlineDownload className="text-xl inline" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;