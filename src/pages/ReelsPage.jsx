// ReelsPage.jsx - Full screen vertical scroll for short video Reels
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  MessageCircle, 
  Repeat2, 
  Send, 
  Bookmark, 
  Volume2, 
  VolumeX, 
  Eye 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReelsPage() {
  const { currentUser } = useAuth();
  const [reels, setReels] = useState([]);
  const [users, setUsers] = useState([]);
  const [isMuted, setIsMuted] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'cartoons' | 'a4'

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

  // Filter reels based on category selection
  const filteredReels = reels.filter(r => {
    if (activeCategory === 'masha') {
      return r.userId === 'masha_medved' || r.caption?.toLowerCase().includes('маша') || r.hashtags?.includes('машаимедведь') || r.hashtags?.includes('masha');
    }
    if (activeCategory === 'cartoons') {
      const isCartoonTag = r.hashtags?.some(h => ['cartoon', 'мультики', 'animation', 'anime', 'kids', 'dragon', '3d', 'машаимедведь', 'masha'].includes(h));
      const isCartoonUser = r.userId === 'cartoon_master' || r.userId === 'masha_medved';
      const isCartoonCaption = r.caption?.toLowerCase().includes('мульт') || r.caption?.toLowerCase().includes('cartoon') || r.caption?.toLowerCase().includes('маша');
      return isCartoonTag || isCartoonUser || isCartoonCaption;
    }
    if (activeCategory === 'a4') {
      return r.userId === 'vlad_a4' || r.hashtags?.includes('a4');
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
          
          <button
            onClick={handleCreateReelClick}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-brand hover:scale-105 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-purple-500/30 flex items-center gap-1 transition-all cursor-pointer"
          >
            <span>+ Добавить Reels</span>
          </button>
        </div>

        {/* Category Filters Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button 
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold backdrop-blur-md transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-white text-black shadow-lg scale-105'
                : 'bg-black/60 text-white/80 hover:bg-black/80'
            }`}
          >
            🎬 Все
          </button>

          <button 
            onClick={() => setActiveCategory('masha')}
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer ${
              activeCategory === 'masha'
                ? 'bg-pink-500 text-white shadow-lg scale-105 ring-2 ring-pink-300'
                : 'bg-black/60 text-pink-300 hover:bg-black/80'
            }`}
          >
            <span>👧🐻 Маша и Медведь</span>
          </button>

          <button 
            onClick={() => setActiveCategory('cartoons')}
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer ${
              activeCategory === 'cartoons'
                ? 'bg-amber-400 text-black shadow-lg scale-105 ring-2 ring-amber-300'
                : 'bg-black/60 text-amber-300 hover:bg-black/80'
            }`}
          >
            <span>🍿 Мультфильмы</span>
          </button>

          <button 
            onClick={() => setActiveCategory('a4')}
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer ${
              activeCategory === 'a4'
                ? 'bg-red-500 text-white shadow-lg scale-105'
                : 'bg-black/60 text-red-300 hover:bg-black/80'
            }`}
          >
            <span>⚡ Влад А4</span>
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
        <div className="reels-container w-full h-full overflow-y-scroll no-scrollbar snap-y snap-mandatory bg-black md:rounded-3xl shadow-2xl relative">
          {filteredReels.map((reel) => (
            <ReelCard 
              key={reel.id} 
              reel={reel} 
              users={users} 
              currentUser={currentUser} 
              isMuted={isMuted}
              setIsMuted={setIsMuted}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ReelCard({ reel, users, currentUser, isMuted, setIsMuted }) {
  const videoRef = useRef(null);
  const [author, setAuthor] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [videoError, setVideoError] = useState(false);
  
  const creator = users.find(u => u.uid === reel.userId);

  useEffect(() => {
    if (creator) setAuthor(creator);
  }, [creator]);

  useEffect(() => {
    setIsLiked(reel.likes.includes(currentUser.uid));
    setIsSaved(reel.saves?.includes(currentUser.uid) || false);
  }, [reel, currentUser]);

  // Subscribe to comments
  useEffect(() => {
    if (!showComments) return;
    const unsubscribe = dbService.subscribeToComments(reel.id, setComments);
    return unsubscribe;
  }, [showComments, reel.id]);

  // Subscribe to conversations for sharing
  useEffect(() => {
    if (!showShareModal) return;
    const unsubscribe = dbService.subscribeToConversations(currentUser.uid, setConversations);
    return unsubscribe;
  }, [showShareModal, currentUser.uid]);

  // Intersection Observer for autoplay & views increment
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!videoError) {
            videoRef.current?.play().catch(() => {});
          }
          // Increment views
          dbService.incrementReelViews(reel.id);
        } else {
          if (!videoError && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
        }
      });
    }, { threshold: 0.6 });

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [reel.id, videoError]);

  // Double tap to like
  let lastTap = 0;
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      if (!isLiked) {
        dbService.likeReel(reel.id, currentUser.uid);
      }
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 800);
    }
    lastTap = now;
  };

  const handleLike = () => {
    dbService.likeReel(reel.id, currentUser.uid);
  };

  const handleSave = () => {
    dbService.savePost(reel.id, currentUser.uid);
    setIsSaved(!isSaved);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    dbService.addComment(reel.id, currentUser.uid, newComment.trim());
    setNewComment('');
  };

  const handleRepost = () => {
    if (window.confirm("Опубликовать этот Reel в вашу ленту?")) {
      dbService.repostPost(reel.id, currentUser.uid);
    }
  };

  const handleShareReel = async (convId) => {
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
      onClick={handleDoubleTap}
    >
      {/* Video element or YouTube iframe or Motion Animated Video Fallback */}
      {ytId ? (
        <iframe 
          src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${ytId}&controls=1&modestbranding=1&rel=0`}
          className="absolute inset-0 w-full h-full border-0 z-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title="YouTube Video"
        />
      ) : videoError ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-black z-0">
          <motion.img 
            animate={{ scale: [1, 1.15, 1], x: [0, -10, 0], y: [0, -15, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            src={reel.coverURL || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80'} 
            alt="Animated Reel" 
            className="w-full h-full object-cover"
          />
          {/* Animated Audio Equalizer Visualizer Overlay */}
          <div className="absolute top-16 right-6 flex items-end gap-1 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
            <span className="w-1 h-4 bg-brand rounded-full animate-pulse" />
            <span className="w-1 h-6 bg-purple-400 rounded-full animate-bounce" />
            <span className="w-1 h-3 bg-pink-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-white ml-1">Анимированный Видео-Reel</span>
          </div>
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

      {/* Shadow gradient overlays */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />

      {/* Floating Mute Indicator */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setIsMuted(!isMuted);
        }}
        className="absolute top-6 left-6 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      {/* Left Bottom Information Overlay */}
      <div className="absolute bottom-6 left-6 right-16 z-20 text-white flex flex-col gap-3 pointer-events-auto">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${author?.uid}`} onClick={(e) => e.stopPropagation()}>
            <img 
              src={author?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg'} 
              alt={author?.displayName} 
              className="w-10 h-10 rounded-full object-cover ring-2 ring-brand"
            />
          </Link>
          <div>
            <Link to={`/profile/${author?.uid}`} onClick={(e) => e.stopPropagation()} className="font-bold text-sm hover:underline block leading-tight">
              {author?.displayName}
            </Link>
            <span className="text-[10px] text-white/60">@{author?.username}</span>
          </div>
        </div>

        <p className="text-xs text-white/90 leading-relaxed font-medium">
          {reel.caption}
        </p>

        <div className="flex items-center gap-1.5 text-[10px] text-white/60 bg-white/10 px-2.5 py-1 rounded-full w-fit">
          <Eye size={12} />
          <span>{reel.viewsCount || 0} просмотров</span>
        </div>
      </div>

      {/* Right Column Overlay Buttons */}
      <div className="absolute bottom-16 right-4 z-20 flex flex-col items-center gap-5 text-white pointer-events-auto">
        {/* Like */}
        <div className="flex flex-col items-center">
          <button 
            onClick={(e) => { e.stopPropagation(); handleLike(); }}
            className={`p-2.5 rounded-full bg-black/40 hover:bg-black/60 hover:scale-105 transition-all ${
              isLiked ? 'text-red-500' : 'text-white'
            }`}
          >
            <Heart size={22} className={isLiked ? 'fill-current text-red-500' : ''} />
          </button>
          <span className="text-[10px] font-bold mt-1 text-white/80">{reel.likes.length}</span>
        </div>

        {/* Comments */}
        <div className="flex flex-col items-center">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowComments(true); }}
            className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 hover:scale-105 transition-all"
          >
            <MessageCircle size={22} />
          </button>
          <span className="text-[10px] font-bold mt-1 text-white/80">{reel.commentsCount || 0}</span>
        </div>

        {/* Repost */}
        <button 
          onClick={(e) => { e.stopPropagation(); handleRepost(); }}
          className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 hover:scale-105 transition-all text-white hover:text-brand"
          title="Репост"
        >
          <Repeat2 size={22} />
        </button>

        {/* Send / Share to Direct Chat */}
        <button 
          onClick={(e) => { e.stopPropagation(); setShowShareModal(true); }}
          className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 hover:scale-105 transition-all text-white hover:text-brand"
          title="Поделиться Reels в чате"
        >
          <Send size={22} />
        </button>

        {/* Bookmark Save */}
        <button 
          onClick={(e) => { e.stopPropagation(); handleSave(); }}
          className={`p-2.5 rounded-full bg-black/40 hover:bg-black/60 hover:scale-105 transition-all ${
            isSaved ? 'text-brand' : 'text-white'
          }`}
        >
          <Bookmark size={22} className={isSaved ? 'fill-current' : ''} />
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
            <Heart size={90} className="fill-red-500 text-red-500 filter drop-shadow-xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reel Comments Drawer */}
      <AnimatePresence>
        {showComments && (
          <>
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/30 z-30" 
              onClick={(e) => { e.stopPropagation(); setShowComments(false); }} 
            />
            {/* Drawer */}
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()} // Stop bubbling double taps
              className="absolute inset-x-0 bottom-0 h-[60%] rounded-t-3xl bg-theme-lightCard dark:bg-theme-darkCard text-theme-lightText dark:text-theme-darkText flex flex-col p-6 z-40 transition-colors"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold uppercase tracking-wider">Комментарии ({comments.length})</span>
                <button 
                  onClick={() => setShowComments(false)}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-lg text-slate-500"
                >
                  Закрыть
                </button>
              </div>

              {/* Scrollable list */}
              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 mb-4">
                {comments.length === 0 ? (
                  <p className="text-xs text-theme-lightMuted dark:text-theme-darkMuted italic text-center py-8">
                    Нет комментариев. Напишите что-нибудь классное!
                  </p>
                ) : (
                  comments.map(c => {
                    const cUser = users.find(u => u.uid === c.userId);
                    return (
                      <div key={c.id} className="text-xs flex gap-2.5 items-start">
                        <Link to={`/profile/${c.userId}`} className="font-bold hover:underline shrink-0 text-brand">
                          @{cUser ? cUser.username : 'user'}
                        </Link>
                        <p className="text-slate-650 dark:text-slate-350 break-all">{c.text}</p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input form */}
              <form onSubmit={handleAddComment} className="flex gap-2 border-t border-theme-lightBorder dark:border-theme-darkBorder pt-4">
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
                  className="px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-xl text-xs font-bold disabled:opacity-50 transition-colors"
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
    </div>
  );
}
