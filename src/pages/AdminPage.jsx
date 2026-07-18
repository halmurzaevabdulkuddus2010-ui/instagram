// AdminPage.jsx - Dashboard for platform managers to moderate content and manage users
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { ShieldCheck, Users, FileText, AlertOctagon, Trash, ShieldAlert, Check } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function AdminPage() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reports, setReports] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('reports'); // 'reports' | 'users'

  // Block non-admins
  if (!currentUser || !currentUser.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Subscriptions
  useEffect(() => {
    const unsubUsers = dbService.subscribeToUsers(setUsers);
    const unsubPosts = dbService.subscribeToPosts(setPosts);
    const unsubReports = dbService.subscribeToReports(setReports);
    return () => {
      unsubUsers();
      unsubPosts();
      unsubReports();
    };
  }, []);

  const pendingReports = reports.filter(r => r.status === 'pending');

  // Stats computation
  const stats = [
    { label: 'Всего пользователей', value: users.length, icon: Users, color: 'text-blue-500' },
    { label: 'Всего публикаций', value: posts.length, icon: FileText, color: 'text-indigo-500' },
    { label: 'Активные жалобы', value: pendingReports.length, icon: AlertOctagon, color: 'text-red-500' },
  ];

  const handleResolveReport = async (reportId) => {
    await dbService.resolveReport(reportId);
    alert("Жалоба отклонена");
  };

  const handleDeleteReportedPost = async (postId, reportId) => {
    if (window.confirm("Удалить эту публикацию в связи с нарушением правил?")) {
      await dbService.deletePost(postId);
      await dbService.resolveReport(reportId);
      alert("Публикация успешно удалена, жалоба закрыта");
    }
  };

  const handleBanToggle = async (user) => {
    if (user.isBanned) {
      await dbService.unbanUser(user.uid);
      alert(`Пользователь @${user.username} разблокирован`);
    } else {
      if (window.confirm(`Заблокировать пользователя @${user.username}? Он больше не сможет войти.`)) {
        await dbService.banUser(user.uid);
        alert(`Пользователь @${user.username} заблокирован`);
      }
    }
  };

  const handleRoleToggle = async (user) => {
    const nextAdminState = !user.isAdmin;
    if (window.confirm(`Изменить права пользователя @${user.username}? Администратор: ${nextAdminState ? 'Да' : 'Нет'}`)) {
      await dbService.updateProfile(user.uid, { isAdmin: nextAdminState });
      alert("Права пользователя изменены");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 md:px-0 transition-colors duration-200">
      
      {/* Header Info */}
      <div className="flex items-center gap-3 mb-8">
        <ShieldCheck size={28} className="text-yellow-500" />
        <div>
          <h1 className="text-xl font-bold">Панель управления модератора</h1>
          <p className="text-xs text-theme-lightMuted dark:text-theme-darkMuted leading-tight">Администрирование Blogger Osh</p>
        </div>
      </div>

      {/* Analytical Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-2xl p-6 transition-all flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-semibold block mb-1">{stat.label}</span>
                <span className="text-2xl font-extrabold">{stat.value}</span>
              </div>
              <div className={`p-3 rounded-full bg-slate-100 dark:bg-slate-800 ${stat.color}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-theme-lightBorder dark:border-theme-darkBorder mb-6">
        <button 
          onClick={() => setActiveSubTab('reports')}
          className={`px-5 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeSubTab === 'reports' ? 'border-brand text-brand' : 'border-transparent text-slate-500'
          }`}
        >
          Жалобы ({pendingReports.length})
        </button>
        <button 
          onClick={() => setActiveSubTab('users')}
          className={`px-5 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeSubTab === 'users' ? 'border-brand text-brand' : 'border-transparent text-slate-500'
          }`}
        >
          Пользователи ({users.length})
        </button>
      </div>

      {/* MODERATION REPORTS */}
      {activeSubTab === 'reports' && (
        <div className="flex flex-col gap-4">
          {pendingReports.length === 0 ? (
            <div className="text-center py-12 bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-2xl">
              <Check size={28} className="text-green-500 mx-auto mb-2" />
              <p className="text-xs text-slate-550">Нет активных жалоб. Все чисто! ✨</p>
            </div>
          ) : (
            pendingReports.map(rep => {
              const post = posts.find(p => p.id === rep.postId);
              const reporter = users.find(u => u.uid === rep.reporterId);
              const author = post ? users.find(u => u.uid === post.userId) : null;
              
              return (
                <div key={rep.id} className="bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-2xl p-5 transition-colors flex flex-col md:flex-row gap-5 justify-between">
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 text-xs">
                      <span className="font-bold text-red-500">Причина: {rep.reason}</span>
                      <span className="text-slate-400">|</span>
                      <span>Отправитель жалобы: <strong className="text-brand">@{reporter?.username || 'user'}</strong></span>
                    </div>

                    {/* Reported Post Preview Card */}
                    {post ? (
                      <div className="flex gap-4 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl max-w-lg border border-slate-100 dark:border-slate-800">
                        <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-900">
                          {post.type === 'photo' ? (
                            <img src={post.mediaURL} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <video src={post.mediaURL} muted className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="text-xs">
                          <p className="font-bold mb-1">Автор: @{author?.username}</p>
                          <p className="line-clamp-2 text-slate-500 leading-tight">{post.caption}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Публикация уже удалена автором</p>
                    )}
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                    <button 
                      onClick={() => handleResolveReport(rep.id)}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Отклонить жалобу
                    </button>
                    {post && (
                      <button 
                        onClick={() => handleDeleteReportedPost(post.id, rep.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-200 dark:shadow-none cursor-pointer"
                      >
                        <Trash size={14} />
                        <span>Удалить пост</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* USER MANAGEMENT */}
      {activeSubTab === 'users' && (
        <div className="bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-2xl overflow-hidden shadow-sm transition-colors duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-550 border-b border-theme-lightBorder dark:border-theme-darkBorder font-bold uppercase tracking-wider">
                  <th className="p-4">Пользователь</th>
                  <th className="p-4">Контакты</th>
                  <th className="p-4">Права</th>
                  <th className="p-4">Статус</th>
                  <th className="p-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 font-medium">
                {users.map(user => {
                  const isSelf = user.uid === currentUser.uid;
                  return (
                    <tr key={user.uid} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                      {/* Name/Username */}
                      <td className="p-4 flex items-center gap-3">
                        <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full object-cover shrink-0" />
                        <div>
                          <p className="font-bold leading-tight">{user.displayName}</p>
                          <p className="text-[10px] text-slate-500 leading-tight">@{user.username}</p>
                        </div>
                      </td>
                      
                      {/* Contacts */}
                      <td className="p-4">
                        <p>{user.email}</p>
                        <p className="text-[10px] text-slate-500">{user.phone || 'Нет телефона'}</p>
                      </td>
                      
                      {/* Roles */}
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                          user.isAdmin ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {user.isAdmin ? 'Администратор' : 'Пользователь'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                          user.isBanned ? 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400' : 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400'
                        }`}>
                          {user.isBanned ? 'Забанен' : 'Активен'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        {!isSelf ? (
                          <div className="flex justify-end gap-2.5">
                            <button 
                              onClick={() => handleRoleToggle(user)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg font-bold text-[10px] cursor-pointer"
                            >
                              Права
                            </button>
                            <button 
                              onClick={() => handleBanToggle(user)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[10px] cursor-pointer ${
                                user.isBanned 
                                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-100 dark:shadow-none' 
                                  : 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-100 dark:shadow-none'
                              }`}
                            >
                              <ShieldAlert size={10} />
                              <span>{user.isBanned ? 'Разбанить' : 'Забанить'}</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Это вы</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
