// StoryTray.jsx - Horizontal tray of story bubbles at the top of the feed
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { Plus } from 'lucide-react';
import StoryViewerModal from './StoryViewerModal';

export default function StoryTray() {
  const { currentUser } = useAuth();
  const [stories, setStories] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeStoryUsers, setActiveStoryUsers] = useState([]);
  
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerInitialIndex, setViewerInitialIndex] = useState(0);
  
  const fileInputRef = useRef(null);

  // Subscribe to stories and users
  useEffect(() => {
    const unsubStories = dbService.subscribeToStories(setStories);
    const unsubUsers = dbService.subscribeToUsers(setUsers);
    return () => {
      unsubStories();
      unsubUsers();
    };
  }, []);

  // Compute users who have active stories
  useEffect(() => {
    if (stories.length === 0 || users.length === 0) {
      setActiveStoryUsers([]);
      return;
    }

    // Get unique user IDs of active stories
    const uidsWithStories = [...new Set(stories.map(s => s.userId))];
    
    // Find matching user records
    const storyUsers = uidsWithStories
      .map(uid => users.find(u => u.uid === uid))
      .filter(Boolean);
      
    setActiveStoryUsers(storyUsers);
  }, [stories, users]);

  const handleStoryUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          await dbService.createStory({
            userId: currentUser.uid,
            mediaURL: event.target.result,
            type: type
          });
        } catch (err) {
          console.error("Story creation error:", err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const openViewer = (userUid) => {
    const index = activeStoryUsers.findIndex(u => u.uid === userUid);
    if (index !== -1) {
      setViewerInitialIndex(index);
      setIsViewerOpen(true);
    }
  };

  // Check if current user has an active story
  const currentUserHasStory = stories.some(s => s.userId === currentUser.uid);

  return (
    <div className="w-full bg-theme-lightCard dark:bg-theme-darkCard border border-theme-lightBorder dark:border-theme-darkBorder rounded-2xl p-4 flex gap-4 overflow-x-auto no-scrollbar transition-colors duration-200 shadow-sm mb-6">
      
      {/* Hidden File Input for Story Upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleStoryUpload} 
        accept="image/*,video/*" 
        className="hidden" 
      />

      {/* Current User story bubble */}
      <div className="flex flex-col items-center flex-shrink-0 cursor-pointer">
        <div className="relative">
          {currentUserHasStory ? (
            <div 
              onClick={() => openViewer(currentUser.uid)}
              className="w-16 h-16 rounded-full story-ring p-[2px] flex items-center justify-center transition-transform hover:scale-105"
            >
              <img 
                src={currentUser.photoURL} 
                alt="My Story" 
                className="w-full h-full rounded-full object-cover border-2 border-theme-lightCard dark:border-theme-darkCard"
              />
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 rounded-full p-[2px] border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center transition-transform hover:scale-105"
            >
              <img 
                src={currentUser.photoURL} 
                alt="Upload Story" 
                className="w-14 h-14 rounded-full object-cover"
              />
            </div>
          )}
          
          {/* Add plus icon */}
          {!currentUserHasStory && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-brand text-white rounded-full p-1 border-2 border-theme-lightCard dark:border-theme-darkCard shadow-md"
            >
              <Plus size={12} className="stroke-[3]" />
            </div>
          )}
        </div>
        <span className="text-[11px] font-medium mt-1.5 text-theme-lightMuted dark:text-theme-darkMuted max-w-[70px] truncate text-center">
          Ваша история
        </span>
      </div>

      {/* Active Story Bubbles from others */}
      {activeStoryUsers
        .filter(user => user.uid !== currentUser.uid)
        .map(user => (
          <div 
            key={user.uid} 
            onClick={() => openViewer(user.uid)}
            className="flex flex-col items-center flex-shrink-0 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full story-ring p-[2px] flex items-center justify-center transition-transform hover:scale-105">
              <img 
                src={user.photoURL} 
                alt={user.displayName} 
                className="w-full h-full rounded-full object-cover border-2 border-theme-lightCard dark:border-theme-darkCard"
              />
            </div>
            <span className="text-[11px] font-medium mt-1.5 text-theme-lightMuted dark:text-theme-darkMuted max-w-[72px] truncate text-center">
              {user.username}
            </span>
          </div>
      ))}

      {/* Story Viewer Overlay */}
      {isViewerOpen && (
        <StoryViewerModal 
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          stories={stories}
          initialUserIndex={viewerInitialIndex}
          users={activeStoryUsers}
        />
      )}
    </div>
  );
}
