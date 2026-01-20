import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  GraduationCap,
  ShieldCheck,
  Database,
  LayoutDashboard,
} from "lucide-react";

const Home: React.FC = () => {
  // Static data representing your ERP modules
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/dashboard"); // Change this path to match your actual dashboard route
  };
  const features = [
    {
      title: "User Management",
      description:
        "Secure authentication system using JWT and Zod validation for Admin, Teacher, and Student roles.",
      icon: <Users className="text-blue-600" size={24} />,
      color: "bg-blue-50",
    },
    {
      title: "Student Records",
      description:
        "Comprehensive database to track student enrollment, counts, and academic performance.",
      icon: <GraduationCap className="text-purple-600" size={24} />,
      color: "bg-purple-50",
    },
    {
      title: "System Security",
      description:
        "Encrypted passwords with bcrypt and strict CORS policies to protect your data.",
      icon: <ShieldCheck className="text-green-600" size={24} />,
      color: "bg-green-50",
    },
    {
      title: "Real-time Analytics",
      description:
        "Live dashboard tracking revenue, growth, and visitor statistics with smooth data fetching.",
      icon: <LayoutDashboard className="text-orange-600" size={24} />,
      color: "bg-orange-50",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-6 lg:p-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            ERP System Overview
          </h1>
          <p className="text-gray-500 mt-1">
            Operational status and system functionality.
          </p>
        </div>
        {/* Updated Button with onClick handler */}
        <button
          onClick={handleRedirect}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md"
        >
          <LayoutDashboard size={18} />{" "}
          {/* Changed icon to Dashboard for better context */}
          Go to Dashboard
        </button>
      </div>

      {/* Stats Quick View (Updated Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-gray-400 text-sm font-medium uppercase">
            Revenue
          </h4>
          <p className="text-2xl font-bold text-gray-800 mt-1">$45,000</p>
          <span className="text-green-500 text-sm font-medium">
            ↑ 12% from last month
          </span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-gray-400 text-sm font-medium uppercase">
            Total Students
          </h4>
          <p className="text-2xl font-bold text-gray-800 mt-1">1,200</p>
          <span className="text-blue-500 text-sm font-medium">
            Active Enrollments
          </span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-gray-400 text-sm font-medium uppercase">
            Visitors
          </h4>
          <p className="text-2xl font-bold text-gray-800 mt-1">8,540</p>
          <span className="text-gray-500 text-sm">Last 24 hours</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-gray-400 text-sm font-medium uppercase">
            Database Health
          </h4>
          <p className="text-2xl font-bold text-green-600 mt-1">Optimal</p>
          <span className="text-gray-500 text-sm">PostgreSQL Connected</span>
        </div>
      </div>

      {/* Functionality Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Core System Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex gap-5 bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div
                className={`flex-shrink-0 w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center`}
              >
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Summary Footnote */}
      <div className="mt-12 p-6 bg-gray-800 rounded-xl text-white flex flex-col md:flex-row items-center gap-6">
        <div className="bg-gray-700 p-3 rounded-full">
          <Database size={24} className="text-blue-400" />
        </div>
        <div className="text-center md:text-left">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Backend Architecture</h4>
            <a
              href="/test"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md active:scale-95 position-relative overflow-hidden mt-2 mb-4 position-relative z-10"
            >
              Go to Test
            </a>
          </div>

          <p className="text-gray-400 text-sm">
            This system uses <strong>InversifyJS</strong> for Dependency Injection, ensuring
            high decoupling between the Controller and PostgreSQL Repositories.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Home;
