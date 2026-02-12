import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  LayoutDashboard, 
  UserCircle 
} from 'lucide-react';
import { cn } from '@/utils/cn';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: userProfile?.role === 'staff' ? '/staff-dashboard' : '/student-dashboard',
      icon: LayoutDashboard,
      show: true
    },
    {
      label: 'Profile',
      path: '/profile',
      icon: UserCircle,
      show: true
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 glass-panel border-r border-white/10 hidden md:flex flex-col"
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Nexus Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">College Management System</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            item.show && (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 rounded-xl transition-all duration-200 group",
                  location.pathname === item.path 
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-900/20" 
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 mr-3 transition-colors",
                  location.pathname === item.path ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                )} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white uppercase">
              {userProfile?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{userProfile?.name}</p>
              <p className="text-xs text-slate-400 capitalize">{userProfile?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
