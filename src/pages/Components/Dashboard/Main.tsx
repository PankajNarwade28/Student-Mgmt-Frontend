import React, { useState } from "react";
import "./Main.css";
import { useNavigate } from "react-router-dom";

const Main: React.FC = () => {
  const navigate = useNavigate();
  // Retrieve the role we stored during login
  const [role] = useState<string | null>(() =>
    localStorage.getItem("userRole"),
  );

  return (
    <div className="dashboard-container">
      <h1>Hello {role || "User"}!</h1>

      <div className="role-badge">
        <br />
        <br />
        <p>
          Your current access level: <strong>{role}</strong>
        </p>
      </div>

      {/* Conditional Rendering based on Role */}
   {role === 'Admin' && (
  <div className="admin-tools">
    <h3>Admin Panel Quick Links</h3>

    <button onClick={() => navigate('/dashboard/admin')}>
      Manage Users
    </button>

    <button onClick={() => navigate('/dashboard/admin/logs')}>
      System Logs
    </button>
  </div>
)}
      

      {role === "Teacher" && (
        <div className="teacher-tools">
          <h3>Teacher Dashboard</h3>
          <button>View My Classes</button>
          <button>Grade Assignments</button>
        </div>
      )}
    </div>
  );
};

export default Main;
