import React, { useState } from 'react';
import { ShieldCheck, Users, Calendar, DollarSign, Activity, Trash2, Edit3 } from 'lucide-react';
import { useClinicAuth } from '../context/ClinicAuthContext';

export default function AdminPortalPage() {
  const { appointments, updateAppointmentStatus, doctorsList, servicesList, updateServicePrice, deleteDoctor } = useClinicAuth();
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editPrice, setEditPrice] = useState('');

  const totalRevenue = 485000;
  const patientsCount = 1420;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6 pb-24">
      {/* Admin Header */}
      <div className="p-6 rounded-3xl bg-slate-950 text-white shadow-xl flex items-center justify-between">
        <div>
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold uppercase mb-2 inline-block">
            Административная Панель Управления
          </span>
          <h1 className="text-2xl font-extrabold">Управление Клиникой «АКАК ТИШ»</h1>
          <p className="text-xs text-slate-400">Управление записями, ценами, врачами и аналитикой доходов</p>
        </div>
      </div>

      {/* Analytics Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <span className="text-xs font-bold text-slate-400 uppercase">Выручка за месяц</span>
          <h3 className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-1">{totalRevenue.toLocaleString()} KGS</h3>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <span className="text-xs font-bold text-slate-400 uppercase">Всего пациентов</span>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{patientsCount}</h3>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <span className="text-xs font-bold text-slate-400 uppercase">Записей в системе</span>
          <h3 className="text-2xl font-extrabold text-blue-500 mt-1">{appointments.length}</h3>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <span className="text-xs font-bold text-slate-400 uppercase">Врачей в штате</span>
          <h3 className="text-2xl font-extrabold text-emerald-500 mt-1">{doctorsList.length}</h3>
        </div>
      </div>

      {/* Appointments Management */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Все записи пациентов</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase">
                <th className="py-3 px-2">Пациент</th>
                <th className="py-3 px-2">Врач</th>
                <th className="py-3 px-2">Услуга</th>
                <th className="py-3 px-2">Дата & Время</th>
                <th className="py-3 px-2">Статус</th>
                <th className="py-3 px-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(app => (
                <tr key={app.id} className="border-b border-slate-100 dark:border-slate-800/60 font-medium">
                  <td className="py-3 px-2 font-bold text-slate-900 dark:text-white">{app.patientName}<br/><span className="text-[10px] text-slate-400 font-normal">{app.patientPhone}</span></td>
                  <td className="py-3 px-2 text-cyan-600 dark:text-cyan-400 font-semibold">{app.doctorName}</td>
                  <td className="py-3 px-2">{app.serviceTitle}</td>
                  <td className="py-3 px-2 font-bold">{app.date} в {app.time}</td>
                  <td className="py-3 px-2"><span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-[10px]">{app.status}</span></td>
                  <td className="py-3 px-2 flex gap-1">
                    <button onClick={() => updateAppointmentStatus(app.id, 'Cancelled')} className="px-2 py-1 bg-red-500/10 text-red-500 rounded-lg text-[10px] font-bold">
                      Отменить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Services & Price Editor */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Редактор прайс-листа услуг</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {servicesList.map(s => (
            <div key={s.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">{s.title}</h4>
                <span className="text-cyan-500 font-extrabold">{s.price.toLocaleString()} KGS</span>
              </div>
              <button 
                onClick={() => {
                  const newP = prompt("Введите новую цену для " + s.title, s.price);
                  if (newP) updateServicePrice(s.id, parseInt(newP));
                }}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-200 font-bold hover:bg-cyan-500 hover:text-white transition-colors"
              >
                Изменить цену
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
