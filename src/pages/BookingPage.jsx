import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  UserCheck, 
  Stethoscope, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { useClinicAuth } from '../context/ClinicAuthContext';

export default function BookingPage({ onBookingComplete }) {
  const { branches, doctorsList, servicesList, addAppointment, currentUser } = useClinicAuth();

  const [step, setStep] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [selectedDoctor, setSelectedDoctor] = useState(doctorsList[0]);
  const [selectedService, setSelectedService] = useState(servicesList[0]);
  const [selectedDate, setSelectedDate] = useState("2026-07-25");
  const [selectedTime, setSelectedTime] = useState("11:00");
  const [notes, setNotes] = useState("");
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const availableTimes = ["09:00", "10:00", "11:00", "12:30", "14:00", "15:30", "17:00", "18:30"];

  const handleConfirm = () => {
    addAppointment({
      patientName: currentUser.name,
      patientPhone: currentUser.phone,
      doctorName: selectedDoctor.name,
      doctorId: selectedDoctor.id,
      serviceTitle: selectedService.title,
      branchName: selectedBranch.name,
      date: selectedDate,
      time: selectedTime,
      notes: notes
    });

    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 shadow-xl animate-bounce">
          <CheckCircle2 size={48} />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
          Вы успешно записаны на прием!
        </h2>

        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
          Запись подтверждена администратором. Мы отправили уведомление и ждем вас в клинике «АКАК ТИШ»!
        </p>

        <div className="w-full p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2 mb-6 shadow-lg">
          <div className="flex justify-between">
            <span className="text-slate-400">Пациент:</span>
            <span className="font-bold text-slate-900 dark:text-white">{currentUser.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Врач:</span>
            <span className="font-bold text-cyan-600 dark:text-cyan-400">{selectedDoctor.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Услуга:</span>
            <span className="font-bold text-slate-900 dark:text-white">{selectedService.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Филиал:</span>
            <span className="font-bold text-slate-900 dark:text-white">{selectedBranch.name}</span>
          </div>
          <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-2">
            <span className="text-slate-400">Дата и время:</span>
            <span className="font-extrabold text-cyan-500">{selectedDate} в {selectedTime}</span>
          </div>
        </div>

        <button
          onClick={() => { setIsSuccess(false); setStep(1); onBookingComplete(); }}
          className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-cyan-500/25 hover:scale-105 transition-all"
        >
          Перейти в Личный кабинет
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6 pb-24">
      {/* Page Title */}
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Онлайн-запись на прием
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Выберите филиал, доктора, удобную дату и время
        </p>
      </div>

      {/* Stepper Header */}
      <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-bold">
        <span className={step === 1 ? 'text-cyan-500' : 'text-slate-400'}>1. Филиал & Врач</span>
        <span>→</span>
        <span className={step === 2 ? 'text-cyan-500' : 'text-slate-400'}>2. Услуга & Дата</span>
        <span>→</span>
        <span className={step === 3 ? 'text-cyan-500' : 'text-slate-400'}>3. Подтверждение</span>
      </div>

      {/* STEP 1: Branch & Doctor */}
      {step === 1 && (
        <div className="flex flex-col gap-6">
          {/* Branch Select */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin size={18} className="text-cyan-500" />
              Выберите филиал клиники
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {branches.map(b => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBranch(b)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedBranch.id === b.id 
                      ? 'border-cyan-500 bg-cyan-500/10 shadow-md' 
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white block mb-1">{b.name}</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{b.address}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor Select */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck size={18} className="text-blue-500" />
              Выберите специалиста
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {doctorsList.map(doc => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoctor(doc)}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                    selectedDoctor.id === doc.id 
                      ? 'border-cyan-500 bg-cyan-500/10 shadow-md' 
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <img src={doc.photoURL} alt={doc.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">{doc.name}</span>
                    <span className="text-[11px] text-cyan-600 dark:text-cyan-400 block">{doc.specialty}</span>
                    <span className="text-[10px] text-slate-400">{doc.experience}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
          >
            <span>Далее (Услуга и Время)</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* STEP 2: Service & Date/Time */}
      {step === 2 && (
        <div className="flex flex-col gap-6">
          {/* Service Select */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Stethoscope size={18} className="text-cyan-500" />
              Выберите услугу
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {servicesList.map(s => (
                <div
                  key={s.id}
                  onClick={() => setSelectedService(s)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    selectedService.id === s.id 
                      ? 'border-cyan-500 bg-cyan-500/10 shadow-md' 
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <span className="font-bold text-xs text-slate-900 dark:text-white block mb-1">{s.title}</span>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">{s.duration}</span>
                    <span className="font-extrabold text-cyan-600 dark:text-cyan-400">{s.price.toLocaleString()} KGS</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Дата приема</label>
              <input 
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Время приема</label>
              <div className="grid grid-cols-4 gap-1.5">
                {availableTimes.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTime(t)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedTime === t 
                        ? 'bg-cyan-500 text-white border-cyan-500 shadow-sm' 
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="py-3.5 px-6 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Назад
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
            >
              <span>Далее (Детали)</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Confirm & Photo upload */}
      {step === 3 && (
        <div className="flex flex-col gap-6">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-3 text-xs">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Детали вашей записи
            </h3>
            <div className="flex justify-between"><span className="text-slate-400">Филиал:</span><span className="font-bold text-slate-900 dark:text-white">{selectedBranch.name}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Врач:</span><span className="font-bold text-cyan-600 dark:text-cyan-400">{selectedDoctor.name}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Услуга:</span><span className="font-bold text-slate-900 dark:text-white">{selectedService.title}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Дата и время:</span><span className="font-extrabold text-cyan-500">{selectedDate} в {selectedTime}</span></div>
            <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-2"><span className="text-slate-400">Ориентировочная стоимость:</span><span className="font-extrabold text-slate-900 dark:text-white">{selectedService.price.toLocaleString()} KGS</span></div>
          </div>

          {/* Photo attachment & symptoms note */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Прикрепить фото зуба / рентген (необязательно)</label>
            <div 
              onClick={() => setPhotoUploaded(!photoUploaded)}
              className={`p-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all ${
                photoUploaded ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-400'
              }`}
            >
              <Upload size={24} />
              <span className="text-xs font-bold">{photoUploaded ? 'Фотография прикреплена ✅' : 'Нажмите, чтобы загрузить фото зуба'}</span>
            </div>

            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Комментарий к записи</label>
            <textarea 
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Опишите ваши симптомы или примечания для врача..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="py-3.5 px-6 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Назад
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-cyan-500/25 hover:scale-[1.01] transition-all"
            >
              Подтвердить и Записаться
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
