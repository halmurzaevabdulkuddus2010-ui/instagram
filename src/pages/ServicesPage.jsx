import React, { useState } from 'react';
import { Search, Stethoscope, Clock, ChevronRight } from 'lucide-react';
import { useClinicAuth } from '../context/ClinicAuthContext';

export default function ServicesPage({ onOpenService, onBookService }) {
  const { servicesList } = useClinicAuth();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');

  const categories = [
    'Все',
    'Лечение кариеса',
    'Имплантация',
    'Брекеты & Ортодонтия',
    'Виниры',
    'Отбеливание',
    'Чистка зубов',
    'Детская стоматология',
    'Хирургия'
  ];

  const filteredServices = servicesList.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'Все' || s.category.includes(selectedCategory) || selectedCategory.includes(s.category);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Услуги и Прайс-лист
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Полный перечень стоматологических услуг клиники «АКАК ТИШ»
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
        <input 
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по услугам, симптомам..."
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs font-medium focus:outline-none focus:border-cyan-500 shadow-sm"
        />
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-cyan-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredServices.map(service => (
          <div
            key={service.id}
            onClick={() => onOpenService(service)}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-cyan-500/50 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex gap-4">
              <img src={service.image} alt={service.title} className="w-24 h-24 rounded-2xl object-cover shrink-0" />
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-extrabold uppercase mb-1 inline-block">
                  {service.category}
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1 leading-snug">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {service.price.toLocaleString()} KGS
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock size={12} /> {service.duration}
                </span>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); onBookService(service); }}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-white text-xs font-bold hover:bg-cyan-600 transition-colors shadow-sm"
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
