// Navigation.jsx - Responsive Sidebar (Desktop) and Bottom Bar (Mobile)
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { dbService } from '../services/dbService';
import { 
  Home, 
  Search, 
  Clapperboard, 
  Send, 
  PlusSquare, 
  Bell, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  Sun, 
  Moon 
} from 'lucide-react';

export default function Navigation({ onCreateClick }) {
  const { currentUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadMsgs, setUnreadMsgs] = useState(0);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  // Subscribe to messages count
  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = dbService.subscribeToConversations(currentUser.uid, (conversations) => {
      let count = 0;
      conversations.forEach(c => {
        if (c.unreadCount && c.unreadCount[currentUser.uid]) {
          count += c.unreadCount[currentUser.uid];
        }
      });
      setUnreadMsgs(count);
    });
    return unsubscribe;
  }, [currentUser]);

  // Subscribe to notifications count
  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = dbService.subscribeToNotifications(currentUser.uid, (notifications) => {
      const count = notifications.filter(n => !n.read).length;
      setUnreadNotifs(count);
    });
    return unsubscribe;
  }, [currentUser]);

  if (!currentUser) return null;

  const activeClass = "flex items-center gap-4 p-3 rounded-xl bg-brand/10 text-brand font-semibold transition-all duration-200";
  const inactiveClass = "flex items-center gap-4 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-medium transition-all duration-200";

  return (
    <>
      {/* --- DESKTOP SIDEBAR (md and up) --- */}
      <aside className="hidden md:flex flex-col justify-between fixed top-0 left-0 h-screen w-64 border-r border-theme-lightBorder dark:border-theme-darkBorder bg-theme-lightCard dark:bg-theme-darkCard p-6 z-40 transition-colors duration-200">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2 px-2 cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-brand to-instagram-pink bg-clip-text text-transparent">
              Blogger Osh
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            <NavLink to="/" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              <Home size={22} />
              <span>Главная</span>
            </NavLink>

            <NavLink to="/search" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              <Search size={22} />
              <span>Поиск</span>
            </NavLink>

            <NavLink to="/reels" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              <Clapperboard size={22} />
              <span>Reels</span>
            </NavLink>

            <NavLink to="/direct" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              <div className="relative">
                <Send size={22} />
                {unreadMsgs > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadMsgs}
                  </span>
                )}
              </div>
              <span>Сообщения</span>
            </NavLink>

            <button 
              onClick={onCreateClick} 
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-medium transition-all duration-200 text-left w-full"
            >
              <PlusSquare size={22} />
              <span>Создать</span>
            </button>

            <NavLink to="/notifications" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              <div className="relative">
                <Bell size={22} />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
                    {unreadNotifs}
                  </span>
                )}
              </div>
              <span>Уведомления</span>
            </NavLink>

            {currentUser.isAdmin && (
              <NavLink to="/admin" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
                <ShieldCheck size={22} className="text-yellow-500" />
                <span className="text-yellow-600 dark:text-yellow-400 font-semibold">Админка</span>
              </NavLink>
            )}

            <NavLink to={`/profile/${currentUser.uid}`} className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              <img 
                src={currentUser.photoURL} 
                alt={currentUser.displayName} 
                className="w-6 h-6 rounded-full object-cover ring-2 ring-brand/50"
              />
              <span>Профиль</span>
            </NavLink>

            <NavLink to="/settings" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              <Settings size={22} />
              <span>Настройки</span>
            </NavLink>
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col gap-2 pt-4 border-t border-theme-lightBorder dark:border-theme-darkBorder">
          {/* Theme Toggler */}
          <button 
            onClick={toggleTheme} 
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-medium transition-all duration-200 text-left"
          >
            {isDark ? <Sun size={22} className="text-yellow-500" /> : <Moon size={22} />}
            <span>{isDark ? 'Светлая тема' : 'Темная тема'}</span>
          </button>

          {/* Logout */}
          <button 
            onClick={logout} 
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 font-medium transition-all duration-200 text-left w-full"
          >
            <LogOut size={22} />
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      {/* --- MOBILE TOP BAR --- */}
      <header className="md:hidden flex items-center justify-between fixed top-0 left-0 w-full h-14 border-b border-theme-lightBorder dark:border-theme-darkBorder bg-theme-lightCard/90 dark:bg-theme-darkCard/90 backdrop-blur-md px-4 z-40 transition-colors duration-200">
        <span className="text-xl font-black bg-gradient-to-r from-brand to-instagram-pink bg-clip-text text-transparent">
          Blogger Osh
        </span>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="text-slate-700 dark:text-slate-300 p-1">
            {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />}
          </button>
          
          <button onClick={() => navigate('/notifications')} className="relative text-slate-700 dark:text-slate-300 p-1">
            <Bell size={20} />
            {unreadNotifs > 0 && (
              <span className="absolute top-0 right-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
                {unreadNotifs}
              </span>
            )}
          </button>

          <button onClick={() => navigate('/direct')} className="relative text-slate-700 dark:text-slate-300 p-1">
            <Send size={20} />
            {unreadMsgs > 0 && (
              <span className="absolute top-0 right-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
                {unreadMsgs}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* --- MOBILE BOTTOM NAVIGATION BAR --- */}
      <nav className="md:hidden flex justify-around items-center fixed bottom-0 left-0 w-full h-16 border-t border-theme-lightBorder dark:border-theme-darkBorder bg-theme-lightCard/95 dark:bg-theme-darkCard/95 backdrop-blur-md z-40 transition-colors duration-200 pb-safe">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? "text-brand p-2" : "text-slate-500 dark:text-slate-400 p-2"}
        >
          <Home size={24} />
        </NavLink>

        <NavLink 
          to="/search" 
          className={({ isActive }) => isActive ? "text-brand p-2" : "text-slate-500 dark:text-slate-400 p-2"}
        >
          <Search size={24} />
        </NavLink>

        <button 
          onClick={onCreateClick} 
          className="text-slate-500 dark:text-slate-400 p-2"
        >
          <PlusSquare size={24} />
        </button>

        <NavLink 
          to="/reels" 
          className={({ isActive }) => isActive ? "text-brand p-2" : "text-slate-500 dark:text-slate-400 p-2"}
        >
          <Clapperboard size={24} />
        </NavLink>

        <NavLink 
          to={`/profile/${currentUser.uid}`} 
          className={({ isActive }) => isActive ? "text-brand p-2" : "text-slate-500 dark:text-slate-400 p-2"}
        >
          <img 
            src={currentUser.photoURL} 
            alt={currentUser.displayName} 
            className={`w-6 h-6 rounded-full object-cover ring-2 ${
              location.pathname.startsWith('/profile') ? 'ring-brand' : 'ring-transparent'
            }`}
          />
        </NavLink>
      </nav>
    </>
  );
}
