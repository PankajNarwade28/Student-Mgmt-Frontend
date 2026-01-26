import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  HiOutlineUserAdd,
  HiOutlineUsers,
  HiOutlineChartBar,
  HiOutlineDocumentText,
} from "react-icons/hi";

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Updated logic: Highlights 'overview' if the path is exactly /admin or contains 'overview'
  const isActive = (path: string) => {
    if (path === "overview") {
      return (
        location.pathname.endsWith("/admin") ||
        location.pathname.endsWith("/admin/") ||
        location.pathname.includes("overview")
      );
    }
    return location.pathname.includes(path);
  };

  const getTabStyle = (path: string) => `
    flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all border-b-2 -mb-[1px]
    ${
      isActive(path)
        ? "border-slate-800 text-indigo-600 bg-indigo-50/50 font-semibold"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }
  `;

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* 1. Top Navigation Tabs */}
     <div className="border-b border-gray-200 bg-white">
  <div className="flex flex-col min-[786px]:flex-row min-[786px]:items-center px-2 min-[786px]:px-4">
    {/* - grid-cols-2: Shows 2 tabs per row on mobile/small screens.
      - min-[786px]:flex: Switches to a single row for tablet/desktop.
    */}
    <div className="grid grid-cols-2 gap-2 w-full py-3 min-[786px]:flex min-[786px]:flex-row min-[786px]:overflow-x-auto min-[786px]:gap-1 min-[786px]:py-0">
      
      {[
        { id: "overview", label: "Overview", icon: <HiOutlineChartBar /> },
        { id: "adduser", label: "Add New User", icon: <HiOutlineUserAdd /> },
        { id: "viewuser", label: "View All Users", icon: <HiOutlineUsers /> },
        { id: "addcourse", label: "Add New Course", icon: <HiOutlineDocumentText /> },
        { id: "courses", label: "View All Courses", icon: <HiOutlineDocumentText /> },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => navigate(tab.id === "overview" ? "" : tab.id)}
          className={`${getTabStyle(tab.id)} 
            flex items-center justify-center min-[786px]:justify-start transition-all whitespace-nowrap hover:cursor-pointer
            
            /* Mobile/Small Screen: 2 per row blocks */
            rounded-lg min-[786px]:rounded-none min-[786px]:border-b-2
            
            /* 1181px Responsiveness: Font & Spacing */
            gap-2 min-[1181px]:gap-3 
            px-3 min-[1181px]:px-4 
            py-3 min-[786px]:py-4
            text-xs min-[1181px]:text-sm font-medium
            
            hover:bg-gray-50 min-[786px]:hover:bg-transparent shrink-0`}
        >
          <span className="text-lg min-[1181px]:text-xl shrink-0">{tab.icon}</span>
          <span className="truncate">{tab.label}</span>
        </button>
      ))}
      
    </div>
  </div>
</div>

      {/* 2. Bottom Content Area */}
      <div className="p-6 bg-gray-50/30">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
