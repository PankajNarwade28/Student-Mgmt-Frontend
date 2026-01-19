// import React, { useEffect, useState, useCallback } from 'react';
import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import type { SystemStatus } from "../../models/systemStatus";
import "./Test.css";

export const Test: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus>({
    backend: false,
    database: false,
    totalStudents: 0,
    loading: true,
    message: "Initializing...",
  });

 useEffect(() => {
    console.log("I only run once on mount");
  }, []);

  // useEffect(() => {
  //   let isMounted = true;

  //   const fetchData = async () => {  // to refactor
  //     try {
  //       // Inside your useEffect fetchData function
  //       const response = await api.get("/health");
  //       if (isMounted) {
  //         setStatus({
  //           backend: response.data.backend,
  //           database: response.data.database,
  //           totalStudents: response.data.totalStudents,
  //           loading: false,
  //           // This will now show the specific database name error
  //           message: response.data.message,
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Health check failed:", error);
  //       if (isMounted) {
  //         setStatus(() => ({
  //           backend: false, // API is down
  //           database: false, // Assume DB is unreachable
  //           totalStudents: "N/A", // Show N/A on the blue card
  //           loading: false,
  //           message: "Network Error: API Server is unreachable",
  //         }));
  //       }
  //     }
  //   };
  //   fetchData();

  //   return () => {
  //     isMounted = false;
  //   }; // The "Kill Switch"
  // }, []); // Empty array means "Run once on mount"

  useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await api.get("/health");
      setStatus({
        backend: response.data.backend,
        database: response.data.database,
        totalStudents: response.data.totalStudents,
        loading: false,
        message: response.data.message,
      });
    }  catch (error) {
  console.error("Health check failed:", error);

  const axiosError = error as { response?: { status?: number; statusText?: string } };
  const hasStatusCode = !!axiosError.response?.status;

  setStatus({
    backend: hasStatusCode,        // true if status code exists, false otherwise
    database: false,
    totalStudents: "N/A",
    loading: false,
    message: ` ${
      hasStatusCode
        ? `Status Code ${axiosError.response?.status} ${axiosError.response?.statusText || ""}`  // just for Testing Use.
        : "API Server is unreachable"
    }`,
  });
}
  };

  fetchData();
}, []); // runs once on mount

  if (status.loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Connecting to Services...</p>
        </div>
      </div>
    );
  }

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

        {/* Main Grid */}
        <div className="dashboard-grid">
          {/* System Status Card */}
          <div className="status-card">
            <div className="card-header">
              <h2 className="card-title">System Connectivity</h2>
              <div className="status-pulse"></div>
            </div>

            <div className="status-items">
              {/* Backend Status */}
              <div className="status-item">
                <div className="status-info">
                  <div
                    className={`status-dot ${
                      status.backend ? "status-online" : "status-offline"
                    }`}
                  ></div>
                  <span className="status-label">API Server</span>
                </div>
                <span
                  className={`status-badge ${
                    status.backend ? "badge-online" : "badge-offline"
                  }`}
                >
                  {status.backend ? "● ONLINE" : "● OFFLINE"}
                </span>
              </div>

              {/* Database Status */}
              <div className="status-item">
                <div className="status-info">
                  <div
                    className={`status-dot ${
                      status.database ? "status-online" : "status-offline"
                    }`}
                  ></div>
                  <span className="status-label">PostgreSQL Database</span>
                </div>
                <span
                  className={`status-badge ${
                    status.database ? "badge-online" : "badge-offline"
                  }`}
                >
                  {status.database ? "● CONNECTED" : "● DISCONNECTED"}
                </span>
              </div>
            </div>

            {/* Status Message */}
            <div
              className={`status-message ${
                status.backend && status.database
                  ? "message-success"
                  : "message-warning"
              }`}
            >
              <svg
                className="message-icon"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="message-text">{status.message}</p>
            </div>
          </div>

          {/* Students Count Card */}
          <div className="count-card">
            <div className="count-header">
              <h2 className="count-label">Total Enrolled</h2>
              <svg
                className="count-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="count-display">
              <div className="count-number">
                {status.totalStudents.toLocaleString()}
              </div>
              <p className="count-description">Active Students</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="action-container">
          <button
            onClick={() => window.location.reload()}
            className="refresh-button"
          >
            <svg
              className="button-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Refresh Status</span>
          </button>
        </div>
        {/* // Inside your component: */}
      </div>
    </div>
  );
};

export default Test;
