// SettingsPage.jsx - Privacy settings, profile customization, and blocking management
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { Save, ShieldAlert, Lock, Unlock, EyeOff, UserMinus, UserCheck } from 'lucide-react';

export default function SettingsPage() {
  const { currentUser, updateProfileDetails } = useAuth();
  
  const [displayName, setDisplayName] = useState(currentUser.displayName || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [isPrivate, setIsPrivate] = useState(currentUser.isPrivate || false);
  const [users, setUsers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Subscribe to users to find blocked user records
  useEffect(() => {
    const unsub = dbService.subscribeToUsers(setUsers);
    return unsub;
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await updateProfileDetails({
        displayName: displayName.trim(),
        bio: bio.trim(),
        isPrivate
      });
      setSuccessMsg('Настройки успешно сохранены!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert("Ошибка при сохранении настроек: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUnblock = async (blockedUid) => {
    if (window.confirm("Разблокировать этого пользователя?")) {
      await dbService.unblockUser(currentUser.uid, blockedUid);
    }
  };

  // Find users currently blocked by the current user
  const blockedList = users.filter(u => currentUser.blockedUsers?.includes(u.uid));

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4 md:px-0 transition-colors duration-200">
      
      <div className="flex flex-col gap-6">
        <h1 className="text-xl font-bold">Настройки профиля</h1>

        {successMsg && (
          <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-xs font-semibold rounded-xl text-green-600 text-center">
            {successMsg}
          </div>
        )}

        {/* Configuration Edit Form */}
        <form onSubmit={handleSave} className="bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-2xl p-6 flex flex-col gap-6 shadow-sm transition-colors duration-200">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-theme-lightMuted dark:text-theme-darkMuted">Никнейм (username)</label>
            <input 
              type="text" 
              disabled 
              value={`@${currentUser.username}`}
              className="w-full bg-slate-100 dark:bg-slate-800/40 border border-theme-lightBorder dark:border-theme-darkBorder rounded-xl px-4 py-2.5 text-xs text-slate-500 font-bold"
            />
            <p className="text-[10px] text-slate-500">Уникальное имя пользователя не может быть изменено в целях безопасности</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-theme-lightMuted dark:text-theme-darkMuted">Отображаемое имя</label>
            <input 
              type="text" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-theme-lightBorder dark:border-theme-darkBorder rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-theme-lightMuted dark:text-theme-darkMuted">О себе (биография)</label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full bg-white dark:bg-slate-800 border border-theme-lightBorder dark:border-theme-darkBorder rounded-xl p-3 text-xs focus:outline-none focus:border-brand resize-none"
            />
          </div>

          {/* Privacy Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex gap-3 items-start pr-8">
              {isPrivate ? <Lock className="text-brand shrink-0 mt-0.5" size={18} /> : <Unlock className="text-slate-400 shrink-0 mt-0.5" size={18} />}
              <div>
                <h4 className="text-xs font-bold leading-normal">Закрытый аккаунт</h4>
                <p className="text-[10px] text-theme-lightMuted dark:text-theme-darkMuted leading-normal">
                  Когда аккаунт закрыт, только одобренные подписчики могут видеть ваши публикации, Reels и истории.
                </p>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={isPrivate} 
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:height-4 after:h-4 after:w-4 after:transition-all peer-checked:bg-brand" />
            </label>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-brand hover:bg-brand-dark disabled:bg-slate-400 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand/15 cursor-pointer self-end w-full md:w-auto"
          >
            <Save size={16} />
            <span>{saving ? 'Сохранение...' : 'Сохранить изменения'}</span>
          </button>
        </form>

        {/* Blocking List Section */}
        <div className="bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-2xl p-6 flex flex-col gap-4 shadow-sm transition-colors duration-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-lightMuted dark:text-theme-darkMuted flex items-center gap-1.5">
            <EyeOff size={14} className="text-red-500" />
            <span>Заблокированные пользователи ({blockedList.length})</span>
          </h3>

          <div className="flex flex-col gap-2">
            {blockedList.length === 0 ? (
              <p className="text-xs text-theme-lightMuted dark:text-theme-darkMuted italic text-center py-2 bg-slate-50 dark:bg-slate-800/10 rounded-xl">
                Вы никого не заблокировали
              </p>
            ) : (
              blockedList.map(u => (
                <div key={u.uid} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <img src={u.photoURL} alt={u.displayName} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="text-xs font-bold leading-tight">{u.displayName}</p>
                      <p className="text-[9px] text-slate-500 leading-tight">@{u.username}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleUnblock(u.uid)}
                    className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                  >
                    <UserCheck size={12} />
                    <span>Разблокировать</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
