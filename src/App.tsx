import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './pages/Dashboard/layout'; 
import { Test } from './pages/Components/Test/Test';
import Main from './pages/Components/Dashboard/Dashboard';
import Reports from './pages/Components/Reports/Reports';
import Settings from './pages/Components/Settings/Settings';
import Users from './pages/Components/Users/Users';
import Login from './pages/Components/Auth/Login/Login';
import ProtectedRoute from './pages/Components/Auth/protectedRoute';
import Signup from './pages/Components/Auth/Signup/Signup'; 

function App() {
  return (
    <BrowserRouter>
  <Routes>
    {/* AUTH PROTECTED GROUP */}
    <Route element={<ProtectedRoute />}>
      {/* Routes that use Layout - only accessible if logged in */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Main />} />
        <Route path="users" element={<Users />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="test" element={<Test />} />
      </Route>
    </Route>

    {/* PUBLIC ROUTES */}
    <Route path="/auth/login" element={<Login />} />
    <Route path="/auth/signup" element={<Signup />} />
  </Routes>
</BrowserRouter>
  );
}

export default App;