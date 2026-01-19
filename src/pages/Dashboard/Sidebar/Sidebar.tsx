import React from 'react';
import { LayoutDashboard, Users, BarChart3, Settings, LogOut, X } from 'lucide-react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';

interface SidebarProps { isOpen: boolean; toggleSidebar: () => void; }

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <LayoutDashboard size={24} /> <span>AdminPanel</span>
        </div>
        <button className="close-btn" onClick={toggleSidebar}><X size={24} /></button>
      </div>
      <nav className="menu">
        <NavLink to="/" className={({isActive}) => isActive ? "menu-item active" : "menu-item"}>
          <LayoutDashboard size={20}/> Dashboard
        </NavLink>
        <NavLink to="/users" className={({isActive}) => isActive ? "menu-item active" : "menu-item"}>
          <Users size={20}/> Users
        </NavLink>
        <NavLink to="/reports" className={({isActive}) => isActive ? "menu-item active" : "menu-item"}>
          <BarChart3 size={20}/> Reports
        </NavLink>
        <NavLink to="/settings" className={({isActive}) => isActive ? "menu-item active" : "menu-item"}>
          <Settings size={20}/> Settings
        </NavLink>
        <NavLink to="/test" className={({isActive}) => isActive ? "menu-item active" : "menu-item"}>
          <LayoutDashboard size={20}/> Test
        </NavLink>
      </nav>
      <div className="sidebar-footer">
        <button className="logout-btn"><LogOut size={20}/> Logout</button>
      </div>
    </aside>
  );
};

export default Sidebar;