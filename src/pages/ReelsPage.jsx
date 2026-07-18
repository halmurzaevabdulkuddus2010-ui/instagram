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

  // Subscriptions
  useEffect(() => {
    const unsubReels = dbService.subscribeToReels(setReels);
    const unsubUsers = dbService.subscribeToUsers(setUsers);
    return () => {
      unsubReels();
      unsubUsers();
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto h-[calc(100vh-3.5rem)] md:h-[calc(100vh-2rem)] md:my-4 flex items-center justify-center">
      {reels.length === 0 ? (
        <div className="text-center p-8 bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-2xl">
          <p className="text-sm font-semibold">Нет доступных Reels</p>
          <p className="text-xs text-slate-500 mt-1">Опубликуйте первое короткое видео!</p>
        </div>
      ) : (
        <div className="reels-container w-full h-full overflow-y-scroll no-scrollbar snap-y snap-mandatory bg-black md:rounded-3xl shadow-2xl relative">
          {reels.map((reel) => (
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
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
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

  // Intersection Observer for autoplay & views increment
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
          // Increment views
          dbService.incrementReelViews(reel.id);
        } else {
          videoRef.current?.pause();
          videoRef.current.currentTime = 0;
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
  }, [reel.id]);

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
    // Treat reel like post save
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

  return (
    <div 
      className="reel-card w-full h-full snap-start relative flex flex-col justify-end select-none"
      onClick={handleDoubleTap}
    >
      {/* Video element */}
      <video 
        ref={videoRef}
        src={reel.mediaURL}
        loop
        muted={isMuted}
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

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
        >
          <Repeat2 size={22} />
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
    </div>
  );
}
