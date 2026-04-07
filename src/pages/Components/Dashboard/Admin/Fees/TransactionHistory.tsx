import React, { useState, useEffect } from "react";
import { HiOutlineDownload, HiOutlineSearch, HiRefresh } from "react-icons/hi";
import api from "../../../../../api/axiosInstance";
import { toast } from "react-hot-toast";

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
      const response = await api.get("/api/student/admin/transactions");
      toast.success("Transaction logs loaded");
      setTransactions(response.data.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Error loading transaction logs");
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (transactionId: string, studentEmail: string, courseName: string) => {
  try {
    const response = await api.get(`/api/student/invoice/${transactionId}`, {
      responseType: 'blob', 
    });

    // FORCE the type to application/pdf here
    const blob = new Blob([response.data], { type: 'application/pdf' });
    
    // Create the URL
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Explicitly add .pdf extension to the filename
    link.setAttribute('download', `Invoice_${studentEmail}_${courseName}_${transactionId}.pdf`);
    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error("Download error:", error);
    toast.error("Failed to open invoice.");
  }
};

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter logic for the search bar
  const filteredData = transactions.filter(
    (txn) =>
      txn.student_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.id?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
   <div className="mx-auto p-2 md:p-4 ">
  {/* 1. HEADER & ACTIONS */}
  <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
    <div className="space-y-1">
      <nav className="text-[10px] font-black text-[#00796b] uppercase tracking-[0.2em] mb-2">
        Financial Audit
      </nav>
      <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
        Transaction Logs
      </h1>
      <p className="text-sm text-slate-400 font-medium">
        Monitor all incoming and outgoing system payments.
      </p>
    </div>

    <div className="flex items-center gap-3 w-full md:w-auto">
      <div className="relative group flex-1 md:flex-none">
        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00796b] transition-colors" />
        <input
          type="text"
          placeholder="Search by email or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-72 pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-teal-500/5 focus:border-[#00796b] text-sm font-medium transition-all shadow-sm"
        />
      </div>
      <button
        onClick={fetchTransactions}
        className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:border-[#00796b] hover:text-[#00796b] transition-all shadow-sm active:scale-95"
      >
        <HiRefresh className={`text-xl ${loading ? "animate-spin" : ""}`} />
      </button>
    </div>
  </div>

  {/* 2. REGISTRY TABLE */}
  <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-xl shadow-teal-900/5 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-50">
            <th className="px-6 py-4">Payment Reference</th>
            <th className="px-6 py-4">Client Identity</th>
            <th className="px-6 py-4">Audit Date</th>
            <th className="px-6 py-4">Net Amount</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Documents</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {loading ? (
            <tr>
              <td colSpan={6} className="px-8 py-20 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-teal-50 border-t-[#00796b] rounded-full animate-spin" />
                  <span className="text-[10px] font-black text-[#00796b] uppercase tracking-widest">Loading Ledger...</span>
                </div>
              </td>
            </tr>
          ) : filteredData.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                No transaction records detected.
              </td>
            </tr>
          ) : (
            filteredData.map((txn) => (
              <tr
                key={txn.id}
                className="hover:bg-teal-50/30 transition-all group"
              >
                <td className="px-8 py-5">
                  <span className="font-mono text-[11px] font-bold text-[#00796b] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100 group-hover:bg-white transition-colors">
                    {txn.id?.slice(0, 12) || "N/A"}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 tracking-tight group-hover:text-[#00796b] transition-colors">
                      {txn.student_email}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                      {txn.course_name}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="text-xs font-bold text-slate-500">
                    {new Date(txn.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <span className="text-sm font-black text-slate-800 tracking-tight">
                    ₹{parseFloat(txn.amount).toLocaleString('en-IN')}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border shadow-sm ${
                      txn.status === "Paid" 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                        : "bg-amber-50 text-amber-600 border-amber-100"
                    }`}
                  >
                    {txn.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <button
                    onClick={() => downloadInvoice(txn.id, txn.student_email, txn.course_name)}
                    className="p-2.5 text-slate-400 hover:text-[#00796b] hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-teal-100"
                    title="Download Receipt"
                  >
                    <HiOutlineDownload className="text-lg" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>
  );
};

export default TransactionHistory;
