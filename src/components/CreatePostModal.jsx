// CreatePostModal.jsx - Modern popup for publishing photos, videos, and Reels
import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { X, Image, Film, FileVideo, Globe, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreatePostModal({ isOpen, onClose }) {
  const { currentUser } = useAuth();
  const [postType, setPostType] = useState('photo'); // 'photo' | 'video' | 'reel'
  const [caption, setCaption] = useState('');
  const [mediaSource, setMediaSource] = useState('upload'); // 'upload' | 'url'
  const [mediaURL, setMediaURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic check
      if (file.type.startsWith('image/')) {
        setPostType('photo');
      } else if (file.type.startsWith('video/')) {
        // Decide if standard video or Reel based on type selection later
        setPostType(prev => prev === 'photo' ? 'video' : prev);
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!preview && !mediaURL) {
      alert("Пожалуйста, добавьте фото или видео");
      return;
    }

    setLoading(true);
    try {
      // Determine final media path
      let finalMediaURL = mediaSource === 'url' ? mediaURL : preview;

      // Extract hashtags from caption
      const hashtagRegex = /#(\w+)/g;
      const hashtags = [];
      let match;
      while ((match = hashtagRegex.exec(caption)) !== null) {
        hashtags.push(match[1].toLowerCase());
      }

      const postData = {
        userId: currentUser.uid,
        type: postType,
        mediaURL: finalMediaURL,
        caption: caption.trim(),
        hashtags,
      };

      if (postType === 'reel') {
        await dbService.createReel(postData);
      } else {
        await dbService.createPost(postData);
      }

      // Reset state
      setCaption('');
      setPreview(null);
      setMediaURL('');
      onClose();
    } catch (err) {
      console.error(err);
      alert("Ошибка при публикации: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[600px] max-h-[850px] transition-colors duration-200"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
          >
            <X size={18} />
          </button>

          {/* Left Panel: Media Uploader / Preview */}
          <div className="flex-1 bg-slate-900 flex flex-col items-center justify-center p-6 relative border-r border-theme-lightBorder dark:border-theme-darkBorder">
            {preview || (mediaSource === 'url' && mediaURL) ? (
              <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-xl bg-slate-950">
                {postType === 'photo' ? (
                  <img 
                    src={preview || mediaURL} 
                    alt="Preview" 
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <video 
                    src={preview || mediaURL} 
                    controls 
                    className="max-w-full max-h-full object-contain"
                  />
                )}
                
                <button 
                  onClick={() => { setPreview(null); setMediaURL(''); }}
                  className="absolute bottom-4 left-4 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-lg transition-colors"
                >
                  Удалить медиа
                </button>
              </div>
            ) : (
              <div className="text-center flex flex-col items-center">
                <div className="flex gap-4 mb-6">
                  <button 
                    onClick={() => setMediaSource('upload')}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      mediaSource === 'upload' 
                        ? 'bg-brand text-white' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    Загрузить файл
                  </button>
                  <button 
                    onClick={() => setMediaSource('url')}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      mediaSource === 'url' 
                        ? 'bg-brand text-white' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    Вставить ссылку
                  </button>
                </div>

                {mediaSource === 'upload' ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-brand/70 rounded-2xl p-8 cursor-pointer flex flex-col items-center justify-center group transition-colors w-64 h-64"
                  >
                    {postType === 'reel' ? (
                      <Film size={48} className="text-slate-500 group-hover:text-brand transition-colors mb-4" />
                    ) : (
                      <Image size={48} className="text-slate-500 group-hover:text-brand transition-colors mb-4" />
                    )}
                    <p className="text-xs font-medium text-slate-400 text-center">
                      Нажмите, чтобы выбрать файл фото или видео
                    </p>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/*,video/*"
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 w-64">
                    <Globe size={40} className="text-slate-500 mb-2 self-center" />
                    <input 
                      type="url" 
                      placeholder="https://example.com/image.jpg"
                      value={mediaURL}
                      onChange={(e) => setMediaURL(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand"
                    />
                    <p className="text-[10px] text-slate-500 text-center">
                      Поддерживаются прямые ссылки на изображения и видео (MP4)
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel: Caption and Settings */}
          <form 
            onSubmit={handlePublish}
            className="w-full md:w-80 flex flex-col justify-between p-6 bg-theme-lightCard dark:bg-theme-darkCard text-theme-lightText dark:text-theme-darkText"
          >
            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-bold">Новая публикация</h3>

              {/* User Identity Info */}
              <div className="flex items-center gap-3">
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName} 
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-brand/50"
                />
                <div>
                  <h4 className="text-sm font-semibold">{currentUser.displayName}</h4>
                  <p className="text-xs text-theme-lightMuted dark:text-theme-darkMuted">@{currentUser.username}</p>
                </div>
              </div>

              {/* Post Type Toggles */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-theme-lightMuted dark:text-theme-darkMuted tracking-wider">Тип контента</label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
                  <button 
                    type="button"
                    onClick={() => setPostType('photo')}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      postType === 'photo' 
                        ? 'bg-white dark:bg-slate-700 shadow-sm text-brand' 
                        : 'text-slate-500'
                    }`}
                  >
                    Фото
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPostType('video')}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      postType === 'video' 
                        ? 'bg-white dark:bg-slate-700 shadow-sm text-brand' 
                        : 'text-slate-500'
                    }`}
                  >
                    Видео
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPostType('reel')}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      postType === 'reel' 
                        ? 'bg-white dark:bg-slate-700 shadow-sm text-brand' 
                        : 'text-slate-500'
                    }`}
                  >
                    Reel
                  </button>
                </div>
              </div>

              {/* Caption Textarea */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-theme-lightMuted dark:text-theme-darkMuted tracking-wider">Описание публикации</label>
                <textarea 
                  placeholder="Добавьте подпись к посту... Добавьте #хэштеги, чтобы вас нашли"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-100 dark:bg-slate-800/50 border border-theme-lightBorder dark:border-theme-darkBorder rounded-xl p-3 text-sm focus:outline-none focus:border-brand transition-all resize-none"
                />
              </div>
            </div>

            {/* Actions / Submit */}
            <div className="pt-4 border-t border-theme-lightBorder dark:border-theme-darkBorder flex items-center justify-between">
              <button 
                type="button"
                onClick={onClose}
                className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold rounded-lg text-slate-500"
              >
                Отмена
              </button>

              <button 
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-dark disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand/20 transition-all hover:scale-102 cursor-pointer"
              >
                {loading ? 'Публикация...' : (
                  <>
                    <span>Поделиться</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
