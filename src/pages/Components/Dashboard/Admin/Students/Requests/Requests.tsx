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
      <div className="p-10 text-center font-bold">Fetching Requests...</div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Enrollment Approvals
          </h1>
          <p className="text-gray-500 text-sm">
            Review pending student course entries.
          </p>
        </header>

        <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Requested On</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.length > 0 ? (
                requests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-gray-50/50 transition-all"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800 tracking-tight">
                        {req.student_name}
                      </div>
                      <div className="text-[10px] font-mono text-gray-400">
                        {req.student_email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl inline-block">
                        {req.course_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-semibold">
                      {new Date(req.requested_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-3">
                      <button
                        onClick={() => handleActionRequest(req, "ACCEPT")}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-bold hover:bg-green-600 hover:text-white transition-all shadow-sm"
                      >
                        <HiOutlineCheck className="w-4 h-4" /> Accept
                      </button>
                      <button
                        onClick={() => handleActionRequest(req, "REJECT")}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm"
                      >
                        <HiOutlineX className="w-4 h-4" /> Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-24 text-center">
                    <div className="flex flex-col items-center opacity-40">
                      <HiOutlineInbox className="w-12 h-12 mb-2" />
                      <p className="font-bold text-gray-800">
                        No Pending Requests
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Navigation */}
        <div className="mt-6 flex items-center justify-between px-2">
          <div className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-bold text-gray-900">{requests.length}</span>{" "}
            requests on page{" "}
            <span className="font-bold text-gray-900">{currentPage}</span>
          </div>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
            >
              Previous
            </button>

            <button
              disabled={currentPage === totalPages || loading}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md shadow-indigo-100"
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
