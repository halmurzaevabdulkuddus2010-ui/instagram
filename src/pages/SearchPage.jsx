// SearchPage.jsx - Advanced exploration and search for users, posts, videos, and reels
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { Search, User, Hash, Grid, Film, Sparkles, Play, X, Heart, MessageCircle, Layers } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function SearchPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'users', 'posts', 'videos'
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);

  // Modal preview state for posts & videos
  const [selectedMedia, setSelectedMedia] = useState(null); // { item, author }

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

  // Sync query state if search parameter changes
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const cleanQuery = query.trim().toLowerCase();

  const handleSearchChange = (val) => {
    setQuery(val);
    if (val) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  // Check if a user is blocked
  const isUserBlocked = (userId) => {
    if (!currentUser) return false;
    const author = users.find(u => u.uid === userId);
    if (author?.isBanned) return true;
    if (currentUser.blockedUsers?.includes(userId)) return true;
    if (author?.blockedUsers?.includes(currentUser.uid)) return true;
    return false;
  };

  // --- FILTERED SEARCH RESULTS ---
  
  // 1. Users search results
  const foundUsers = cleanQuery ? users.filter(u => {
    if (u.isBanned) return false;
    if (currentUser && u.uid === currentUser.uid) return false;
    if (isUserBlocked(u.uid)) return false;
    
    return u.username?.toLowerCase().includes(cleanQuery) || 
           u.displayName?.toLowerCase().includes(cleanQuery);
  }) : [];

  // 2. Posts search results (photos & post videos)
  const foundPosts = cleanQuery ? posts.filter(p => {
    if (isUserBlocked(p.userId)) return false;

    if (cleanQuery.startsWith('#')) {
      const tag = cleanQuery.slice(1);
      return p.hashtags?.some(t => t.toLowerCase().includes(tag));
    }
    return (
      p.caption?.toLowerCase().includes(cleanQuery) ||
      p.hashtags?.some(tag => tag.toLowerCase().includes(cleanQuery))
    );
  }) : [];

  // 3. Videos & Reels search results
  const foundVideos = cleanQuery ? [
    // Videos from Posts
    ...posts.filter(p => p.type === 'video' || p.mediaType === 'video').map(p => ({ ...p, isReel: false, mediaKind: 'video' })),
    // Reels
    ...reels.map(r => ({ ...r, isReel: true, mediaKind: 'video' }))
  ].filter(v => {
    if (isUserBlocked(v.userId)) return false;

    if (cleanQuery.startsWith('#')) {
      const tag = cleanQuery.slice(1);
      return v.hashtags?.some(t => t.toLowerCase().includes(tag));
    }
    return (
      v.caption?.toLowerCase().includes(cleanQuery) ||
      v.audioTitle?.toLowerCase().includes(cleanQuery) ||
      v.hashtags?.some(tag => tag.toLowerCase().includes(cleanQuery))
    );
  }) : [];

  // --- EXPLORE GRID CONTENT (When query is empty) ---
  const explorePosts = posts.filter(p => !isUserBlocked(p.userId));
  const exploreVideos = reels.filter(r => !isUserBlocked(r.userId));

  // Combined Explore Feed
  const combinedExplore = [
    ...explorePosts.map(p => ({ ...p, mediaKind: p.type === 'video' ? 'video' : 'photo' })),
    ...exploreVideos.map(r => ({ ...r, mediaKind: 'video', isReel: true }))
  ];

  // Filter explore content by tab
  const displayExplore = combinedExplore.filter(item => {
    if (activeTab === 'posts') return item.mediaKind === 'photo';
    if (activeTab === 'videos') return item.mediaKind === 'video';
    return true; // 'all' or 'users'
  });

  // Open Media Modal
  const openMediaModal = (item) => {
    const author = users.find(u => u.uid === item.userId);
    setSelectedMedia({ item, author });
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 md:px-0 transition-colors duration-200">
      
      {/* Search Input Bar */}
      <div className="relative w-full max-w-2xl mx-auto mb-6">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Поиск пользователей, публикаций, видео или хэштегов (#osh)..."
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-2xl pl-12 pr-10 py-3 text-sm focus:outline-none focus:border-brand shadow-sm transition-colors"
        />
        {query && (
          <button 
            onClick={() => handleSearchChange('')}
            className="absolute right-4 top-3.5 p-1 bg-slate-200 dark:bg-slate-700 rounded-full text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-brand text-white shadow-md shadow-brand/20'
              : 'bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers size={14} />
          <span>Все</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'users'
              ? 'bg-brand text-white shadow-md shadow-brand/20'
              : 'bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <User size={14} />
          <span>Пользователи {cleanQuery ? `(${foundUsers.length})` : ''}</span>
        </button>

        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'posts'
              ? 'bg-brand text-white shadow-md shadow-brand/20'
              : 'bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Grid size={14} />
          <span>Публикации {cleanQuery ? `(${foundPosts.length})` : ''}</span>
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'videos'
              ? 'bg-brand text-white shadow-md shadow-brand/20'
              : 'bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Film size={14} />
          <span>Видео {cleanQuery ? `(${foundVideos.length})` : ''}</span>
        </button>
      </div>

      {cleanQuery ? (
        /* --- SEARCH RESULTS --- */
        <div className="flex flex-col gap-8">
          
          {/* Users Results */}
          {(activeTab === 'all' || activeTab === 'users') && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-theme-lightMuted dark:text-theme-darkMuted mb-3 flex items-center gap-1.5 px-1">
                <User size={14} />
                <span>Пользователи ({foundUsers.length})</span>
              </h3>
              
              {foundUsers.length === 0 ? (
                activeTab === 'users' && (
                  <div className="text-center py-10 bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-2xl text-xs text-slate-500">
                    Пользователи по запросу «{query}» не найдены
                  </div>
                )
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {foundUsers.map(user => (
                    <Link 
                      key={user.uid} 
                      to={`/profile/${user.uid}`}
                      className="flex items-center gap-3 p-3 bg-theme-lightCard dark:bg-theme-darkCard rounded-2xl border border-theme-lightBorder dark:border-theme-darkBorder hover:border-brand transition-all shadow-sm group"
                    >
                      <img src={user.photoURL} alt={user.displayName} className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold leading-tight truncate group-hover:text-brand transition-colors">{user.displayName}</h4>
                        <p className="text-[11px] text-slate-500 leading-tight truncate">@{user.username}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Videos & Reels Results */}
          {(activeTab === 'all' || activeTab === 'videos') && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-theme-lightMuted dark:text-theme-darkMuted mb-4 flex items-center gap-1.5 px-1">
                <Film size={14} className="text-purple-500" />
                <span>Видео ({foundVideos.length})</span>
              </h3>

              {foundVideos.length === 0 ? (
                activeTab === 'videos' && (
                  <div className="text-center py-12 bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-2xl text-xs text-slate-500">
                    Видео по запросу «{query}» не найдены
                  </div>
                )
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {foundVideos.map(video => (
                    <div 
                      key={video.id}
                      onClick={() => openMediaModal(video)}
                      className="aspect-[9/16] bg-slate-900 overflow-hidden relative rounded-2xl group cursor-pointer border border-theme-lightBorder dark:border-theme-darkBorder shadow-sm"
                    >
                      <img 
                        src={video.coverURL || video.mediaURL} 
                        alt={video.caption || 'Video cover'} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Video Badge */}
                      <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md p-1.5 rounded-full text-white">
                        <Play size={12} className="fill-white" />
                      </div>

                      {/* Video Info Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white">
                        <p className="text-[11px] font-semibold line-clamp-2 leading-tight mb-2">
                          {video.caption || 'Видео'}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-slate-300 font-medium">
                          <span className="flex items-center gap-1">❤️ {video.likes?.length || 0}</span>
                          <span className="flex items-center gap-1">👁️ {video.viewsCount || video.views || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Posts Results */}
          {(activeTab === 'all' || activeTab === 'posts') && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-theme-lightMuted dark:text-theme-darkMuted mb-4 flex items-center gap-1.5 px-1">
                <Grid size={14} className="text-brand" />
                <span>Публикации ({foundPosts.length})</span>
              </h3>
              
              {foundPosts.length === 0 ? (
                activeTab === 'posts' && (
                  <div className="text-center py-12 bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-2xl text-xs text-slate-500">
                    Публикации по запросу «{query}» не найдены
                  </div>
                )
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
                  {foundPosts.map(post => (
                    <div 
                      key={post.id}
                      onClick={() => openMediaModal(post)}
                      className="aspect-square bg-slate-900 overflow-hidden relative rounded-2xl group cursor-pointer border border-theme-lightBorder dark:border-theme-darkBorder shadow-sm"
                    >
                      <img 
                        src={post.coverURL || post.mediaURL} 
                        alt="Post thumbnail" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {post.type === 'video' && (
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md p-1.5 rounded-full text-white">
                          <Play size={10} className="fill-white" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3.5 text-white font-bold text-xs">
                        <span className="flex items-center gap-1">❤️ {post.likes?.length || 0}</span>
                        <span className="flex items-center gap-1">💬 {post.commentsCount || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Global Empty State */}
          {foundUsers.length === 0 && foundPosts.length === 0 && foundVideos.length === 0 && (
            <div className="text-center py-16 bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-3xl p-8">
              <Search className="mx-auto text-slate-400 mb-3" size={32} />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Ничего не найдено</h3>
              <p className="text-xs text-slate-500 mt-1">Попробуйте изменить поисковый запрос или хэштег</p>
            </div>
          )}

        </div>
      ) : (
        /* --- DEFAULT EXPLORE GRID --- */
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-brand animate-pulse" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-theme-lightMuted dark:text-theme-darkMuted">
                Интересное в Оше
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">Нажмите на видео или пост для просмотра</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
            {displayExplore.map(item => (
              <div 
                key={item.id}
                onClick={() => openMediaModal(item)}
                className={`relative bg-slate-900 overflow-hidden rounded-2xl group cursor-pointer border border-theme-lightBorder dark:border-theme-darkBorder shadow-sm ${
                  item.mediaKind === 'video' ? 'aspect-[9/16]' : 'aspect-square'
                }`}
              >
                <img 
                  src={item.coverURL || item.mediaURL} 
                  alt="Explore thumbnail" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {item.mediaKind === 'video' && (
                  <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md p-1.5 rounded-full text-white shadow-md">
                    <Play size={12} className="fill-white" />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3.5 text-white font-bold text-xs p-2 text-center">
                  <span className="flex items-center gap-1">❤️ {item.likes?.length || 0}</span>
                  <span className="flex items-center gap-1">💬 {item.commentsCount || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- MEDIA PREVIEW MODAL --- */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedMedia(null)}
              className="absolute top-3 right-3 z-20 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
            >
              <X size={18} />
            </button>

            {/* Media Content Box */}
            <div className="w-full md:w-3/5 bg-black flex items-center justify-center relative min-h-[300px] md:min-h-[500px]">
              {selectedMedia.item.mediaKind === 'video' || selectedMedia.item.type === 'video' || selectedMedia.item.isReel ? (
                <video 
                  src={selectedMedia.item.mediaURL || selectedMedia.item.videoURL} 
                  poster={selectedMedia.item.coverURL}
                  controls 
                  autoPlay 
                  loop
                  className="max-h-[75vh] w-full object-contain"
                />
              ) : (
                <img 
                  src={selectedMedia.item.mediaURL} 
                  alt="Post preview" 
                  className="max-h-[75vh] w-full object-contain"
                />
              )}
            </div>

            {/* Sidebar Details */}
            <div className="w-full md:w-2/5 p-5 flex flex-col justify-between overflow-y-auto">
              <div>
                {/* Author Info Header */}
                {selectedMedia.author && (
                  <div className="flex items-center justify-between pb-4 border-b border-theme-lightBorder dark:border-theme-darkBorder mb-4">
                    <Link 
                      to={`/profile/${selectedMedia.author.uid}`}
                      onClick={() => setSelectedMedia(null)}
                      className="flex items-center gap-3 group"
                    >
                      <img 
                        src={selectedMedia.author.photoURL} 
                        alt={selectedMedia.author.displayName} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
                      />
                      <div>
                        <h4 className="text-xs font-bold group-hover:text-brand transition-colors">{selectedMedia.author.displayName}</h4>
                        <p className="text-[10px] text-slate-500">@{selectedMedia.author.username}</p>
                      </div>
                    </Link>

                    <button 
                      onClick={() => {
                        setSelectedMedia(null);
                        navigate(`/profile/${selectedMedia.author.uid}`);
                      }}
                      className="text-xs font-semibold px-3 py-1.5 bg-brand text-white rounded-xl hover:bg-brand/90 transition-colors"
                    >
                      Профиль
                    </button>
                  </div>
                )}

                {/* Caption */}
                <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed mb-4">
                  {selectedMedia.item.caption || 'Без описания'}
                </p>

                {/* Hashtags */}
                {selectedMedia.item.hashtags && selectedMedia.item.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {selectedMedia.item.hashtags.map((tag, idx) => (
                      <span 
                        key={idx}
                        onClick={() => {
                          setSelectedMedia(null);
                          handleSearchChange(`#${tag}`);
                        }}
                        className="text-[11px] font-medium text-brand hover:underline cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Bar Footer */}
              <div className="pt-4 border-t border-theme-lightBorder dark:border-theme-darkBorder flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 font-bold text-red-500">
                    <Heart size={16} className="fill-red-500" />
                    {selectedMedia.item.likes?.length || 0}
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold">
                    <MessageCircle size={16} />
                    {selectedMedia.item.commentsCount || 0}
                  </span>
                </div>

                <button 
                  onClick={() => {
                    setSelectedMedia(null);
                    if (selectedMedia.item.isReel) {
                      navigate('/reels');
                    } else {
                      navigate('/');
                    }
                  }}
                  className="text-xs font-bold text-brand hover:underline"
                >
                  {selectedMedia.item.isReel ? 'Смотреть в Reels →' : 'Смотреть в ленте →'}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
