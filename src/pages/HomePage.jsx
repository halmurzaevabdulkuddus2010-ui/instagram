import React from 'react';
import { 
  CalendarPlus, 
  Stethoscope, 
  UserCheck, 
  Tag, 
  Star, 
  MessageSquare, 
  Phone, 
  Video, 
  User, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Flame,
  Award
} from 'lucide-react';
import { useClinicAuth } from '../context/ClinicAuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CLINIC_PROMOTIONS, CLINIC_SERVICES, CLINIC_DOCTORS, CLINIC_REVIEWS } from '../services/clinicData';

export default function HomePage({ onNavigate, onOpenDoctor, onOpenService, onOpenAI }) {
  const { t } = useLanguage();
  const { role } = useClinicAuth();

  const quickActionGrid = [
    { label: t('bookAppointment'), icon: CalendarPlus, tab: 'booking', color: 'from-cyan-500 to-blue-600', text: 'text-white' },
    { label: t('ourDoctors'), icon: UserCheck, tab: 'doctors', color: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-800 dark:text-slate-100' },
    { label: t('services'), icon: Stethoscope, tab: 'services', color: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-800 dark:text-slate-100' },
    { label: t('pricing'), icon: Tag, tab: 'services', color: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-800 dark:text-slate-100' },
    { label: t('promotions'), icon: Flame, tab: 'services', color: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-800 dark:text-slate-100' },
    { label: t('reviews'), icon: Star, tab: 'home', color: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-800 dark:text-slate-100' },
    { label: t('contacts'), icon: MapPin, tab: 'contacts', color: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-800 dark:text-slate-100' },
    { label: t('consultation'), icon: Video, tab: 'consultation', color: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-800 dark:text-slate-100' },
    { label: t('cabinet'), icon: User, tab: 'cabinet', color: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-800 dark:text-slate-100' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-8 pb-24 md:pb-12">
      
      {/* HERO BANNER SECTION */}
      <section className="relative w-full rounded-[32px] overflow-hidden apple-card gradient-navy-cyan text-white p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold mb-4 backdrop-blur-md">
            <Sparkles size={14} />
            <span>Премиум Стоматология 2026</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            Здоровая белоснежная улыбка клиники <span className="bg-gradient-to-r from-cyan-300 via-white to-cyan-200 bg-clip-text text-transparent">«АКАК ТИШ»</span>
          </h1>

          <p className="text-sm md:text-base text-cyan-100/90 max-w-xl font-medium mb-6 leading-relaxed">
            Швейцарские импланты, элайнеры, лечение под микроскопом и виниры без боли. Доверьте свою улыбку лучшим врачам юга Кыргызстана.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
            <button
              onClick={() => onNavigate('booking')}
              className="w-full sm:w-auto px-7 py-4 bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 font-extrabold text-xs rounded-2xl shadow-xl shadow-cyan-500/30 hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CalendarPlus size={18} />
              <span>{t('bookAppointment')}</span>
            </button>

            <button
              onClick={onOpenAI}
              className="w-full sm:w-auto px-6 py-4 bg-white/15 backdrop-blur-md border border-white/20 text-white font-extrabold text-xs rounded-2xl hover:bg-white/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles size={18} className="text-cyan-300" />
              <span>Консультация с ИИ</span>
            </button>
          </div>
        </div>

        {/* Hero Illustration / Image Card */}
        <div className="relative w-full md:w-96 h-64 md:h-72 rounded-3xl overflow-hidden border border-white/20 shadow-2xl shrink-0">
          <img 
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80" 
            alt="Akak Tish Dentistry" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          
          <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 text-white flex items-center justify-center font-bold">
              <Award size={22} />
            </div>
            <div>
              <span className="font-bold text-white block">Клиника №1 в г. Ош</span>
              <span className="text-[10px] text-cyan-200">Более 15,000 счастливых пациентов</span>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS GRID */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          Быстрый доступ
        </h2>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-9 gap-3">
          {quickActionGrid.map((act, idx) => {
            const Icon = act.icon;
            return (
              <button
                key={idx}
                onClick={() => onNavigate(act.tab)}
                className={`p-3.5 rounded-2xl ${act.color} ${act.text} border border-slate-200/60 dark:border-slate-800 shadow-sm hover:scale-105 transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer`}
              >
                <Icon size={22} />
                <span className="text-[11px] font-bold leading-tight">{act.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* SPECIAL PROMOTIONS CAROUSEL */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Flame size={20} className="text-amber-500" />
            Акции и Специальные предложения
          </h2>
          <button 
            onClick={() => onNavigate('services')}
            className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
          >
            Все акции →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CLINIC_PROMOTIONS.map(promo => (
            <div 
              key={promo.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="h-40 relative overflow-hidden">
                <img src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-cyan-500 text-white text-[10px] font-extrabold uppercase shadow-md">
                  {promo.badge}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-2 leading-snug">
                    {promo.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    {promo.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">{promo.discountText}</span>
                  <button
                    onClick={() => onNavigate('booking')}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-white text-xs font-bold hover:bg-cyan-600 transition-colors"
                  >
                    Записаться
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR SERVICES GRID */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Stethoscope size={20} className="text-cyan-500" />
            Популярные услуги клиники
          </h2>
          <button 
            onClick={() => onNavigate('services')}
            className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
          >
            Все услуги →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {CLINIC_SERVICES.slice(0, 4).map(serv => (
            <div
              key={serv.id}
              onClick={() => onOpenService(serv)}
              className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:border-cyan-500/50 hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-extrabold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block mb-1">
                  {serv.category}
                </span>
                <h3 className="font-bold text-xs text-slate-900 dark:text-white mb-2 line-clamp-2">
                  {serv.title}
                </h3>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                  {serv.price.toLocaleString()} KGS
                </span>
                <span className="text-[10px] text-cyan-500 font-bold">Подробнее →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED DOCTORS */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck size={20} className="text-blue-500" />
            Ведущие специалисты «АКАК ТИШ»
          </h2>
          <button 
            onClick={() => onNavigate('doctors')}
            className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
          >
            Все врачи →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {CLINIC_DOCTORS.map(doc => (
            <div
              key={doc.id}
              onClick={() => onOpenDoctor(doc)}
              className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:border-cyan-500/50 transition-all cursor-pointer flex flex-col items-center text-center"
            >
              <img 
                src={doc.photoURL} 
                alt={doc.name} 
                className="w-24 h-24 rounded-2xl object-cover mb-3 ring-2 ring-cyan-500/20 shadow-md"
              />
              <h3 className="font-extrabold text-xs text-slate-900 dark:text-white mb-1">
                {doc.name}
              </h3>
              <p className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 mb-2">
                {doc.specialty}
              </p>
              
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-500 text-[10px] font-bold mb-4">
                <Star size={12} className="fill-current" />
                <span>{doc.rating} ({doc.reviewsCount} отзывов)</span>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); onNavigate('booking'); }}
                className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500 hover:text-white text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
              >
                Записаться
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* PATIENT REVIEWS */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Star size={20} className="text-amber-400 fill-current" />
          Отзывы наших пациентов
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CLINIC_REVIEWS.map(rev => (
            <div key={rev.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <img src={rev.avatar} alt={rev.patientName} className="w-9 h-9 rounded-full bg-cyan-100" />
                    <div>
                      <span className="font-bold text-xs text-slate-900 dark:text-white block">{rev.patientName}</span>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={13} className="fill-current" />
                    ))}
                  </div>
                </div>

                <span className="inline-block px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold mb-2">
                  {rev.service}
                </span>

                <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-medium italic">
                  "{rev.comment}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
