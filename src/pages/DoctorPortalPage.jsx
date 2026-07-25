import React, { useState } from 'react';
import { Calendar, User, FileText, CheckCircle2, Clock, Plus, Activity } from 'lucide-react';
import { useClinicAuth } from '../context/ClinicAuthContext';

export default function DoctorPortalPage() {
  const { appointments, updateAppointmentStatus } = useClinicAuth();
  const [selectedPatient, setSelectedPatient] = useState(appointments[0]);
  const [newNote, setNewNote] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6 pb-24">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 to-slate-900 text-white shadow-xl flex items-center justify-between">
        <div>
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase mb-2 inline-block">
            Панель Врача-Стоматолога
          </span>
          <h1 className="text-2xl font-extrabold">Д-р Алмаз Каримов</h1>
          <p className="text-xs text-blue-200">Главный врач • Расписание и прием пациентов на сегодня</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Appointments Queue */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar size={18} className="text-cyan-500" />
            Очередь пациентов ({appointments.length})
          </h3>

          {appointments.map(app => (
            <div 
              key={app.id}
              onClick={() => setSelectedPatient(app)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedPatient?.id === app.id 
                  ? 'border-cyan-500 bg-cyan-500/10 shadow-md' 
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-extrabold text-xs text-slate-900 dark:text-white">{app.patientName}</span>
                <span className="text-[10px] font-bold text-cyan-500">{app.time}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{app.serviceTitle}</p>
            </div>
          ))}
        </div>

        {/* Patient Workstation & Record */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col gap-4">
          {selectedPatient ? (
            <>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{selectedPatient.patientName}</h2>
                  <p className="text-xs text-slate-400">{selectedPatient.patientPhone} • {selectedPatient.serviceTitle}</p>
                </div>
                <button 
                  onClick={() => updateAppointmentStatus(selectedPatient.id, 'Completed')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-md"
                >
                  Завершить прием ✅
                </button>
              </div>

              {/* Patient Teeth Record */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-400 uppercase mb-2">Интерактивная карта зубов</h4>
                <div className="grid grid-cols-8 gap-2 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-center text-xs font-bold">
                  {[18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28].slice(0,8).map(tooth => (
                    <div key={tooth} className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-cyan-600">
                      {tooth}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Clinical Note */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Внести назначение и рекомендации</label>
                <textarea 
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Запишите выписанные препараты или план дальнейшего лечения..."
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-medium"
                />
                <button 
                  onClick={() => setNewNote('')}
                  className="self-end px-4 py-2 bg-cyan-500 text-white text-xs font-bold rounded-xl"
                >
                  Сохранить в медкартy
                </button>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-400">Выберите пациента из списка слева</p>
          )}
        </div>
      </div>
    </div>
  );
}
