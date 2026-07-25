import React from 'react';
import { X, Star, Calendar, Award, GraduationCap, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DoctorModal({ doctor, isOpen, onClose, onBook }) {
  if (!isOpen || !doctor) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/40 hover:bg-slate-950/60 text-white backdrop-blur-md transition-colors"
          >
            <X size={18} />
          </button>

          <div className="overflow-y-auto p-6 flex flex-col gap-6">
            {/* Doctor Profile Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pt-2">
              <img 
                src={doctor.photoURL} 
                alt={doctor.name} 
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-cyan-500/30 shadow-xl"
              />

              <div className="flex-1 text-center sm:text-left">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-extrabold uppercase tracking-wider mb-2 inline-block">
                  {doctor.specialty}
                </span>

                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">
                  {doctor.name}
                </h2>

                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
                  {doctor.experience} • Клиника «АКАК ТИШ»
                </p>

                {/* Rating & Reviews */}
                <div className="flex items-center justify-center sm:justify-start gap-4">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-xl text-xs font-bold">
                    <Star size={15} className="fill-current" />
                    <span>{doctor.rating}</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {doctor.reviewsCount} отзывов клиентов
                  </span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1">О враче</h4>
              <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-medium">
                {doctor.bio}
              </p>
            </div>

            {/* Education & Certificates */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <GraduationCap size={16} className="text-cyan-500" />
                Образование & Сертификаты
              </h4>
              
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold">
                  <CheckCircle2 size={15} className="text-cyan-500 shrink-0" />
                  <span>{doctor.education}</span>
                </div>
                {doctor.certificates.map((cert, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Award size={15} className="text-blue-500 shrink-0" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule & Price */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Прием по дням</span>
                <div className="flex gap-1.5 mt-1">
                  {doctor.schedule.map(d => (
                    <span key={d} className="px-2 py-0.5 rounded-md bg-cyan-500 text-white text-[10px] font-bold">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Консультация</span>
                <span className="text-sm font-extrabold text-cyan-600 dark:text-cyan-400">{doctor.priceFrom}</span>
              </div>
            </div>

            {/* Action CTA */}
            <button
              onClick={() => { onClose(); onBook(doctor); }}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <span>Записаться к доктору</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
