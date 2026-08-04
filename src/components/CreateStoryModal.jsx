// CreateStoryModal.jsx - Modern Story Creator with Filters & Stickers
import React, { useState } from 'react';
import { dbService } from '../services/dbService';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Image, 
  Upload, 
  Sparkles, 
  MapPin, 
  Clock, 
  Smile, 
  Check 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FILTERS = [
  { id: 'normal', name: 'Обычный', filterStyle: 'none' },
  { id: 'vintage', name: 'Винтаж 📜', filterStyle: 'sepia(0.6) contrast(1.1) brightness(0.95)' },
  { id: 'neon', name: 'Неон 🎆', filterStyle: 'contrast(1.4) saturate(1.8) hue-rotate(15deg)' },
  { id: 'bw', name: 'B&W 🖤', filterStyle: 'grayscale(1) contrast(1.2)' },
  { id: 'golden', name: 'Закат 🌅', filterStyle: 'sepia(0.3) saturate(1.4) hue-rotate(-10deg)' },
  { id: 'cyber', name: 'Космос ❄️', filterStyle: 'hue-rotate(180deg) saturate(1.5)' }
];

export default function CreateStoryModal({ isOpen, onClose }) {
  const { currentUser } = useAuth();
  const [mediaURL, setMediaURL] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('normal');
  const [stickerText, setStickerText] = useState('📍 г. Ош, Кыргызстан');
  const [loading, setLoading] = useState(false);

  const sampleImages = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80'
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mediaURL || !currentUser?.uid) return;
    setLoading(true);
    try {
      await dbService.createStory({
        userId: currentUser.uid,
        mediaURL,
        filter: selectedFilter,
        stickerText,
        type: 'image'
      });
      alert("История успешно выложена в ваш профиль!");
      setMediaURL('');
      onClose();
    } catch (err) {
      alert("Ошибка публикации истории");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentFilterObj = FILTERS.find(f => f.id === selectedFilter) || FILTERS[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-theme-lightCard dark:bg-theme-darkCard text-theme-lightText dark:text-theme-darkText rounded-3xl p-6 shadow-2xl z-10 flex flex-col gap-4 border border-theme-lightBorder dark:border-theme-darkBorder transition-colors"
        >
          <div className="flex items-center justify-between border-b border-theme-lightBorder dark:border-theme-darkBorder pb-3">
            <h3 className="font-extrabold text-sm flex items-center gap-2">
              <Sparkles size={18} className="text-brand" />
              <span>Создать новую Историю (Story)</span>
            </h3>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
              <X size={18} />
            </button>
          </div>

          {/* Preview Canvas Container */}
          <div className="w-full aspect-[9/16] max-h-72 bg-black rounded-2xl overflow-hidden relative border border-slate-700 flex items-center justify-center">
            {mediaURL ? (
              <img 
                src={mediaURL} 
                alt="Story Preview" 
                className="w-full h-full object-cover"
                style={{ filter: currentFilterObj.filterStyle }}
              />
            ) : (
              <div className="text-center p-6 text-slate-400 flex flex-col items-center gap-2">
                <Image size={36} className="text-brand opacity-60" />
                <p className="text-xs font-bold">Выберите картинку для Истории</p>
              </div>
            )}

            {/* Sticker Overlay Preview */}
            {mediaURL && stickerText && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-[10px] font-extrabold shadow-lg border border-white/20">
                {stickerText}
              </div>
            )}

            {/* 24h Timer Badge */}
            <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-gradient-to-r from-purple-600 to-brand text-white text-[9px] font-extrabold rounded-full flex items-center gap-1 shadow-md">
              <Clock size={11} />
              <span>24 часа</span>
            </div>
          </div>

          {/* Image Input Options */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-all border border-dashed border-slate-400">
              <Upload size={16} className="text-brand" />
              <span>Загрузить фото с компьютера</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
              {sampleImages.map((img, idx) => (
                <img 
                  key={idx}
                  src={img}
                  alt="sample"
                  onClick={() => setMediaURL(img)}
                  className="w-12 h-12 rounded-xl object-cover cursor-pointer hover:scale-105 ring-2 ring-transparent hover:ring-brand transition-all shrink-0"
                />
              ))}
            </div>
          </div>

          {/* Filter Selection Tabs */}
          {mediaURL && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Выберите фильтр:</span>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                {FILTERS.map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFilter(f.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                      selectedFilter === f.id
                        ? 'bg-brand text-white border-brand shadow-md scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent hover:bg-slate-200'
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sticker text input */}
          <input 
            type="text"
            placeholder="Стикер/геометка (например: 📍 Ош)"
            value={stickerText}
            onChange={(e) => setStickerText(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800 border border-theme-lightBorder dark:border-theme-darkBorder rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-brand"
          />

          <button 
            onClick={handleSubmit}
            disabled={!mediaURL || loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-brand hover:scale-105 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Публикация...' : '🚀 Опубликовать в Истории'}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
