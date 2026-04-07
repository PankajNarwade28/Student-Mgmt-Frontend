import { useEffect, useState } from "react";
import api from "../../../../../../api/axiosInstance";
import { toast } from "react-hot-toast";
import { HiOutlineCheck, HiOutlineX, HiOutlineInbox } from "react-icons/hi";

import ConfirmationModal from "../../../../Modal/confirmationModal";

interface CourseRequest {
  id: number;
  student_id: string;
  course_id: number;
  student_name: string;
  student_email: string;
  requested_at: string;
  course_name: string;
}

interface ModalConfig {
  title: string;
  message: string;
  type: "danger" | "warning" | "info" | "success";
  confirmText: string;
  onConfirm: () => Promise<void> | void;
}

const RequestsPage = () => {
  const [requests, setRequests] = useState<CourseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/api/admin/requests?page=${currentPage}&limit=8`,
      );

      if (res.data.success) {
        setRequests(res.data.requests);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Fetch Requests Error:", err);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentPage]);

  const handleActionRequest = (
    req: CourseRequest,
    action: "ACCEPT" | "REJECT",
  ) => {
    setModalConfig({
      title: action === "ACCEPT" ? "Accept Enrollment" : "Reject Request",
      message: `Are you sure you want to ${action.toLowerCase()} ${req.student_name}'s request for ${req.course_name}?`,
      type: action === "ACCEPT" ? "warning" : "danger",
      confirmText: action === "ACCEPT" ? "Accept & Enroll" : "Reject & Delete",
      onConfirm: async () => {
        try {
          await api.post(`/api/admin/requests/${req.id}/decision`, {
            action,
            student_id: req.student_id,
            course_id: req.course_id,
          });
          setRequests((prev) => prev.filter((r) => r.id !== req.id));
          toast.success(`Request ${action.toLowerCase()}ed successfully`);
        } catch (err: unknown) {
          console.error(err);
          toast.error("Action failed");
        } finally {
          setIsModalOpen(false);
        }
      },
    });
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading)
    return (
      <div className="p-4 text-center font-bold">Fetching Requests...</div>
    );

  return (
    <div className="p-2 md:p-2 bg-gray-50/50 min-h-screen ">
  <div className="mx-auto">
    <header className="mb-4">
      <nav className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] mb-2">Internal Requests</nav>
      <h1 className="text-3xl font-black text-slate-800 tracking-tight">Enrollment Approvals</h1>
      <p className="text-slate-400 text-sm font-medium">System review for pending student course entries.</p>
    </header>

    <div className="bg-white shadow-xl shadow-teal-900/5 rounded-[2.5rem] overflow-hidden border border-slate-50">
      <table className="min-w-full divide-y divide-slate-50">
        <thead className="bg-gray-50/50">
          <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <th className="px-6 py-4">Student Information</th>
            <th className="px-6 py-4">Course Target</th>
            <th className="px-6 py-4">Request Timeline</th>
            <th className="px-6 py-4 text-center">System Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {requests.length > 0 ? (
            requests.map((req) => (
              <tr key={req.id} className="hover:bg-teal-50/30 transition-all group">
                <td className="px-4 py-4">
                  <div className="font-bold text-slate-800 tracking-tight text-base group-hover:text-teal-600 transition-colors">
                    {req.student_name}
                  </div>
                  <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    {req.student_email}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-[10px] font-black text-[#00796b] bg-teal-50 px-4 py-1.5 rounded-full inline-block border border-teal-100 uppercase tracking-widest">
                    {req.course_name}
                  </div>
                </td>
                <td className="px-4 py-4 text-[11px] text-slate-400 font-black uppercase">
                  {new Date(req.requested_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 flex justify-center gap-3">
                  <button
                    onClick={() => handleActionRequest(req, "ACCEPT")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95"
                  >
                    <HiOutlineCheck size={14} /> Accept
                  </button>
                  <button
                    onClick={() => handleActionRequest(req, "REJECT")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
                  >
                    <HiOutlineX size={14} /> Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="py-32 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-4">
                    <HiOutlineInbox size={40} />
                  </div>
                  <p className="font-black text-slate-300 uppercase tracking-[0.2em] text-xs">No Pending System Requests</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* PAGINATION NAVIGATION */}
    <div className="mt-4 flex items-center justify-between px-4">
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        Records: <span className="text-slate-800">{requests.length}</span> / Page <span className="text-slate-800">{currentPage}</span>
      </div>

      <div className="flex gap-3">
        <button
          disabled={currentPage === 1 || loading}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white border border-slate-100 rounded-2xl hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
        >
          Previous
        </button>
        <button
          disabled={currentPage === totalPages || loading}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white bg-teal-600 rounded-2xl hover:bg-teal-700 disabled:opacity-30 transition-all shadow-xl shadow-teal-100"
        >
          Next
        </button>
      </div>
    </div>
  </div> 
      {isModalOpen && modalConfig && (
        <ConfirmationModal
          isOpen={isModalOpen}
          title={modalConfig.title}
          message={modalConfig.message}
          type={modalConfig.type}
          confirmText={modalConfig.confirmText}
          onConfirm={modalConfig.onConfirm}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default RequestsPage;
