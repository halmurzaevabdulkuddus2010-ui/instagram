import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, User, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIAssistantModal({ isOpen, onClose, onBookDirect }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Здравствуйте! Я ваш виртуальный ИИ-стоматолог клиники «АКАК ТИШ». Чем я могу помочь вам сегодня?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Как подготовиться к чистке?',
    'Что делать после удаления зуба?',
    'Как ухаживать за брекетами?',
    'Записаться на прием'
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = 'Спасибо за вопрос! Клиника «АКАК ТИШ» предлагает инновационные и абсолютно безболезненные методы лечения. Могу я записать вас на бесплатную первичную консультацию?';

      const lower = query.toLowerCase();
      if (lower.includes('удал') || lower.includes('вырыв')) {
        botResponse = 'Рекомендации после удаления зуба:\n1. Удерживайте марлевый тампон 20 минут.\n2. Не пейте и не ешьте горячее первые 2-3 часа.\n3. Не полоскайте рот слишком активно в первый день.\n4. Примите назначенные анальгетики.';
      } else if (lower.includes('брекет') || lower.includes('прикус')) {
        botResponse = 'Уход за брекетами Damon в клинике «АКАК ТИШ»:\n1. Чистите зубы ортодонтической V-образной щеткой после каждого приема пищи.\n2. Используйте монопучковую щетку и ирригатор.\n3. Избегайте твердых орехов, сухариков и тягучих конфет.';
      } else if (lower.includes('запис') || lower.includes('прием')) {
        botResponse = 'Отлично! Я могу помочь вам записаться к нашим лучшим специалистам. Нажмите кнопку «Записаться» ниже!';
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 1000);
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
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] z-10"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Bot size={22} className="text-white animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                  ИИ Стоматолог «АКАК ТИШ»
                  <Sparkles size={14} className="text-cyan-200" />
                </h3>
                <p className="text-[11px] text-cyan-100/90">Онлайн помощник 24/7</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 text-white">
              <X size={20} />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50/50 dark:bg-slate-950/50">
            {messages.map(msg => (
              <div 
                key={msg.id}
                className={`flex gap-2.5 max-w-[85%] ${
                  msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user' 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white'
                }`}>
                  {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>

                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-tr-none shadow-md shadow-cyan-500/10'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-slate-400 p-2">
                <Bot size={16} className="animate-spin text-cyan-500" />
                <span>ИИ думает над ответом...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (p === 'Записаться на прием') {
                    onClose();
                    onBookDirect();
                  } else {
                    handleSend(p);
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[11px] font-bold shrink-0 hover:bg-cyan-500/20 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2"
          >
            <input 
              type="text"
              placeholder="Задайте вопрос по лечению зубов..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl disabled:opacity-50 text-xs font-bold shadow-md shadow-cyan-500/20 hover:scale-105 transition-all"
            >
              <Send size={16} />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
