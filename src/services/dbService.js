// dbService.js - Database and Real-time Service
import { SEED_USERS, SEED_POSTS, SEED_REELS, SEED_STORIES, SEED_COMMENTS, SEED_CONVERSATIONS, SEED_MESSAGES, SEED_REPORTS, SEED_NOTIFICATIONS } from './mockData';

// Check if Firebase environment variables are configured
const isFirebaseConfigured = 
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID;

// Define Mock Local Database Keys
const KEYS = {
  USERS: 'bloggerosh_users',
  POSTS: 'bloggerosh_posts',
  REELS: 'bloggerosh_reels',
  STORIES: 'bloggerosh_stories',
  COMMENTS: 'bloggerosh_comments',
  CONVERSATIONS: 'bloggerosh_conversations',
  MESSAGES: 'bloggerosh_messages',
  REPORTS: 'bloggerosh_reports',
  NOTIFICATIONS: 'bloggerosh_notifications'
};

const checkAndSeed = (key, seedData) => {
  const item = localStorage.getItem(key);
  if (!item || item === '[]' || item === 'null' || item === 'undefined') {
    localStorage.setItem(key, JSON.stringify(seedData));
    return;
  }
  // Self-heal from old mixkit.co/googleapis.com/w3schools/w3.org/pexels URLs or old counts in reels
  if (key === KEYS.REELS) {
    try {
      const parsed = JSON.parse(item);
      if (item.includes('mixkit.co') || item.includes('googleapis.com') || item.includes('w3schools.com') || item.includes('w3.org') || item.includes('pexels.com') || !Array.isArray(parsed) || parsed.length < 100) {
        localStorage.setItem(key, JSON.stringify(seedData));
        return;
      }
    } catch (e) {
      localStorage.setItem(key, JSON.stringify(seedData));
      return;
    }
  }
  try {
    JSON.parse(item);
  } catch (e) {
    localStorage.setItem(key, JSON.stringify(seedData));
  }
};

// Initialize localStorage with seed data if empty or corrupt
const initMockDB = () => {
  const currentVersion = localStorage.getItem('bloggerosh_db_version');
  const REQUIRED_VERSION = 'v29';

  if (currentVersion !== REQUIRED_VERSION) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(SEED_USERS));
    localStorage.setItem(KEYS.POSTS, JSON.stringify(SEED_POSTS));
    localStorage.setItem(KEYS.REELS, JSON.stringify(SEED_REELS));
    localStorage.setItem(KEYS.STORIES, JSON.stringify(SEED_STORIES));
    localStorage.setItem(KEYS.COMMENTS, JSON.stringify(SEED_COMMENTS));
    localStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(SEED_CONVERSATIONS));
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(SEED_MESSAGES));
    localStorage.setItem(KEYS.REPORTS, JSON.stringify(SEED_REPORTS));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
    localStorage.setItem('bloggerosh_db_version', REQUIRED_VERSION);

    Object.values(KEYS).forEach(k => triggerMockUpdate(k));
    return;
  }

  if (!localStorage.getItem(KEYS.USERS)) localStorage.setItem(KEYS.USERS, JSON.stringify(SEED_USERS));
  if (!localStorage.getItem(KEYS.POSTS)) localStorage.setItem(KEYS.POSTS, JSON.stringify(SEED_POSTS));
  if (!localStorage.getItem(KEYS.REELS)) localStorage.setItem(KEYS.REELS, JSON.stringify(SEED_REELS));
  if (!localStorage.getItem(KEYS.STORIES)) localStorage.setItem(KEYS.STORIES, JSON.stringify(SEED_STORIES));
  if (!localStorage.getItem(KEYS.COMMENTS)) localStorage.setItem(KEYS.COMMENTS, JSON.stringify(SEED_COMMENTS));
  if (!localStorage.getItem(KEYS.CONVERSATIONS)) localStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(SEED_CONVERSATIONS));
  if (!localStorage.getItem(KEYS.MESSAGES)) localStorage.setItem(KEYS.MESSAGES, JSON.stringify(SEED_MESSAGES));
  if (!localStorage.getItem(KEYS.REPORTS)) localStorage.setItem(KEYS.REPORTS, JSON.stringify(SEED_REPORTS));
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
};

if (!isFirebaseConfigured) {
  initMockDB();
}

