// CreatePostModal.jsx - Modern popup for publishing photos, videos, Reels, custom drawing, and webcam photos
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { X, Image, Film, FileVideo, Globe, ArrowRight, Sparkles, Upload, Hash, Palette, Camera, Type, Trash2, RefreshCw, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// High quality sample presets for easy 1-click publishing
const PRESET_PHOTOS = [
  { label: '🏔️ Горы', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80' },
  { label: '🏎️ Спорткар', url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80' },
  { label: '🌆 Ночной город', url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80' },
  { label: '☕ Кофе и утро', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80' },
  { label: '🎨 Искусство', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80' },
  { label: '🌊 Океан', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' },
];

const PRESET_VIDEOS = [
  { label: '🌊 Волны океана', url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4' },
  { label: '🏙️ Ночной мегаполис', url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4' },
  { label: '🚗 Поездка на авто', url: 'https://assets.mixkit.co/videos/preview/mixkit-driving-down-a-road-with-trees-on-the-sides-4290-large.mp4' },
];

const QUICK_HASHTAGS = ['#bloggerosh', '#osh', '#kyrgyzstan', '#vibe', '#nature', '#trending', '#reels', '#photooftheday'];

const BRUSH_COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#FFFFFF', '#000000'];
const EMOJI_STICKERS = ['🔥', '❤️', '🚀', '👑', '✨', '💯', '🏔️', '😎', '🎉', '🌟'];

// Canvas Studio Subcomponent for drawing and creating custom images
function CanvasStudio({ onSave }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#EF4444');
  const [brushSize, setBrushSize] = useState(6);
  const [bgColor, setBgColor] = useState('sunset'); // 'dark' | 'sunset' | 'ocean' | 'neon' | 'white'
  const [overlayText, setOverlayText] = useState('');

  // Draw background onto canvas
  const renderBackground = (ctx, width, height) => {
    if (bgColor === 'sunset') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#833ab4');
      grad.addColorStop(0.5, '#fd1d1d');
      grad.addColorStop(1, '#fcb045');
      ctx.fillStyle = grad;
    } else if (bgColor === 'ocean') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#0f2027');
      grad.addColorStop(0.5, '#203a43');
      grad.addColorStop(1, '#2c5364');
      ctx.fillStyle = grad;
    } else if (bgColor === 'neon') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#0575E6');
      grad.addColorStop(1, '#00F666');
      ctx.fillStyle = grad;
    } else if (bgColor === 'white') {
      ctx.fillStyle = '#FFFFFF';
    } else {
      ctx.fillStyle = '#0F172A';
    }
    ctx.fillRect(0, 0, width, height);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;
    renderBackground(ctx, 500, 500);
  }, [bgColor]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    renderBackground(ctx, canvas.width, canvas.height);
  };

  const addTextToCanvas = () => {
    if (!overlayText.trim()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 36px Inter, sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 10;
    ctx.fillText(overlayText, canvas.width / 2, canvas.height / 2);
    ctx.shadowBlur = 0;
    setOverlayText('');
  };

  const addStickerToCanvas = (emoji) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.font = '64px serif';
    ctx.textAlign = 'center';
    const rx = 100 + Math.random() * (canvas.width - 200);
    const ry = 100 + Math.random() * (canvas.height - 200);
    ctx.fillText(emoji, rx, ry);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      onSave(canvas.toDataURL('image/png'));
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between gap-3 p-2 overflow-y-auto custom-scrollbar">
      {/* Canvas Controls Top Bar */}
      <div className="w-full flex items-center justify-between gap-2 flex-wrap bg-slate-900/90 p-2 rounded-2xl border border-slate-800">
        {/* Colors */}
        <div className="flex items-center gap-1.5">
          {BRUSH_COLORS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full transition-all border ${color === c ? 'scale-125 ring-2 ring-white border-transparent' : 'border-slate-700 opacity-80 hover:opacity-100'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Brush Size */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-bold">Кисть:</span>
          <input 
            type="range" 
            min="2" 
            max="30" 
            value={brushSize} 
            onChange={e => setBrushSize(Number(e.target.value))}
            className="w-20 accent-brand cursor-pointer"
          />
        </div>

        {/* Bg presets */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-400 font-bold">Фон:</span>
          <button type="button" onClick={() => setBgColor('sunset')} className="px-2 py-0.5 rounded text-[10px] bg-gradient-to-r from-purple-500 to-amber-500 text-white font-bold">Sunset</button>
          <button type="button" onClick={() => setBgColor('ocean')} className="px-2 py-0.5 rounded text-[10px] bg-gradient-to-r from-slate-900 to-cyan-700 text-white font-bold">Ocean</button>
          <button type="button" onClick={() => setBgColor('dark')} className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-white font-bold border border-slate-700">Dark</button>
        </div>
      </div>

      {/* Main Drawing Canvas Container */}
      <div className="relative aspect-square max-h-[340px] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 touch-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full cursor-crosshair bg-slate-950"
        />
      </div>

      {/* Stickers & Text Toolbar */}
      <div className="w-full flex flex-col gap-2 bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800">
        {/* Stickers */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[10px] font-bold text-slate-400 shrink-0">Стикеры:</span>
          {EMOJI_STICKERS.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => addStickerToCanvas(emoji)}
              className="text-base hover:scale-125 transition-transform px-1 py-0.5"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Text Overlay Input */}
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Напишите текст на холсте..."
            value={overlayText}
            onChange={e => setOverlayText(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand"
          />
          <button 
            type="button"
            onClick={addTextToCanvas}
            className="px-3 py-1.5 bg-brand hover:bg-brand-dark text-white rounded-xl text-xs font-bold transition-all shrink-0"
          >
            Добавить текст
          </button>
          <button 
            type="button"
            onClick={clearCanvas}
            className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-xl transition-all shrink-0"
            title="Очистить холст"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Complete Button */}
      <button 
        type="button"
        onClick={handleSave}
        className="w-full py-2.5 bg-gradient-to-r from-brand to-purple-600 hover:from-brand-dark hover:to-purple-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-brand/20 transition-all hover:scale-102 flex items-center justify-center gap-2"
      >
        <Sparkles size={16} />
        <span>Использовать этот рисунок</span>
      </button>
    </div>
  );
}

// Webcam Capture Subcomponent
function WebcamStudio({ onCapture }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activeStream = null;
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(s => {
        activeStream = s;
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      })
      .catch(err => {
        console.error(err);
        setError("Не удалось получить доступ к веб-камере. Проверьте разрешения вашего браузера.");
      });

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    
    // Stop camera
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onCapture(dataUrl);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      {error ? (
        <div className="text-center p-6 bg-slate-900 rounded-2xl border border-slate-800">
          <Camera size={48} className="text-slate-600 mx-auto mb-3" />
          <p className="text-xs text-red-400 mb-2 font-medium">{error}</p>
          <p className="text-[11px] text-slate-500">Вы также можете нарисовать свой рисунок или выбрать готовые фото.</p>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center gap-4">
          <div className="relative w-full max-w-sm aspect-square bg-slate-900 rounded-3xl overflow-hidden border-2 border-brand/50 shadow-2xl">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className="w-full h-full object-cover -scale-x-100" 
            />
          </div>

          <button 
            type="button"
            onClick={takeSnapshot}
            className="px-6 py-3 bg-brand hover:bg-brand-dark text-white rounded-2xl text-xs font-extrabold shadow-xl shadow-brand/30 transition-all hover:scale-105 flex items-center gap-2"
          >
            <Camera size={18} />
            <span>Сделать фото</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function CreatePostModal({ isOpen, onClose, initialPostType = 'photo' }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [postType, setPostType] = useState(initialPostType); // 'photo' | 'video' | 'reel'
  const [caption, setCaption] = useState('');
  const [mediaSource, setMediaSource] = useState(initialPostType === 'reel' ? 'presets' : 'draw'); // 'draw' | 'presets' | 'upload' | 'camera' | 'url'
  const [mediaURL, setMediaURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPostType(initialPostType);
      if (initialPostType === 'reel') {
        setMediaSource('presets');
      }
    }
  }, [isOpen, initialPostType]);
  
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (file) => {
    if (file) {
      if (file.type.startsWith('image/')) {
        setPostType('photo');
      } else if (file.type.startsWith('video/')) {
        setPostType(prev => prev === 'photo' ? 'video' : prev);
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const selectPreset = (url, isVideo = false) => {
    setPreview(url);
    if (isVideo && postType === 'photo') {
      setPostType('video');
    }
  };

  const addHashtag = (tag) => {
    if (!caption.includes(tag)) {
      setCaption(prev => prev ? `${prev} ${tag}` : tag);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!preview && !mediaURL) {
      alert("Пожалуйста, нарисуйте картинку, сделайте фото на камеру или выберите готовое видео для Reels");
      return;
    }

    setLoading(true);
    try {
      let finalMediaURL = mediaSource === 'url' ? mediaURL : (preview || mediaURL);

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
        caption: caption.trim() || (postType === 'reel' ? 'Новое видео Reels 🔥' : 'Мое авторское творчество 🎨'),
        hashtags,
      };

      if (postType === 'reel') {
        await dbService.createReel(postData);
        setCaption('');
        setPreview(null);
        setMediaURL('');
        onClose();
        navigate('/reels');
      } else {
        await dbService.createPost(postData);
        setCaption('');
        setPreview(null);
        setMediaURL('');
        onClose();
        navigate('/');
      }
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
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[680px] max-h-[920px] transition-colors duration-200"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all shadow-lg hover:rotate-90"
          >
            <X size={18} />
          </button>

          {/* Left Panel: Media Picker / Canvas Studio / Preview */}
          <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-4 relative border-r border-theme-lightBorder dark:border-theme-darkBorder overflow-hidden">
            {preview || (mediaSource === 'url' && mediaURL) ? (
              <div className="w-full h-full flex flex-col items-center justify-center relative rounded-2xl bg-black overflow-hidden group">
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
                    autoPlay
                    loop
                    className="max-w-full max-h-full object-contain"
                  />
                )}
                
                <button 
                  type="button"
                  onClick={() => { setPreview(null); setMediaURL(''); }}
                  className="absolute bottom-4 left-4 px-4 py-2 bg-red-600/90 hover:bg-red-600 text-white rounded-xl text-xs font-bold backdrop-blur-md shadow-lg transition-all hover:scale-105 flex items-center gap-1.5"
                >
                  <RefreshCw size={14} />
                  <span>Переделать / Изменить</span>
                </button>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-between py-1 overflow-hidden">
                {/* Source Tabs */}
                <div className="flex gap-1 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 w-full overflow-x-auto mb-2 shrink-0 custom-scrollbar">
                  <button 
                    type="button"
                    onClick={() => setMediaSource('draw')}
                    className={`flex-1 min-w-[90px] py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      mediaSource === 'draw' 
                        ? 'bg-gradient-to-r from-brand to-purple-600 text-white shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Palette size={14} />
                    <span>🎨 Студия / Холст</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setMediaSource('camera')}
                    className={`flex-1 min-w-[90px] py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      mediaSource === 'camera' 
                        ? 'bg-brand text-white shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Camera size={14} />
                    <span>📷 Камера</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setMediaSource('presets')}
                    className={`flex-1 min-w-[90px] py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      mediaSource === 'presets' 
                        ? 'bg-brand text-white shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Sparkles size={14} />
                    <span>🖼️ Пресеты</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setMediaSource('upload')}
                    className={`flex-1 min-w-[80px] py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      mediaSource === 'upload' 
                        ? 'bg-brand text-white shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Upload size={14} />
                    <span>Файл</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setMediaSource('url')}
                    className={`flex-1 min-w-[80px] py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      mediaSource === 'url' 
                        ? 'bg-brand text-white shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Globe size={14} />
                    <span>Ссылка</span>
                  </button>
                </div>

                {/* TAB 1: CANVAS STUDIO */}
                {mediaSource === 'draw' && (
                  <div className="w-full flex-1 overflow-hidden">
                    <CanvasStudio onSave={(dataUrl) => setPreview(dataUrl)} />
                  </div>
                )}

                {/* TAB 2: WEBCAM STUDIO */}
                {mediaSource === 'camera' && (
                  <div className="w-full flex-1 overflow-hidden">
                    <WebcamStudio onCapture={(dataUrl) => setPreview(dataUrl)} />
                  </div>
                )}

                {/* TAB 3: PRESETS GALLERY */}
                {mediaSource === 'presets' && (
                  <div className="w-full flex-1 overflow-y-auto px-2 custom-scrollbar">
                    <p className="text-xs font-semibold text-slate-400 mb-3 text-center">
                      Нажмите на любое фото или видео, чтобы добавить в пост:
                    </p>
                    
                    <div className="mb-4">
                      <span className="text-[11px] font-bold text-brand uppercase tracking-wider block mb-2">📸 Популярные фото</span>
                      <div className="grid grid-cols-3 gap-2">
                        {PRESET_PHOTOS.map((item, idx) => (
                          <div 
                            key={idx}
                            onClick={() => selectPreset(item.url, false)}
                            className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border border-slate-800 hover:border-brand transition-all hover:scale-105"
                          >
                            <img src={item.url} alt={item.label} className="w-full h-full object-cover group-hover:opacity-90" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                              <span className="text-[10px] font-bold text-white leading-tight">{item.label}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block mb-2">🎥 Популярные видео / Reels</span>
                      <div className="grid grid-cols-3 gap-2">
                        {PRESET_VIDEOS.map((item, idx) => (
                          <div 
                            key={idx}
                            onClick={() => selectPreset(item.url, true)}
                            className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border border-slate-800 hover:border-purple-500 transition-all hover:scale-105"
                          >
                            <video src={item.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" muted />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                              <span className="text-[10px] font-bold text-white leading-tight">{item.label}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: UPLOAD FILE WITH DRAG & DROP */}
                {mediaSource === 'upload' && (
                  <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full flex-1 border-2 border-dashed rounded-3xl p-8 cursor-pointer flex flex-col items-center justify-center transition-all ${
                      isDragging 
                        ? 'border-brand bg-brand/10 scale-98' 
                        : 'border-slate-800 hover:border-brand/70 bg-slate-900/50'
                    }`}
                  >
                    {postType === 'reel' ? (
                      <Film size={52} className="text-purple-400 mb-4 animate-bounce" />
                    ) : (
                      <Image size={52} className="text-brand mb-4 animate-bounce" />
                    )}
                    <h4 className="text-sm font-bold text-white mb-1">
                      {isDragging ? 'Перетащите сюда файл' : 'Выберите фото или видео с ПК'}
                    </h4>
                    <p className="text-xs text-slate-400 text-center max-w-xs mb-4">
                      Поддерживаются файлы PNG, JPG, WEBP, MP4, MOV. Или просто перетащите файл прямо сюда!
                    </p>
                    <button 
                      type="button"
                      className="px-5 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl text-xs font-bold shadow-lg"
                    >
                      Обзор файлов
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])} 
                      accept="image/*,video/*"
                      className="hidden"
                    />
                  </div>
                )}

                {/* TAB 5: ENTER URL */}
                {mediaSource === 'url' && (
                  <div className="w-full flex-1 flex flex-col items-center justify-center p-6 max-w-md">
                    <Globe size={48} className="text-brand mb-4" />
                    <h4 className="text-sm font-bold text-white mb-2">Ссылка на изображение или видео</h4>
                    <input 
                      type="url" 
                      placeholder="https://images.unsplash.com/... или .mp4"
                      value={mediaURL}
                      onChange={(e) => setMediaURL(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand mb-3"
                    />
                    <button 
                      type="button"
                      onClick={() => mediaURL && setPreview(mediaURL)}
                      disabled={!mediaURL}
                      className="w-full py-2.5 bg-brand hover:bg-brand-dark disabled:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      Предпросмотр по ссылке
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel: Caption & Options */}
          <form 
            onSubmit={handlePublish}
            className="w-full md:w-96 flex flex-col justify-between p-6 bg-theme-lightCard dark:bg-theme-darkCard text-theme-lightText dark:text-theme-darkText"
          >
            <div className="flex flex-col gap-5 overflow-y-auto pr-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold flex items-center gap-2">
                  <span>Создать пост</span>
                  <Sparkles size={18} className="text-brand" />
                </h3>
              </div>

              {/* User Identity Info */}
              <div className="flex items-center gap-3 p-2 bg-slate-100 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName} 
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-brand/60"
                />
                <div>
                  <h4 className="text-sm font-bold leading-tight">{currentUser.displayName}</h4>
                  <p className="text-xs text-theme-lightMuted dark:text-theme-darkMuted">@{currentUser.username}</p>
                </div>
              </div>

              {/* Content Type Toggles */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-theme-lightMuted dark:text-theme-darkMuted tracking-wider">Тип контента</label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl">
                  <button 
                    type="button"
                    onClick={() => setPostType('photo')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      postType === 'photo' 
                        ? 'bg-white dark:bg-slate-700 shadow-md text-brand' 
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    📸 Фото
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPostType('video')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      postType === 'video' 
                        ? 'bg-white dark:bg-slate-700 shadow-md text-brand' 
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    🎥 Видео
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPostType('reel')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      postType === 'reel' 
                        ? 'bg-white dark:bg-slate-700 shadow-md text-purple-500' 
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    ✨ Reel
                  </button>
                </div>
              </div>

              {/* Caption Textarea */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-theme-lightMuted dark:text-theme-darkMuted tracking-wider">Описание публикации</label>
                <textarea 
                  placeholder="Добавьте описание к посту..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-100 dark:bg-slate-800/50 border border-theme-lightBorder dark:border-theme-darkBorder rounded-2xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all resize-none"
                />
              </div>

              {/* Quick Hashtags */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                  <Hash size={12} />
                  <span>Быстрые хэштеги</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_HASHTAGS.map((tag) => (
                    <button 
                      key={tag}
                      type="button"
                      onClick={() => addHashtag(tag)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-brand/10 hover:text-brand dark:bg-slate-800 dark:hover:bg-brand/20 text-slate-600 dark:text-slate-300 rounded-lg text-[11px] font-semibold transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions / Submit */}
            <div className="pt-4 border-t border-theme-lightBorder dark:border-theme-darkBorder flex items-center justify-between gap-3 mt-2">
              <button 
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold rounded-xl text-slate-500 transition-colors"
              >
                Отмена
              </button>

              <button 
                type="submit"
                disabled={loading || (!preview && !mediaURL)}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-brand hover:bg-brand-dark disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-brand/25 transition-all hover:scale-102 cursor-pointer"
              >
                {loading ? 'Публикация...' : (
                  <>
                    <span>Опубликовать</span>
                    <ArrowRight size={16} />
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

