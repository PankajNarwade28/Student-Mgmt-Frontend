// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Layout from './pages/Dashboard/layout'; 
// import { Test } from './pages/Components/Test/Test';
// import Main from './pages/Components/Dashboard/Dashboard';
// import Reports from './pages/Components/Reports/Reports';
// import Settings from './pages/Components/Settings/Settings';
// import Users from './pages/Components/Users/Users';
// import Login from './pages/Components/Auth/Login/Login';
// import ProtectedRoute from './pages/Components/Auth/protectedRoute';
// import Signup from './pages/Components/Auth/Signup/Signup';  
// import Home from './pages/Dashboard/Home/Home';

// function App() {
//   return (
//     <BrowserRouter>
//   <Routes>
//     {/* AUTH PROTECTED GROUP */}
//     <Route element={<ProtectedRoute />}>
//       {/* Routes that use Layout - only accessible if logged in */}
//       <Route path="/dashboard" element={<Layout />}>
//         <Route index element={<Main />} />
//         <Route path="users" element={<Users />} />
//         <Route path="reports" element={<Reports />} />
//         <Route path="settings" element={<Settings />} />
//         <Route path="test" element={<Test />} />
//       </Route>
//     </Route>

//     {/* PUBLIC ROUTES */}
//     <Route path="/auth/login" element={<Login />} />
//     <Route path="/auth/signup" element={<Signup />} />
//     <Route path="/test" element={<Test />} />
//     <Route path="/" element={<Home />} />
//   </Routes>
// </BrowserRouter>
//   );
// }


// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Dashboard/layout";
import { Test } from "./pages/Components/Test/Test";
import Main from "./pages/Components/Dashboard/Dashboard";
import Reports from "./pages/Components/Reports/Reports";
import Settings from "./pages/Components/Settings/Settings";
import Users from "./pages/Components/Users/Users";
import Login from "./pages/Components/Auth/Login/Login";
import Signup from "./pages/Components/Auth/Signup/Signup";
import ProtectedRoute from "./pages/Components/Auth/protectedRoute";
import Home from "./pages/Dashboard/Home/Home";

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
            <Route
              element={<ProtectedRoute allowedRoles={["Admin"]} />}
            >
              <Route path="users" element={<Users />} />
            </Route>

            {/* ADMIN + TEACHER */}
            <Route
              element={<ProtectedRoute allowedRoles={["Admin", "Teacher"]} />}
            >
              <Route path="reports" element={<Reports />} />
            </Route>

            {/* ALL LOGGED-IN USERS */}
            <Route path="settings" element={<Settings />} />
            <Route path="test" element={<Test />} />
          </Route>
        </Route>

        {/* PUBLIC ROUTES */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
