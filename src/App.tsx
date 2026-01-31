import { BrowserRouter, Routes, Route , Navigate } from "react-router-dom";
import Layout from "./pages/Dashboard/layout";
import { Test } from "./pages/Components/Test/Test";
import Main from "./pages/Components/Dashboard/Main";
import Reports from "./pages/Components/Reports/Reports";
import Settings from "./pages/Components/Settings/Settings";
import Users from "./pages/Components/Users/Users";
import Login from "./pages/Components/Auth/Login/Login"; 
import ProtectedRoute from "./pages/Components/Auth/protectedRoute";
import Home from "./pages/Dashboard/Home/Home";
import AddUser from "./pages/Components/Dashboard/Admin/AddUser/AddUser";
import SystemLogs from "./pages/Components/Dashboard/Admin/SystemLogs/SystemLogs";
import Admin from "./pages/Components/Dashboard/Admin/Admin"; 
import ViewUsers from "./pages/Components/Dashboard/Admin/ViewUser/ViewUser";
import Profile from "./pages/Components/Dashboard/Profile/Profile"; 
import AdminPage from "./pages/Components/Dashboard/Admin/AdminPage";
import AddCourse from "./pages/Components/Dashboard/Admin/AddCourse/AddCourse";
import ViewCourses from "./pages/Components/Dashboard/Admin/ViewCourse/ViewCourse";
import MyCourses from "./pages/Components/Dashboard/Courses/Courses";
import TeacherLogs from "./pages/Components/Dashboard/TeacherLogs/TeacherLogs";
import Instructor from "./pages/Components/Dashboard/Admin/Instructor/Instructor"; 
import Students from "./pages/Components/Dashboard/Admin/Students/Students";
import StudentList from "./pages/Components/Dashboard/Admin/Students/StudentList/StudentList";
import Enrollments from "./pages/Components/Dashboard/Admin/Students/Enrollments/Enrollments";
import Grades from "./pages/Components/Dashboard/Admin/Students/Grades/Grades";
import TeacherGrade from "./pages/Components/Teacher/TeacherGrade";
import AccessCourse from "./pages/Components/Dashboard/Courses/AccessCourse/AccessCourse"; 
import RequestsPage from "./pages/Components/Dashboard/Admin/Students/Requests/Requests";
import EnrollmentStatus from "./pages/Components/Dashboard/Admin/Students/EnrollmentStatus/EnrollmentStatus";
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
                <Route path="viewuser" element={<ViewUsers />} />
                <Route path="addcourse" element={<AddCourse />} />
                <Route path="courses" element={<ViewCourses />} />
              </Route>
              <Route path="admin/students" element={<Students />}>
                {/* The 'index' route renders automatically at /admin/students */}
                <Route index element={<StudentList />} />

                {/* Sub-paths for your tabs */}
                {/* <Route path="list" element={<Students />} /> */}
                <Route
                  path="enroll"
                  element={<Enrollments />}
                />
                <Route
                  path="grades"
                  element={<Grades />}
                /> 
                <Route
                  path="requests"
                  element={<RequestsPage />}
                /> 
                <Route
                  path="enrollment-status"
                  element={<EnrollmentStatus />}
                />
              </Route>
              <Route path="admin/logs" element={<SystemLogs />} />
              <Route path="admin/instructors" element={<Instructor />} />
              {/* <Route path="admin/viewuser" element={<ViewUsers />} /> */}
            </Route>

            {/* ADMIN + TEACHER */}
            <Route
              element={<ProtectedRoute allowedRoles={["Admin"]} />}
            >
              <Route path="reports" element={<Reports />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["Teacher"]} />}>
              <Route path="mycourses/grades/:courseId" element={<TeacherGrade />} />
            </Route>

            {/* Student ONLY */}
            <Route
              element={<ProtectedRoute allowedRoles={["Student", "Teacher"]} />}
            >
              {/* Add student-specific routes here */}
              <Route path="mycourses" element={<MyCourses />} />
              <Route path="mycourses/access/:courseId" element={<AccessCourse />} />
            </Route>

            {/* ALL LOGGED-IN USERS */}
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile onClose={() => {}} />} />
            <Route path="schedule" element={<TeacherLogs />} />
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
