import React from 'react';
import { MapPin, PhoneCall, Clock, MessageSquare, Send, Navigation, Globe } from 'lucide-react';
import { useClinicAuth } from '../context/ClinicAuthContext';

export default function ContactsPage() {
  const { branches } = useClinicAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6 pb-24">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Контакты и Филиалы клиники
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Стоматологическая клиника «АКАК ТИШ» в г. Ош
        </p>
      </div>

      {/* Quick Contact Buttons Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <a 
          href="tel:+996555700011" 
          className="p-4 rounded-2xl bg-emerald-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
        >
          <PhoneCall size={18} />
          <span>Позвонить: +996 (555) 70-00-11</span>
        </a>

        <a 
          href="https://wa.me/996555700011" 
          target="_blank" 
          rel="noreferrer"
          className="p-4 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
        >
          <MessageSquare size={18} />
          <span>Написать в WhatsApp</span>
        </a>

        <a 
          href="https://t.me/akaktish_bot" 
          target="_blank" 
          rel="noreferrer"
          className="p-4 rounded-2xl bg-sky-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
        >
          <Send size={18} />
          <span>Telegram-Бот Клиники</span>
        </a>
      </div>

      {/* Branches List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {branches.map(b => (
          <div key={b.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-extrabold uppercase">
                  {b.name}
                </span>
                {b.is24Hours && (
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-extrabold">
                    Круглосуточно 24/7
                  </span>
                )}
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-2 leading-snug">
                {b.address}
              </h3>

              <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <p className="flex items-center gap-1.5"><PhoneCall size={14} className="text-cyan-500" /> {b.phone}</p>
                <p className="flex items-center gap-1.5"><Clock size={14} className="text-blue-500" /> {b.workHours}</p>
              </div>
            </div>

            {/* Interactive Map Frame simulation */}
            <div className="w-full h-44 rounded-2xl overflow-hidden relative bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80" 
                alt="Branch Map Location" 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                <div className="px-4 py-2 rounded-2xl bg-slate-950/80 text-white backdrop-blur-md border border-white/20 text-xs font-bold flex items-center gap-2 shadow-xl">
                  <MapPin size={18} className="text-cyan-400 animate-bounce" />
                  <span>Показать маршрут на карте</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
