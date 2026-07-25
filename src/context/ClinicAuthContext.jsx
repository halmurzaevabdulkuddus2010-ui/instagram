import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PATIENT_DATA, CLINIC_DOCTORS, CLINIC_SERVICES, CLINIC_BRANCHES } from '../services/clinicData';

const ClinicAuthContext = createContext();

export const ClinicAuthProvider = ({ children }) => {
  // Current active role: 'patient' | 'doctor' | 'admin'
  const [role, setRole] = useState('patient');
  const [currentUser, setCurrentUser] = useState(INITIAL_PATIENT_DATA);
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('akaktish_appointments');
    return saved ? JSON.parse(saved) : [
      {
        id: "app_101",
        patientName: "Эркин Мамытов",
        patientPhone: "+996 (772) 12-34-56",
        doctorName: "Д-р Айсулу Сатыбалдиева",
        doctorId: "doc_2",
        serviceTitle: "Осмотр & Коррекция брекетов",
        branchName: "Филиал Центр (Ош)",
        date: "2026-07-25",
        time: "14:30",
        status: "Confirmed",
        createdAt: new Date().toISOString()
      },
      {
        id: "app_102",
        patientName: "Айсулу Кадирова",
        patientPhone: "+996 (550) 99-88-77",
        doctorName: "Д-р Алмаз Каримов",
        doctorId: "doc_1",
        serviceTitle: "Имплантация Straumann",
        branchName: "Филиал Западно-Городской",
        date: "2026-07-22",
        time: "10:00",
        status: "Confirmed",
        createdAt: new Date().toISOString()
      }
    ];
  });

  const [doctorsList, setDoctorsList] = useState(CLINIC_DOCTORS);
  const [servicesList, setServicesList] = useState(CLINIC_SERVICES);

  useEffect(() => {
    localStorage.setItem('akaktish_appointments', JSON.stringify(appointments));
  }, [appointments]);

  const switchRole = (newRole) => {
    setRole(newRole);
  };

  const addAppointment = (newApp) => {
    const created = {
      id: `app_${Date.now()}`,
      status: "Confirmed",
      createdAt: new Date().toISOString(),
      ...newApp
    };
    setAppointments(prev => [created, ...prev]);

    setCurrentUser(prev => ({
      ...prev,
      upcomingAppointments: [
        {
          id: created.id,
          doctorName: created.doctorName,
          serviceTitle: created.serviceTitle,
          date: created.date,
          time: created.time,
          branchName: created.branchName,
          status: "Подтверждено",
          statusColor: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40"
        },
        ...prev.upcomingAppointments
      ],
      bonusPoints: prev.bonusPoints + 250
    }));
    return created;
  };

  const addFamilyMember = (member) => {
    setCurrentUser(prev => ({
      ...prev,
      familyMembers: [...prev.familyMembers, { id: `fam_${Date.now()}`, ...member }]
    }));
  };

  const updateAppointmentStatus = (id, newStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const deleteDoctor = (id) => {
    setDoctorsList(prev => prev.filter(d => d.id !== id));
  };

  const updateServicePrice = (id, newPrice) => {
    setServicesList(prev => prev.map(s => s.id === id ? { ...s, price: newPrice } : s));
  };

  return (
    <ClinicAuthContext.Provider value={{
      role,
      switchRole,
      currentUser,
      appointments,
      addAppointment,
      addFamilyMember,
      doctorsList,
      servicesList,
      updateAppointmentStatus,
      deleteDoctor,
      updateServicePrice,
      branches: CLINIC_BRANCHES
    }}>
      {children}
    </ClinicAuthContext.Provider>
  );
};

export const useClinicAuth = () => useContext(ClinicAuthContext);
