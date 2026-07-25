import React, { useState } from 'react';
import { 
  User, 
  CreditCard, 
  Award, 
  Users, 
  Calendar, 
  FileText, 
  Image as ImageIcon, 
  Plus, 
  CheckCircle2, 
  Settings, 
  Moon, 
  Globe, 
  Shield, 
  LogOut,
  Gift
} from 'lucide-react';
import { useClinicAuth } from '../context/ClinicAuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function PatientCabinetPage() {
  const { currentUser, addFamilyMember } = useClinicAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('history'); // 'history' | 'xrays' | 'family' | 'loyalty'
  const [showAddFamily, setShowAddFamily] = useState(false);
  const [famName, setFamName] = useState('');
  const [famRelation, setFamRelation] = useState('Ребенок');

  const handleAddFamily = (e) => {
    e.preventDefault();
    if (!famName.trim()) return;
    addFamilyMember({ name: `${famName} (${famRelation})`, age: 'Новый член семьи', cardNo: `AT-FAM-${Math.floor(Math.random()*900+100)}` });
    setFamName('');
    setShowAddFamily(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6 pb-24">
      {/* Patient Profile Card */}
      <div className="p-6 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-1 shadow-lg shadow-cyan-500/20">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Erkin&backgroundColor=b6e3f4" 
              alt={currentUser.name} 
              className="w-full h-full rounded-[22px] bg-white"
            />
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {currentUser.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-extrabold">
                {currentUser.discountTier}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Медкарта: <span className="font-mono font-bold text-slate-900 dark:text-white">{currentUser.medicalCardNo}</span> • {currentUser.phone}
            </p>
          </div>
        </div>

        {/* Loyalty Balance Badge */}
        <div className="p-4 rounded-2xl bg-gradient-to-tr from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 flex items-center gap-4 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500 text-white flex items-center justify-center font-bold shadow-md shadow-cyan-500/30">
            <Gift size={24} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Бонусные баллы</span>
            <span className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400">
              {currentUser.bonusPoints} Б
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'history' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          История посещений & Записи
        </button>

        <button
          onClick={() => setActiveTab('xrays')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'xrays' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Рентген-снимки & Анализы
        </button>

        <button
          onClick={() => setActiveTab('family')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'family' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Семейный кабинет ({currentUser.familyMembers.length})
        </button>

        <button
          onClick={() => setActiveTab('loyalty')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'loyalty' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Программа лояльности
        </button>
      </div>

      {/* TAB 1: HISTORY & UPCOMING */}
      {activeTab === 'history' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upcoming */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar size={18} className="text-cyan-500" />
              Предстоящие записи
            </h3>

            {currentUser.upcomingAppointments.map(app => (
              <div key={app.id} className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-cyan-600 dark:text-cyan-400">{app.doctorName}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${app.statusColor}`}>{app.status}</span>
                </div>
                <p className="font-bold text-slate-900 dark:text-white">{app.serviceTitle}</p>
                <div className="flex items-center justify-between text-slate-400 pt-1">
                  <span>{app.branchName}</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{app.date} в {app.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Past History */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText size={18} className="text-blue-500" />
              Завершенное лечение
            </h3>

            {currentUser.pastAppointments.map(app => (
              <div key={app.id} className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-1 text-xs">
                <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                  <span>{app.serviceTitle}</span>
                  <span className="text-cyan-500">{app.cost}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400">{app.doctorName} • {app.branchName}</p>
                <p className="text-[10px] text-slate-400">{app.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: X-RAYS */}
      {activeTab === 'xrays' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentUser.xrayScans.map(xray => (
            <div key={xray.id} className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-3">
              <div className="h-44 rounded-2xl overflow-hidden bg-slate-950">
                <img src={xray.url} alt={xray.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">{xray.title}</h4>
                <p className="text-[10px] text-slate-400">Дата снимка: {xray.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: FAMILY PORTAL */}
      {activeTab === 'family' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Users size={18} className="text-cyan-500" />
              Члены семьи в медкарте
            </h3>
            <button
              onClick={() => setShowAddFamily(!showAddFamily)}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={16} /> Добавить члена семьи
            </button>
          </div>

          {showAddFamily && (
            <form onSubmit={handleAddFamily} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex flex-col sm:flex-row gap-3">
              <input 
                type="text"
                value={famName}
                onChange={(e) => setFamName(e.target.value)}
                placeholder="Имя члена семьи..."
                className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold"
              />
              <select
                value={famRelation}
                onChange={(e) => setFamRelation(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold"
              >
                <option>Ребенок</option>
                <option>Супруг/Супруга</option>
                <option>Родитель</option>
              </select>
              <button type="submit" className="px-4 py-2 bg-cyan-500 text-white rounded-xl text-xs font-bold">
                Сохранить
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentUser.familyMembers.map(fam => (
              <div key={fam.id} className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{fam.name}</h4>
                  <p className="text-[11px] text-slate-400">Карта: {fam.cardNo} • {fam.age}</p>
                </div>
                <button className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold">
                  Записать
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LOYALTY */}
      {activeTab === 'loyalty' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Gift size={20} className="text-cyan-500" />
            Программа лояльности «АКАК ТИШ БОНУС»
          </h3>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-wider block">Ваш уровень лояльности</span>
            <h2 className="text-2xl font-extrabold">GOLD PATIENT (10% Скидка)</h2>
            <p className="text-xs text-cyan-100">Начислено 1,250 бонусов. Вы можете оплачивать ими до 50% стоимости приема!</p>
          </div>
        </div>
      )}
    </div>
  );
}
