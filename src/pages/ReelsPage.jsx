// ReelsPage.jsx - Full screen vertical scroll for short video Reels (Authentic Instagram UI)
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { Link } from 'react-router-dom';
import { soundEngine } from '../utils/soundEngine';
import { 
  Heart, 
  MessageCircle, 
  Repeat2, 
  Send, 
  Bookmark, 
  Volume2, 
  VolumeX, 
  Eye,
  Trash2,
  Play,
  Music,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const formatCount = (num) => {
  if (!num) return '0';
  if (typeof num === 'number') {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }
  return num;
};

export default function ReelsPage() {
  const { currentUser } = useAuth();
  const [reels, setReels] = useState([]);
  const [users, setUsers] = useState([]);
  const [isMuted, setIsMuted] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'football' | 'cartoons' | 'a4'
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef(null);

  // Subscriptions
  useEffect(() => {
    const unsubReels = dbService.subscribeToReels(setReels);
    const unsubUsers = dbService.subscribeToUsers(setUsers);
    return () => {
      unsubReels();
      unsubUsers();
    };
  }, []);

  const handleCreateReelClick = () => {
    window.dispatchEvent(new CustomEvent('open_create_modal', { detail: { type: 'reel' } }));
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollPosition = container.scrollTop;
    const cardHeight = container.clientHeight;
    if (cardHeight > 0) {
      const idx = Math.round(scrollPosition / cardHeight);
      if (idx !== activeIdx && idx >= 0 && idx < filteredReels.length) {
        setActiveIdx(idx);
      }
    }
  };

  // Filter reels based on category selection
  const filteredReels = reels.filter(r => {
    const text = `${r.caption || ''} ${(r.hashtags || []).join(' ')} ${r.audioTitle || ''}`.toLowerCase();
    if (activeCategory === 'football' || activeCategory === 'sports') {
      return (
        r.userId === 'reels_star' ||
        text.includes('фудбол') ||
        text.includes('футбол') ||
        text.includes('foot') ||
        text.includes('messi') ||
        text.includes('ronaldo') ||
        text.includes('cr7') ||
        text.includes('гол') ||
        text.includes('мяч') ||
        text.includes('спорт')
      );
    }
    if (activeCategory === 'masha') {
      return r.userId === 'masha_medved' || text.includes('маша') || text.includes('masha');
    }
    if (activeCategory === 'cartoons') {
      return r.userId === 'cartoon_master' || r.userId === 'masha_medved' || text.includes('мульт') || text.includes('cartoon') || text.includes('anime') || text.includes('3d') || text.includes('маша');
    }
    if (activeCategory === 'a4') {
      return r.userId === 'vlad_a4' || text.includes('a4') || text.includes('влад');
    }
    if (activeCategory === 'cars') {
      return text.includes('car') || text.includes('drift') || text.includes('supercar') || text.includes('speed') || text.includes('гонк') || text.includes('машин') || text.includes('bugatti') || text.includes('subaru');
    }
    if (activeCategory === 'nature') {
      return text.includes('nature') || text.includes('ocean') || text.includes('dolphin') || text.includes('flower') || text.includes('природ') || text.includes('гор') || text.includes('animal');
    }
    return true;
  });

  return (
    <div className="w-full max-w-md mx-auto h-[calc(100vh-3.5rem)] md:h-[calc(100vh-2rem)] md:my-4 flex flex-col items-center justify-center relative">
      {/* Top Header Bar inside Reels */}
      <div className="absolute top-3 inset-x-3 z-30 flex flex-col gap-2 pointer-events-auto">
        <div className="flex items-center justify-between">
          <span className="text-sm font-extrabold text-white drop-shadow-md bg-black/50 px-3 py-1 rounded-xl backdrop-blur-md flex items-center gap-1.5">
            <span>Reels</span>
            <span className="text-purple-400">🎬</span>
          </span>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEngine.init();
                setIsMuted(!isMuted);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-lg ${
                isMuted
                  ? 'bg-red-500/80 hover:bg-red-600 text-white animate-pulse'
                  : 'bg-emerald-500/90 hover:bg-emerald-600 text-white ring-2 ring-emerald-300'
              }`}
              title={isMuted ? "Включить звук" : "Выключить звук"}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="animate-bounce" />}
              <span>{isMuted ? "🔊 Включить звук" : "🔊 Звук ВКЛ"}</span>
            </button>
            <button
              onClick={() => {
                dbService.resetReels();
              }}
              className="px-2.5 py-1.5 bg-black/60 hover:bg-black/80 text-white rounded-xl text-xs font-bold backdrop-blur-md transition-all cursor-pointer"
              title="Обновить список видео"
            >
              <span>🔄 Обновить</span>
            </button>
            <button
              onClick={handleCreateReelClick}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-brand hover:scale-105 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-purple-500/30 flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>+ Добавить Reels</span>
            </button>
          </div>
        </div>

        {/* Category Filters Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button 
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold backdrop-blur-md transition-all cursor-pointer shrink-0 ${
              activeCategory === 'all'
                ? 'bg-white text-black shadow-lg scale-105'
                : 'bg-black/60 text-white/80 hover:bg-black/80'
            }`}
          >
            🎬 Все
          </button>

          <button 
            onClick={() => setActiveCategory('football')}
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
              activeCategory === 'football'
                ? 'bg-emerald-500 text-white shadow-lg scale-105 ring-2 ring-emerald-300'
                : 'bg-black/60 text-emerald-300 hover:bg-black/80'
            }`}
          >
            <span>⚽ Футбол</span>
          </button>

          <button 
            onClick={() => setActiveCategory('masha')}
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
              activeCategory === 'masha'
                ? 'bg-pink-500 text-white shadow-lg scale-105 ring-2 ring-pink-300'
                : 'bg-black/60 text-pink-300 hover:bg-black/80'
            }`}
          >
            <span>👧🐻 Маша и Медведь</span>
          </button>

          <button 
            onClick={() => setActiveCategory('cartoons')}
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
              activeCategory === 'cartoons'
                ? 'bg-amber-400 text-black shadow-lg scale-105 ring-2 ring-amber-300'
                : 'bg-black/60 text-amber-300 hover:bg-black/80'
            }`}
          >
            <span>🍿 Мультфильмы</span>
          </button>

          <button 
            onClick={() => setActiveCategory('a4')}
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
              activeCategory === 'a4'
                ? 'bg-red-500 text-white shadow-lg scale-105'
                : 'bg-black/60 text-red-300 hover:bg-black/80'
            }`}
          >
            <span>⚡ Влад А4</span>
          </button>

          <button 
            onClick={() => setActiveCategory('cars')}
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
              activeCategory === 'cars'
                ? 'bg-blue-500 text-white shadow-lg scale-105'
                : 'bg-black/60 text-blue-300 hover:bg-black/80'
            }`}
          >
            <span>🏎️ Машины & Дрифт</span>
          </button>

          <button 
            onClick={() => setActiveCategory('nature')}
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
              activeCategory === 'nature'
                ? 'bg-teal-500 text-white shadow-lg scale-105'
                : 'bg-black/60 text-teal-300 hover:bg-black/80'
            }`}
          >
            <span>🏔️ Природа & Океан</span>
          </button>
        </div>
      </div>

      {filteredReels.length === 0 ? (
        <div className="text-center p-8 bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-3xl shadow-xl flex flex-col items-center gap-4">
          <p className="text-sm font-bold">В этой категории пока нет видео</p>
          <p className="text-xs text-slate-500">Опубликуйте первое короткое видео или мультфильм!</p>
          <button
            onClick={handleCreateReelClick}
            className="px-5 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl text-xs font-extrabold shadow-lg transition-all"
          >
            🎬 Добавить видео / мультфильм
          </button>
        </div>
      ) : (
        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className="reels-container w-full h-full overflow-y-scroll no-scrollbar snap-y snap-mandatory bg-black md:rounded-3xl shadow-2xl relative"
        >
          {filteredReels.map((reel, index) => (
            <ReelCard 
              key={reel.id} 
              reel={reel} 
              users={users} 
              currentUser={currentUser} 
              isMuted={isMuted}
              setIsMuted={setIsMuted}
              isActive={index === activeIdx}
              handleCreateReelClick={handleCreateReelClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ReelCard({ reel, users, currentUser, isMuted, setIsMuted, isActive, handleCreateReelClick }) {
  const videoRef = useRef(null);
  const [author, setAuthor] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAudioDrawer, setShowAudioDrawer] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [videoError, setVideoError] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const creator = users.find(u => u.uid === reel.userId);

  useEffect(() => {
    if (creator) setAuthor(creator);
  }, [creator]);

  useEffect(() => {
    setIsLiked(reel.likes?.includes(currentUser?.uid) || false);
    setIsSaved(reel.saves?.includes(currentUser?.uid) || false);
  }, [reel, currentUser]);

  // Video progress timeline tracking
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = 1.0;
    }
    if (isActive && !isMuted) {
      soundEngine.init();
      let genre = 'general';
      const text = `${reel.caption || ''} ${reel.audioTitle || ''} ${(reel.hashtags || []).join(' ')}`.toLowerCase();
      if (text.includes('футбол') || text.includes('messi') || text.includes('ronaldo') || text.includes('foot') || reel.userId === 'reels_star') genre = 'football';
      else if (text.includes('маша') || text.includes('мульт') || reel.userId === 'masha_medved' || reel.userId === 'cartoon_master') genre = 'cartoons';
      else if (text.includes('a4') || text.includes('влад') || reel.userId === 'vlad_a4') genre = 'a4';
      else if (text.includes('car') || text.includes('drift') || text.includes('bugatti') || text.includes('subaru')) genre = 'cars';

      soundEngine.playTrack(genre);
    } else {
      soundEngine.stop();
    }

    return () => {
      soundEngine.stop();
    };
  }, [isMuted, isActive, reel]);

  // Subscribe to comments
  useEffect(() => {
    if (!showComments) return;
    const unsubscribe = dbService.subscribeToComments(reel.id, setComments);
    return unsubscribe;
  }, [showComments, reel.id]);

  // Subscribe to conversations for sharing
  useEffect(() => {
    if (!showShareModal || !currentUser?.uid) return;
    const unsubscribe = dbService.subscribeToConversations(currentUser.uid, setConversations);
    return unsubscribe;
  }, [showShareModal, currentUser?.uid]);

  // Intersection Observer for autoplay & views increment
  useEffect(() => {
    const el = videoRef.current;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!videoError && el) {
            el.play().catch(() => {});
          }
          dbService.incrementReelViews(reel.id);
        } else {
          if (!videoError && el) {
            el.pause();
          }
        }
      });
    }, { threshold: 0.6 });

    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
    };
  }, [reel.id, videoError]);

  const [isPlaying, setIsPlaying] = useState(true);
  const lastTapRef = useRef(0);
  const tapTimeoutRef = useRef(null);

  const handleTap = () => {
    soundEngine.init();
    if (isMuted) {
      setIsMuted(false);
    }
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
        tapTimeoutRef.current = null;
      }
      if (!isLiked && currentUser?.uid) {
        dbService.likeReel(reel.id, currentUser.uid);
      }
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 800);
    } else {
      tapTimeoutRef.current = setTimeout(() => {
        if (videoRef.current) {
          if (videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
            setIsPlaying(true);
          } else {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      }, 250);
    }
    lastTapRef.current = now;
  };

  useEffect(() => {
    return () => {
      if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
    };
  }, []);

  const handleLike = () => {
    if (!currentUser?.uid) return;
    dbService.likeReel(reel.id, currentUser.uid);
  };

  const handleSave = () => {
    if (!currentUser?.uid) return;
    dbService.savePost(reel.id, currentUser.uid);
    setIsSaved(!isSaved);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser?.uid) return;
    dbService.addComment(reel.id, currentUser.uid, newComment.trim());
    setNewComment('');
  };

  const handleRepost = () => {
    if (!currentUser?.uid) return;
    if (window.confirm("Опубликовать этот Reel в вашу ленту?")) {
      dbService.repostPost(reel.id, currentUser.uid);
    }
  };

  const handleShareReel = async (convId) => {
    if (!currentUser?.uid) return;
    try {
      await dbService.sendMessage(convId, currentUser.uid, "Отправил Reels 🎬", null, null, reel.id);
      alert("Reels успешно отправлен другу в чат!");
      setShowShareModal(false);
    } catch (e) {
      alert("Не удалось отправить Reels");
    }
  };

  const getYouTubeId = (url) => {
    if (!url) return null;
    if (url.startsWith('youtube:')) return url.split(':')[1];
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    }
    return null;
  };

  const ytId = getYouTubeId(reel.mediaURL);

  return (
    <div 
      className="reel-card w-full h-full snap-start relative flex flex-col justify-end select-none animate-fade-in"
      onClick={handleTap}
    >
      {/* Video element or YouTube iframe or Motion Animated Video Fallback */}
      {ytId ? (
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
          <iframe 
            src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${ytId}&controls=0&modestbranding=1&rel=0&enablejsapi=1`}
            className="w-full h-full border-0 scale-125"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title="YouTube Video"
          />
        </div>
      ) : videoError ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-black z-0">
          <motion.img 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            src={reel.coverURL || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80'} 
            alt="Reel Cover" 
            className="w-full h-full object-cover opacity-90"
          />
        </div>
      ) : (
        <video 
          ref={videoRef}
          src={reel.mediaURL}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}

      {/* Prominent Floating Unmute Banner if Muted */}
      {isMuted && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            soundEngine.init();
            setIsMuted(false);
          }}
          className="absolute top-28 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-gradient-to-r from-purple-600 to-brand hover:scale-105 text-white rounded-full text-xs font-extrabold shadow-2xl backdrop-blur-md border border-white/20 flex items-center gap-2 animate-bounce cursor-pointer"
        >
          <VolumeX size={18} />
          <span>🔊 Нажмите, чтобы включить звук</span>
        </button>
      )}

      {/* Red YouTube Button Link Overlay for A4 or YouTube clips */}
      {(ytId || reel.userId === 'vlad_a4') && (
        <a 
          href={ytId ? `https://www.youtube.com/watch?v=${ytId}` : 'https://www.youtube.com/@A4a4a4a4'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute top-6 right-6 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-extrabold flex items-center gap-1.5 z-20 shadow-lg cursor-pointer transition-all hover:scale-105"
          onClick={(e) => e.stopPropagation()}
        >
          <span>Смотреть на YouTube 📺</span>
        </a>
      )}

      {/* Play/Pause Overlay Icon */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none z-10">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-5 rounded-full bg-black/60 text-white"
          >
            <Play size={40} fill="currentColor" />
          </motion.div>
        </div>
      )}

      {/* Video Progress Timeline Bar */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20 z-30">
        <div 
          className="h-full bg-gradient-to-r from-brand via-purple-500 to-pink-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Shadow gradient overlays */}
      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />

      {/* Left Bottom Information Overlay (Authentic Instagram Reels style) */}
      <div className="absolute bottom-6 left-5 right-16 z-20 text-white flex flex-col gap-2 pointer-events-auto">
        <div className="flex items-center gap-2.5">
          <Link to={`/profile/${author?.uid}`} onClick={(e) => e.stopPropagation()} className="relative shrink-0">
            <img 
              src={author?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg'} 
              alt={author?.displayName} 
              className="w-10 h-10 rounded-full object-cover ring-2 ring-brand/80"
            />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Link to={`/profile/${author?.uid}`} onClick={(e) => e.stopPropagation()} className="font-bold text-sm hover:underline leading-tight flex items-center gap-1">
                <span>{author?.displayName}</span>
                {author?.isVerified && (
                  <span className="text-blue-400" title="Подтвержденный профиль">
                    <CheckCircle2 size={14} className="fill-blue-500 text-white" />
                  </span>
                )}
              </Link>

              {/* Instagram Follow / Subscribed Button */}
              {currentUser && author && currentUser.uid !== author.uid && (
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    const isFollowing = currentUser.following?.includes(author.uid);
                    if (isFollowing) {
                      await dbService.unfollowUser(currentUser.uid, author.uid);
                    } else {
                      await dbService.followUser(currentUser.uid, author.uid);
                    }
                  }}
                  className={`ml-1.5 px-3 py-0.5 rounded-full text-[11px] font-extrabold transition-all cursor-pointer border ${
                    currentUser.following?.includes(author.uid)
                      ? 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                      : 'bg-white text-black border-white hover:bg-white/90 shadow-md hover:scale-105'
                  }`}
                >
                  {currentUser.following?.includes(author.uid) ? 'Подписки' : '+ Подписаться'}
                </button>
              )}
            </div>
            <span className="text-[10px] text-white/70">@{author?.username}</span>
          </div>
        </div>

        {/* Location Tag */}
        <div className="flex items-center gap-1 text-[10px] font-semibold text-purple-300/90">
          <MapPin size={11} className="text-purple-400" />
          <span>📍 г. Ош, Кыргызстан</span>
        </div>

        <p className="text-xs text-white/95 leading-relaxed font-medium line-clamp-2">
          {reel.caption}
        </p>

        {/* Music Track Badge */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setShowAudioDrawer(true);
          }}
          className={`flex items-center gap-2 text-[11px] font-bold px-3 py-1 rounded-full border backdrop-blur-md w-fit max-w-[280px] transition-all cursor-pointer ${
            !isMuted 
              ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-400/50' 
              : 'bg-black/50 text-white/90 border-white/10 hover:bg-black/70'
          }`}
        >
          <Music size={13} className={`${!isMuted ? 'text-emerald-400 animate-spin' : 'text-purple-400'} shrink-0`} />
          <span className="truncate">{reel.audioTitle || '🎵 Футбол & Музыка — Оригинальный трек ⚽'}</span>
          {!isMuted ? (
            <span className="flex items-end gap-0.5 h-3 ml-1 shrink-0">
              <span className="w-0.5 h-full bg-emerald-400 animate-pulse" />
              <span className="w-0.5 h-2 bg-emerald-400 animate-bounce" />
              <span className="w-0.5 h-3 bg-emerald-400 animate-pulse" />
            </span>
          ) : (
            <span className="text-[10px] text-red-400 font-extrabold ml-1 shrink-0">🔇 Звук ВЫКЛ</span>
          )}
        </button>

        <div className="flex items-center gap-1.5 text-[10px] text-white/60 bg-white/10 px-2.5 py-0.5 rounded-full w-fit">
          <Eye size={12} />
          <span>{formatCount(reel.viewsCount || 0)} просмотров</span>
        </div>
      </div>

      {/* Right Column Action Bar (Official Instagram Reels Icons Layout) */}
      <div className="absolute bottom-16 right-3 z-20 flex flex-col items-center gap-4 text-white pointer-events-auto">
        {/* Like */}
        <div className="flex flex-col items-center">
          <button 
            onClick={(e) => { e.stopPropagation(); handleLike(); }}
            className={`p-2.5 rounded-full bg-black/40 hover:bg-black/60 hover:scale-110 transition-all ${
              isLiked ? 'text-red-500' : 'text-white'
            }`}
          >
            <Heart size={24} className={isLiked ? 'fill-current text-red-500' : ''} />
          </button>
          <span className="text-[10px] font-extrabold mt-0.5 text-white">{formatCount(reel.likes.length)}</span>
        </div>

        {/* Comments */}
        <div className="flex flex-col items-center">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowComments(true); }}
            className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 hover:scale-110 transition-all"
          >
            <MessageCircle size={24} />
          </button>
          <span className="text-[10px] font-extrabold mt-0.5 text-white">{formatCount(reel.commentsCount || 0)}</span>
        </div>

        {/* Repost */}
        <button 
          onClick={(e) => { e.stopPropagation(); handleRepost(); }}
          className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 hover:scale-110 transition-all text-white hover:text-brand"
          title="Репост в профиль"
        >
          <Repeat2 size={24} />
        </button>

        {/* Send / Share to Direct Chat */}
        <button 
          onClick={(e) => { e.stopPropagation(); setShowShareModal(true); }}
          className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 hover:scale-110 transition-all text-white hover:text-brand"
          title="Поделиться Reels"
        >
          <Send size={24} />
        </button>

        {/* Bookmark Save */}
        <button 
          onClick={(e) => { e.stopPropagation(); handleSave(); }}
          className={`p-2.5 rounded-full bg-black/40 hover:bg-black/60 hover:scale-110 transition-all ${
            isSaved ? 'text-brand' : 'text-white'
          }`}
        >
          <Bookmark size={24} className={isSaved ? 'fill-current' : ''} />
        </button>

        {/* Delete Reel (if owner or admin) */}
        {(reel.userId === currentUser.uid || currentUser.isAdmin) && (
          <button 
            onClick={async (e) => { 
              e.stopPropagation(); 
              if (window.confirm("Удалить этот Reel навсегда?")) {
                await dbService.deleteReel(reel.id);
                alert("Reel успешно удален!");
              }
            }}
            className="p-2 rounded-full bg-black/40 hover:bg-red-600 hover:scale-110 transition-all text-red-500 hover:text-white"
            title="Удалить Reel"
          >
            <Trash2 size={20} />
          </button>
        )}

        {/* Spinning Audio Album Disc (Instagram Vinyl Record) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowAudioDrawer(true);
          }}
          className="relative mt-1 p-0.5 rounded-full border-2 border-white/80 bg-black/60 hover:scale-110 transition-all cursor-pointer shadow-2xl group"
          title="Информация об аудиотреке"
        >
          <img 
            src={author?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg'} 
            alt="Audio Art" 
            className={`w-7 h-7 rounded-full object-cover ${!isMuted ? 'animate-spin' : ''}`}
            style={{ animationDuration: '4s' }}
          />
          <div className="absolute inset-0 rounded-full border border-black/40" />
        </button>
      </div>

      {/* Double tap heart popup overlay */}
      <AnimatePresence>
        {showHeartPop && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.3, 0.9, 1], opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          >
            <Heart size={95} className="fill-red-500 text-red-500 filter drop-shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reel Comments Drawer */}
      <AnimatePresence>
        {showComments && (
          <>
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/40 z-30 backdrop-blur-xs" 
              onClick={(e) => { e.stopPropagation(); setShowComments(false); }} 
            />
            {/* Drawer */}
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-x-0 bottom-0 h-[65%] rounded-t-3xl bg-theme-lightCard dark:bg-theme-darkCard text-theme-lightText dark:text-theme-darkText flex flex-col p-5 z-40 transition-colors shadow-2xl border-t border-theme-lightBorder dark:border-theme-darkBorder"
            >
              <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-3" />
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider">Комментарии ({comments.length})</span>
                <button 
                  onClick={() => setShowComments(false)}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-lg text-slate-500 cursor-pointer"
                >
                  Закрыть
                </button>
              </div>

              {/* Scrollable list */}
              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3.5 mb-3">
                {comments.length === 0 ? (
                  <p className="text-xs text-theme-lightMuted dark:text-theme-darkMuted italic text-center py-8">
                    Нет комментариев. Напишите что-нибудь классное!
                  </p>
                ) : (
                  comments.map(c => {
                    const cUser = users.find(u => u.uid === c.userId);
                    return (
                      <div key={c.id} className="text-xs flex gap-2.5 items-start">
                        <img 
                          src={cUser?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg'} 
                          alt="avatar" 
                          className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" 
                        />
                        <div className="flex-1">
                          <Link to={`/profile/${c.userId}`} className="font-bold hover:underline shrink-0 text-brand mr-1.5">
                            @{cUser ? cUser.username : 'user'}
                          </Link>
                          <span className="text-slate-700 dark:text-slate-300 break-all">{c.text}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Quick Emoji Reaction Bar */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 border-t border-theme-lightBorder dark:border-theme-darkBorder">
                {['❤️', '🔥', '🙌', '😂', '👏', '😮', '😍', '🍿', '⚽', '🏆'].map(emoji => (
                  <button 
                    key={emoji}
                    type="button"
                    onClick={() => setNewComment(prev => prev + emoji)}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-lg hover:scale-125 transition-transform cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Input form */}
              <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                <input 
                  type="text" 
                  placeholder="Добавить комментарий..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 border border-theme-lightBorder dark:border-theme-darkBorder rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-brand"
                />
                <button 
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-xl text-xs font-bold disabled:opacity-50 transition-colors cursor-pointer"
                >
                  Отправить
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Share Reel Modal Dialog */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowShareModal(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-2xl border border-theme-lightBorder dark:border-theme-darkBorder bg-theme-lightCard dark:bg-theme-darkCard text-theme-lightText dark:text-theme-darkText p-6 shadow-2xl z-10 transition-colors"
            >
              <h3 className="text-md font-extrabold mb-4 flex items-center gap-2">
                <Send size={18} className="text-brand" />
                <span>Отправить Reels другу</span>
              </h3>
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1 mb-4">
                {conversations.length === 0 ? (
                  <p className="text-xs text-theme-lightMuted dark:text-theme-darkMuted italic text-center py-4">
                    Нет активных бесед. Перейдите в Сообщения, чтобы начать чат!
                  </p>
                ) : (
                  conversations.map(conv => {
                    const recipientUid = conv.participants.find(p => p !== currentUser.uid);
                    const recipient = users.find(u => u.uid === recipientUid);
                    if (!recipient) return null;
                    return (
                      <button 
                        key={conv.id}
                        onClick={() => handleShareReel(conv.id)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-left w-full cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={recipient.photoURL} 
                            alt={recipient.displayName} 
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-brand/30"
                          />
                          <div>
                            <p className="text-xs font-bold leading-tight">{recipient.displayName}</p>
                            <p className="text-[10px] text-slate-400 leading-tight">@{recipient.username}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-extrabold text-white bg-brand px-3 py-1.5 rounded-lg shadow-sm hover:scale-105 transition-all">
                          Отправить
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
              <button 
                onClick={() => setShowShareModal(false)}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-xl text-center cursor-pointer"
              >
                Отмена
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Audio Track Remix Drawer Modal */}
      <AnimatePresence>
        {showAudioDrawer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAudioDrawer(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-3xl border border-theme-lightBorder dark:border-theme-darkBorder bg-theme-lightCard dark:bg-theme-darkCard text-theme-lightText dark:text-theme-darkText p-6 shadow-2xl z-10 text-center flex flex-col items-center gap-4 transition-colors"
            >
              <div className="w-20 h-20 rounded-full ring-4 ring-purple-500/40 p-1 bg-gradient-to-tr from-purple-600 to-pink-500 shadow-xl overflow-hidden">
                <img 
                  src={author?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg'} 
                  alt="Music Cover" 
                  className="w-full h-full rounded-full object-cover animate-spin"
                  style={{ animationDuration: '6s' }}
                />
              </div>

              <div>
                <h3 className="font-extrabold text-base leading-snug">
                  {reel.audioTitle || '🎵 Оригинальный аудио трек'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Автор: @{author?.username || 'instagram'}
                </p>
                <p className="text-[11px] font-bold text-purple-500 mt-2 bg-purple-500/10 px-3 py-1 rounded-full inline-block">
                  🎬 14.5K видео с этим звуком
                </p>
              </div>

              <button 
                onClick={() => {
                  setShowAudioDrawer(false);
                  handleCreateReelClick();
                }}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-brand hover:scale-105 text-white rounded-2xl text-xs font-extrabold shadow-xl shadow-purple-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Music size={16} />
                <span>🎙️ Использовать этот аудио трек в Reels</span>
              </button>

              <button 
                onClick={() => setShowAudioDrawer(false)}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Закрыть
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
