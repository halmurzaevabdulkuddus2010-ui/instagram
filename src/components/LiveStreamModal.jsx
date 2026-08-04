// LiveStreamModal.jsx - Authentic Instagram Live Stream Component
import React, { useState, useEffect, useRef } from 'react';
import { dbService } from '../services/dbService';
import { 
  Radio, 
  X, 
  Heart, 
  Send, 
  Users, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveStreamModal({ isOpen, onClose, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [viewers, setViewers] = useState(1420);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  // Subscribe to live comments simulation
  useEffect(() => {
    if (!isOpen) return;

    // Viewer count ticker
    const viewerInterval = setInterval(() => {
      setViewers(prev => prev + Math.floor(Math.random() * 7) - 3);
    }, 3000);

    const unsub = dbService.subscribeToLiveComments('live_main', setComments);

    return () => {
      clearInterval(viewerInterval);
      unsub();
    };
  }, [isOpen]);

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;
    const commentObj = {
      id: `live_c_${Date.now()}`,
      username: currentUser.username || 'me',
      text: newComment.trim(),
      createdAt: new Date().toISOString()
    };
    setComments(prev => [...prev.slice(-15), commentObj]);
    setNewComment('');
  };

  const handleTapHeart = () => {
    const newHeart = {
      id: Date.now() + Math.random(),
      left: Math.random() * 40 + 60 // 60% to 100% right
    };
    setFloatingHearts(prev => [...prev, newHeart]);
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 select-none">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

        {/* Live Stream Main Container */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md h-full md:h-[90vh] md:rounded-3xl bg-black overflow-hidden shadow-2xl flex flex-col justify-end z-10 border border-white/10"
        >
          {/* Background Live Stream Video Feed */}
          <video 
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          {/* Top Gradient Overlay */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-10" />
          {/* Bottom Gradient Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />

          {/* Top Bar Header */}
          <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs font-extrabold rounded-full shadow-lg animate-pulse">
                <Radio size={14} className="animate-spin" />
                <span>LIVE 🔴</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 bg-black/50 text-white text-xs font-bold rounded-full backdrop-blur-md border border-white/10">
                <Users size={13} className="text-pink-400" />
                <span>{viewers.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 bg-black/50 text-white rounded-full backdrop-blur-md hover:bg-black/70 transition-all cursor-pointer"
              >
                {isMuted ? <VolumeX size={18} className="text-red-400" /> : <Volume2 size={18} className="text-emerald-400" />}
              </button>
              <button 
                onClick={onClose}
                className="p-2 bg-black/50 text-white rounded-full backdrop-blur-md hover:bg-black/70 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Floating Hearts Animation Container */}
          <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
            {floatingHearts.map(h => (
              <motion.div
                key={h.id}
                initial={{ y: '100%', opacity: 1, scale: 0.8 }}
                animate={{ y: '-40%', opacity: 0, scale: 1.5 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute bottom-20"
                style={{ left: `${h.left}%` }}
              >
                <Heart size={32} className="fill-pink-500 text-pink-500 filter drop-shadow-lg" />
              </motion.div>
            ))}
          </div>

          {/* Live Comments Overlay & Action Bar */}
          <div className="relative z-20 p-4 flex flex-col gap-3 pointer-events-auto">
            {/* Live Comments Scroll Area */}
            <div className="max-h-48 overflow-y-auto no-scrollbar flex flex-col gap-2 pr-2">
              {comments.map((c, i) => (
                <motion.div 
                  key={c.id || i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-2xl w-fit max-w-[85%] border border-white/10 text-xs"
                >
                  <span className="font-extrabold text-pink-300">@{c.username}</span>
                  <span className="text-white/90">{c.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Bottom Input & Hearts Button Bar */}
            <div className="flex items-center gap-2 pt-2">
              <form onSubmit={handleSendComment} className="flex-1 flex gap-2">
                <input 
                  type="text"
                  placeholder="Комментировать прямой эфир..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 bg-black/60 border border-white/20 rounded-full px-4 py-2.5 text-xs text-white placeholder-white/50 focus:outline-none focus:border-pink-500 backdrop-blur-md"
                />
                <button 
                  type="submit"
                  disabled={!newComment.trim()}
                  className="p-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full disabled:opacity-40 transition-transform active:scale-95 shadow-lg cursor-pointer"
                >
                  <Send size={16} />
                </button>
              </form>

              {/* Heart Pulse Button */}
              <button
                type="button"
                onClick={handleTapHeart}
                className="p-2.5 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full shadow-lg hover:scale-110 active:scale-90 transition-transform cursor-pointer"
              >
                <Heart size={20} className="fill-current" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
