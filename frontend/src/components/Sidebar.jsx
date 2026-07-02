import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  FileSpreadsheet, 
  UserCircle, 
  LogOut, 
  Menu, 
  X, 
  GraduationCap,
  Mail
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { name: 'Dashboard', path: '/admin-dashboard', icon: LayoutDashboard },
    { name: 'Students', path: '/students', icon: Users },
    { name: 'Mark Attendance', path: '/mark-attendance', icon: CheckSquare },
    { name: 'Reports', path: '/reports', icon: FileSpreadsheet },
    { name: 'Profile', path: '/profile', icon: UserCircle },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  const studentLinks = [
    { name: 'Dashboard', path: '/student-dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/profile', icon: UserCircle },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  const NavContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-white w-64 p-4 border-r border-slate-800">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-4 mb-6">
        <div className="bg-academic-600 p-2.5 rounded-xl shadow-lg shadow-academic-600/30">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">ClassTrack</h1>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Attendance System</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-academic-600 text-white shadow-md shadow-academic-600/20' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`
              }
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-slate-800 pt-4 mt-auto">
        <div className="flex items-center gap-3 px-3 py-3 mb-3 bg-slate-800/50 rounded-xl border border-slate-800">
          <div className="bg-academic-900 h-9 w-9 rounded-full flex items-center justify-center font-bold text-academic-300 text-sm border border-slate-700">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-slate-200">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize truncate">{user?.role} Portal</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-rose-400 hover:bg-rose-950/20 rounded-xl text-sm font-medium transition-colors group"
        >
          <LogOut className="h-5 w-5 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden flex items-center justify-between bg-slate-900 text-white px-4 py-3 w-full border-b border-slate-800 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-academic-500" />
          <span className="font-bold text-lg tracking-tight">ClassTrack</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-shrink-0 h-screen sticky top-0">
        <NavContent />
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <div className="relative flex flex-col w-64 max-w-xs h-full z-50 animate-fade-in-up">
            <NavContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
