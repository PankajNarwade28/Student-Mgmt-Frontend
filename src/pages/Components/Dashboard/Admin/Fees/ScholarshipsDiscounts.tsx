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

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await api.delete(`/api/admin/coupons/${id}`);
      toast.success("Coupon deleted");
      fetchCoupons();
    } catch (err) {
      console.error("Error deleting coupon:", err);
      toast.error("Failed to delete coupon");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <HiOutlineTicket className="text-indigo-600" /> Coupon Management
          </h1>
          <p className="text-gray-500 text-sm">
            Create and manage student discount codes.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-100"
        >
          <HiPlus /> New Coupon
        </button>
      </div>

      {/* Coupon Grid */}
      {/* Coupon Grid / Managed Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading Shimmer or Text
          <div className="col-span-full text-center py-20 text-gray-400 animate-pulse">
            Checking for active coupons...
          </div>
        ) : coupons.length > 0 ? (
          // Map through coupons if they exist
          coupons.map((c) => (
            <div
              key={c.id}
              className="bg-white border-2 border-dashed border-indigo-200 p-6 rounded-2xl relative group hover:border-indigo-400 transition-all"
            >
              <button
                onClick={() => handleDelete(c.id)}
                className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
              >
                <HiOutlineTrash className="text-xl" />
              </button>

              <div className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">
                Code
              </div>
              <div className="text-2xl font-black text-gray-800 mb-4">
                {c.code}
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-bold">
                  {c.discount_type === "percentage"
                    ? `${c.discount_value}% OFF`
                    : `₹${c.discount_value} OFF`}
                </span>
                <span className="text-gray-400 text-xs">
                  Min Order: ₹{c.min_order_amount}
                </span>
              </div>

              <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                <HiOutlineCalendar /> Expires:{" "}
                {new Date(c.expiry_date).toLocaleDateString()}
              </div>
            </div>
          ))
        ) : (
          // EMPTY STATE: Shown when coupons.length === 0
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <HiOutlineTicket className="text-4xl text-indigo-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-700">
              No active coupons
            </h3>
            <p className="text-gray-500 text-sm mb-6 text-center max-w-xs">
              You haven't created any discount codes yet. Create one to
              encourage more enrollments!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-2"
            >
              <HiPlus /> Create your first coupon
            </button>
          </div>
        )}
      </div>

     {/* Ensure the parent component wrapping this has the "relative" class */}
{isModalOpen && (
  <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 rounded-2xl">
    {/* 1. "absolute" makes it relative to the parent, not the screen.
        2. "inset-0" stretches it to the parent's edges.
        3. Added "rounded-2xl" to match your parent's card corners if applicable.
    */}
    <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Create New Coupon</h2>
        <button
          onClick={() => setIsModalOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <HiX size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... rest of your form remains the same ... */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Coupon Code
          </label>
          <input
            type="text"
            required
            placeholder="E.g. WELCOME20"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.code}
            onChange={(e) =>
              setFormData({ ...formData, code: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.discount_type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  discount_type: e.target.value,
                })
              }
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value
            </label>
            <input
              type="number"
              required
              placeholder="10"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.discount_value}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  discount_value: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date
          </label>
          <input
            type="date"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.expiry_date}
            onChange={(e) =>
              setFormData({ ...formData, expiry_date: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Coupon"}
        </button>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default ScholarshipDiscounts;
