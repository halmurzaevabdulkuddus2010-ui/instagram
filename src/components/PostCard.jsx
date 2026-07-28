// PostCard.jsx - Modern, feature-rich social card for photos, videos, and shared posts
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { 
  Heart, 
  MessageCircle, 
  Repeat2, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  Volume2, 
  VolumeX, 
  Trash2, 
  AlertTriangle, 
  UserMinus 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PostCard({ post, authors = [], currentUserId }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [reposter, setReposter] = useState(null);
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [isMuted, setIsMuted] = useState(true);

  // Fetch author & reposter metadata
  useEffect(() => {
    const postAuthor = authors.find(u => u.uid === post.userId);
    setAuthor(postAuthor || null);

    if (post.repostedBy) {
      const postReposter = authors.find(u => u.uid === post.repostedBy);
      setReposter(postReposter || null);
    } else {
      setReposter(null);
    }
  }, [post, authors]);

  // Subscribe to comments
  useEffect(() => {
    if (!showComments) return;
    const unsubscribe = dbService.subscribeToComments(post.id, setComments);
    return unsubscribe;
  }, [showComments, post.id]);

  // Subscribe to conversations for post sharing
  useEffect(() => {
    if (!showShareModal) return;
    const unsubscribe = dbService.subscribeToConversations(currentUser.uid, setConversations);
    return unsubscribe;
  }, [showShareModal, currentUser.uid]);

  if (author && author.isBanned) return null;

  const isLiked = post.likes.includes(currentUser.uid);
  const isSaved = post.saves?.includes(currentUser.uid);

  // Double tap handler
  let lastTap = 0;
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      if (!isLiked) {
        dbService.likePost(post.id, currentUser.uid);
      }
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 800);
    }
    lastTap = now;
  };

  const handleLike = () => {
    dbService.likePost(post.id, currentUser.uid);
  };

  const handleSave = () => {
    dbService.savePost(post.id, currentUser.uid);
  };

  const handleRepost = () => {
    if (window.confirm("Репостнуть эту запись на свою страницу?")) {
      dbService.repostPost(post.id, currentUser.uid);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    dbService.addComment(post.id, currentUser.uid, newComment.trim());
    setNewComment('');
  };

  const handleSharePost = async (convId) => {
    try {
      await dbService.sendMessage(convId, currentUser.uid, "Поделился публикацией", post.id);
      alert("Публикация отправлена в чат!");
      setShowShareModal(false);
    } catch (e) {
      alert("Не удалось отправить публикацию");
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm("Удалить этот пост навсегда?")) {
      await dbService.deletePost(post.id);
      setShowMenu(false);
    }
  };

  const handleReportPost = async () => {
    const reason = prompt("Укажите причину жалобы (спам, неприемлемый контент, и т.д.):");
    if (reason && reason.trim()) {
      await dbService.reportPost(currentUser.uid, post.id, reason.trim());
      alert("Жалоба отправлена на рассмотрение модераторам.");
      setShowMenu(false);
    }
  };

  const handleBlockUser = async () => {
    if (window.confirm(`Заблокировать пользователя @${author.username}? Вы больше не будете видеть его посты.`)) {
      await dbService.blockUser(currentUser.uid, author.uid);
      setShowMenu(false);
    }
  };

  const getPostTime = (isoString) => {
    const minutes = Math.floor((Date.now() - new Date(isoString).getTime()) / (1000 * 60));
    if (minutes < 60) return `${minutes}м назад`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}ч назад`;
    const days = Math.floor(hours / 24);
    return `${days}д назад`;
  };

  return (
    <article className="relative w-full bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-2xl overflow-hidden transition-colors duration-200 shadow-sm mb-6">
      
      {/* Repost Header Indicator */}
      {reposter && (
        <div className="flex items-center gap-1.5 px-4 pt-3 text-xs font-semibold text-theme-lightMuted dark:text-theme-darkMuted border-b border-slate-50 dark:border-slate-800/40 pb-2">
          <Repeat2 size={14} className="text-brand" />
          <span>Репост от</span>
          <Link to={`/profile/${reposter.uid}`} className="hover:underline text-brand">
            @{reposter.username}
          </Link>
        </div>
      )}

      {/* Main Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${author?.uid}`} className="block">
            <img 
              src={author?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg'} 
              alt={author?.displayName} 
              className="w-10 h-10 rounded-full object-cover ring-2 ring-brand/10 hover:ring-brand/40 transition-all"
            />
          </Link>
          <div>
            <Link to={`/profile/${author?.uid}`} className="font-semibold text-sm hover:underline block leading-tight">
              {author?.displayName}
            </Link>
            <span className="text-[11px] text-theme-lightMuted dark:text-theme-darkMuted leading-tight">
              {getPostTime(post.createdAt)}
            </span>
          </div>
        </div>

        {/* Options Dot Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-500 transition-colors"
          >
            <MoreHorizontal size={18} />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 mt-2 w-48 rounded-xl bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder shadow-xl py-1.5 z-40"
                >
                  {(post.userId === currentUser.uid || post.repostedBy === currentUser.uid || currentUser.isAdmin) && (
                    <button 
                      onClick={handleDeletePost}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 font-medium"
                    >
                      <Trash2 size={16} />
                      <span>Удалить пост</span>
                    </button>
                  )}
                  {(post.userId !== currentUser.uid && post.repostedBy !== currentUser.uid) && (
                    <>
                      <button 
                        onClick={handleReportPost}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-sm text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 font-medium"
                      >
                        <AlertTriangle size={16} />
                        <span>Пожаловаться</span>
                      </button>
                      <button 
                        onClick={handleBlockUser}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 font-medium"
                      >
                        <UserMinus size={16} />
                        <span>Заблокировать</span>
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
                      alert("Ссылка скопирована!");
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <span>Скопировать ссылку</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Post Content Area */}
      <div 
        onClick={handleDoubleTap}
        className="w-full aspect-square bg-slate-950 flex items-center justify-center overflow-hidden relative cursor-pointer select-none"
      >
        {post.type === 'photo' ? (
          <img 
            src={post.mediaURL} 
            alt="Media" 
            className="w-full h-full object-contain pointer-events-none"
          />
        ) : (
          <div className="w-full h-full relative">
            <video 
              src={post.mediaURL} 
              autoPlay 
              loop 
              muted={isMuted}
              playsInline
              className="w-full h-full object-contain pointer-events-none"
            />
            {/* Audio Toggle Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="absolute bottom-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white z-10 transition-colors"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
        )}

        {/* Double-tap splash heart overlay */}
        <AnimatePresence>
          {showHeartPop && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 0.9, 1], opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <Heart size={90} className="fill-red-500 text-red-500 filter drop-shadow-lg" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Post Action Buttons */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Like */}
          <button 
            onClick={handleLike}
            className={`p-1 hover:scale-110 transition-transform ${isLiked ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}
          >
            <Heart size={24} className={isLiked ? 'fill-current text-red-500' : ''} />
          </button>

          {/* Comment toggle */}
          <button 
            onClick={() => setShowComments(!showComments)}
            className="p-1 text-slate-700 dark:text-slate-300 hover:scale-110 transition-transform"
          >
            <MessageCircle size={24} />
          </button>

          {/* Repost */}
          <button 
            onClick={handleRepost}
            className="p-1 text-slate-700 dark:text-slate-300 hover:scale-110 transition-transform hover:text-brand"
          >
            <Repeat2 size={24} />
          </button>

          {/* Send (Share to chat) */}
          <button 
            onClick={() => setShowShareModal(true)}
            className="p-1 text-slate-700 dark:text-slate-300 hover:scale-110 transition-transform"
          >
            <Send size={24} />
          </button>
        </div>

        {/* Save */}
        <button 
          onClick={handleSave}
          className={`p-1 hover:scale-110 transition-transform ${isSaved ? 'text-brand' : 'text-slate-700 dark:text-slate-300'}`}
        >
          <Bookmark size={24} className={isSaved ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Post Description / Caption */}
      <div className="px-4 pb-2 text-sm leading-relaxed">
        <span className="font-bold mr-2 text-sm">@{author?.username}</span>
        {/* Render hashtags as clickable link components */}
        <span>
          {post.caption.split(' ').map((word, idx) => {
            if (word.startsWith('#')) {
              return (
                <span 
                  key={idx} 
                  onClick={() => navigate(`/search?q=${word.slice(1)}`)}
                  className="text-brand hover:underline cursor-pointer font-medium mr-1"
                >
                  {word}
                </span>
              );
            }
            return word + ' ';
          })}
        </span>
        
        {post.likes.length > 0 && (
          <div className="mt-1.5 font-bold text-xs">
            {post.likes.length} {post.likes.length === 1 ? 'лайк' : 'лайков'}
          </div>
        )}
      </div>

      {/* Comments Panel */}
      {showComments && (
        <div className="border-t border-theme-lightBorder dark:border-theme-darkBorder bg-slate-50 dark:bg-slate-900/40 p-4 transition-colors">
          <h4 className="text-xs font-bold uppercase text-theme-lightMuted dark:text-theme-darkMuted tracking-wider mb-3">
            Комментарии ({comments.length})
          </h4>

          {/* List of comments */}
          <div className="flex flex-col gap-3 max-h-48 overflow-y-auto mb-4 pr-1">
            {comments.length === 0 ? (
              <p className="text-xs text-theme-lightMuted dark:text-theme-darkMuted italic py-2">
                Нет комментариев. Будьте первыми!
              </p>
            ) : (
              comments.map(c => {
                const commentUser = authors.find(u => u.uid === c.userId);
                return (
                  <div key={c.id} className="text-xs flex gap-2 items-start">
                    <Link to={`/profile/${c.userId}`} className="font-bold hover:underline shrink-0">
                      @{commentUser ? commentUser.username : 'user'}
                    </Link>
                    <p className="text-slate-650 dark:text-slate-300 break-all">{c.text}</p>
                  </div>
                );
              })
            )}
          </div>

          {/* Add Comment Input Form */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Добавить комментарий..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-white dark:bg-slate-800 border border-theme-lightBorder dark:border-theme-darkBorder rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-brand"
            />
            <button 
              type="submit"
              disabled={!newComment.trim()}
              className="px-3 py-1.5 bg-brand hover:bg-brand-dark text-white rounded-xl text-xs font-bold disabled:opacity-50 transition-colors"
            >
              Отправить
            </button>
          </form>
        </div>
      )}

      {/* Share Modal Dialog */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowShareModal(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-2xl border border-theme-lightBorder dark:border-theme-darkBorder bg-theme-lightCard dark:bg-theme-darkCard p-6 shadow-2xl z-10 transition-colors"
            >
              <h3 className="text-md font-bold mb-4">Отправить в чат</h3>
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1 mb-4">
                {conversations.length === 0 ? (
                  <p className="text-xs text-theme-lightMuted dark:text-theme-darkMuted italic text-center py-4">
                    Нет активных бесед. Начните чат в Direct.
                  </p>
                ) : (
                  conversations.map(conv => {
                    const recipientUid = conv.participants.find(p => p !== currentUser.uid);
                    const recipient = authors.find(u => u.uid === recipientUid);
                    if (!recipient) return null;
                    return (
                      <button 
                        key={conv.id}
                        onClick={() => handleSharePost(conv.id)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-left w-full"
                      >
                        <div className="flex items-center gap-2">
                          <img 
                            src={recipient.photoURL} 
                            alt={recipient.displayName} 
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-xs font-bold leading-tight">{recipient.displayName}</p>
                            <p className="text-[10px] text-slate-500 leading-tight">@{recipient.username}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-brand hover:underline">Отправить</span>
                      </button>
                    );
                  })
                )}
              </div>
              <button 
                onClick={() => setShowShareModal(false)}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-xl text-center cursor-pointer"
              >
                Закрыть
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </article>
  );
}
