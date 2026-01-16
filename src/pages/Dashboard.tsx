import React from "react";
import "./Dashboard.css";
import { Link } from "react-router";

export const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Student Management System</h1>
          <p className="dashboard-subtitle">
            Production-Style Unified TypeScript Codebase
          </p>
        </div>
        {/* // Inside your component: */}
        <nav>
          <Link to="/">Go to Dashboard</Link>
          <Link to="/test">Go to Test Page</Link>
        </nav>
      </div>
    </div>
  );
};

export default Dashboard;