// Reactive Subscription System for Mock Database
const subscribers = {};
const triggerMockUpdate = (key) => {
  const eventName = `db_update_${key}`;
  window.dispatchEvent(new CustomEvent(eventName));
  // Cross-tab communication
  try {
    const channel = new BroadcastChannel('bloggerosh_sync');
    channel.postMessage({ key });
    channel.close();
  } catch (e) {
    // BroadcastChannel unsupported or sandbox restriction
  }
};

// Set up cross-tab synchronization listener
if (typeof window !== 'undefined') {
  try {
    const channel = new BroadcastChannel('bloggerosh_sync');
    channel.onmessage = (event) => {
      const eventName = `db_update_${event.data.key}`;
      window.dispatchEvent(new CustomEvent(eventName));
    };
  } catch (e) {}
}

const mockSubscribe = (key, callback) => {
  const eventName = `db_update_${key}`;
  const handler = () => {
    const rawData = localStorage.getItem(key);
    callback(rawData ? JSON.parse(rawData) : []);
  };
  
  window.addEventListener(eventName, handler);
  // Initial call
  handler();
  
  // Return unsubscribe function
  return () => {
    window.removeEventListener(eventName, handler);
  };
};

// --- DATA ACCESS METHODS ---

export const dbService = {
  isFirebase: isFirebaseConfigured,

  // --- SUBSCRIPTIONS (REAL-TIME UPDATES) ---
  subscribeToPosts: (callback) => {
    if (isFirebaseConfigured) {
      // Firebase Firestore implementation would go here
      // For this project, we provide a fully functional mock stream
      return mockSubscribe(KEYS.POSTS, callback);
    } else {
      return mockSubscribe(KEYS.POSTS, callback);
    }
  },

  subscribeToReels: (callback) => {
    return mockSubscribe(KEYS.REELS, callback);
  },

  subscribeToStories: (callback) => {
    return mockSubscribe(KEYS.STORIES, (stories) => {
      // Filter out stories older than 24h
      const activeStories = stories.filter(s => {
        const ageInMs = Date.now() - new Date(s.createdAt).getTime();
        return ageInMs < 24 * 60 * 60 * 1000;
      });
      callback(activeStories);
    });
  },

  subscribeToComments: (postId, callback) => {
    return mockSubscribe(KEYS.COMMENTS, (comments) => {
      const filtered = comments.filter(c => c.postId === postId)
                              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      callback(filtered);
    });
  },

  subscribeToLiveComments: (liveId, callback) => {
    const mockLiveComments = [
      { id: 'lc_1', username: 'traveler_osh', text: 'Ого, крутой эфир! 😍' },
      { id: 'lc_2', username: 'photo_kg', text: 'Привет из Оша! Сними горы!' },
      { id: 'lc_3', username: 'reels_star', text: 'Качество супер 🚀🔴' },
      { id: 'lc_4', username: 'vlad_a4', text: 'Ребята, всем привет! Челлендж бомба! 🔥' },
      { id: 'lc_5', username: 'masha_medved', text: 'Маша смотрит эфир! 👧🐻' }
    ];
    
    setTimeout(() => {
      callback(mockLiveComments);
    }, 100);

    const chatSimulations = [
      "Классный контент! 👍",
      "Привет от подписчиков! ❤️",
      "Вау, это очень круто!",
      "Снимите Сулайман-Тоо!",
      "Обожаю ваши трансляции! ✨",
      "Кто тоже смотрит из Киргизии? 🇰🇬",
      "Влад А4, привет!",
      "Маша, а где Медведь? 🐻",
      "Ура, прямой эфир! 🎉",
      "Сделайте сходку блогеров!"
    ];

    const usersList = ['traveler_osh', 'photo_kg', 'reels_star', 'vlad_a4', 'masha_medved', 'user_123', 'sweet_girl', 'osh_blogger'];

    const intervalId = setInterval(() => {
      const randomUser = usersList[Math.floor(Math.random() * usersList.length)];
      const randomText = chatSimulations[Math.floor(Math.random() * chatSimulations.length)];
      const newComment = {
        id: `lc_${Date.now()}`,
        username: randomUser,
        text: randomText,
        createdAt: new Date().toISOString()
      };
      
      mockLiveComments.push(newComment);
      if (mockLiveComments.length > 15) {
        mockLiveComments.shift();
      }
      callback([...mockLiveComments]);
    }, 4000);

    return () => {
      clearInterval(intervalId);
    };
  },

  subscribeToConversations: (userId, callback) => {
    return mockSubscribe(KEYS.CONVERSATIONS, (conversations) => {
      const filtered = conversations.filter(c => c.participants.includes(userId))
                                    .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
      callback(filtered);
    });
  },

  subscribeToMessages: (conversationId, callback) => {
    return mockSubscribe(KEYS.MESSAGES, (messages) => {
      const filtered = messages.filter(m => m.conversationId === conversationId)
                              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      callback(filtered);
    });
  },

  subscribeToNotifications: (userId, callback) => {
    return mockSubscribe(KEYS.NOTIFICATIONS, (notifications) => {
      const filtered = notifications.filter(n => n.userId === userId)
                                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      callback(filtered);
    });
  },

  subscribeToReports: (callback) => {
    return mockSubscribe(KEYS.REPORTS, callback);
  },

  subscribeToUsers: (callback) => {
    return mockSubscribe(KEYS.USERS, callback);
  },

  // --- ACTIONS (MUTATIONS) ---

  // User Actions
  getUser: async (uid) => {
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    return users.find(u => u.uid === uid || u.username === uid) || null;
  },

  updateProfile: async (uid, data) => {
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    const index = users.findIndex(u => u.uid === uid);
    if (index !== -1) {
      users[index] = { ...users[index], ...data };
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      triggerMockUpdate(KEYS.USERS);
      return users[index];
    }
    throw new Error("User not found");
  },

  followUser: async (followerId, targetId) => {
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    const follower = users.find(u => u.uid === followerId);
    const target = users.find(u => u.uid === targetId);

    if (follower && target) {
      if (!follower.following.includes(targetId)) {
        follower.following.push(targetId);
        target.followers.push(followerId);
        
        // Create Notification
        await dbService.createNotification({
          userId: targetId,
          senderId: followerId,
          type: 'follow',
          read: false
        });
      }
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      triggerMockUpdate(KEYS.USERS);
    }
  },

  unfollowUser: async (followerId, targetId) => {
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    const follower = users.find(u => u.uid === followerId);
    const target = users.find(u => u.uid === targetId);

    if (follower && target) {
      follower.following = follower.following.filter(id => id !== targetId);
      target.followers = target.followers.filter(id => id !== followerId);
      
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      triggerMockUpdate(KEYS.USERS);
    }
  },

  blockUser: async (userId, targetId) => {
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    const user = users.find(u => u.uid === userId);
    if (user) {
      if (!user.blockedUsers) user.blockedUsers = [];
      if (!user.blockedUsers.includes(targetId)) {
        user.blockedUsers.push(targetId);
        // Automatically unfollow
        user.following = user.following.filter(id => id !== targetId);
        user.followers = user.followers.filter(id => id !== targetId);
        
        const target = users.find(u => u.uid === targetId);
        if (target) {
          target.followers = target.followers.filter(id => id !== userId);
          target.following = target.following.filter(id => id !== userId);
        }
      }
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      triggerMockUpdate(KEYS.USERS);
    }
  },

  unblockUser: async (userId, targetId) => {
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    const user = users.find(u => u.uid === userId);
    if (user && user.blockedUsers) {
      user.blockedUsers = user.blockedUsers.filter(id => id !== targetId);
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      triggerMockUpdate(KEYS.USERS);
    }
  },

  // Post Actions
  createPost: async (postData) => {
    const posts = JSON.parse(localStorage.getItem(KEYS.POSTS) || '[]');
    const newPost = {
      id: `post_${Date.now()}`,
      likes: [],
      saves: [],
      commentsCount: 0,
      viewsCount: 0,
      repostedFrom: null,
      repostedBy: null,
      createdAt: new Date().toISOString(),
      ...postData
    };
    posts.unshift(newPost);
    localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
    triggerMockUpdate(KEYS.POSTS);
    return newPost;
  },

  deletePost: async (postId) => {
    // Delete Post
    let posts = JSON.parse(localStorage.getItem(KEYS.POSTS) || '[]');
    posts = posts.filter(p => p.id !== postId);
    localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
    triggerMockUpdate(KEYS.POSTS);

    // Delete associated comments
    let comments = JSON.parse(localStorage.getItem(KEYS.COMMENTS) || '[]');
    comments = comments.filter(c => c.postId !== postId);
    localStorage.setItem(KEYS.COMMENTS, JSON.stringify(comments));
    triggerMockUpdate(KEYS.COMMENTS);
  },

  likePost: async (postId, userId) => {
    const posts = JSON.parse(localStorage.getItem(KEYS.POSTS) || '[]');
    const post = posts.find(p => p.id === postId);
    if (post) {
      const isLiked = post.likes.includes(userId);
      if (isLiked) {
        post.likes = post.likes.filter(id => id !== userId);
      } else {
        post.likes.push(userId);
        
        // Notify author (unless self)
        if (post.userId !== userId) {
          await dbService.createNotification({
            userId: post.userId,
            senderId: userId,
            type: 'like',
            postId: postId,
            read: false
          });
        }
      }
      localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
      triggerMockUpdate(KEYS.POSTS);
    }
  },

  savePost: async (postId, userId) => {
    const posts = JSON.parse(localStorage.getItem(KEYS.POSTS) || '[]');
    const post = posts.find(p => p.id === postId);
    if (post) {
      if (!post.saves) post.saves = [];
      const isSaved = post.saves.includes(userId);
      if (isSaved) {
        post.saves = post.saves.filter(id => id !== userId);
      } else {
        post.saves.push(userId);
      }
      localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
      triggerMockUpdate(KEYS.POSTS);
    }
  },

  repostPost: async (postId, userId) => {
    const posts = JSON.parse(localStorage.getItem(KEYS.POSTS) || '[]');
    const originalPost = posts.find(p => p.id === postId);
    if (originalPost) {
      const repost = {
        id: `post_repost_${Date.now()}`,
        userId: originalPost.userId, // keep creator info
        type: originalPost.type,
        mediaURL: originalPost.mediaURL,
        caption: originalPost.caption,
        hashtags: originalPost.hashtags,
        likes: [],
        saves: [],
        commentsCount: 0,
        viewsCount: 0,
        repostedFrom: originalPost.id,
        repostedBy: userId, // User who shared it
        createdAt: new Date().toISOString()
      };
      posts.unshift(repost);
      localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
      triggerMockUpdate(KEYS.POSTS);
      
      // Notify original author (unless self)
      if (originalPost.userId !== userId) {
        await dbService.createNotification({
          userId: originalPost.userId,
          senderId: userId,
          type: 'repost',
          postId: originalPost.id,
          read: false
        });
      }
      return repost;
    }
  },

  // Comment Actions
  addComment: async (postId, userId, text) => {
    const comments = JSON.parse(localStorage.getItem(KEYS.COMMENTS) || '[]');
    const newComment = {
      id: `comment_${Date.now()}`,
      postId,
      userId,
      text,
      createdAt: new Date().toISOString()
    };
    comments.push(newComment);
    localStorage.setItem(KEYS.COMMENTS, JSON.stringify(comments));
    triggerMockUpdate(KEYS.COMMENTS);

    // Update comment count on post
    const posts = JSON.parse(localStorage.getItem(KEYS.POSTS) || '[]');
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.commentsCount = (post.commentsCount || 0) + 1;
      localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
      triggerMockUpdate(KEYS.POSTS);

      // Notify post owner
      if (post.userId !== userId) {
        await dbService.createNotification({
          userId: post.userId,
          senderId: userId,
          type: 'comment',
          postId: postId,
          commentText: text,
          read: false
        });
      }
    }
  },

  // Story Actions
  createStory: async (storyData) => {
    const stories = JSON.parse(localStorage.getItem(KEYS.STORIES) || '[]');
    const newStory = {
      id: `story_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...storyData
    };
    stories.unshift(newStory);
    localStorage.setItem(KEYS.STORIES, JSON.stringify(stories));
    triggerMockUpdate(KEYS.STORIES);
    return newStory;
  },

  // Reels Actions
  resetReels: () => {
    localStorage.setItem(KEYS.REELS, JSON.stringify(SEED_REELS));
    triggerMockUpdate(KEYS.REELS);
  },

  createReel: async (reelData) => {
    const reels = JSON.parse(localStorage.getItem(KEYS.REELS) || '[]');
    const newReel = {
      id: `reel_${Date.now()}`,
      likes: [],
      saves: [],
      viewsCount: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      ...reelData
    };
    reels.unshift(newReel);
    localStorage.setItem(KEYS.REELS, JSON.stringify(reels));
    triggerMockUpdate(KEYS.REELS);
    return newReel;
  },

  deleteReel: async (reelId) => {
    let reels = JSON.parse(localStorage.getItem(KEYS.REELS) || '[]');
    reels = reels.filter(r => r.id !== reelId);
    localStorage.setItem(KEYS.REELS, JSON.stringify(reels));
    triggerMockUpdate(KEYS.REELS);

    let comments = JSON.parse(localStorage.getItem(KEYS.COMMENTS) || '[]');
    comments = comments.filter(c => c.postId !== reelId);
    localStorage.setItem(KEYS.COMMENTS, JSON.stringify(comments));
    triggerMockUpdate(KEYS.COMMENTS);
  },

  incrementReelViews: async (reelId) => {
    const reels = JSON.parse(localStorage.getItem(KEYS.REELS) || '[]');
    const reel = reels.find(r => r.id === reelId);
    if (reel) {
      reel.viewsCount = (reel.viewsCount || 0) + 1;
      localStorage.setItem(KEYS.REELS, JSON.stringify(reels));
      triggerMockUpdate(KEYS.REELS);
    }
  },

  likeReel: async (reelId, userId) => {
    const reels = JSON.parse(localStorage.getItem(KEYS.REELS) || '[]');
    const reel = reels.find(r => r.id === reelId);
    if (reel) {
      const isLiked = reel.likes.includes(userId);
      if (isLiked) {
        reel.likes = reel.likes.filter(id => id !== userId);
      } else {
        reel.likes.push(userId);
        
        if (reel.userId !== userId) {
          await dbService.createNotification({
            userId: reel.userId,
            senderId: userId,
            type: 'like',
            postId: reelId, // Treat reel like post in notifications
            read: false
          });
        }
      }
      localStorage.setItem(KEYS.REELS, JSON.stringify(reels));
      triggerMockUpdate(KEYS.REELS);
    }
  },

  // Messaging Actions
  startConversation: async (user1Id, user2Id) => {
    const conversations = JSON.parse(localStorage.getItem(KEYS.CONVERSATIONS) || '[]');
    
    // Check if conversation already exists
    let conv = conversations.find(c => 
      c.participants.includes(user1Id) && c.participants.includes(user2Id)
    );

    if (!conv) {
      conv = {
        id: `conv_${Date.now()}`,
        participants: [user1Id, user2Id],
        lastMessage: "Conversation started",
        lastMessageAt: new Date().toISOString(),
        unreadCount: {
          [user1Id]: 0,
          [user2Id]: 0
        }
      };
      conversations.unshift(conv);
      localStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(conversations));
      triggerMockUpdate(KEYS.CONVERSATIONS);
    }
    return conv;
  },

  sendMessage: async (conversationId, senderId, text, sharedPostId = null, videoUrl = null, sharedReelId = null) => {
    const messages = JSON.parse(localStorage.getItem(KEYS.MESSAGES) || '[]');
    const newMessage = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId,
      text,
      sharedPostId,
      videoUrl,
      sharedReelId,
      createdAt: new Date().toISOString()
    };
    messages.push(newMessage);
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(messages));
    triggerMockUpdate(KEYS.MESSAGES);

    // Update conversation details
    const conversations = JSON.parse(localStorage.getItem(KEYS.CONVERSATIONS) || '[]');
    const convIndex = conversations.findIndex(c => c.id === conversationId);
    let recipientId = null;
    
    if (convIndex !== -1) {
      const conv = conversations[convIndex];
      conv.lastMessage = sharedPostId ? "Поделился публикацией" : text;
      conv.lastMessageAt = newMessage.createdAt;
      
      // Update unread count for other participants
      recipientId = conv.participants.find(p => p !== senderId);
      if (recipientId) {
        if (!conv.unreadCount) conv.unreadCount = {};
        conv.unreadCount[recipientId] = (conv.unreadCount[recipientId] || 0) + 1;
      }

      // Move to top of the list
      conversations.splice(convIndex, 1);
      conversations.unshift(conv);
      
      localStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(conversations));
      triggerMockUpdate(KEYS.CONVERSATIONS);
    }

  },



  clearUnreadCount: async (conversationId, userId) => {
    const conversations = JSON.parse(localStorage.getItem(KEYS.CONVERSATIONS) || '[]');
    const conv = conversations.find(c => c.id === conversationId);
    if (conv && conv.unreadCount && conv.unreadCount[userId] > 0) {
      conv.unreadCount[userId] = 0;
      localStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(conversations));
      triggerMockUpdate(KEYS.CONVERSATIONS);
    }
  },

  // Notification Actions
  createNotification: async (notifData) => {
    const notifications = JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || '[]');
    const newNotif = {
      id: `notif_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...notifData
    };
    notifications.unshift(newNotif);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    triggerMockUpdate(KEYS.NOTIFICATIONS);
    return newNotif;
  },

  markNotificationsRead: async (userId) => {
    const notifications = JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || '[]');
    let updated = false;
    notifications.forEach(n => {
      if (n.userId === userId && !n.read) {
        n.read = true;
        updated = true;
      }
    });
    if (updated) {
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
      triggerMockUpdate(KEYS.NOTIFICATIONS);
    }
  },

  // Admin & Safety Actions
  reportPost: async (reporterId, postId, reason) => {
    const reports = JSON.parse(localStorage.getItem(KEYS.REPORTS) || '[]');
    const newReport = {
      id: `rep_${Date.now()}`,
      reporterId,
      postId,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    reports.push(newReport);
    localStorage.setItem(KEYS.REPORTS, JSON.stringify(reports));
    triggerMockUpdate(KEYS.REPORTS);
  },

  resolveReport: async (reportId) => {
    const reports = JSON.parse(localStorage.getItem(KEYS.REPORTS) || '[]');
    const report = reports.find(r => r.id === reportId);
    if (report) {
      report.status = 'resolved';
      localStorage.setItem(KEYS.REPORTS, JSON.stringify(reports));
      triggerMockUpdate(KEYS.REPORTS);
    }
  },

  banUser: async (userId) => {
    // Delete user from db (or set property isBanned)
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    const user = users.find(u => u.uid === userId);
    if (user) {
      user.isBanned = true;
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      triggerMockUpdate(KEYS.USERS);
    }
  },

  unbanUser: async (userId) => {
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    const user = users.find(u => u.uid === userId);
    if (user) {
      user.isBanned = false;
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      triggerMockUpdate(KEYS.USERS);
    }
  },

  deleteUser: async (userId) => {
    let users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    users = users.filter(u => u.uid !== userId);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    triggerMockUpdate(KEYS.USERS);

    // Delete posts by user
    let posts = JSON.parse(localStorage.getItem(KEYS.POSTS) || '[]');
    posts = posts.filter(p => p.userId !== userId);
    localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
    triggerMockUpdate(KEYS.POSTS);
  },

  // Recommendation Engine & Feed filtering
  getFeedData: (currentUserId, allPosts, allUsers) => {
    const currentUser = allUsers.find(u => u.uid === currentUserId);
    if (!currentUser) return [];

    const following = currentUser.following || [];
    const blocked = currentUser.blockedUsers || [];

    // Recommendation logic:
    // Posts by followed users, or general recommended popular posts if feed is small.
    // Ensure posts by blocked users or users who blocked current user are hidden.
    return allPosts.filter(post => {
      // Hide post if author is blocked
      if (blocked.includes(post.userId)) return false;

      // Hide if author blocked current user
      const postAuthor = allUsers.find(u => u.uid === post.userId);
      if (postAuthor && postAuthor.blockedUsers && postAuthor.blockedUsers.includes(currentUserId)) return false;
      
      // Hide if the post author is banned
      if (postAuthor && postAuthor.isBanned) return false;

      // Repost filter
      if (post.repostedBy && blocked.includes(post.repostedBy)) return false;
      
      return true;
    }).sort((a, b) => {
      // Sort strategy: posts of followed users get slight weight boost, but mostly newest first.
      const isAFollowed = following.includes(a.userId) ? 1.5 : 1.0;
      const isBFollowed = following.includes(b.userId) ? 1.5 : 1.0;
      
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();

      // Combined sort score
      return (timeB * isBFollowed) - (timeA * isAFollowed);
    });
  },

  getRecommendations: (currentUserId, allUsers) => {
    const currentUser = allUsers.find(u => u.uid === currentUserId);
    if (!currentUser) return [];

    const following = currentUser.following || [];
    const blocked = currentUser.blockedUsers || [];

    // Recommend users that:
    // 1. Are not current user
    // 2. Are not already followed
    // 3. Are not blocked
    // 4. Have not blocked the current user
    // 5. Are not banned
    // Sorted by number of followers descending (popularity)
    return allUsers.filter(user => {
      if (user.uid === currentUserId) return false;
      if (following.includes(user.uid)) return false;
      if (blocked.includes(user.uid)) return false;
      if (user.blockedUsers && user.blockedUsers.includes(currentUserId)) return false;
      if (user.isBanned) return false;
      return true;
    }).sort((a, b) => (b.followers?.length || 0) - (a.followers?.length || 0))
      .slice(0, 5); // top 5 recommendations
  },

  updateProfileMusic: async (userId, musicData) => {
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    const user = users.find(u => u.uid === userId);
    if (user) {
      user.featuredMusic = musicData;
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      triggerMockUpdate(KEYS.USERS);
    }
  }
};
