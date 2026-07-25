import React, { useState } from 'react';
import { Send, Image, Mic, Video, PhoneCall, Bot, User, CheckCircle2 } from 'lucide-react';

export default function ConsultationPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'doc', name: 'Д-р Алмаз Каримов', text: 'Здравствуйте! Направьте фотографию волнующего зуба или опишите вашу проблему.' }
  ]);
  const [input, setInput] = useState('');
  const [isVideoModal, setIsVideoModal] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { id: Date.now(), sender: 'patient', name: 'Вы', text: input }]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'doc',
        name: 'Д-р Алмаз Каримов',
        text: 'Понял вашу проблему. Рекомендую пройти первичный осмотр и сделать 3D снимок.'
      }]);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-4 pb-24 h-[calc(100vh-5rem)]">
      {/* Header Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80" alt="Doctor" className="w-10 h-10 rounded-2xl object-cover ring-2 ring-cyan-500" />
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Д-р Алмаз Каримов</h3>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> В сети (Онлайн Консультация)
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setIsVideoModal(true)}
            className="p-2.5 rounded-xl bg-cyan-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-cyan-500/20"
          >
            <Video size={16} /> <span className="hidden sm:inline">Видеозвонок</span>
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col gap-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'patient' ? 'items-end' : 'items-start'}`}>
            <span className="text-[10px] text-slate-400 mb-1 px-1">{msg.name}</span>
            <div className={`p-3.5 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
              msg.sender === 'patient' 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex items-center gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Напишите сообщение доктору..." 
          className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none"
        />
        <button type="submit" className="p-2.5 bg-cyan-500 text-white rounded-xl shadow-md">
          <Send size={16} />
        </button>
      </form>

      {/* Video Call Modal */}
      {isVideoModal && (
        <div className="fixed inset-0 z-[200] bg-slate-950/90 flex flex-col items-center justify-center p-4 text-white text-center">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-4 ring-4 ring-cyan-500 animate-pulse">
            <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80" alt="Doctor" className="w-full h-full object-cover" />
          </div>
          <h3 className="text-xl font-extrabold mb-1">Видеозвонок с Д-ром Алмазом</h3>
          <p className="text-xs text-cyan-300 mb-6">Подключение защищенного канала «АКАК ТИШ»...</p>
          <button 
            onClick={() => setIsVideoModal(false)}
            className="px-6 py-3 bg-red-600 text-white font-bold text-xs rounded-2xl shadow-lg"
          >
            Завершить звонок
          </button>
        </div>
      )}
    </div>
  );
}
