// DirectPage.jsx - Real-time Direct Messages with chat list and shared post cards
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { Send, Plus, ChevronLeft, Search, MessageSquare, ImageIcon, Paperclip } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function DirectPage() {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  
  const [text, setText] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'chat'
  
  const chatBottomRef = useRef(null);

  // Subscribe to conversations, users, and posts
  useEffect(() => {
    const unsubConvs = dbService.subscribeToConversations(currentUser.uid, setConversations);
    const unsubUsers = dbService.subscribeToUsers(setUsers);
    const unsubPosts = dbService.subscribeToPosts(setPosts);
    return () => {
      unsubConvs();
      unsubUsers();
      unsubPosts();
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
    if (user.isBanned) return false;
    // Check if user is blocked
    if (currentUser.blockedUsers?.includes(user.uid)) return false;
    if (user.blockedUsers?.includes(currentUser.uid)) return false;
    
    const term = searchQuery.toLowerCase();
    return user.username.includes(term) || user.displayName.toLowerCase().includes(term);
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
              
              // Check if they are blocked
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
                    {/* Simulated online indicator */}
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
            </div>

            {/* Scrollable Message Box */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {messages.map((msg) => {
                const isSelf = msg.senderId === currentUser.uid;
                
                // If message contains a shared post
                const sharedPost = msg.sharedPostId ? posts.find(p => p.id === msg.sharedPostId) : null;
                const sharedPostAuthor = sharedPost ? users.find(u => u.uid === sharedPost.userId) : null;

                return (
                  <div 
                    key={msg.id}
                    className={`flex flex-col max-w-[70%] ${
                      isSelf ? 'self-end items-end' : 'self-start items-start'
                    }`}
                  >
                    {/* Normal message text */}
                    {!sharedPost && (
                      <div className={`p-3.5 rounded-2xl text-xs font-medium ${
                        isSelf 
                          ? 'bg-brand text-white rounded-br-none shadow-md shadow-brand/10' 
                          : 'bg-theme-lightCard dark:bg-theme-darkCard text-theme-lightText dark:text-theme-darkText border border-theme-lightBorder dark:border-theme-darkBorder rounded-bl-none'
                      }`}>
                        <p className="break-words leading-relaxed">{msg.text}</p>
                      </div>
                    )}

                    {/* Shared post card layout */}
                    {sharedPost && (
                      <div className={`border border-theme-lightBorder dark:border-theme-darkBorder rounded-2xl overflow-hidden bg-theme-lightCard dark:bg-theme-darkCard w-56 flex flex-col shadow-md ${
                        isSelf ? 'rounded-br-none' : 'rounded-bl-none'
                      }`}>
                        <div className="p-2 border-b border-slate-50 dark:border-slate-800/40 flex items-center gap-2">
                          <img 
                            src={sharedPostAuthor?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg'} 
                            alt={sharedPostAuthor?.displayName} 
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-[10px] font-bold truncate">@{sharedPostAuthor?.username}</span>
                        </div>
                        <div className="w-full aspect-square bg-slate-900 overflow-hidden relative">
                          {sharedPost.type === 'photo' ? (
                            <img src={sharedPost.mediaURL} alt="Shared" className="w-full h-full object-cover" />
                          ) : (
                            <video src={sharedPost.mediaURL} muted playsInline className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="p-2.5">
                          <p className="text-[10px] text-theme-lightMuted dark:text-theme-darkMuted line-clamp-2 leading-normal">
                            {sharedPost.caption}
                          </p>
                          <Link 
                            to="/" 
                            className="text-[9px] font-bold text-brand hover:underline mt-1.5 block"
                            onClick={() => {
                              // Custom anchor or action to view post (links to Feed for now)
                            }}
                          >
                            Посмотреть публикацию
                          </Link>
                        </div>
                      </div>
                    )}

                    <span className="text-[8px] text-slate-400 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* Message Input Box Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-theme-lightBorder dark:border-theme-darkBorder bg-theme-lightCard dark:bg-theme-darkCard flex gap-3 transition-colors duration-200">
              <input 
                type="text"
                placeholder="Напишите сообщение..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 bg-slate-100 dark:bg-slate-800 border border-theme-lightBorder dark:border-theme-darkBorder rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand"
              />
              <button 
                type="submit"
                disabled={!text.trim()}
                className="p-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl disabled:opacity-50 transition-colors shadow-md shadow-brand/15 cursor-pointer"
              >
                <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-theme-lightMuted dark:text-theme-darkMuted">
            <MessageSquare size={48} className="mb-4 text-brand opacity-30 animate-pulse-subtle" />
            <h3 className="text-base font-bold mb-1">Ваши сообщения</h3>
            <p className="text-xs max-w-xs">
              Выберите переписку из списка слева или начните новый диалог с интересным блогером.
            </p>
            <button 
              onClick={() => setShowNewChat(true)}
              className="mt-4 px-4 py-2 bg-brand text-white rounded-xl text-xs font-bold shadow-md shadow-brand/20 transition-all cursor-pointer hover:scale-102"
            >
              Начать чат
            </button>
          </div>
        )}
      </div>

      {/* New Chat Modal Selector */}
      <AnimatePresence>
        {showNewChat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowNewChat(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-2xl border border-theme-lightBorder dark:border-theme-darkBorder bg-theme-lightCard dark:bg-theme-darkCard p-6 shadow-2xl z-10 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider">Новое сообщение</h3>
                <button 
                  onClick={() => { setShowNewChat(false); setSearchQuery(''); }}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-lg text-slate-500"
                >
                  Закрыть
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Поиск по имени или username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-theme-lightBorder dark:border-theme-darkBorder rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none"
                />
              </div>

              {/* User list */}
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                {filteredUsers.length === 0 ? (
                  <p className="text-xs text-theme-lightMuted dark:text-theme-darkMuted italic text-center py-4">
                    Пользователи не найдены
                  </p>
                ) : (
                  filteredUsers.map(user => (
                    <button 
                      key={user.uid}
                      onClick={() => handleStartChat(user.uid)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-left w-full cursor-pointer"
                    >
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName} 
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                      <div>
                        <p className="text-xs font-bold leading-tight">{user.displayName}</p>
                        <p className="text-[10px] text-slate-550 leading-tight">@{user.username}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
