import React from 'react';
import Dashboard from './pages/Dashboard'; // Import the Dashboard component
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      {/* This renders the Dashboard at the root path */}
      <h1>Welcome to the Dashboard Testing Purpose Only</h1>
      <Dashboard />
    </div>
  );
};

export default App;