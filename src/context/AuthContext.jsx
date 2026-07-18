// AuthContext.jsx - Authentication State Provider
import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '../services/dbService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync current user details from db updates (e.g. bio updates, new followers)
  useEffect(() => {
    // Check if we have a logged in session in localStorage
    const savedUid = localStorage.getItem('bloggerosh_logged_uid');
    
    if (savedUid) {
      // Set up real-time listener to user collection changes
      const unsubscribe = dbService.subscribeToUsers((users) => {
        const userDoc = users.find(u => u.uid === savedUid);
        if (userDoc) {
          if (userDoc.isBanned) {
            // User was banned by admin, force logout
            handleLogout();
            alert("Ваш аккаунт был заблокирован администратором.");
          } else {
            setCurrentUser(userDoc);
          }
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      setCurrentUser(null);
      setLoading(false);
    }
  }, []);

  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      const users = JSON.parse(localStorage.getItem('bloggerosh_users') || '[]');
      const user = users.find(u => (u.email === email || u.username === email));
      
      if (!user) {
        throw new Error("Неверный email или имя пользователя");
      }
      if (user.isBanned) {
        throw new Error("Этот аккаунт заблокирован администратором");
      }

      // In real Firebase, we would call auth.signInWithEmailAndPassword
      // Here in mock mode, we assume password verification is successful
      localStorage.setItem('bloggerosh_logged_uid', user.uid);
      setCurrentUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email, password, username, displayName) => {
    setLoading(true);
    try {
      const users = JSON.parse(localStorage.getItem('bloggerosh_users') || '[]');
      
      // Validation
      if (users.some(u => u.email === email)) {
        throw new Error("Этот email уже зарегистрирован");
      }
      if (users.some(u => u.username === username.toLowerCase())) {
        throw new Error("Это имя пользователя уже занято");
      }

      const newUid = `user_${Date.now()}`;
      const newUser = {
        uid: newUid,
        username: username.toLowerCase().trim(),
        displayName: displayName.trim(),
        email: email.trim(),
        phone: '',
        bio: 'Всем привет! Я в Blogger Osh. 👋',
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}&backgroundColor=b6e3f4`,
        coverURL: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&auto=format&fit=crop&q=80',
        followers: [],
        following: [],
        blockedUsers: [],
        isPrivate: false,
        isAdmin: false,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('bloggerosh_users', JSON.stringify(users));
      
      // Notify user table updated
      window.dispatchEvent(new CustomEvent('db_update_bloggerosh_users'));

      localStorage.setItem('bloggerosh_logged_uid', newUid);
      setCurrentUser(newUser);
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Simulate Google Sign-In popup selection
      const users = JSON.parse(localStorage.getItem('bloggerosh_users') || '[]');
      
      // Let's create or load a default Google user
      const gEmail = "google.user@gmail.com";
      let user = users.find(u => u.email === gEmail);

      if (!user) {
        const newUid = `user_google_${Date.now()}`;
        user = {
          uid: newUid,
          username: "google_user",
          displayName: "Google User",
          email: gEmail,
          phone: '',
          bio: "Вошел через аккаунт Google 🚀",
          photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=google_user&backgroundColor=ffdfbf",
          coverURL: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
          followers: [],
          following: [],
          blockedUsers: [],
          isPrivate: false,
          isAdmin: false,
          createdAt: new Date().toISOString()
        };
        users.push(user);
        localStorage.setItem('bloggerosh_users', JSON.stringify(users));
        window.dispatchEvent(new CustomEvent('db_update_bloggerosh_users'));
      }
      
      if (user.isBanned) {
        throw new Error("Этот аккаунт заблокирован администратором");
      }

      localStorage.setItem('bloggerosh_logged_uid', user.uid);
      setCurrentUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLoginStart = async (phoneNumber) => {
    // Send simulated SMS code
    console.log(`[SMS OTP] Отправка проверочного кода на номер ${phoneNumber}: 123456`);
    return { verificationId: `verification_${Date.now()}` };
  };

  const handlePhoneLoginVerify = async (phoneNumber, verificationCode) => {
    setLoading(true);
    try {
      if (verificationCode !== "123456" && verificationCode !== "000000") {
        throw new Error("Неверный код подтверждения (введите 123456 или 000000)");
      }

      const users = JSON.parse(localStorage.getItem('bloggerosh_users') || '[]');
      let user = users.find(u => u.phone === phoneNumber);

      if (!user) {
        // Create user with phone
        const newUid = `user_phone_${Date.now()}`;
        const cleanPhone = phoneNumber.replace(/[^0-9+]/g, '');
        const randomUsername = `user_${cleanPhone.slice(-4)}`;
        user = {
          uid: newUid,
          username: randomUsername,
          displayName: `Пользователь ${cleanPhone.slice(-4)}`,
          email: `${randomUsername}@bloggerosh.kg`,
          phone: cleanPhone,
          bio: `Вошел по номеру телефона ${phoneNumber} 📱`,
          photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomUsername}&backgroundColor=ffd5dc`,
          coverURL: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&auto=format&fit=crop&q=80",
          followers: [],
          following: [],
          blockedUsers: [],
          isPrivate: false,
          isAdmin: false,
          createdAt: new Date().toISOString()
        };
        users.push(user);
        localStorage.setItem('bloggerosh_users', JSON.stringify(users));
        window.dispatchEvent(new CustomEvent('db_update_bloggerosh_users'));
      }

      if (user.isBanned) {
        throw new Error("Этот аккаунт заблокирован администратором");
      }

      localStorage.setItem('bloggerosh_logged_uid', user.uid);
      setCurrentUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bloggerosh_logged_uid');
    setCurrentUser(null);
  };

  const updateProfileDetails = async (data) => {
    if (!currentUser) return;
    const updatedUser = await dbService.updateProfile(currentUser.uid, data);
    setCurrentUser(updatedUser);
  };

  const value = {
    currentUser,
    loading,
    login: handleLogin,
    register: handleRegister,
    loginWithGoogle: handleGoogleLogin,
    loginWithPhoneStart: handlePhoneLoginStart,
    loginWithPhoneVerify: handlePhoneLoginVerify,
    logout: handleLogout,
    updateProfileDetails
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
