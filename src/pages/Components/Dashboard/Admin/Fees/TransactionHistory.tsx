import React, { useState, useEffect } from 'react';
import { HiOutlineDownload, HiOutlineSearch, HiRefresh } from "react-icons/hi";
import api from '../../../../../api/axiosInstance';
import { toast } from 'react-hot-toast';

interface Transaction {
  id: string;
  student_email: string;
  course_name: string;
  date: string;
  amount: string;
  status: string;
}

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/student/admin/transactions');
      toast.success("Transaction logs loaded");
      setTransactions(response.data.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Error loading transaction logs"); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter logic for the search bar
  const filteredData = transactions.filter(txn => 
    txn.student_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transaction Logs</h1>
          <p className="text-gray-500 text-sm">Monitor all incoming and outgoing payments.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by email or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64" 
            />
          </div>
          <button 
            onClick={fetchTransactions}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <HiRefresh className={`text-xl ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
              <th className="px-6 py-4">Payment ID</th>
              <th className="px-6 py-4">Student Email</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">Loading transactions...</td></tr>
            ) : filteredData.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">No transactions found.</td></tr>
            ) : (
              filteredData.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50 transition-colors text-sm">
                  <td className="px-6 py-4 font-mono text-xs text-indigo-600">{txn.id || 'N/A'}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {txn.student_email}
                    <br/><span className="text-[10px] text-gray-400">{txn.course_name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(txn.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800">₹{parseFloat(txn.amount).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${txn.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-indigo-600"><HiOutlineDownload className="text-xl inline" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;