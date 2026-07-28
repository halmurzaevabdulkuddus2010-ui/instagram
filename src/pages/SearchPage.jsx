// SearchPage.jsx - Advanced exploration and search for users, posts, and hashtags
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { Search, User, Hash, Grid, Film, Sparkles } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function SearchPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);

  // Subscriptions
  useEffect(() => {
    const unsubUsers = dbService.subscribeToUsers(setUsers);
    const unsubPosts = dbService.subscribeToPosts(setPosts);
    const unsubReels = dbService.subscribeToReels(setReels);
    return () => {
      unsubUsers();
      unsubPosts();
      unsubReels();
    };
  }, []);

  // Update query state if search parameter changes
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const cleanQuery = query.trim().toLowerCase();

  // Search filter results
  const foundUsers = cleanQuery ? users.filter(u => {
    if (u.isBanned) return false;
    if (u.uid === currentUser.uid) return false;
    // Check blocks
    if (currentUser.blockedUsers?.includes(u.uid) || u.blockedUsers?.includes(currentUser.uid)) return false;
    
    return u.username.includes(cleanQuery) || u.displayName.toLowerCase().includes(cleanQuery);
  }) : [];

  const foundPosts = cleanQuery ? posts.filter(p => {
    const author = users.find(u => u.uid === p.userId);
    if (author && author.isBanned) return false;
    
    // Check blocks
    if (currentUser.blockedUsers?.includes(p.userId) || author?.blockedUsers?.includes(currentUser.uid)) return false;

    // Check hashtag matching or description match
    if (cleanQuery.startsWith('#')) {
      const tag = cleanQuery.slice(1);
      return p.hashtags?.includes(tag);
    }
    return p.caption?.toLowerCase().includes(cleanQuery) || p.hashtags?.some(tag => tag.includes(cleanQuery));
  }) : [];

  // Recommended/Explore Content (when not searching)
  // Show all posts from non-blocked, active users
  const explorePosts = posts.filter(p => {
    const author = users.find(u => u.uid === p.userId);
    if (author && author.isBanned) return false;
    if (currentUser.blockedUsers?.includes(p.userId) || author?.blockedUsers?.includes(currentUser.uid)) return false;
    return true;
  }).sort(() => 0.5 - Math.random()); // Randomize for fresh explore feel

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 md:px-0 transition-colors duration-200">
      
      {/* Search Input Bar */}
      <div className="relative w-full max-w-xl mx-auto mb-8">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Поиск пользователей, постов или хэштегов (например: #osh)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-brand shadow-sm transition-colors"
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute right-4 top-3 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-500 hover:text-slate-700"
          >
            Сбросить
          </button>
        )}
      </div>

      {cleanQuery ? (
        /* --- SEARCH RESULTS --- */
        <div className="flex flex-col gap-8">
          
          {/* Users Results */}
          {foundUsers.length > 0 && (
            <div className="bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-2xl p-4 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-theme-lightMuted dark:text-theme-darkMuted mb-3 flex items-center gap-1.5">
                <User size={14} />
                <span>Найденные пользователи ({foundUsers.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {foundUsers.map(user => (
                  <Link 
                    key={user.uid} 
                    to={`/profile/${user.uid}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 transition-all border border-transparent hover:border-theme-lightBorder dark:hover:border-theme-darkBorder"
                  >
                    <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="text-xs font-bold leading-tight">{user.displayName}</h4>
                      <p className="text-[10px] text-slate-500 leading-tight">@{user.username}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Posts Results */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-theme-lightMuted dark:text-theme-darkMuted mb-4 flex items-center gap-1.5 px-1">
              <Hash size={14} />
              <span>Найденные публикации ({foundPosts.length})</span>
            </h3>
            
            {foundPosts.length === 0 ? (
              <div className="text-center py-12 bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-2xl">
                <p className="text-xs text-slate-500">Публикации по запросу не найдены</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                {foundPosts.map(post => (
                  <div 
                    key={post.id}
                    onClick={() => navigate('/')}
                    className="aspect-square bg-slate-900 overflow-hidden relative rounded-xl group cursor-pointer border border-theme-lightBorder dark:border-theme-darkBorder"
                  >
                    {post.type === 'photo' ? (
                      <img src={post.mediaURL} alt="Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <video src={`${post.mediaURL}#t=0.1`} preload="metadata" muted className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-xs">
                      <span>❤️ {post.likes?.length || 0}</span>
                      <span>💬 {post.commentsCount || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      ) : (
        /* --- DEFAULT EXPLORE GRID --- */
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 px-1">
            <Sparkles size={16} className="text-brand animate-pulse" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-theme-lightMuted dark:text-theme-darkMuted">
              Интересное в Оше
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {explorePosts.map(post => (
              <div 
                key={post.id}
                onClick={() => navigate('/')}
                className="aspect-square bg-slate-900 overflow-hidden relative rounded-xl group cursor-pointer border border-theme-lightBorder dark:border-theme-darkBorder"
              >
                {post.type === 'photo' ? (
                  <img src={post.mediaURL} alt="Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <video src={`${post.mediaURL}#t=0.1`} preload="metadata" muted className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                )}
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3.5 text-white font-bold text-xs">
                  <span>❤️ {post.likes?.length || 0}</span>
                  <span>💬 {post.commentsCount || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
