import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ClinicAuthProvider, useClinicAuth } from '../context/ClinicAuthContext';
import { LanguageProvider } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

import SplashScreen from '../components/SplashScreen';
import ClinicNavigation from '../components/ClinicNavigation';
import AIAssistantModal from '../components/AIAssistantModal';
import DoctorModal from '../components/DoctorModal';
import ServiceModal from '../components/ServiceModal';
import AuthModal from '../components/AuthModal';

import HomePage from './HomePage';
import ServicesPage from './ServicesPage';
import DoctorsPage from './DoctorsPage';
import BookingPage from './BookingPage';
import PatientCabinetPage from './PatientCabinetPage';
import ConsultationPage from './ConsultationPage';
import DoctorPortalPage from './DoctorPortalPage';
import AdminPortalPage from './AdminPortalPage';
import ContactsPage from './ContactsPage';

function ClinicMainAppContent() {
  const { role } = useClinicAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  // Modals
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-200">
      
      {/* Return to Instagram Header Banner */}
      <div className="w-full bg-slate-900 text-white text-xs py-2 px-4 flex items-center justify-between font-bold z-50">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Вернуться в Instagram (Blogger Osh)</span>
        </button>
        <span className="text-[10px] text-slate-400">Мини-приложение «АКАК ТИШ»</span>
      </div>

      {/* Top Clinic Navigation */}
      <ClinicNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenAI={() => setIsAIOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {role === 'doctor' ? (
          <DoctorPortalPage />
        ) : role === 'admin' ? (
          <AdminPortalPage />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomePage 
                onNavigate={setActiveTab}
                onOpenDoctor={(doc) => setSelectedDoctor(doc)}
                onOpenService={(serv) => setSelectedService(serv)}
                onOpenAI={() => setIsAIOpen(true)}
              />
            )}

            {activeTab === 'services' && (
              <ServicesPage 
                onOpenService={(serv) => setSelectedService(serv)}
                onBookService={(serv) => { setSelectedService(null); setActiveTab('booking'); }}
              />
            )}

            {activeTab === 'doctors' && (
              <DoctorsPage 
                onOpenDoctor={(doc) => setSelectedDoctor(doc)}
                onBookDoctor={(doc) => { setSelectedDoctor(null); setActiveTab('booking'); }}
              />
            )}

            {activeTab === 'booking' && (
              <BookingPage 
                onBookingComplete={() => setActiveTab('cabinet')}
              />
            )}

            {activeTab === 'cabinet' && (
              <PatientCabinetPage />
            )}

            {activeTab === 'consultation' && (
              <ConsultationPage />
            )}

            {activeTab === 'contacts' && (
              <ContactsPage />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <AIAssistantModal 
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onBookDirect={() => setActiveTab('booking')}
      />

      <DoctorModal 
        doctor={selectedDoctor}
        isOpen={Boolean(selectedDoctor)}
        onClose={() => setSelectedDoctor(null)}
        onBook={(doc) => { setSelectedDoctor(null); setActiveTab('booking'); }}
      />

      <ServiceModal 
        service={selectedService}
        isOpen={Boolean(selectedService)}
        onClose={() => setSelectedService(null)}
        onBook={(serv) => { setSelectedService(null); setActiveTab('booking'); }}
      />

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}

export default function AkakTishMain() {
  return (
    <LanguageProvider>
      <ClinicAuthProvider>
        <ClinicMainAppContent />
      </ClinicAuthProvider>
    </LanguageProvider>
  );
}
