// NotificationPage.jsx - Real-time activity notifications list
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, UserPlus, Repeat2, CheckCheck } from 'lucide-react';

export default function NotificationPage() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  // Subscriptions
  useEffect(() => {
    const unsubNotifs = dbService.subscribeToNotifications(currentUser.uid, (notifs) => {
      setNotifications(notifs);
      
      // Auto mark read on load
      if (notifs.some(n => !n.read)) {
        dbService.markNotificationsRead(currentUser.uid);
      }
    });

    const unsubUsers = dbService.subscribeToUsers(setUsers);
    const unsubPosts = dbService.subscribeToPosts(setPosts);

    return () => {
      unsubNotifs();
      unsubUsers();
      unsubPosts();
    };
  }, [currentUser.uid]);

  const getNotifIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart size={14} className="fill-current text-red-500" />;
      case 'comment':
        return <MessageCircle size={14} className="text-blue-500 fill-current" />;
      case 'follow':
        return <UserPlus size={14} className="text-green-500" />;
      case 'repost':
        return <Repeat2 size={14} className="text-brand" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4 md:px-0 transition-colors duration-200">
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold">Уведомления</h1>
        {notifications.some(n => !n.read) && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-brand bg-brand/10 px-2 py-1 rounded-full">
            <CheckCheck size={12} />
            <span>Новые</span>
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {notifications.length === 0 ? (
          <div className="text-center py-16 bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-2xl">
            <p className="text-xs text-slate-500">У вас пока нет уведомлений о действиях</p>
          </div>
        ) : (
          notifications.map(notif => {
            const sender = users.find(u => u.uid === notif.senderId);
            const post = notif.postId ? posts.find(p => p.id === notif.postId) : null;
            
            if (sender?.isBanned) return null;

            return (
              <div 
                key={notif.id}
                className={`flex items-center justify-between p-4 bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-2xl shadow-sm transition-all ${
                  !notif.read ? 'border-l-4 border-l-brand' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Sender Avatar & Type Overlay icon */}
                  <div className="relative shrink-0">
                    {sender ? (
                      <Link to={`/profile/${sender.uid}`}>
                        <img 
                          src={sender.photoURL} 
                          alt={sender.displayName} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </Link>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                    )}
                    <span className="absolute -bottom-1 -right-1 bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-full p-1 shadow-md">
                      {getNotifIcon(notif.type)}
                    </span>
                  </div>

                  {/* Notification message */}
                  <div className="text-xs">
                    <p className="leading-normal">
                      {sender ? (
                        <Link to={`/profile/${sender.uid}`} className="font-extrabold hover:underline mr-1.5">
                          @{sender.username}
                        </Link>
                      ) : (
                        <span className="font-extrabold mr-1.5">Кто-то</span>
                      )}
                      
                      {notif.type === 'like' && 'оценил вашу публикацию.'}
                      {notif.type === 'comment' && 'прокомментировал вашу публикацию.'}
                      {notif.type === 'follow' && 'подписался на ваши обновления.'}
                      {notif.type === 'repost' && 'сделал репост вашей публикации.'}
                    </p>

                    {/* Inline comment text preview */}
                    {notif.type === 'comment' && notif.commentText && (
                      <p className="text-[11px] text-slate-500 mt-1 pl-2 border-l-2 border-slate-200 dark:border-slate-700 italic break-words line-clamp-1 max-w-sm">
                        "{notif.commentText}"
                      </p>
                    )}
                    
                    <span className="text-[9px] text-slate-400 block mt-1">
                      {new Date(notif.createdAt).toLocaleDateString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Related Post media preview */}
                {post && (
                  <div className="w-11 h-11 shrink-0 rounded-lg overflow-hidden bg-slate-900 border border-theme-lightBorder dark:border-theme-darkBorder select-none">
                    {post.type === 'photo' ? (
                      <img src={post.mediaURL} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <video src={`${post.mediaURL}#t=0.1`} preload="metadata" muted className="w-full h-full object-cover" />
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
