import React, { useState, useEffect } from "react";
import {
  HiOutlineTicket,
  HiOutlineTrash,
  HiPlus,
  HiX,
  HiOutlineCalendar,
} from "react-icons/hi";
import api from "../../../../../api/axiosInstance"; 
import { toast } from "react-hot-toast";
import ConfirmationModal from "../../../Modal/confirmationModal";

interface Coupon {
  id: number;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount: number;
  expiry_date: string;
}

// Inside your component
const ScholarshipDiscounts = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    min_order_amount: "0",
    expiry_date: "",
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/coupons");
      // Important: Fallback to [] if data is missing
      setCoupons(res.data.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setCoupons([]); // Prevent .map() from breaking
      toast.error("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);
 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/admin/coupons", formData);
      toast.success("Coupon created successfully!");
      setIsModalOpen(false);
      setFormData({
        code: "",
        discount_type: "percentage",
        discount_value: "",
        min_order_amount: "0",
        expiry_date: "",
      });
      fetchCoupons();
    } catch (err) {
      console.error("Error creating coupon:", err);
      toast.error("Error creating coupon. Code might already exist.");
    } finally {
      setLoading(false);
    }
  };

  // 1. Updated handler for the trash icon click
const handleDeleteClick = (coupon: Coupon) => {
  setCouponToDelete(coupon);
  setIsDeleteModalOpen(true);
};
const handleDeleteConfirm = async () => {
  if (!couponToDelete) return;
  try {
    await api.delete(`/api/admin/coupons/${couponToDelete.id}`);
    toast.success("Coupon Deleted Successfully");
    fetchCoupons();
  } catch (err) {
    console.error("Error deleting coupon:", err);
    toast.error("Failed to delete coupon");
  } finally {
    setIsDeleteModalOpen(false);
    setCouponToDelete(null);
  }
};
  return (
    <div className=" mx-auto p-2 md:p-4 ">
  {/* 1. HEADER & ACTIONS */}
  <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
    <div className="space-y-1">
      <nav className="text-[10px] font-black text-[#00796b] uppercase tracking-[0.2em] mb-2">
        Incentives & Growth
      </nav>
      <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
        <HiOutlineTicket className="text-[#00796b]" /> 
        Coupon Management
      </h1>
      <p className="text-sm text-slate-400 font-medium">
        Configure and deploy student discount authorization codes.
      </p>
    </div>

    <button
      onClick={() => setIsModalOpen(true)}
      className="bg-[#00796b] hover:bg-[#004d40] text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-teal-100 active:scale-95"
    >
      <HiPlus size={18} /> New Coupon
    </button>
  </div>

  {/* 2. COUPON GRID */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {loading ? (
      <div className="col-span-full flex flex-col items-center justify-center py-24">
        <div className="w-12 h-12 border-4 border-teal-50 border-t-[#00796b] rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black text-[#00796b] uppercase tracking-widest">Auditing active codes...</p>
      </div>
    ) : coupons.length > 0 ? (
      coupons.map((c) => (
        <div
          key={c.id}
          className="bg-white border-2 border-dashed border-teal-100 p-7 rounded-[2rem] relative group hover:border-[#00796b] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-teal-900/5"
        >
          {/* Delete Action */}
          <button
            onClick={() => handleDeleteClick(c)}
            className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl"
          >
            <HiOutlineTrash size={20} />
          </button>

          <div className="text-[10px] font-black text-[#00796b] uppercase tracking-[0.2em] mb-2">
            Authorization Code
          </div>
          <div className="text-3xl font-black text-slate-800 mb-6 tracking-tight">
            {c.code}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-tighter">
              {c.discount_type === "percentage"
                ? `${c.discount_value}% OFF`
                : `₹${c.discount_value} OFF`}
            </span>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-lg">
              Min: ₹{c.min_order_amount}
            </span>
          </div>

          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2 pt-4 border-t border-gray-50">
            <HiOutlineCalendar className="text-teal-500" /> 
            Expiration: {new Date(c.expiry_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
        </div>
      ))
    ) : (
      /* EMPTY STATE */
      <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-gray-50">
        <div className="bg-teal-50 p-6 rounded-[2rem] mb-6">
          <HiOutlineTicket className="text-5xl text-[#00796b]" />
        </div>
        <h3 className="text-xl font-black text-slate-800 tracking-tight">
          No Active Coupons
        </h3>
        <p className="text-slate-400 text-sm mb-8 text-center max-w-xs font-medium">
          Your incentive registry is currently empty. Initialize a new code to drive enrollment velocity.
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-[#00796b] font-black uppercase tracking-[0.2em] text-xs hover:text-[#004d40] flex items-center gap-2 transition-all"
        >
          <HiPlus /> Create your first coupon
        </button>
      </div>
    )}
  </div>

  {/* 3. REFINED CREATE MODAL */}
  {isModalOpen && (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#004d40]/40 backdrop-blur-md p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#00796b]" />
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Create New Coupon</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-slate-300 hover:text-slate-600 transition-all p-2 hover:bg-gray-50 rounded-full"
          >
            <HiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Coupon Code</label>
            <input
              type="text"
              required
              placeholder="E.g. SYSTEM20"
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#00796b] focus:bg-white transition-all font-bold text-slate-700 uppercase tracking-widest placeholder:normal-case"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
              <select
                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#00796b] focus:bg-white transition-all font-bold text-slate-700"
                value={formData.discount_type}
                onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
              >
                <option value="percentage">Percent (%)</option>
                <option value="fixed">Fixed (₹)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Value</label>
              <input
                type="number"
                required
                placeholder="10"
                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#00796b] focus:bg-white transition-all font-bold text-slate-700"
                value={formData.discount_value}
                onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry Date</label>
            <input
              type="date"
              required
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#00796b] focus:bg-white transition-all font-bold text-slate-700"
              value={formData.expiry_date}
              onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00796b] hover:bg-[#004d40] text-white py-4.5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-teal-100 disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? "Initializing..." : "Authorize Coupon"}
          </button>
        </form>
      </div>
    </div>
  )}

   {/* Delete Confirmation Modal */} 
<ConfirmationModal
  isOpen={isDeleteModalOpen}
  title="Revoke Coupon"
  message={`Are you sure you want to delete the code "${couponToDelete?.code}"?.`}
  onConfirm={handleDeleteConfirm}
  onCancel={() => {
    setIsDeleteModalOpen(false);
    setCouponToDelete(null);
  }}
  confirmText="Delete Coupon"
  type="danger"
/>
</div>
  );
};

export default ScholarshipDiscounts;
