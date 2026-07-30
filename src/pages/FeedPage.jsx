// FeedPage.jsx - Main real-time feed with stories and user recommendations
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { Link } from 'react-router-dom';
import StoryTray from '../components/StoryTray';
import PostCard from '../components/PostCard';
import { Sparkles, MessageCircleCode } from 'lucide-react';

export default function FeedPage() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  // Subscriptions
  useEffect(() => {
    const unsubPosts = dbService.subscribeToPosts(setPosts);
    const unsubUsers = dbService.subscribeToUsers(setUsers);
    
    return () => {
      unsubPosts();
      unsubUsers();
    };
  }, []);

  // Filter and sort feed based on user settings (follows, blocks, recommendations)
  const feedPosts = dbService.getFeedData(currentUser.uid, posts, users);

  // Recommendations for the sidebar
  const recommendedUsers = dbService.getRecommendations(currentUser.uid, users);

  const handleFollow = (userId) => {
    dbService.followUser(currentUser.uid, userId);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex gap-8 py-6 px-4 md:px-0">
      {/* Feed Column */}
      <div className="flex-1 max-w-2xl">
        {/* Story tray */}
        <StoryTray />

        {/* Feed Posts */}
        {feedPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-2xl">
            <Sparkles size={40} className="text-brand mb-4 animate-pulse-subtle" />
            <h3 className="text-base font-bold mb-1">Лента пуста</h3>
            <p className="text-xs text-theme-lightMuted dark:text-theme-darkMuted max-w-sm mb-4">
              Подпишитесь на других пользователей или опубликуйте свой первый пост, чтобы наполнить ленту!
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {feedPosts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                authors={users} 
                currentUserId={currentUser.uid} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Recommended Sidebar Column (visible on large screen) */}
      <aside className="hidden lg:block w-80 shrink-0">
        <div className="sticky top-20 flex flex-col gap-6">
          {/* User Profile Card */}
          <div className="flex items-center justify-between p-4 bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-2xl transition-colors">
            <div className="flex items-center gap-3">
              <Link to={`/profile/${currentUser.uid}`}>
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName} 
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-brand/20 hover:ring-brand/50 transition-all"
                />
              </Link>
              <div>
                <Link to={`/profile/${currentUser.uid}`} className="font-bold text-sm hover:underline block">
                  {currentUser.displayName}
                </Link>
                <p className="text-xs text-theme-lightMuted dark:text-theme-darkMuted leading-tight">
                  @{currentUser.username}
                </p>
              </div>
            </div>
            <Link to="/settings" className="text-xs font-bold text-brand hover:underline">
              Настройки
            </Link>
          </div>

          {/* User Recommendations */}
          <div className="bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-2xl p-4 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold uppercase text-theme-lightMuted dark:text-theme-darkMuted tracking-wider">
                Рекомендации для вас
              </h4>
              <Link to="/search" className="text-xs font-bold text-brand hover:underline">
                Все
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {recommendedUsers.length === 0 ? (
                <p className="text-xs text-theme-lightMuted dark:text-theme-darkMuted italic text-center py-2">
                  Нет новых рекомендаций
                </p>
              ) : (
                recommendedUsers.map(user => (
                  <div key={user.uid} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Link to={`/profile/${user.uid}`}>
                        <img 
                          src={user.photoURL} 
                          alt={user.displayName} 
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-brand/10"
                        />
                      </Link>
                      <div>
                        <Link to={`/profile/${user.uid}`} className="text-xs font-bold hover:underline leading-none block mb-0.5">
                          {user.displayName}
                        </Link>
                        <p className="text-[10px] text-theme-lightMuted dark:text-theme-darkMuted leading-none">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleFollow(user.uid)}
                      className="px-3 py-1 bg-brand/10 hover:bg-brand text-brand hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                    >
                      Подписаться
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Osh City Info Box */}
          <div className="p-4 bg-brand/5 border border-brand/10 rounded-2xl text-[11px] text-theme-lightMuted dark:text-theme-darkMuted leading-relaxed">
            <span className="font-bold text-brand block mb-1">О городе Ош:</span>
            Ош — древнейший город Кыргызстана с 3000-летней историей. В центре города возвышается гора Сулайман-Тоо — объект Всемирного наследия ЮНЕСКО. INSTAGRAM объединяет блогеров нашего любимого южного мегаполиса! 🗻☀️
          </div>
        </div>
      </aside>
    </div>
  );
}
