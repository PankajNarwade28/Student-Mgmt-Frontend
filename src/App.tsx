import React from 'react'; 
import Dashboard from './pages//Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import './App.css';
import Test from './pages/Test/Test';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <h1>Welcome to the Dashboard Testing Purpose Only</h1>
        
        <Routes>
          {/* This renders the Dashboard only at the root (/) path */}
          <Route path="/" element={<Dashboard />} />

          {/* This renders the Test page ONLY at the (/test) path */}
          <Route path="/test" element={<Test />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

 