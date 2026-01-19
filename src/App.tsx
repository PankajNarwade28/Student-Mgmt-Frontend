import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './pages/Dashboard/layout';
// import Test from './pages/Test/Test';
import { Test } from './pages/Components/Test/Test';
import Main from './pages/Components/Dashboard/Dashboard';
import Reports from './pages/Components/Reports/Reports';
import Settings from './pages/Components/Settings/Settings';
import Users from './pages/Components/Users/Users';
// import Layout from './components/Layout';
// import Main from './components/Main';
// import Users from './components/Users';
// import Reports from './components/Reports';
// import Settings from './components/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="users" element={<Users />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        <Route path='/test' element={<Test />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;