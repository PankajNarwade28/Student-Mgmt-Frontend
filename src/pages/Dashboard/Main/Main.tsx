import React from 'react';
import './Main.css';

const Main: React.FC = () => {
  return (
    <main className="main-content">
      <div className="header-actions">
        <h1>Dashboard</h1>
        <button className="btn-add">Download CSV</button>
      </div>

      <div className="grid">
        <div className="card"><h4>Revenue</h4><p>$45,000</p></div>
        <div className="card"><h4>Orders</h4><p>1,200</p></div>
        <div className="card"><h4>Visitors</h4><p>8,540</p></div>
        <div className="card"><h4>Growth</h4><p>+14%</p></div>
      </div>
    </main>
  );
};

export default Main;