import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  HiOutlineCreditCard,
  HiOutlineDownload,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineReceiptTax,
} from "react-icons/hi";
import { HiArrowPath, HiOutlineShieldCheck } from "react-icons/hi2";
import api from "../../../../api/axiosInstance"; // Adjust path to your axios instance

interface FeeData {
  razorpay_payment_id: string; // Add this field to store payment ID
  student_email: string; // Add this field for receipt naming
  enrollment_id: number;
  course_name: string;
  total_fee: string;
  payment_status: "Paid" | "Pending";
}

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string; // Default to your test key for development
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void | Promise<void>;
  prefill: {
    name: string;
    email: string;
  };
  theme: { color: string };
  modal: {
    ondismiss: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

const FeesSection: React.FC = () => {
  const [fees, setFees] = useState<FeeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const loadRazorpayScript = () => {
  return new Promise<boolean>((resolve) => {
    // prevent duplicate loading
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.id = "razorpay-script";
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

  // 1. Fetch Dynamic Data from your new feeRoutes.ts
  const fetchFees = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/student/my-fees");
      setFees(response.data.data);
    } catch (error) {
      console.error("Error fetching fee data:", error);
      toast.error("Failed to load fee information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handlePayment = async (enrollmentId: number, amount: string) => {
  try {
    setProcessingId(enrollmentId);

    // ✅ LOAD SCRIPT ONLY WHEN USER CLICKS
    const isLoaded = await loadRazorpayScript();

    if (!isLoaded) {
      toast.error("Payment gateway failed to load");
      return;
    }

    // ✅ CREATE ORDER FROM BACKEND
    const response = await api.post("/api/student/create-order", {
      amount: Number(amount),
    });

    const orderData = response.data.order;

    const options: RazorpayOptions = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Modern College Portal",
      description: "Course Fee Payment",
      order_id: orderData.id,

      handler: async (response: RazorpayPaymentResponse) => {
        try {
          const verifyRes = await api.post("/api/student/verify-payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            enrollmentId,
            amount,
          });

          if (verifyRes.data.success) {
            toast.success("Payment successful!");
            fetchFees();
          }
        } catch (err) {
          console.error(err);
          toast.error("Verification failed");
        }
      },

      prefill: {
        name: "Pankaj Narwade",
        email: "pankaj@mail.com",
      },

      theme: { color: "#00796b" },

      modal: {
        ondismiss: () => {
          toast("Payment cancelled");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (error) {
    console.error("Payment setup failed:", error);
    toast.error("Initialization failed");
  } finally {
    setProcessingId(null);
  }
};

  const handleDownloadReceipt = async (paymentId: string) => {
  if (!paymentId) {
    toast.error("Receipt not available yet.");
    return;
  }

  try {
    toast.loading("Preparing receipt...", { id: "download-receipt" });

    const response = await api.get(`/api/student/invoice/${paymentId}`, {
      responseType: 'blob', // Critical for PDF files
    });

    // Create a URL for the PDF blob
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    
    // Create temporary link to trigger download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Receipt_${paymentId}.pdf`);
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success("Receipt downloaded!", { id: "download-receipt" });
  } catch (error) {
    console.error("Download error:", error);
    toast.error("Failed to download receipt.", { id: "download-receipt" });
  }
};

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <HiArrowPath className="text-4xl text-indigo-600 animate-spin" />
        <p className="text-gray-500 animate-pulse">
          Loading financial records...
        </p>
      </div>
    );
  }

  return (
    <div className=" mx-auto p-4 md:p-6 space-y-10  ">
  {/* 1. COMPACT HEADER */}
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
    <div className="space-y-1">
      <nav className="text-[10px] font-black text-[#00796b] uppercase tracking-[0.2em] mb-2">
        Financial Obligations
      </nav>
      <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tighter flex items-center gap-3">
        <HiOutlineReceiptTax className="text-[#00796b]" /> Course Payments
      </h1>
      <p className="text-slate-400 text-sm font-medium">
        Audit your tuition ledger and finalize enrollment locks.
      </p>
    </div>
  </div>

  {/* 2. OPERATIONAL FEE REGISTRY */}
  <div className="space-y-4">
    <div className="flex items-center gap-4 mb-6">
       <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">
          Active Fee Ledger
       </h2>
       <div className="h-[1px] w-full bg-slate-100"></div>
    </div>

    {fees.length === 0 ? (
      <div className="bg-white border-4 border-dashed border-slate-50 rounded-[3rem] p-20 text-center">
        <HiOutlineExclamationCircle className="mx-auto text-5xl text-slate-200 mb-2" />
        <p className="text-slate-300 font-black text-xs uppercase tracking-[0.2em]">
          No pending financial records detected.
        </p>
      </div>
    ) : (
      fees.map((item) => (
        <div
          key={item.enrollment_id}
          className={`group bg-white p-5 rounded-[2rem] border transition-all flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl shadow-teal-900/5 hover:shadow-teal-900/10 ${
            item.payment_status === "Paid"
              ? "border-emerald-100/50"
              : "border-slate-100 hover:border-teal-200"
          }`}
        >
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div
              className={`p-2 rounded-2xl shadow-inner transition-colors ${
                item.payment_status === "Paid" 
                ? "bg-emerald-50 text-emerald-600" 
                : "bg-teal-50 text-[#00796b]"
              }`}
            >
              <HiOutlineReceiptTax size={28} />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-lg tracking-tight group-hover:text-[#00796b] transition-colors">
                {item.course_name}
              </h3>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">
                Valuation: <span className="text-slate-600">₹{parseFloat(item.total_fee).toLocaleString("en-IN")}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {item.payment_status === "Paid" ? (
              <div className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-100 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm">
                <HiOutlineCheckCircle size={16} />
                Registry Locked
              </div>
            ) : (
              <button
                onClick={() => handlePayment(item.enrollment_id, item.total_fee)}
                disabled={processingId === item.enrollment_id}
                className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#00796b] hover:bg-[#004d40] text-white px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-teal-100 active:scale-95 disabled:opacity-50"
              >
                {processingId === item.enrollment_id ? (
                  <HiArrowPath className="animate-spin text-lg" />
                ) : (
                  <>
                    <HiOutlineCreditCard size={18} className="text-teal-300" />
                    Authorize Payment
                  </>
                )}
              </button>
            )}

            {item.payment_status === "Paid" && (
              <button 
                onClick={() => handleDownloadReceipt(item.razorpay_payment_id)}
                className="p-3.5 text-slate-400 hover:text-[#00796b] hover:bg-teal-50 border border-slate-100 rounded-xl transition-all shadow-sm bg-white active:scale-90" 
                title="Download Audit Receipt"
              >
                <HiOutlineDownload size={22} />
              </button>
            )}
          </div>
        </div>
      ))
    )}
  </div>

  {/* 3. SYSTEM POLICY DISCLOSURE */}
  <div className="bg-[#004d40] rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-start md:items-center gap-8 relative overflow-hidden shadow-2xl shadow-teal-900/20">
    {/* Abstract Background Detail */}
    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
    
    <div className="p-4 bg-white/10 rounded-[1.5rem] backdrop-blur-md border border-white/10">
        <HiOutlineShieldCheck className="text-4xl text-teal-300" />
    </div>

    <div className="z-10 flex-1">
      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-teal-400 mb-2">Operational Protocol</h3>
      <p className="text-teal-50 text-sm leading-relaxed font-medium">
        Successful transaction processing triggers an <span className="text-white font-black">Enrollment Lock</span>. 
        Module state becomes immutable; adjustments or curriculum withdrawal will be restricted until the 
        conclusion of the current academic audit cycle.
      </p>
    </div>
    
    <HiOutlineReceiptTax className="absolute right-[-30px] bottom-[-30px] text-[12rem] opacity-5 rotate-12 pointer-events-none" />
  </div>

  <div className="pt-4 flex flex-col items-center gap-2">
    <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.4em]">
      Secure Encryption Active • Unified Financial Hub v4.2.0
    </p>
  </div>
</div>
  );
};

export default FeesSection;
