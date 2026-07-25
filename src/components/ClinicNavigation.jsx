import React from 'react';
import { useClinicAuth } from '../context/ClinicAuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Home, 
  Stethoscope, 
  UserCheck, 
  CalendarPlus, 
  User, 
  ShieldCheck, 
  Globe, 
  Sun, 
  Moon, 
  Bot,
  Sparkles,
  Award
} from 'lucide-react';

export default function ClinicNavigation({ activeTab, setActiveTab, onOpenAI, onOpenAuth }) {
  const { role, switchRole } = useClinicAuth();
  const { lang, setLang, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  return (
    <>
      {/* TOP HEADER BAR */}
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C9.5 2 7.5 3.5 6.5 5.5C5.5 7.5 5 10 5.5 12.5C6 15 7 17.5 8 19.5C8.5 20.5 9.5 22 10.5 22C11.5 22 11.8 20.5 12 19C12.2 20.5 12.5 22 13.5 22C14.5 22 15.5 20.5 16 19.5C17 17.5 18 15 18.5 12.5C19 10 18.5 7.5 17.5 5.5C16.5 3.5 14.5 2 12 2Z" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-wide bg-gradient-to-r from-slate-900 via-cyan-600 to-blue-600 dark:from-white dark:via-cyan-300 dark:to-blue-400 bg-clip-text text-transparent">
                  АКАК ТИШ
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-md border border-cyan-500/20 uppercase">
                  24/7
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                {t('slogan')}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenAI}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-md shadow-cyan-500/20 hover:scale-105 transition-all cursor-pointer"
            >
              <Bot size={16} className="animate-bounce" />
              <span className="hidden md:inline">{t('aiAssistant')}</span>
            </button>

            {/* Role Switcher */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                <span className="capitalize">{role === 'patient' ? 'Пациент' : role === 'doctor' ? 'Врач' : 'Админ'}</span>
              </button>

              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 hidden group-hover:block z-50 animate-fade-in">
                <span className="text-[10px] font-bold text-slate-400 px-3 py-1 block uppercase tracking-wider">
                  Сменить роль:
                </span>
                <button
                  onClick={() => switchRole('patient')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    role === 'patient' ? 'bg-cyan-500/10 text-cyan-600 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <User size={14} />
                  <span>Пациент (Эркин)</span>
                </button>
                <button
                  onClick={() => switchRole('doctor')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    role === 'doctor' ? 'bg-cyan-500/10 text-cyan-600 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <User size={14} />
                  <span>Врач (Д-р Алмаз)</span>
                </button>
                <button
                  onClick={() => switchRole('admin')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    role === 'admin' ? 'bg-cyan-500/10 text-cyan-600 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <ShieldCheck size={14} />
                  <span>Администратор</span>
                </button>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
              {['ru', 'kg', 'en'].map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    lang === l 
                      ? 'bg-cyan-500 text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Dark/Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-700" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 md:hidden px-2 py-1.5 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 p-1.5 transition-all ${
            activeTab === 'home' ? 'text-cyan-600 dark:text-cyan-400 font-bold scale-105' : 'text-slate-500'
          }`}
        >
          <Home size={20} />
          <span className="text-[10px]">Главная</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`flex flex-col items-center gap-1 p-1.5 transition-all ${
            activeTab === 'services' ? 'text-cyan-600 dark:text-cyan-400 font-bold scale-105' : 'text-slate-500'
          }`}
        >
          <Stethoscope size={20} />
          <span className="text-[10px]">Услуги</span>
        </button>

        <button
          onClick={() => setActiveTab('booking')}
          className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/40 -mt-5 hover:scale-110 transition-transform"
        >
          <CalendarPlus size={22} />
        </button>

        <button
          onClick={() => setActiveTab('doctors')}
          className={`flex flex-col items-center gap-1 p-1.5 transition-all ${
            activeTab === 'doctors' ? 'text-cyan-600 dark:text-cyan-400 font-bold scale-105' : 'text-slate-500'
          }`}
        >
          <UserCheck size={20} />
          <span className="text-[10px]">Врачи</span>
        </button>

        <button
          onClick={() => setActiveTab('cabinet')}
          className={`flex flex-col items-center gap-1 p-1.5 transition-all ${
            activeTab === 'cabinet' ? 'text-cyan-600 dark:text-cyan-400 font-bold scale-105' : 'text-slate-500'
          }`}
        >
          <User size={20} />
          <span className="text-[10px]">Кабинет</span>
        </button>
      </div>
    </>
  );
}
