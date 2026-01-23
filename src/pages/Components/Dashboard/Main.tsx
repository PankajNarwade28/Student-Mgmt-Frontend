import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineShieldCheck,
  HiOutlineClipboardList,
  HiOutlineAcademicCap,
  HiOutlineChartBar,
  HiOutlineArrowRight,
} from "react-icons/hi";

const Main: React.FC = () => {
  const navigate = useNavigate();
  const [role] = useState<string | null>(() =>
    localStorage.getItem("userRole"),
  );
  const [activeTab, setActiveTab] = useState("overview");

  const getTabStyle = (tabId: string) => `
    flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all border-b-2 -mb-[1px]
    ${
      activeTab === tabId
        ? "border-slate-800 text-slate-900 font-semibold"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }
  `;

  return (
    <div className="dashboard-container p-6 bg-gray-50  min-h-screen  ">
      <div className="mb-6 flex justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Hello, {role || "User"}!{" "}
           
        </h1>
        <span className="text-gray-500 flex items-center gap-2">
            Access Level:{" "}
            <span className="font-semibold text-indigo-600 border border-indigo-600 rounded-md px-2 py-1">{role}</span>
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Tab Navigation - Only for general views */}
        <div className="flex items-center border-b border-gray-200 px-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={getTabStyle("overview")}
          >
            <HiOutlineHome className="text-xl" /> Overview
          </button>

          {role === "Teacher" && (
            <button
              onClick={() => setActiveTab("classes")}
              className={getTabStyle("classes")}
            >
              <HiOutlineAcademicCap className="text-xl" /> My Classes
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* 1. Statistics Cards */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Quick Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 border border-gray-100 rounded-lg bg-blue-50/50">
                    <p className="text-sm text-blue-600 font-medium uppercase">
                      Active Sessions
                    </p>
                    <p className="text-3xl font-bold text-gray-800">12</p>
                  </div>
                  <div className="p-5 border border-gray-100 rounded-lg bg-green-50/50">
                    <p className="text-sm text-green-600 font-medium uppercase">
                      Pending Tasks
                    </p>
                    <p className="text-3xl font-bold text-gray-800">04</p>
                  </div>
                  <div className="p-5 border border-gray-100 rounded-lg bg-purple-50/50">
                    <p className="text-sm text-purple-600 font-medium uppercase">
                      Notifications
                    </p>
                    <p className="text-3xl font-bold text-gray-800">07</p>
                  </div>
                </div>
              </div>

              {/* 2. Admin Quick Actions (Separate from tabs) */}
              {role === "Admin" && (
                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Admin Management Tools
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => navigate("/dashboard/admin")}
                      className="flex hover:cursor-pointer items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-slate-800 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-100 rounded-lg text-slate-700 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                          <HiOutlineShieldCheck className="text-2xl" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-gray-800">
                            Manage Users
                          </p>
                          <p className="text-xs text-gray-500">
                            Edit permissions, add members, or delete accounts
                          </p>
                        </div>
                      </div>
                      <HiOutlineArrowRight className="text-gray-300 group-hover:text-slate-800 transition-colors" />
                    </button>

                    <button
                      onClick={() => navigate("/dashboard/admin/logs")}
                      className="flex hover:cursor-pointer items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-slate-800 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-100 rounded-lg text-slate-700 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                          <HiOutlineClipboardList className="text-2xl" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-gray-800">System Logs</p>
                          <p className="text-xs text-gray-500">
                            View security audits and system activity history
                          </p>
                        </div>
                      </div>
                      <HiOutlineArrowRight className="text-gray-300 group-hover:text-slate-800 transition-colors" />
                    </button>

                    <button
                      onClick={() => navigate("/dashboard/admin/addcourse")}
                      className="flex hover:cursor-pointer items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-slate-800 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-100 rounded-lg text-slate-700 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                          <HiOutlineClipboardList className="text-2xl" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-gray-800">Courses</p>
                          <p className="text-xs text-gray-500">
                            Manage course offerings and schedules
                          </p>
                        </div>
                      </div>
                      <HiOutlineArrowRight className="text-gray-300 group-hover:text-slate-800 transition-colors" />
                    </button>

                    <button
                      onClick={() => navigate("/dashboard/admin/instructors")}
                      className="flex hover:cursor-pointer items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-slate-800 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-100 rounded-lg text-slate-700 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                          <HiOutlineClipboardList className="text-2xl" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-gray-800">Instructors</p>
                          <p className="text-xs text-gray-500">
                            Manage instructor profiles and assignments
                          </p>
                        </div>
                      </div>
                      <HiOutlineArrowRight className="text-gray-300 group-hover:text-slate-800 transition-colors" />
                    </button>
                  </div>
                </div>
              )}

              {/* 3. Static Placeholder for Charts */}
              <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                <HiOutlineChartBar className="text-4xl mb-2" />
                <p>Detailed activity charts will appear here.</p>
              </div>
            </div>
          )}

          {activeTab === "classes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg shadow-sm">
                <h4 className="font-bold">Computer Networks - Section A</h4>
                <p className="text-sm text-gray-500">
                  Time: 10:00 AM - 11:30 AM
                </p>
              </div>
              <div className="p-4 border rounded-lg shadow-sm">
                <h4 className="font-bold">Web Development - Section C</h4>
                <p className="text-sm text-gray-500">
                  Time: 02:00 PM - 03:30 PM
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
