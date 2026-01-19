import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import './Navbar.css';

interface NavbarProps { toggleSidebar: () => void; }

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <button className="hamburger" onClick={toggleSidebar}><Menu size={24} /></button>
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="nav-right">
        <button className="icon-btn"><Bell size={20} /></button>
        <div className="profile-pill">
          <img src="https://ui-avatars.com/api/?name=Admin" alt="user" />
          <span>Admin</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;