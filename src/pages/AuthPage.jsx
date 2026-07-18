// AuthPage.jsx - Gorgeous split-screen page for registration and login
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, CheckCircle, Smartphone, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthPage() {
  const { login, register, loginWithGoogle, loginWithPhoneStart, loginWithPhoneVerify } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'phone'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  // Phone OTP States
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setDisplayName('');
    setPhoneNumber('');
    setOtpCode('');
    setOtpSent(false);
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError('Заполните все поля');
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !username || !displayName) {
      return setError('Пожалуйста, заполните все поля');
    }
    if (username.length < 3) {
      return setError('Имя пользователя должно быть не менее 3 символов');
    }
    setError('');
    setLoading(true);
    try {
      await register(email, password, username, displayName);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError(err.message || 'Ошибка входа через Google');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber) return setError('Введите номер телефона');
    setError('');
    setLoading(true);
    try {
      await loginWithPhoneStart(phoneNumber);
      setOtpSent(true);
    } catch (err) {
      setError(err.message || 'Ошибка отправки SMS');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    if (!otpCode) return setError('Введите код из SMS');
    setError('');
    setLoading(true);
    try {
      await loginWithPhoneVerify(phoneNumber, otpCode);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Ошибка проверки кода');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-theme-lightBg dark:bg-theme-darkBg transition-colors duration-200">
      
      {/* LEFT PANEL: Branding & Visuals (visible on desktop) */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-gradient-to-tr from-brand-dark via-brand to-instagram-pink text-white relative overflow-hidden">
        {/* Decorative backdrop patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 relative z-10">
          <span className="text-3xl font-black tracking-wider">Blogger Osh</span>
        </div>

        <div className="max-w-md relative z-10">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight mb-6">
            Социальная сеть нового поколения.
          </h1>
          <p className="text-white/80 text-lg">
            Делитесь лучшими моментами, снимайте захватывающие Reels, общайтесь с друзьями в реальном времени и открывайте для себя прекрасный город Ош.
          </p>
        </div>

        <div className="flex justify-between text-xs text-white/50 relative z-10">
          <span>© 2026 Blogger Osh. Все права защищены.</span>
          <span className="flex items-center gap-1">
            <Globe size={12} />
            <span>Русский (Кыргызстан)</span>
          </span>
        </div>
      </div>

      {/* RIGHT PANEL: Auth Card Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-theme-lightBg dark:bg-theme-darkBg transition-colors">
        <div className="w-full max-w-md">
          {/* Logo on mobile */}
          <div className="lg:hidden text-center mb-8">
            <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-brand to-instagram-pink bg-clip-text text-transparent">
              Blogger Osh
            </h2>
            <p className="text-xs text-theme-lightMuted dark:text-theme-darkMuted mt-1">
              Социальная сеть нового поколения
            </p>
          </div>

          <div className="bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-3xl p-8 shadow-xl transition-colors duration-200">
            {/* Tab switch header */}
            <div className="flex gap-4 mb-6 border-b border-theme-lightBorder dark:border-theme-darkBorder pb-3">
              <button 
                onClick={() => { setMode('login'); clearForm(); }}
                className={`pb-2 text-sm font-bold border-b-2 transition-all ${
                  mode === 'login' ? 'border-brand text-brand' : 'border-transparent text-slate-500'
                }`}
              >
                Вход
              </button>
              <button 
                onClick={() => { setMode('register'); clearForm(); }}
                className={`pb-2 text-sm font-bold border-b-2 transition-all ${
                  mode === 'register' ? 'border-brand text-brand' : 'border-transparent text-slate-500'
                }`}
              >
                Регистрация
              </button>
              <button 
                onClick={() => { setMode('phone'); clearForm(); }}
                className={`pb-2 text-sm font-bold border-b-2 transition-all ${
                  mode === 'phone' ? 'border-brand text-brand' : 'border-transparent text-slate-500'
                }`}
              >
                Телефон
              </button>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-xs font-semibold rounded-xl text-red-500 text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email LOGIN Form */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-theme-lightMuted dark:text-theme-darkMuted">Email / Логин</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="admin@bloggerosh.kg или traveler_osh"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-800/50 border border-theme-lightBorder dark:border-theme-darkBorder rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-theme-lightMuted dark:text-theme-darkMuted">Пароль</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-800/50 border border-theme-lightBorder dark:border-theme-darkBorder rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 bg-brand hover:bg-brand-dark text-white rounded-xl text-sm font-bold shadow-md shadow-brand/20 transition-all cursor-pointer"
                >
                  {loading ? 'Вход...' : 'Войти'}
                </button>
              </form>
            )}

            {/* Email REGISTER Form */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-theme-lightMuted dark:text-theme-darkMuted">Имя в Blogger Osh</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Алибек Каримов"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-800/50 border border-theme-lightBorder dark:border-theme-darkBorder rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-theme-lightMuted dark:text-theme-darkMuted">Username (никнейм)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-slate-400 text-sm font-semibold">@</span>
                    <input 
                      type="text" 
                      placeholder="alibek_osh"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-800/50 border border-theme-lightBorder dark:border-theme-darkBorder rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-theme-lightMuted dark:text-theme-darkMuted">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input 
                      type="email" 
                      placeholder="alibek@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-800/50 border border-theme-lightBorder dark:border-theme-darkBorder rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-theme-lightMuted dark:text-theme-darkMuted">Пароль</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-800/50 border border-theme-lightBorder dark:border-theme-darkBorder rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 bg-brand hover:bg-brand-dark text-white rounded-xl text-sm font-bold shadow-md shadow-brand/20 transition-all cursor-pointer"
                >
                  {loading ? 'Создание аккаунта...' : 'Создать аккаунт'}
                </button>
              </form>
            )}

            {/* Phone Number Auth Form */}
            {mode === 'phone' && (
              <div className="flex flex-col gap-4">
                {!otpSent ? (
                  <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-theme-lightMuted dark:text-theme-darkMuted">Номер телефона</label>
                      <div className="relative">
                        <Smartphone size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                        <input 
                          type="tel" 
                          placeholder="+996 777 123 456"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full bg-slate-100 dark:bg-slate-800/50 border border-theme-lightBorder dark:border-theme-darkBorder rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full py-3 bg-brand hover:bg-brand-dark text-white rounded-xl text-sm font-bold shadow-md shadow-brand/20 transition-all cursor-pointer"
                    >
                      {loading ? 'Отправка...' : 'Отправить SMS-код'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleOtpVerify} className="flex flex-col gap-4">
                    <p className="text-xs text-slate-500 text-center">
                      На номер <span className="font-semibold">{phoneNumber}</span> отправлен SMS-код подтверждения.
                    </p>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-theme-lightMuted dark:text-theme-darkMuted">Код из SMS</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                        <input 
                          type="text" 
                          maxLength={6}
                          placeholder="Введите 123456"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          className="w-full bg-slate-100 dark:bg-slate-800/50 border border-theme-lightBorder dark:border-theme-darkBorder rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand text-center tracking-widest font-mono text-lg"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full py-3 bg-brand hover:bg-brand-dark text-white rounded-xl text-sm font-bold shadow-md shadow-brand/20 transition-all cursor-pointer"
                    >
                      {loading ? 'Проверка...' : 'Войти по коду'}
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-xs text-slate-500 hover:text-brand font-semibold text-center"
                    >
                      Изменить номер телефона
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Quick SSO Logins */}
            <div className="mt-8 pt-6 border-t border-theme-lightBorder dark:border-theme-darkBorder text-center">
              <span className="text-xs text-theme-lightMuted dark:text-theme-darkMuted block mb-4">или войти с помощью</span>
              <button 
                type="button" 
                onClick={handleGoogleSignIn}
                className="w-full py-3 border border-theme-lightBorder dark:border-theme-darkBorder rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold flex items-center justify-center gap-3 transition-all cursor-pointer text-slate-700 dark:text-slate-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Войти через Google</span>
              </button>
            </div>

            {/* Quick credentials helper */}
            <div className="mt-6 p-4 rounded-2xl bg-brand/5 border border-brand/10 text-[11px] text-theme-lightMuted dark:text-theme-darkMuted leading-relaxed">
              <span className="font-bold text-brand block mb-1">Демо-аккаунты для быстрой проверки:</span>
              <ul className="list-disc pl-4 space-y-1">
                <li>Админ: <span className="font-semibold text-slate-750 dark:text-slate-200">admin@bloggerosh.kg</span> (или <span className="font-semibold text-slate-750 dark:text-slate-200">osh_admin</span>)</li>
                <li>Блогер: <span className="font-semibold text-slate-750 dark:text-slate-200">traveler_osh</span></li>
                <li>Пароль: <span className="font-semibold text-slate-750 dark:text-slate-200">любой пароль</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
