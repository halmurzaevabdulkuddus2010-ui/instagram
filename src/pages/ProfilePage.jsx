// ProfilePage.jsx - Detailed user profiles with covers, avatars, stats, and grids
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundEngine } from '../utils/soundEngine';
import { 
  Grid, 
  Film, 
  Bookmark, 
  Lock, 
  Camera, 
  UserPlus, 
  UserMinus, 
  MessageSquare,
  ShieldCheck,
  Music,
  Volume2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { id } = useParams();
  const { currentUser, updateProfileDetails } = useAuth();
  const navigate = useNavigate();
  
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'reels' | 'saved'
  const [loading, setLoading] = useState(true);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Load specific profile user and subscriptions
  useEffect(() => {
    setLoading(true);
    const loadProfile = async () => {
      try {
        const u = await dbService.getUser(id);
        setProfileUser(u);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();

    const unsubPosts = dbService.subscribeToPosts(setPosts);
    const unsubReels = dbService.subscribeToReels(setReels);
    const unsubUsers = dbService.subscribeToUsers((allUsers) => {
      setUsers(allUsers);
      const updated = allUsers.find(user => user.uid === id);
      if (updated) setProfileUser(updated);
    });

    return () => {
      unsubPosts();
      unsubReels();
      unsubUsers();
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand" />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-bold">Пользователь не найден</h3>
        <Link to="/" className="text-xs text-brand hover:underline mt-2 inline-block">Вернуться на главную</Link>
      </div>
    );
  }

  const isOwnProfile = currentUser.uid === profileUser.uid;
  const isFollowing = profileUser.followers?.includes(currentUser.uid);
  const isBlockedByMe = currentUser.blockedUsers?.includes(profileUser.uid);
  const hasBlockedMe = profileUser.blockedUsers?.includes(currentUser.uid);
  const showContent = true;

  // Filter items
  const userPosts = posts.filter(p => p.userId === profileUser.uid && !p.repostedBy);
  const repostedPosts = posts.filter(p => p.repostedBy === profileUser.uid);
  const combinedPosts = [...userPosts, ...repostedPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const userReels = reels.filter(r => r.userId === profileUser.uid);
  
  // Filter saved posts (only available on own profile or if allowed)
  const savedPosts = posts.filter(p => p.saves?.includes(currentUser.uid));

  const handleFollowToggle = () => {
    if (isFollowing) {
      dbService.unfollowUser(currentUser.uid, profileUser.uid);
    } else {
      dbService.followUser(currentUser.uid, profileUser.uid);
    }
  };

  const handleStartMessage = async () => {
    const conv = await dbService.startConversation(currentUser.uid, profileUser.uid);
    navigate(`/direct?c=${conv.id}`);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        await updateProfileDetails({ photoURL: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        await updateProfileDetails({ coverURL: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 md:px-0 transition-colors duration-200">
      {/* Hidden File Inputs */}
      <input type="file" ref={avatarInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
      <input type="file" ref={coverInputRef} onChange={handleCoverUpload} accept="image/*" className="hidden" />

      {/* Profile Header Block */}
      <div className="bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-3xl overflow-hidden transition-colors shadow-sm mb-6">
        
        {/* Cover Image */}
        <div className="h-44 w-full bg-slate-200 dark:bg-slate-800 relative group overflow-hidden">
          <img 
            src={profileUser.coverURL || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200'} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
          {isOwnProfile && (
            <button 
              onClick={() => coverInputRef.current?.click()}
              className="absolute bottom-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/85 text-white transition-all shadow-lg opacity-0 group-hover:opacity-100 cursor-pointer"
              title="Изменить обложку"
            >
              <Camera size={16} />
            </button>
          )}
        </div>

        {/* User Details Area */}
        <div className="px-6 pb-6 relative flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Avatar Positioned hanging over cover */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-5 -mt-16 md:-mt-14">
            <div className="relative group rounded-full overflow-hidden w-28 h-28 ring-4 ring-theme-lightCard dark:ring-theme-darkCard shrink-0">
              <img 
                src={profileUser.photoURL} 
                alt={profileUser.displayName} 
                className="w-full h-full object-cover"
              />
              {isOwnProfile && (
                <div 
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                  title="Изменить аватар"
                >
                  <Camera size={18} />
                </div>
              )}
            </div>

            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-1.5 mb-1">
                <h1 className="text-xl font-bold">{profileUser.displayName}</h1>
                {profileUser.isAdmin && <ShieldCheck size={18} className="text-yellow-500" title="Администратор" />}
                {profileUser.isVerified && (
                  <span className="w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm shrink-0" title="Подтвержденный аккаунт">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-xs text-theme-lightMuted dark:text-theme-darkMuted font-semibold">@{profileUser.username}</p>
            </div>
          </div>

          {/* Action Buttons (Follow / Chat / Edit) */}
          <div className="flex justify-center gap-3">
            {isOwnProfile ? (
              <Link 
                to="/settings" 
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-xl text-xs font-bold transition-all"
              >
                Редактировать профиль
              </Link>
            ) : (
              <>
                {isBlockedByMe ? (
                  <button 
                    onClick={async () => {
                      await dbService.unblockUser(currentUser.uid, profileUser.uid);
                      alert("Пользователь разблокирован");
                    }}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Разблокировать
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={handleFollowToggle}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isFollowing 
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200' 
                          : 'bg-brand hover:bg-brand-dark text-white shadow-md shadow-brand/15'
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <UserMinus size={14} />
                          <span>Отписаться</span>
                        </>
                      ) : (
                        <>
                          <UserPlus size={14} />
                          <span>Подписаться</span>
                        </>
                      )}
                    </button>
                    
                    {!hasBlockedMe && (
                      <button 
                        onClick={handleStartMessage}
                        className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all cursor-pointer"
                        title="Отправить сообщение"
                      >
                        <MessageSquare size={16} />
                      </button>
                    )}

                    {profileUser.username === 'akaktish' && (
                      <button 
                        onClick={() => navigate('/akaktish')}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 hover:scale-105 transition-all cursor-pointer shrink-0"
                      >
                        🦷 Записаться к врачу
                      </button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Stats counter row */}
        <div className="border-t border-theme-lightBorder dark:border-theme-darkBorder p-4 grid grid-cols-3 text-center bg-slate-50/50 dark:bg-slate-800/10">
          <div>
            <span className="block text-base font-extrabold">{combinedPosts.length}</span>
            <span className="text-[10px] uppercase font-bold text-theme-lightMuted dark:text-theme-darkMuted tracking-wider">Публикации</span>
          </div>
          <div>
            <span className="block text-base font-extrabold">{profileUser.followers?.length || 0}</span>
            <span className="text-[10px] uppercase font-bold text-theme-lightMuted dark:text-theme-darkMuted tracking-wider">Подписчики</span>
          </div>
          <div>
            <span className="block text-base font-extrabold">{profileUser.following?.length || 0}</span>
            <span className="text-[10px] uppercase font-bold text-theme-lightMuted dark:text-theme-darkMuted tracking-wider">Подписки</span>
          </div>
        </div>

        {/* Biography Block */}
        {profileUser.bio && (
          <div className="px-6 pb-4 pt-2 border-t border-theme-lightBorder dark:border-theme-darkBorder text-sm leading-relaxed">
            <span className="font-bold text-xs uppercase text-theme-lightMuted dark:text-theme-darkMuted tracking-wider block mb-1">О себе</span>
            <p className="text-slate-650 dark:text-slate-300 font-medium whitespace-pre-line">{profileUser.bio}</p>
          </div>
        )}

        {/* Featured Music Player Badge */}
        <div className="px-6 pb-6 pt-1">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-brand/10 border border-purple-500/20 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => {
                  soundEngine.init();
                  if (isPlayingMusic) {
                    soundEngine.stop();
                    setIsPlayingMusic(false);
                  } else {
                    soundEngine.playTrack(profileUser.featuredMusic?.audioGenre || 'general', 'profile');
                    setIsPlayingMusic(true);
                  }
                }}
                className="p-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:scale-110 transition-transform cursor-pointer"
              >
                {isPlayingMusic ? <Volume2 size={18} className="animate-bounce" /> : <Music size={18} />}
              </button>
              <div>
                <p className="text-xs font-extrabold flex items-center gap-1.5 text-purple-600 dark:text-purple-300 leading-tight">
                  <span>🎵 Любимый трек профиля</span>
                  {isPlayingMusic && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
                </p>
                <p className="text-xs font-bold leading-tight mt-0.5">
                  {profileUser.featuredMusic?.title || '🎵 Instagram Vibe Beats 🎧'}
                </p>
              </div>
            </div>

            {isOwnProfile && (
              <button
                type="button"
                onClick={() => {
                  const newTrack = prompt("Введите название вашего любимого трека в профиль:", profileUser.featuredMusic?.title || "🎵 Phonk Night Drive 🏎️");
                  if (newTrack && newTrack.trim()) {
                    dbService.updateProfileMusic(currentUser.uid, {
                      title: newTrack.trim(),
                      artist: currentUser.displayName,
                      audioGenre: 'cars'
                    });
                    setProfileUser(prev => ({
                      ...prev,
                      featuredMusic: { title: newTrack.trim(), artist: currentUser.displayName, audioGenre: 'cars' }
                    }));
                    alert("Музыкальный трек профиля сохранен!");
                  }
                }}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-[11px] font-bold cursor-pointer transition-all"
              >
                Сменить трек ✏️
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Private Profile Screen */}
      {!showContent ? (
        <div className="flex flex-col items-center justify-center p-16 text-center bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-3xl transition-colors">
          <div className="p-4 rounded-full bg-brand/10 text-brand mb-4">
            <Lock size={32} />
          </div>
          <h3 className="text-base font-bold mb-1">Это закрытый аккаунт</h3>
          <p className="text-xs text-theme-lightMuted dark:text-theme-darkMuted max-w-xs">
            Подпишитесь на @{profileUser.username}, чтобы видеть их публикации и Reels.
          </p>
        </div>
      ) : (
        <>
          {/* Tab Selector Header */}
          <div className="flex justify-center border-b border-theme-lightBorder dark:border-theme-darkBorder mb-6">
            <button 
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'posts' 
                  ? 'border-brand text-brand' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Grid size={14} />
              <span>Посты ({combinedPosts.length})</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('reels')}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'reels' 
                  ? 'border-brand text-brand' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Film size={14} />
              <span>Reels ({userReels.length})</span>
            </button>

            {isOwnProfile && (
              <button 
                onClick={() => setActiveTab('saved')}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'saved' 
                    ? 'border-brand text-brand' 
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Bookmark size={14} />
                <span>Сохранено ({savedPosts.length})</span>
              </button>
            )}
          </div>

          {/* Grid Layouts */}
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            
            {/* Posts Grid */}
            {activeTab === 'posts' && (
              combinedPosts.length === 0 ? (
                <div className="col-span-3 text-center py-12 text-slate-500 text-xs">Нет постов</div>
              ) : (
                combinedPosts.map(post => (
                  <div 
                    key={post.id} 
                    onClick={() => navigate('/')} // Redirect to main feed to show full interactive card
                    className="aspect-square bg-slate-900 overflow-hidden relative rounded-xl group cursor-pointer border border-theme-lightBorder dark:border-theme-darkBorder"
                  >
                    {post.type === 'photo' ? (
                      <img src={post.mediaURL} alt="Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <video src={`${post.mediaURL}#t=0.1`} preload="metadata" muted className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    )}
                    {/* Hover stat indicators */}
                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-sm">
                      <span>❤️ {post.likes?.length || 0}</span>
                      <span>💬 {post.commentsCount || 0}</span>
                    </div>
                  </div>
                ))
              )
            )}

            {/* Reels Grid */}
            {activeTab === 'reels' && (
              userReels.length === 0 ? (
                <div className="col-span-3 text-center py-12 text-slate-500 text-xs">Нет Reels</div>
              ) : (
                userReels.map(reel => (
                  <div 
                    key={reel.id} 
                    onClick={() => navigate('/reels')}
                    className="aspect-[9/16] bg-slate-900 overflow-hidden relative rounded-xl group cursor-pointer border border-theme-lightBorder dark:border-theme-darkBorder"
                  >
                    <video src={`${reel.mediaURL}#t=0.1`} preload="metadata" muted className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-xs">
                      <span>▶️ {reel.viewsCount || 0}</span>
                      <span>❤️ {reel.likes?.length || 0}</span>
                    </div>
                  </div>
                ))
              )
            )}

            {/* Bookmarked / Saved Grid */}
            {activeTab === 'saved' && isOwnProfile && (
              savedPosts.length === 0 ? (
                <div className="col-span-3 text-center py-12 text-slate-500 text-xs">Нет сохраненных постов</div>
              ) : (
                savedPosts.map(post => (
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
                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-sm">
                      <span>❤️ {post.likes?.length || 0}</span>
                    </div>
                  </div>
                ))
              )
            )}

          </div>
        </>
      )}
    </div>
  );
}
