import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { HiOutlineUserAdd, HiOutlineUsers, HiOutlineChartBar, HiOutlineDocumentText } from "react-icons/hi";
import DashboardBanner from "../Admin/DashboardBanner";

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Define the content for each tab
  const bannerConfig: Record<string, { title: string; subtitle: string }> = {
    overview: { 
      title: "System Management & User Analytics", 
      subtitle: "System Overview" 
    },
    adduser: { 
      title: "User Onboarding Portal", 
      subtitle: "Add New User" 
    },
    viewuser: { 
      title: "User Directory & Management", 
      subtitle: "View All Users" 
    },
    addcourse: { 
      title: "Curriculum Management", 
      subtitle: "Add New Course" 
    },
    courses: { 
      title: "Course Catalog & Analytics", 
      subtitle: "View All Courses" 
    },
  };

  // 2. Determine the active key from the URL
  const pathParts = location.pathname.split("/");
  const lastPart = pathParts[pathParts.length - 1];
  // Default to 'overview' if the path is just '/admin'
  const activeTabKey = lastPart === "admin" || !lastPart ? "overview" : lastPart;

  const currentBanner = bannerConfig[activeTabKey] || bannerConfig.overview;

  const isActive = (path: string) => {
    if (path === "overview") {
      return location.pathname.endsWith("/admin") || location.pathname.includes("overview");
    }
    return location.pathname.includes(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dynamic Banner based on the activeTabKey */}
      <DashboardBanner 
        title={currentBanner.title} 
        subtitle={currentBanner.subtitle}
        registryId="4029-AD"
        region="Central Hub"
      />

      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-white">
          <div className="flex overflow-x-auto scrollbar-hide">
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
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all border-b-2 -mb-[1px] whitespace-nowrap
                  ${isActive(tab.id) 
                    ? "border-teal-600 text-teal-600 bg-teal-50/30" 
                    : "border-transparent text-gray-400 hover:text-teal-600 hover:bg-gray-50"}`}
              >
                <span className="text-lg">{tab.icon}</span> 
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Admin;