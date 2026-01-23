import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Dashboard/layout";
import { Test } from "./pages/Components/Test/Test";
import Main from "./pages/Components/Dashboard/Main";
import Reports from "./pages/Components/Reports/Reports";
import Settings from "./pages/Components/Settings/Settings";
import Users from "./pages/Components/Users/Users";
import Login from "./pages/Components/Auth/Login/Login";
// import Signup from "./pages/Components/Auth/Signup/Signup";
import ProtectedRoute from "./pages/Components/Auth/protectedRoute";
import Home from "./pages/Dashboard/Home/Home";
import AddUser from "./pages/Components/Dashboard/Admin/AddUser/AddUser";
import SystemLogs from "./pages/Components/Dashboard/Admin/SystemLogs/SystemLogs";
import Admin from "./pages/Components/Dashboard/Admin/Admin";
import { Navigate } from "react-router-dom";
import ViewUsers from "./pages/Components/Dashboard/Admin/ViewUser/ViewUser";
import Profile from "./pages/Components/Dashboard/Profile/Profile";
import ViewUser from "./pages/Components/Dashboard/Admin/ViewUser/ViewUser";
import AdminPage from "./pages/Components/Dashboard/Admin/AdminPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ALL AUTHENTICATED USERS */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["Admin", "Teacher", "Student"]} />
          }
        >
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Main />} />

            {/* ADMIN ONLY */}
            <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
              <Route path="users" element={<Users />} />
              {/* <Route path="admin" element={<Admin />} /> */}
              {/* <Route path="admin/adduser" element={<AddUser />} /> */}

              <Route path="admin" element={<Admin />}>
                {/* These will render inside the Admin's <Outlet /> */}
                {/* This is the default page that shows at /admin */}
                {/* The default dashboard page */}
                <Route index element={<AdminPage />} />
                <Route path="adduser" element={<AddUser />} />
                <Route path="viewuser" element={<ViewUser />} />
              </Route>
              <Route path="admin/logs" element={<SystemLogs />} />
              <Route path="admin/viewuser" element={<ViewUsers />} />
            </Route>

            {/* ADMIN + TEACHER */}
            <Route
              element={<ProtectedRoute allowedRoles={["Admin", "Teacher"]} />}
            >
              <Route path="reports" element={<Reports />} />
            </Route>

            {/* ALL LOGGED-IN USERS */}
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="test" element={<Test />} />
          </Route>
        </Route>

        {/* PUBLIC ROUTES */}
        <Route path="/auth/login" element={<Login />} />
        {/* No signup for now */}
        {/* <Route path="/auth/signup" element={<Signup />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
        {/* To redirect immediately to Home  for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
