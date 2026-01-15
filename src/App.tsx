import React from 'react';
import Dashboard from './pages/Dashboard'; // Import the Dashboard component
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      {/* This renders the Dashboard at the root path */}
      <Dashboard />
    </div>
  );
};

export default App;