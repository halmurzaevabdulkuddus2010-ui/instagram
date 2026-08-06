// AuthPage.jsx - Gorgeous split-screen page for registration and login
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, CheckCircle, Smartphone, Globe, ChevronLeft } from 'lucide-react';
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
    <div className="min-h-screen w-full flex flex-col justify-between bg-white dark:bg-theme-darkBg text-slate-800 dark:text-white transition-colors duration-200">
      
      <div className="flex-1 flex w-full max-w-6xl mx-auto items-center justify-center px-4 py-8 lg:py-16">
        
        {/* LEFT PANEL: Official Instagram Replicating Illustration (visible on desktop) */}
        <div className="hidden lg:flex w-1/2 flex-col justify-center items-start pr-12 border-r border-slate-100 dark:border-slate-800">
          {/* Logo with Gradient */}
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="insta-grad-login" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f09433"/>
                  <stop offset="25%" stopColor="#e6683c"/>
                  <stop offset="50%" stopColor="#dc2743"/>
                  <stop offset="75%" stopColor="#cc2366"/>
                  <stop offset="100%" stopColor="#bc1888"/>
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="20" height="20" rx="6" stroke="url(#insta-grad-login)" strokeWidth="2"/>
              <circle cx="12" cy="12" r="4.5" stroke="url(#insta-grad-login)" strokeWidth="2"/>
              <circle cx="17.5" cy="6.5" r="1.2" fill="url(#insta-grad-login)"/>
            </svg>
            <span className="text-3xl font-black tracking-widest bg-gradient-to-r from-brand to-osh-pink bg-clip-text text-transparent">INSTAGRAM</span>
          </div>

          <h1 className="font-serif text-3xl xl:text-4xl text-slate-855 dark:text-slate-100 leading-tight font-normal mb-8">
            Посмотрите, какими моментами из жизни поделились ваши{" "}
            <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent font-medium">
              близкие друзья.
            </span>
          </h1>

          {/* Floating visual mock preview cards matching the user screenshot */}
          <div className="relative w-full max-w-sm h-80 mx-auto mt-6 bg-slate-50 dark:bg-slate-900/40 rounded-3xl p-6 overflow-hidden border border-slate-100 dark:border-slate-800">
            {/* Left Card */}
            <div className="absolute left-4 bottom-4 w-36 h-52 rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-slate-800 transform -rotate-6 z-10 hover:scale-105 transition-transform duration-300">
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80" alt="Friends laughing" className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-pink-500 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                Сториз
              </div>
            </div>

            {/* Right Card */}
            <div className="absolute right-4 top-4 w-32 h-48 rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-slate-800 transform rotate-6 z-10 hover:scale-105 transition-transform duration-300">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80" alt="Close friend smiling" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 right-2 bg-green-500 text-white p-1 rounded-full text-[10px] shadow-md flex items-center justify-center font-bold">
                ★
              </div>
            </div>

            {/* Center Card */}
            <div className="absolute left-1/2 top-8 w-44 h-60 rounded-2xl overflow-hidden shadow-xl border-2 border-white dark:border-slate-800 transform -translate-x-1/2 z-20 hover:scale-105 transition-transform duration-300">
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80" alt="Hugging friends" className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-5 h-5 rounded-full border border-white" alt="avatar" />
                <span className="text-[9px] font-bold text-white drop-shadow-md">beka_osh</span>
              </div>
              <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] text-white font-extrabold flex items-center gap-1">
                ❤️ 452
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Authentic Instagram Login Form Container */}
        <div className="w-full lg:w-1/2 flex justify-center lg:pl-12">
          <div className="w-full max-w-sm flex flex-col gap-5">
            
            {/* Split top card for desktop */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-9 shadow-sm">
              
              {/* Header with back arrow */}
              <div className="flex items-center gap-3 mb-6">
                {mode !== 'login' && (
                  <button 
                    onClick={() => { setMode('login'); clearForm(); }} 
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer text-slate-700 dark:text-slate-200"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  {mode === 'login' ? 'Войти в Instagram' : mode === 'register' ? 'Регистрация' : 'Вход по телефону'}
                </h2>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-[11px] font-semibold rounded-lg text-red-500 text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* LOGIN FORM */}
              {mode === 'login' && (
                <form onSubmit={handleLogin} className="flex flex-col gap-3">
                  <input 
                    type="text" 
                    placeholder="Имя пользователя или эл. адрес"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-905 border border-slate-200 dark:border-slate-700 rounded-md px-3.5 py-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white dark:focus:bg-slate-950"
                  />
                  <input 
                    type="password" 
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-905 border border-slate-200 dark:border-slate-700 rounded-md px-3.5 py-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white dark:focus:bg-slate-950"
                  />
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 bg-[#4cb5f9] hover:bg-[#189bf2] text-white text-xs font-extrabold rounded-md cursor-pointer transition-colors shadow-sm disabled:opacity-50 mt-2"
                  >
                    {loading ? 'Вход...' : 'Войти'}
                  </button>

                  <a 
                    href="#forgot" 
                    onClick={(e) => { e.preventDefault(); alert("Обратитесь к администратору osh_admin для сброса пароля."); }}
                    className="text-xs text-[#00376b] dark:text-[#4cb5f9] hover:underline text-center mt-3 block"
                  >
                    Забыли пароль?
                  </a>
                </form>
              )}

              {/* REGISTRATION FORM */}
              {mode === 'register' && (
                <form onSubmit={handleRegister} className="flex flex-col gap-3">
                  <input 
                    type="text" 
                    placeholder="Имя и фамилия"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-905 border border-slate-200 dark:border-slate-700 rounded-md px-3.5 py-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white"
                  />
                  <input 
                    type="text" 
                    placeholder="Имя пользователя (никнейм)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-905 border border-slate-200 dark:border-slate-700 rounded-md px-3.5 py-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white"
                  />
                  <input 
                    type="email" 
                    placeholder="Электронный адрес (email)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-905 border border-slate-200 dark:border-slate-700 rounded-md px-3.5 py-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white"
                  />
                  <input 
                    type="password" 
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-905 border border-slate-200 dark:border-slate-700 rounded-md px-3.5 py-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white"
                  />

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 bg-[#4cb5f9] hover:bg-[#189bf2] text-white text-xs font-extrabold rounded-md cursor-pointer transition-colors shadow-sm disabled:opacity-50 mt-2"
                  >
                    {loading ? 'Создание...' : 'Регистрация'}
                  </button>
                </form>
              )}

              {/* PHONE OTP FORM */}
              {mode === 'phone' && (
                <div className="flex flex-col gap-3">
                  {!otpSent ? (
                    <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-3">
                      <input 
                        type="tel" 
                        placeholder="Номер телефона (+996...)"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-905 border border-slate-200 dark:border-slate-700 rounded-md px-3.5 py-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white"
                      />
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3 bg-[#4cb5f9] hover:bg-[#189bf2] text-white text-xs font-extrabold rounded-md cursor-pointer transition-colors shadow-sm disabled:opacity-50 mt-2"
                      >
                        {loading ? 'Отправка...' : 'Отправить код'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleOtpVerify} className="flex flex-col gap-3">
                      <p className="text-[10px] text-slate-400 text-center mb-1">
                        Код отправлен на <span className="font-semibold text-slate-600 dark:text-slate-350">{phoneNumber}</span>
                      </p>
                      <input 
                        type="text" 
                        maxLength={6}
                        placeholder="Введите код подтверждения"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-905 border border-slate-200 dark:border-slate-700 rounded-md px-3.5 py-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white text-center tracking-widest font-bold"
                      />
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3 bg-[#4cb5f9] hover:bg-[#189bf2] text-white text-xs font-extrabold rounded-md cursor-pointer transition-colors shadow-sm disabled:opacity-50 mt-2"
                      >
                        {loading ? 'Проверка...' : 'Войти по коду'}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setOtpSent(false)}
                        className="text-[11px] text-[#00376b] dark:text-[#4cb5f9] hover:underline text-center"
                      >
                        Изменить номер телефона
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Dividers */}
              <div className="flex items-center my-5">
                <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-800"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase px-4 tracking-wider">ИЛИ</span>
                <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-800"></div>
              </div>

              {/* Google login options */}
              <button 
                type="button" 
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center gap-2 text-xs font-extrabold text-[#385185] dark:text-[#4cb5f9] w-full py-1 hover:underline cursor-pointer"
              >
                <span className="text-sm">🔵</span> Войти через Google / Facebook
              </button>

              {/* Phone login switch */}
              {mode !== 'phone' && (
                <button 
                  type="button" 
                  onClick={() => { setMode('phone'); clearForm(); }}
                  className="text-xs text-[#00376b] dark:text-[#4cb5f9] hover:underline w-full text-center mt-3 block"
                >
                  Войти по номеру телефона
                </button>
              )}
            </div>

            {/* Bottom Account Switch Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 text-center text-xs">
              {mode === 'login' ? (
                <div className="flex items-center justify-center gap-1 text-slate-600 dark:text-slate-400">
                  <span>У вас нет аккаунта?</span>
                  <button 
                    onClick={() => { setMode('register'); clearForm(); }}
                    className="text-[#4cb5f9] font-extrabold hover:underline cursor-pointer"
                  >
                    Создать новый аккаунт
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1 text-slate-600 dark:text-slate-400">
                  <span>Уже зарегистрированы?</span>
                  <button 
                    onClick={() => { setMode('login'); clearForm(); }}
                    className="text-[#4cb5f9] font-extrabold hover:underline cursor-pointer"
                  >
                    Войти в аккаунт
                  </button>
                </div>
              )}
            </div>

            {/* Quick credentials Helper */}
            <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
              <span className="font-extrabold text-[#00376b] dark:text-[#4cb5f9] block mb-1">Демо-аккаунты для быстрой проверки:</span>
              <ul className="list-disc pl-4 space-y-1">
                <li>Админ: <span className="font-semibold text-slate-700 dark:text-slate-350">admin@bloggerosh.kg</span> (или <span className="font-semibold text-slate-700 dark:text-slate-350">osh_admin</span>)</li>
                <li>Блогер: <span className="font-semibold text-slate-700 dark:text-slate-350">traveler_osh</span></li>
                <li>Пароль: <span className="font-semibold text-slate-700 dark:text-slate-350">любой пароль</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER: Official Instagram replica Meta Footer */}
      <footer className="w-full pb-8 pt-4 px-4 text-center text-[10px] text-slate-400 dark:text-slate-500 bg-white dark:bg-theme-darkBg transition-colors border-t border-slate-50 dark:border-slate-900">
        <div className="flex gap-4 flex-wrap justify-center font-medium max-w-4xl mx-auto mb-3">
          <span className="hover:underline cursor-pointer">Meta</span>
          <span className="hover:underline cursor-pointer">Информация</span>
          <span className="hover:underline cursor-pointer">Блог</span>
          <span className="hover:underline cursor-pointer">Вакансии</span>
          <span className="hover:underline cursor-pointer">Помощь</span>
          <span className="hover:underline cursor-pointer">API</span>
          <span className="hover:underline cursor-pointer">Конфиденциальность</span>
          <span className="hover:underline cursor-pointer">Условия</span>
          <span className="hover:underline cursor-pointer">Места</span>
          <span className="hover:underline cursor-pointer">Instagram Lite</span>
          <span className="hover:underline cursor-pointer">Threads</span>
          <span className="hover:underline cursor-pointer">Загрузка контактов и лица</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-wider text-slate-400 font-bold">
          <span>© 2026 INSTAGRAM FROM</span>
          <span className="tracking-widest font-black text-slate-500">∞ Meta</span>
        </div>
      </footer>
    </div>
  );
}
