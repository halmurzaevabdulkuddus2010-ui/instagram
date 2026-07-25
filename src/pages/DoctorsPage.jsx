import React from 'react';
import { Star, Award, GraduationCap, ArrowRight } from 'lucide-react';
import { useClinicAuth } from '../context/ClinicAuthContext';

export default function DoctorsPage({ onOpenDoctor, onBookDoctor }) {
  const { doctorsList } = useClinicAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6 pb-24">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Команда врачей-стоматологов
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Высококвалифицированные врачи клиники «АКАК ТИШ» с международными сертификатами
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {doctorsList.map(doc => (
          <div
            key={doc.id}
            onClick={() => onOpenDoctor(doc)}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl hover:border-cyan-500/50 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex flex-col sm:flex-row gap-5">
              <img 
                src={doc.photoURL} 
                alt={doc.name} 
                className="w-28 h-28 rounded-2xl object-cover ring-2 ring-cyan-500/20 shrink-0 mx-auto sm:mx-0"
              />

              <div className="flex-1 text-center sm:text-left">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-extrabold uppercase mb-1.5 inline-block">
                  {doc.specialty}
                </span>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-1">
                  {doc.name}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-2">
                  Стаж: {doc.experience}
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-bold">
                    <Star size={13} className="fill-current" />
                    <span>{doc.rating}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {doc.reviewsCount} отзывов
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-medium">
                  {doc.bio}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
                Консультация: {doc.priceFrom}
              </span>

              <button
                onClick={(e) => { e.stopPropagation(); onBookDoctor(doc); }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-md shadow-cyan-500/20 hover:scale-105 transition-all"
              >
                Записаться
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
