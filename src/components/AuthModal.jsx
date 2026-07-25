import React, { useState } from 'react';
import { X, Smartphone, Lock, User, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClinicAuth } from '../context/ClinicAuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { switchRole } = useClinicAuth();
  const [mode, setMode] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('+996 ');
  const [otp, setOtp] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setMode('otp');
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setMode('phone');
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 p-6"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <X size={18} />
          </button>

          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 mx-auto mb-3 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C9.5 2 7.5 3.5 6.5 5.5C5.5 7.5 5 10 5.5 12.5C6 15 7 17.5 8 19.5C8.5 20.5 9.5 22 10.5 22C11.5 22 11.8 20.5 12 19C12.2 20.5 12.5 22 13.5 22C14.5 22 15.5 20.5 16 19.5C17 17.5 18 15 18.5 12.5C16.5 3.5 14.5 2 12 2Z" />
                </svg>
              </div>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Вход и Регистрация
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Стоматологическая клиника «АКАК ТИШ»
            </p>
          </div>

          {success ? (
            <div className="py-8 text-center flex flex-col items-center">
              <CheckCircle2 size={56} className="text-emerald-500 mb-3 animate-bounce" />
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Авторизация успешна!</h4>
              <p className="text-xs text-slate-400 mt-1">Создана личная электронная медкарта пациента.</p>
            </div>
          ) : mode === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Номер телефона</label>
                <div className="relative">
                  <Smartphone size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input 
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+996 (555) 00-11-22"
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-cyan-500/20 hover:scale-[1.02] transition-all cursor-pointer"
              >
                Получить SMS-код
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpVerify} className="flex flex-col gap-4">
              <p className="text-xs text-slate-500 text-center">
                Код отправлен на <span className="font-bold text-slate-900 dark:text-white">{phone}</span>
              </p>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Код из SMS</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input 
                    type="text"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="1234"
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono tracking-widest text-center text-lg focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-cyan-500/20 hover:scale-[1.02] transition-all cursor-pointer"
              >
                Подтвердить
              </button>
            </form>
          )}

          {/* Social Logins */}
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 block text-center mb-3">или войти через</span>
            
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => { switchRole('patient'); onClose(); }}
                className="py-2 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Google</span>
              </button>

              <button 
                onClick={() => { switchRole('patient'); onClose(); }}
                className="py-2 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.13-1.97.99-3.12-1 .04-2.19.67-2.91 1.5-.63.73-1.19 1.9-1.04 3.03 1.12.09 2.29-.59 2.96-1.41z"/>
                </svg>
                <span>Apple ID</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
