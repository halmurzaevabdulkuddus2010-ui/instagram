// DirectPage.jsx - Real-time Direct Messages with chat list, shared posts, Notes & Calling
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { 
  Send, 
  Plus, 
  ChevronLeft, 
  Search, 
  MessageSquare, 
  ImageIcon, 
  Paperclip, 
  Film, 
  Clapperboard, 
  X,
  Phone,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Radio,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function DirectPage() {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [showVideoPicker, setShowVideoPicker] = useState(false);
  
  const [text, setText] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'chat'
  
  // Instagram Notes & Calling State
  const [userNote, setUserNote] = useState('Слушаю музыку 🎵');
  const [showCallModal, setShowCallModal] = useState(null); // 'audio' | 'video' | null
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  const chatBottomRef = useRef(null);

  // Subscribe to conversations, users, posts, and reels
  useEffect(() => {
    const unsubConvs = dbService.subscribeToConversations(currentUser.uid, setConversations);
    const unsubUsers = dbService.subscribeToUsers(setUsers);
    const unsubPosts = dbService.subscribeToPosts(setPosts);
    const unsubReels = dbService.subscribeToReels(setReels);
    return () => {
      unsubConvs();
      unsubUsers();
      unsubPosts();
      unsubReels();
    };
  }, [currentUser.uid]);

  // Subscribe to messages when active conversation changes
  useEffect(() => {
    if (!activeConvId) {
      setMessages([]);
      return;
    }
    
    // Clear unread counts
    dbService.clearUnreadCount(activeConvId, currentUser.uid);

    const unsubMsgs = dbService.subscribeToMessages(activeConvId, setMessages);
    return unsubMsgs;
  }, [activeConvId, currentUser.uid]);

  // Scroll to bottom when messages load/change
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() || !activeConvId) return;
    dbService.sendMessage(activeConvId, currentUser.uid, text.trim());
    setText('');
  };

  const handleStartChat = async (recipientId) => {
    const conv = await dbService.startConversation(currentUser.uid, recipientId);
    setActiveConvId(conv.id);
    setShowNewChat(false);
    setSearchQuery('');
    setMobileView('chat');
  };

  const activeConversation = conversations.find(c => c.id === activeConvId);
  const activeRecipientId = activeConversation?.participants.find(p => p !== currentUser.uid);
  const activeRecipient = users.find(u => u.uid === activeRecipientId);

  // Filter users for starting new chat
  const filteredUsers = users.filter(user => {
    if (user.uid === currentUser.uid) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      user.displayName?.toLowerCase().includes(q) ||
      user.username?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full max-w-6xl mx-auto h-[calc(100vh-3.5rem)] md:h-[calc(100vh-2rem)] md:my-4 flex border border-theme-lightBorder dark:border-theme-darkBorder bg-theme-lightCard dark:bg-theme-darkCard md:rounded-3xl shadow-xl overflow-hidden transition-colors duration-200">
      
      {/* LEFT PANEL: Chat List */}
      <div className={`w-full md:w-80 flex flex-col border-r border-theme-lightBorder dark:border-theme-darkBorder ${
        mobileView === 'chat' ? 'hidden md:flex' : 'flex'
      }`}>
        {/* Chat List Header */}
        <div className="p-4 border-b border-theme-lightBorder dark:border-theme-darkBorder flex items-center justify-between">
          <h2 className="font-extrabold text-lg">Сообщения</h2>
          <button 
            onClick={() => setShowNewChat(true)}
            className="p-1.5 rounded-full bg-brand/10 hover:bg-brand text-brand hover:text-white transition-all cursor-pointer"
            title="Начать чат"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Instagram Notes (Заметки 💬) Row */}
        <div className="p-3 border-b border-theme-lightBorder dark:border-theme-darkBorder overflow-x-auto no-scrollbar bg-slate-50/50 dark:bg-slate-900/20">
          <div className="flex items-center gap-3">
            {/* My Note bubble */}
            <div 
              onClick={() => {
                const newNote = prompt("Введите вашу заметку в Директ (до 60 символов):", userNote);
                if (newNote !== null) setUserNote(newNote.slice(0, 60));
              }}
              className="flex flex-col items-center gap-1 cursor-pointer shrink-0 group relative"
            >
              <div className="relative">
                <img src={currentUser.photoURL} alt="Me" className="w-12 h-12 rounded-full object-cover ring-2 ring-brand/40" />
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-white dark:bg-slate-800 text-[9px] font-extrabold rounded-full shadow border border-slate-200 dark:border-slate-700 whitespace-nowrap max-w-[75px] truncate">
                  {userNote || '+ Заметка'}
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-500">Ваша заметка</span>
            </div>

            {/* Friends Notes */}
            {[
              { id: '1', name: 'traveler_osh', note: 'В горах Оша 🏔️', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=traveler_osh' },
              { id: '2', name: 'vlad_a4', note: 'Челлендж 24ч 🔥', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vladA4' },
              { id: '3', name: 'masha', note: 'Печем варенье 🍓', img: 'https://api.dicebear.com/7.x/bottts/svg?seed=masha_medved' }
            ].map(n => (
              <div key={n.id} className="flex flex-col items-center gap-1 cursor-pointer shrink-0 relative">
                <div className="relative">
                  <img src={n.img} alt={n.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700" />
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-white dark:bg-slate-800 text-[9px] font-extrabold rounded-full shadow border border-slate-200 dark:border-slate-700 whitespace-nowrap max-w-[75px] truncate">
                    {n.note}
                  </div>
                </div>
                <span className="text-[10px] font-bold truncate max-w-[55px]">{n.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* List of active chats */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-theme-lightMuted dark:text-theme-darkMuted h-48">
              <MessageSquare size={32} className="mb-2 opacity-40" />
              <p className="text-xs font-semibold">Нет переписок</p>
              <p className="text-[10px] opacity-60">Нажмите "+", чтобы начать общение</p>
            </div>
          ) : (
            conversations.map(conv => {
              const recipientUid = conv.participants.find(p => p !== currentUser.uid);
              const recipient = users.find(u => u.uid === recipientUid);
              
              if (!recipient || recipient.isBanned) return null;
              if (currentUser.blockedUsers?.includes(recipientUid)) return null;

              const isSelected = conv.id === activeConvId;
              const hasUnread = conv.unreadCount && conv.unreadCount[currentUser.uid] > 0;
              
              return (
                <div 
                  key={conv.id}
                  onClick={() => {
                    setActiveConvId(conv.id);
                    setMobileView('chat');
                  }}
                  className={`flex items-center gap-3 p-4 border-b border-slate-50 dark:border-slate-800/40 cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-brand/5 border-l-4 border-l-brand' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img 
                      src={recipient.photoURL} 
                      alt={recipient.displayName} 
                      className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-theme-lightCard dark:border-theme-darkCard" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="text-xs font-bold truncate leading-tight">{recipient.displayName}</h4>
                      <span className="text-[9px] text-theme-lightMuted dark:text-theme-darkMuted shrink-0">
                        {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`text-[11px] truncate ${
                      hasUnread ? 'text-theme-lightText dark:text-theme-darkText font-extrabold' : 'text-theme-lightMuted dark:text-theme-darkMuted'
                    }`}>
                      {conv.lastMessage}
                    </p>
                  </div>

                  {hasUnread && (
                    <span className="h-2 w-2 rounded-full bg-brand shrink-0 animate-pulse" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Chat Box stream */}
      <div className={`flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-900/10 ${
        mobileView === 'list' ? 'hidden md:flex' : 'flex'
      }`}>
        {activeConvId ? (
          <>
            {/* Chat Box Header */}
            <div className="p-4 border-b border-theme-lightBorder dark:border-theme-darkBorder bg-theme-lightCard dark:bg-theme-darkCard flex items-center justify-between transition-colors duration-200">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setMobileView('list')}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 md:hidden transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                {activeRecipient && (
                  <Link to={`/profile/${activeRecipient.uid}`} className="flex items-center gap-2.5">
                    <img 
                      src={activeRecipient.photoURL} 
                      alt={activeRecipient.displayName} 
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-xs font-bold hover:underline block leading-tight">{activeRecipient.displayName}</h3>
                      <span className="text-[9px] text-green-500 block leading-tight">В сети</span>
                    </div>
                  </Link>
                )}
              </div>

              {/* Calling Action Buttons */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowCallModal('audio')}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  title="Аудиозвонок"
                >
                  <Phone size={18} />
                </button>
                <button 
                  onClick={() => setShowCallModal('video')}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  title="Видеозвонок"
                >
                  <Video size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable Message Box */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {messages.map((msg) => {
                const isSelf = msg.senderId === currentUser.uid;
                
                const sharedPost = msg.sharedPostId ? posts.find(p => p.id === msg.sharedPostId) : null;
                const sharedPostAuthor = sharedPost ? users.find(u => u.uid === sharedPost.userId) : null;

                const sharedReel = msg.sharedReelId ? reels.find(r => r.id === msg.sharedReelId) : null;
                const sharedReelAuthor = sharedReel ? users.find(u => u.uid === sharedReel.userId) : null;

                return (
                  <div 
                    key={msg.id}
                    className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
                  >
                    <div 
                      className={`max-w-[75%] p-3.5 rounded-2xl text-xs shadow-sm ${
                        isSelf 
                          ? 'bg-gradient-to-r from-purple-600 to-brand text-white rounded-br-none' 
                          : 'bg-theme-lightCard dark:bg-theme-darkCard text-theme-lightText dark:text-theme-darkText border border-theme-lightBorder dark:border-theme-darkBorder rounded-bl-none'
                      }`}
                    >
                      {/* Text */}
                      {msg.text && <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>}

                      {/* Shared Post Card */}
                      {sharedPost && (
                        <div className="mt-2 rounded-xl overflow-hidden border border-white/20 bg-black/20 p-2 flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <img 
                              src={sharedPostAuthor?.photoURL} 
                              alt="author" 
                              className="w-5 h-5 rounded-full object-cover" 
                            />
                            <span className="text-[10px] font-extrabold text-white">
                              @{sharedPostAuthor?.username || 'user'}
                            </span>
                          </div>
                          {sharedPost.type === 'photo' ? (
                            <img 
                              src={sharedPost.mediaURL} 
                              alt="Shared" 
                              className="w-full max-h-48 object-cover rounded-lg" 
                            />
                          ) : (
                            <video 
                              src={sharedPost.mediaURL} 
                              controls 
                              className="w-full max-h-48 object-cover rounded-lg" 
                            />
                          )}
                          <p className="text-[10px] text-white/90 line-clamp-1 italic">{sharedPost.caption}</p>
                        </div>
                      )}

                      {/* Shared Reel Card */}
                      {sharedReel && (
                        <div className="mt-2 rounded-xl overflow-hidden border border-purple-400/30 bg-black/40 p-2 flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <Clapperboard size={14} className="text-pink-400" />
                            <span className="text-[10px] font-extrabold text-pink-300">Reels</span>
                          </div>
                          <video 
                            src={sharedReel.mediaURL} 
                            controls 
                            className="w-full max-h-48 object-cover rounded-lg" 
                          />
                          <p className="text-[10px] text-white/90 line-clamp-1 italic">{sharedReel.caption}</p>
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-theme-lightBorder dark:border-theme-darkBorder bg-theme-lightCard dark:bg-theme-darkCard flex items-center gap-2">
              <input 
                type="text"
                placeholder="Напишите сообщение..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 bg-slate-100 dark:bg-slate-800 border border-theme-lightBorder dark:border-theme-darkBorder rounded-full px-4 py-2.5 text-xs focus:outline-none focus:border-brand"
              />
              <button 
                type="submit"
                disabled={!text.trim()}
                className="p-2.5 bg-gradient-to-r from-purple-600 to-brand text-white rounded-full disabled:opacity-40 hover:scale-105 transition-all shadow-md cursor-pointer"
              >
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <MessageSquare size={48} className="mb-3 opacity-30 text-brand" />
            <h3 className="text-base font-extrabold mb-1">Ваши сообщения</h3>
            <p className="text-xs max-w-xs text-slate-500 mb-4">Отправляйте личные сообщения, делитесь публикациями и звоните друзьям!</p>
            <button 
              onClick={() => setShowNewChat(true)}
              className="px-5 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl text-xs font-extrabold shadow-lg transition-all cursor-pointer"
            >
              Отправить сообщение
            </button>
          </div>
        )}
      </div>

      {/* Calling Modal Simulation */}
      {showCallModal && activeRecipient && (
        <AnimatePresence>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-lg" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md h-[80vh] bg-slate-950 text-white rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col justify-between p-6 border border-white/10"
            >
              <div className="text-center pt-8 flex flex-col items-center gap-3">
                <div className="relative">
                  <img src={activeRecipient.photoURL} alt="Calling" className="w-24 h-24 rounded-full object-cover ring-4 ring-purple-500/50 animate-pulse" />
                  <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-950" />
                </div>
                <div>
                  <h3 className="text-lg font-black">{activeRecipient.displayName}</h3>
                  <p className="text-xs text-purple-400 font-bold animate-pulse">
                    {showCallModal === 'video' ? '📹 Видеовызов Instagram...' : '📞 Аудиовызов Instagram...'}
                  </p>
                </div>
              </div>

              {/* Video preview simulation */}
              {showCallModal === 'video' && !isVideoMuted && (
                <div className="w-full h-48 bg-slate-900 rounded-2xl overflow-hidden border border-white/10 relative">
                  <video 
                    src="/videos/video1.mp4"
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded text-[9px] font-bold">Вы</span>
                </div>
              )}

              {/* Controls bar */}
              <div className="flex items-center justify-center gap-6 pb-6">
                <button 
                  onClick={() => setIsMicMuted(!isMicMuted)}
                  className={`p-4 rounded-full transition-all cursor-pointer ${
                    isMicMuted ? 'bg-red-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {isMicMuted ? <MicOff size={22} /> : <Mic size={22} />}
                </button>

                <button 
                  onClick={() => setShowCallModal(null)}
                  className="p-5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                >
                  <Phone size={26} className="rotate-[135deg]" />
                </button>

                {showCallModal === 'video' && (
                  <button 
                    onClick={() => setIsVideoMuted(!isVideoMuted)}
                    className={`p-4 rounded-full transition-all cursor-pointer ${
                      isVideoMuted ? 'bg-red-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {isVideoMuted ? <VideoOff size={22} /> : <Video size={22} />}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}

      {/* Modal for starting a new chat */}
      {showNewChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNewChat(false)} />
          
          <div className="relative w-full max-w-sm bg-theme-lightCard dark:bg-theme-darkCard text-theme-lightText dark:text-theme-darkText rounded-3xl p-5 shadow-2xl z-10 border border-theme-lightBorder dark:border-theme-darkBorder">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-extrabold text-sm">Новое сообщение</h3>
              <button onClick={() => setShowNewChat(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                <X size={18} />
              </button>
            </div>

            <div className="relative mb-3">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text"
                placeholder="Поиск собеседника..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-theme-lightBorder dark:border-theme-darkBorder rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-brand"
              />
            </div>

            <div className="max-h-64 overflow-y-auto flex flex-col gap-1">
              {filteredUsers.map(user => (
                <div 
                  key={user.uid}
                  onClick={() => handleStartChat(user.uid)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all"
                >
                  <img src={user.photoURL} alt={user.displayName} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <h4 className="text-xs font-bold leading-tight">{user.displayName}</h4>
                    <span className="text-[10px] text-slate-400">@{user.username}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
