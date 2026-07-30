// StoryViewerModal.jsx - Full-screen stories viewer with progress bars
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StoryViewerModal({ isOpen, onClose, stories, initialUserIndex = 0, users = [] }) {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Get active stories for current user
  const currentUser = users[currentUserIndex];
  const userStories = currentUser ? stories.filter(s => s.userId === currentUser.uid) : [];
  const currentStory = userStories[currentStoryIndex];

  // Reset story index when user changes
  useEffect(() => {
    setCurrentStoryIndex(0);
    setProgress(0);
  }, [currentUserIndex]);

  // Reset progress when story index changes
  useEffect(() => {
    setProgress(0);
  }, [currentStoryIndex]);

  // Story autoplay timer
  useEffect(() => {
    if (!isOpen || !currentStory) return;

    const duration = 5000; // 5 seconds per story
    const intervalTime = 100; // update every 100ms
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isOpen, currentStoryIndex, currentUserIndex, currentStory]);

  if (!isOpen || !currentUser || !currentStory) return null;

  const handlePrev = () => {
    if (currentStoryIndex > 0) {
      // Go to previous story of same user
      setCurrentStoryIndex(prev => prev - 1);
    } else if (currentUserIndex > 0) {
      // Go to last story of previous user
      const prevUserStories = stories.filter(s => s.userId === users[currentUserIndex - 1].uid);
      setCurrentUserIndex(prev => prev - 1);
      setTimeout(() => {
        setCurrentStoryIndex(prevUserStories.length - 1);
      }, 0);
    } else {
      // At the absolute beginning
      onClose();
    }
  };

  const handleNext = () => {
    if (currentStoryIndex < userStories.length - 1) {
      // Go to next story of same user
      setCurrentStoryIndex(prev => prev + 1);
    } else if (currentUserIndex < users.length - 1) {
      // Go to first story of next user
      setCurrentUserIndex(prev => prev + 1);
    } else {
      // At the absolute end
      onClose();
    }
  };

  // Helper for text timestamps
  const getStoryAge = (isoString) => {
    const hours = Math.floor((Date.now() - new Date(isoString).getTime()) / (1000 * 60 * 60));
    if (hours === 0) {
      const mins = Math.floor((Date.now() - new Date(isoString).getTime()) / (1000 * 60));
      return `${mins}м`;
    }
    return `${hours}ч`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
        {/* Progress bars at top */}
        <div className="absolute top-4 left-0 right-0 px-4 flex gap-1 z-20">
          {userStories.map((s, index) => (
            <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{ 
                  width: `${
                    index < currentStoryIndex 
                      ? 100 
                      : index === currentStoryIndex 
                        ? progress 
                        : 0
                  }%` 
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Info Header */}
        <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-20 text-white">
          <div className="flex items-center gap-2">
            <img 
              src={currentUser.photoURL} 
              alt={currentUser.displayName} 
              className="w-9 h-9 rounded-full object-cover ring-2 ring-brand"
            />
            <div>
              <span className="font-semibold text-sm">{currentUser.displayName}</span>
              <span className="text-xs text-white/70 ml-2">{getStoryAge(currentStory.createdAt)}</span>
            </div>
          </div>
          
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-20 hidden md:block"
        >
          <ChevronLeft size={24} />
        </button>

        <button 
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-20 hidden md:block"
        >
          <ChevronRight size={24} />
        </button>

        {/* Mobile Tap Areas */}
        <div className="absolute inset-0 flex z-10 md:hidden">
          <div className="w-1/3 h-full" onClick={handlePrev} />
          <div className="w-1/3 h-full" onClick={onClose} />
          <div className="w-1/3 h-full" onClick={handleNext} />
        </div>

        {/* Content Viewer */}
        <motion.div 
          key={currentStory.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg h-full md:h-[85vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black relative"
        >
          {currentStory.type === 'image' ? (
            <img 
              src={currentStory.mediaURL} 
              alt="Story" 
              className="w-full h-full object-contain pointer-events-none"
            />
          ) : (
            <video 
              src={currentStory.mediaURL} 
              autoPlay 
              playsInline 
              className="w-full h-full object-contain pointer-events-none"
            />
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
