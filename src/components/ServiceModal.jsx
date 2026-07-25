import React from 'react';
import { X, Clock, ShieldCheck, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ServiceModal({ service, isOpen, onClose, onBook }) {
  if (!isOpen || !service) return null;

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
          animate={{ opacity: 1, scale: 1 }}
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

          {/* Hero Banner Image */}
          <div className="w-full h-48 sm:h-56 relative overflow-hidden bg-slate-950">
            <img 
              src={service.image} 
              alt={service.title} 
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            
            <div className="absolute bottom-4 left-6 right-6 text-white">
              <span className="px-3 py-1 rounded-full bg-cyan-500 text-white text-[10px] font-extrabold uppercase tracking-wider mb-2 inline-block shadow-md">
                {service.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold leading-tight">
                {service.title}
              </h2>
            </div>
          </div>

          <div className="overflow-y-auto p-6 flex flex-col gap-6">
            {/* Price & Duration Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                <span className="text-[10px] font-extrabold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block mb-0.5">Стоимость процедуры</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {service.price.toLocaleString()} KGS
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-0.5 flex items-center gap-1">
                  <Clock size={12} /> Длительность
                </span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {service.duration}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Описание процедуры</h4>
              <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-medium">
                {service.description}
              </p>
            </div>

            {/* FAQ List */}
            {service.faq && service.faq.length > 0 && (
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <HelpCircle size={15} className="text-cyan-500" />
                  Частые вопросы пациентов
                </h4>
                {service.faq.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                      {item.q}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Button */}
            <button
              onClick={() => { onClose(); onBook(service); }}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <span>Записаться на услугу</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
