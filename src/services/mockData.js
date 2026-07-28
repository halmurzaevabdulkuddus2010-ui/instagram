// Seed data for INSTAGRAM in Mock Mode

export const SEED_USERS = [
  {
    uid: "osh_admin",
    username: "osh_admin",
    displayName: "Admin INSTAGRAM",
    email: "admin@bloggerosh.kg",
    phone: "+996555112233",
    bio: "Официальный аккаунт администратора INSTAGRAM. Управление контентом и пользователями",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=osh_admin&backgroundColor=b6e3f4",
    coverURL: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    followers: ["traveler_osh", "photo_kg", "reels_star"],
    following: ["traveler_osh"],
    blockedUsers: [],
    isPrivate: false,
    isAdmin: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
  },
  {
    uid: "traveler_osh",
    username: "traveler_osh",
    displayName: "Эркин Путешественник",
    email: "traveler@bloggerosh.kg",
    phone: "+996777445566",
    bio: "Показываю самые красивые уголки города Ош и Кыргызстана. Горы Сулайман-Тоо — моя любовь! 🏔️✈️",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=traveler_osh&backgroundColor=ffdfbf",
    coverURL: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80",
    followers: ["osh_admin", "reels_star"],
    following: ["osh_admin", "photo_kg", "reels_star"],
    blockedUsers: [],
    isPrivate: false,
    isAdmin: false,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    uid: "photo_kg",
    username: "photo_kg",
    displayName: "Айбек Фотограф",
    email: "photo@bloggerosh.kg",
    phone: "+996500889900",
    bio: "Профессиональная съемка в Оше. Портреты, свадьбы, мобилография. Пишите в Direct! 📸✨",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=photo_kg&backgroundColor=d1f4ff",
    coverURL: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&auto=format&fit=crop&q=80",
    followers: ["traveler_osh"],
    following: ["traveler_osh", "reels_star"],
    blockedUsers: [],
    isPrivate: false,
    isAdmin: false,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    uid: "reels_star",
    username: "reels_star",
    displayName: "Адинай Видеомейкер",
    email: "reels@bloggerosh.kg",
    phone: "+996999334455",
    bio: "Создаю вирусные Reels. Тренды, юмор, эстетика Оша. Коллаборации в ЛС! 🎬🔥",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=reels_star&backgroundColor=ffd5dc",
    coverURL: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&auto=format&fit=crop&q=80",
    followers: ["traveler_osh", "photo_kg"],
    following: ["traveler_osh"],
    blockedUsers: [],
    isPrivate: false,
    isAdmin: false,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const SEED_POSTS = [
  {
    id: "post_1",
    userId: "traveler_osh",
    type: "photo",
    mediaURL: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80", // Beautiful Mountain view
    caption: "Сулайман-Тоо на закате. Вид, от которого захватывает дух. Согласны? 😍 #osh #sulaimantoo #kyrgyzstan #travel #sunset",
    hashtags: ["osh", "sulaimantoo", "kyrgyzstan", "travel", "sunset"],
    likes: ["osh_admin", "photo_kg"],
    saves: ["osh_admin"],
    commentsCount: 2,
    viewsCount: 152,
    repostedFrom: null,
    repostedBy: null,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    id: "post_2",
    userId: "photo_kg",
    type: "photo",
    mediaURL: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80", // Camera lens capture
    caption: "Новая фотосессия в этно-стиле. Как вам глубина резкости и цветопередача? Напишите свое мнение в комментариях 👇 #photo #aesthetic #culture #osh",
    hashtags: ["photo", "aesthetic", "culture", "osh"],
    likes: ["traveler_osh", "reels_star"],
    saves: [],
    commentsCount: 1,
    viewsCount: 89,
    repostedFrom: null,
    repostedBy: null,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: "post_3",
    userId: "traveler_osh",
    type: "photo",
    mediaURL: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80", // Traditional food / Plov
    caption: "А вы знали, что ошский плов официально признан кулинарным шедевром? Зашли в чайхану после прогулки. Ммм, пальчики оближешь! 🍛🤤 #plov #oshfood #traditional #yummy",
    hashtags: ["plov", "oshfood", "traditional", "yummy"],
    likes: ["osh_admin", "photo_kg", "reels_star"],
    saves: ["traveler_osh"],
    commentsCount: 2,
    viewsCount: 310,
    repostedFrom: null,
    repostedBy: null,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
  }
];

const generateMockReels = () => {
  const users = ["reels_star", "traveler_osh", "photo_kg", "osh_admin"];
  const localVideos = [
    {
      url: "/videos/video1.mp4",
      caption: "Невероятное подводное путешествие! Красота морских глубин, кристально чистая вода и коралловые рифы. 🌊🐠",
      tags: ["travel", "nature", "ocean", "diving", "adventure"]
    },
    {
      url: "/videos/video2.mp4",
      caption: "Дикая природа нашего края! Бурый медведь ловит рыбу в чистейшей горной реке Алайского хребта. Потрясающие кадры! 🐻🏔️",
      tags: ["nature", "wildlife", "kyrgyzstan", "mountains", "bear"]
    },
    {
      url: "/videos/video3.mp4",
      caption: "Создание 3D-анимации. Наш новый проект забавного короткометражного мультфильма про кролика! 🐰🎨",
      tags: ["animation", "3d", "cartoon", "creative", "art"]
    },
    {
      url: "/videos/video5.mp4",
      caption: "Весна в городе Ош! Невероятное макро-видео цветения весенних бутонов в центральном парке. 🌸🌱",
      tags: ["osh", "spring", "flowers", "nature", "macro"]
    }
  ];

  const reels = [];
  
  const modifiers = [
    "Снято на профессиональную камеру. Эстетика зашкаливает! ✨📸",
    "Невероятная атмосфера. Делитесь этим видео с друзьями! ⚡📱",
    "Выходные прошли с пользой. Как вам такой ракурс? 🏔️💯",
    "Просто вау! Смотреть до конца со звуком 🔊🔥",
    "Локации, от которых захватывает дух. Сохраняйте в закладки! 📍📌",
    "Утренний вайб. Всем продуктивного дня и хорошего настроения! ☀️☕",
    "За кулисами съемок. Самый сложный кадр за сегодня. 🎬🎬",
    "Эмоции через край. Повторили бы такое? 🎢💥",
    "Момент абсолютного спокойствия и слияния с миром. 🧘‍♂️🕊️",
    "Короткий обзор сегодняшнего приключения. Поехали! 🚀🎒"
  ];

  for (let i = 1; i <= 100; i++) {
    const videoTemplate = localVideos[(i - 1) % localVideos.length];
    const modifier = modifiers[i % modifiers.length];
    const user = users[i % users.length];
    
    const likes = [];
    users.forEach(u => {
      if (Math.random() > 0.4) likes.push(u);
    });
    
    const saves = [];
    users.forEach(u => {
      if (Math.random() > 0.7) saves.push(u);
    });

    reels.push({
      id: `reel_${i}`,
      userId: user,
      type: "reel",
      mediaURL: videoTemplate.url,
      caption: `${videoTemplate.caption} ${modifier}`,
      hashtags: videoTemplate.tags,
      likes: likes,
      saves: saves,
      viewsCount: Math.floor(Math.random() * 9000) + 100,
      commentsCount: Math.floor(Math.random() * 5),
      repostedFrom: null,
      repostedBy: null,
      createdAt: new Date(Date.now() - i * 3 * 3600 * 1000).toISOString()
    });
  }
  return reels;
};

export const SEED_REELS = generateMockReels();

export const SEED_STORIES = [
  {
    id: "story_1",
    userId: "traveler_osh",
    mediaURL: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80", // Beautiful beach/sunny theme
    type: "image",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago (Active)
  },
  {
    id: "story_2",
    userId: "photo_kg",
    mediaURL: "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=600&auto=format&fit=crop&q=80", // Creative photo work
    type: "image",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() // 8 hours ago (Active)
  },
  {
    id: "story_3",
    userId: "reels_star",
    mediaURL: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4",
    type: "video",
    createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString() // 23 hours ago (Active - expires soon)
  },
  {
    id: "story_4",
    userId: "traveler_osh",
    mediaURL: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80", // Mountain sunrise
    type: "image",
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() // Expired (Will not show in Feed)
  }
];

export const SEED_COMMENTS = [
  {
    id: "comment_1",
    postId: "post_1",
    userId: "osh_admin",
    text: "Невероятный кадр! Наша Сулайман-Тоо прекрасна в любое время года 👏",
    createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "comment_2",
    postId: "post_1",
    userId: "photo_kg",
    text: "Отличный свет поймал, Эркин! На какой объектив снимал?",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "comment_3",
    postId: "post_2",
    userId: "traveler_osh",
    text: "Портрет шикарен! Особенно детализация костюма.",
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "comment_4",
    postId: "post_3",
    userId: "osh_admin",
    text: "Ошский плов - это бренд! 🔥 Аж слюнки потекли.",
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "comment_5",
    postId: "post_3",
    userId: "reels_star",
    text: "В какой чайхане сидели? Поделитесь локацией!",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  }
];

export const SEED_CONVERSATIONS = [
  {
    id: "conv_1",
    participants: ["traveler_osh", "reels_star"],
    lastMessage: "Ок, договорились, снимем коллаб завтра на Сулайман-Тоо!",
    lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unreadCount: {
      traveler_osh: 0,
      reels_star: 0
    }
  },
  {
    id: "conv_2",
    participants: ["osh_admin", "traveler_osh"],
    lastMessage: "Привет! Твой пост о плове попал в рекомендации. Отличная работа!",
    lastMessageAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    unreadCount: {
      osh_admin: 0,
      traveler_osh: 1
    }
  }
];

export const SEED_MESSAGES = [
  {
    id: "msg_1",
    conversationId: "conv_1",
    senderId: "traveler_osh",
    text: "Привет, Адинай! Видела мои новые фото с горы?",
    sharedPostId: null,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "msg_2",
    conversationId: "conv_1",
    senderId: "reels_star",
    text: "Привет! Да, заценила! Очень крутые цвета. Давай сделаем Reels вместе?",
    sharedPostId: null,
    createdAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "msg_3",
    conversationId: "conv_1",
    senderId: "traveler_osh",
    text: "Крутая идея! Какая тема?",
    sharedPostId: null,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "msg_4",
    conversationId: "conv_1",
    senderId: "reels_star",
    text: "Ок, договорились, снимем коллаб завтра на Сулайман-Тоо!",
    sharedPostId: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "msg_5",
    conversationId: "conv_2",
    senderId: "osh_admin",
    text: "Привет! Твой пост о плове попал в рекомендации. Отличная работа!",
    sharedPostId: "post_3", // Share post_3 in chat
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const SEED_REPORTS = [
  {
    id: "rep_1",
    reporterId: "reels_star",
    postId: "post_2",
    reason: "Недопустимый контент / спам",
    status: "pending",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  }
];

export const SEED_NOTIFICATIONS = [
  {
    id: "notif_1",
    userId: "traveler_osh",
    senderId: "osh_admin",
    type: "like",
    postId: "post_1",
    read: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "notif_2",
    userId: "traveler_osh",
    senderId: "reels_star",
    type: "comment",
    postId: "post_3",
    commentText: "В какой чайхане сидели? Поделитесь локацией!",
    read: false,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "notif_3",
    userId: "traveler_osh",
    senderId: "photo_kg",
    type: "follow",
    read: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];
