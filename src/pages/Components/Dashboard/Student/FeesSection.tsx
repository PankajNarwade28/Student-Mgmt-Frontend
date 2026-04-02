import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  HiOutlineCreditCard,
  HiOutlineDownload,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineReceiptTax,
} from "react-icons/hi";
import { HiArrowPath } from "react-icons/hi2";
import api from "../../../../api/axiosInstance"; // Adjust path to your axios instance

interface FeeData {
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

      // 1. You've already got this part working!
      const response = await api.post("/api/student/create-order", {
        amount: Number(amount),
      });
      const orderData = response.data.order;
      console.log(
        "Razorpay Key being used:",
        import.meta.env.VITE_RAZORPAY_KEY_ID,
      );
      // 2. This is the part that "calls" Razorpay to show the UI
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Test Key ID
        amount: orderData.amount, // 1245000 (paise)
        currency: orderData.currency,
        name: "Modern College Portal",
        description: "Course Fee Payment",
        order_id: orderData.id, // This is order_SYBr3808eCjsHm from your screenshot
        handler: async (response: RazorpayPaymentResponse) => {
          // This runs after student pays successfully
          try {
            console.log("Razorpay Response:", response); // Look at this in Browser Console

            const verifyRes = await api.post("/api/student/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              enrollmentId: enrollmentId,
              amount: amount,
            });

            if (verifyRes.data.success) {
              toast.success("Payment successful! Enrollment Locked.");
              fetchFees(); // Refresh your table
            }
          } catch (err) {
            console.error("Payment verification failed:", err);
            toast.error("Signature verification failed.");
          }
        },
        prefill: {
          name: "Pankaj Narwade", // Use dynamic data from your auth state
          email: "pankaj@mail.com",
        },
        theme: { color: "#4f46e5" },
      };

      const rzp = new (
        window as {
          Razorpay: new (options: RazorpayOptions) => { open: () => void };
        }
      ).Razorpay(options as RazorpayOptions);
      rzp.open(); // This command actually opens the modal
    } catch (error) {
      console.error("Payment setup failed:", error);
      toast.error("Initialization failed.");
    } finally {
      setProcessingId(null);
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
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Course Payments</h1>
          <p className="text-gray-500 text-sm">
            Manage your tuition and view enrollment locks.
          </p>
        </div>
      </div>

      {/* 2. Dynamic Course Cards */}
      <div className="grid grid-cols-1 gap-4">
        {fees.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
            <HiOutlineExclamationCircle className="mx-auto text-4xl text-gray-400 mb-2" />
            <p className="text-gray-500">
              No active enrollments found with fees.
            </p>
          </div>
        ) : (
          fees.map((item) => (
            <div
              key={item.enrollment_id}
              className={`bg-white p-6 rounded-2xl border shadow-sm transition-all flex flex-col md:flex-row justify-between items-center gap-4 ${
                item.payment_status === "Paid"
                  ? "border-green-100"
                  : "border-gray-100"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl ${item.payment_status === "Paid" ? "bg-green-50 text-green-600" : "bg-indigo-50 text-indigo-600"}`}
                >
                  <HiOutlineReceiptTax className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">
                    {item.course_name}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    Total Fee: ₹
                    {parseFloat(item.total_fee).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                {item.payment_status === "Paid" ? (
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg font-bold text-sm">
                    <HiOutlineCheckCircle className="text-lg" />
                    Paid & Locked
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      handlePayment(item.enrollment_id, item.total_fee)
                    }
                    disabled={processingId === item.enrollment_id}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50"
                  >
                    {processingId === item.enrollment_id ? (
                      <HiArrowPath className="animate-spin text-xl" />
                    ) : (
                      <>
                        <HiOutlineCreditCard className="text-lg" />
                        Pay Now
                      </>
                    )}
                  </button>
                )}

                {item.payment_status === "Paid" && (
                  <button
                    className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                    title="Download Receipt"
                  >
                    <HiOutlineDownload className="text-xl" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 3. Global Information Notice */}
      <div className="bg-indigo-900 rounded-2xl p-6 text-white flex items-start gap-4 relative overflow-hidden">
        <HiOutlineExclamationCircle className="text-3xl shrink-0" />
        <div className="z-10">
          <h3 className="text-lg font-bold">Important Policy</h3>
          <p className="text-indigo-200 text-sm mt-1 leading-relaxed">
            Once the fee for a specific course is paid, your enrollment is
            permanently locked. You will not be able to change or drop the
            subject until the academic term concludes.
          </p>
        </div>
        <HiOutlineReceiptTax className="absolute right-[-20px] top-[-20px] text-9xl opacity-5 rotate-12" />
      </div>

      <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest font-bold">
        Secure Financial Dashboard • University Management System
      </p>
    </div>
  );
};

export default FeesSection;
