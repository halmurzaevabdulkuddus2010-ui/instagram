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
  },
  {
    uid: "akaktish",
    username: "akaktish",
    displayName: "Стоматология АКАК ТИШ",
    email: "info@akaktish.kg",
    phone: "+996555700011",
    bio: "Премиальная стоматологическая клиника в г. Ош 🦷✨ Имплантация, брекеты, отбеливание и безболезненное лечение зубов! Запишитесь онлайн 👇",
    photoURL: "https://api.dicebear.com/7.x/bottts/svg?seed=akaktish&backgroundColor=c0f2fe",
    coverURL: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&auto=format&fit=crop&q=80",
    followers: ["traveler_osh", "photo_kg", "reels_star", "osh_admin"],
    following: [],
    blockedUsers: [],
    isPrivate: false,
    isAdmin: false,
    isVerified: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    uid: "cartoon_master",
    username: "cartoon_master",
    displayName: "Мульт Мастер 🎬",
    email: "cartoon@bloggerosh.kg",
    phone: "+996500707070",
    bio: "Создаю яркие 3D мультфильмы и концепт-арты! Подпишись, чтобы не пропустить новые серии! 🐱🚀",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=cartoon_master&backgroundColor=d1f4ff",
    coverURL: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    followers: ["traveler_osh", "reels_star"],
    following: [],
    blockedUsers: [],
    isPrivate: false,
    isAdmin: false,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    uid: "vlad_a4",
    username: "a4omg",
    displayName: "Влад А4",
    email: "vlad@a4.ru",
    phone: "+996555443322",
    bio: "Официальный аккаунт А4! ⚡ Новые челленджи, крутые видосы и мерч! Подписывайся! 🕶️🔥",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=vladA4&backgroundColor=ffd5dc",
    coverURL: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80",
    followers: ["traveler_osh", "photo_kg", "reels_star", "osh_admin"],
    following: [],
    blockedUsers: [],
    isPrivate: false,
    isAdmin: false,
    isVerified: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    uid: "masha_medved",
    username: "masha_and_bear",
    displayName: "Маша и Медведь 👧🐻",
    email: "masha@mashabear.ru",
    phone: "+996555778899",
    bio: "Официальный канал мультсериала «Маша и Медведь»! 👧🎈🐻 Все самые любимые серии, песни и приключения!",
    photoURL: "https://api.dicebear.com/7.x/bottts/svg?seed=masha_medved&backgroundColor=ffd5dc",
    coverURL: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80",
    followers: ["traveler_osh", "photo_kg", "reels_star", "osh_admin", "cartoon_master"],
    following: [],
    blockedUsers: [],
    isPrivate: false,
    isAdmin: false,
    isVerified: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const SEED_POSTS = [
  {
    id: "post_a4_1",
    userId: "vlad_a4",
    type: "video",
    mediaURL: "/videos/video1.mp4",
    caption: "1,000 ЗАДАНИЙ за 24 ЧАСА ЧЕЛЛЕНДЖ ! 😱 Наш самый новый и безумный выпуск! Смотри прямо сейчас 👇 #a4 #challenge #omg #fun #vlad",
    hashtags: ["a4", "challenge", "omg", "fun", "vlad"],
    likes: ["traveler_osh", "reels_star", "photo_kg", "osh_admin"],
    saves: ["vlad_a4"],
    commentsCount: 3,
    viewsCount: 1540,
    repostedFrom: null,
    repostedBy: null,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "post_a4_2",
    userId: "vlad_a4",
    type: "photo",
    mediaURL: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
    caption: "Новый фирменный мерч А4 уже доступен! 🎒⚡ Какая футболка круче: оранжевая или зеленая? #a4merch #style #a4",
    hashtags: ["a4merch", "style", "a4"],
    likes: ["traveler_osh", "reels_star"],
    saves: [],
    commentsCount: 2,
    viewsCount: 920,
    repostedFrom: null,
    repostedBy: null,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "post_cartoon_1",
    userId: "cartoon_master",
    type: "photo",
    mediaURL: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
    caption: "Премьера новой серии мультфильма 'Приключения в городе Ош'! 🎬🍿 Напишите в комментариях, какой ваш любимый персонаж! #cartoon #animation #anime #osh #art #fun",
    hashtags: ["cartoon", "animation", "anime", "osh", "art", "fun"],
    likes: ["traveler_osh", "reels_star", "photo_kg", "osh_admin"],
    saves: ["cartoon_master"],
    commentsCount: 4,
    viewsCount: 1540,
    repostedFrom: null,
    repostedBy: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "post_cartoon_2",
    userId: "cartoon_master",
    type: "photo",
    mediaURL: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
    caption: "Концепт-арт к аниме-сериалу в стиле студии Ghibli. Закат на фоне гор. 🎨✨ #anime #ghibli #cartoon #art #sketch",
    hashtags: ["anime", "ghibli", "cartoon", "art", "sketch"],
    likes: ["traveler_osh", "reels_star"],
    saves: ["traveler_osh"],
    commentsCount: 2,
    viewsCount: 920,
    repostedFrom: null,
    repostedBy: null,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "post_1",
    userId: "traveler_osh",
    type: "photo",
    mediaURL: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80",
    caption: "Сулайман-Тоо на закате. Вид, от которого захватывает дух. Согласны? 😍 #osh #sulaimantoo #kyrgyzstan #travel #sunset",
    hashtags: ["osh", "sulaimantoo", "kyrgyzstan", "travel", "sunset"],
    likes: ["osh_admin", "photo_kg", "reels_star"],
    saves: ["osh_admin"],
    commentsCount: 2,
    viewsCount: 450,
    repostedFrom: null,
    repostedBy: null,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "post_2",
    userId: "photo_kg",
    type: "photo",
    mediaURL: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
    caption: "Новая атмосфера съемок на объектив 85mm f/1.4. Детализация портрета на высоте! 📸✨ #photo #portrait #aesthetic #osh",
    hashtags: ["photo", "portrait", "aesthetic", "osh"],
    likes: ["traveler_osh", "reels_star"],
    saves: [],
    commentsCount: 1,
    viewsCount: 289,
    repostedFrom: null,
    repostedBy: null,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "post_3",
    userId: "traveler_osh",
    type: "photo",
    mediaURL: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
    caption: "А вы знали, что настоящий ошский плов готовится на узгенском рисе «девзира»? Аромат на всю чайхану! 🍛🤤 #plov #oshfood #traditional #yummy",
    hashtags: ["plov", "oshfood", "traditional", "yummy"],
    likes: ["osh_admin", "photo_kg", "reels_star"],
    saves: ["traveler_osh"],
    commentsCount: 2,
    viewsCount: 610,
    repostedFrom: null,
    repostedBy: null,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "post_4",
    userId: "reels_star",
    type: "photo",
    mediaURL: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
    caption: "Утренняя музыкальная пауза. Записываем новый трек для следующего вирусного видео Reels! 🎶🔥 #music #studio #beats #reels #osh",
    hashtags: ["music", "studio", "beats", "reels", "osh"],
    likes: ["traveler_osh", "photo_kg"],
    saves: ["reels_star"],
    commentsCount: 3,
    viewsCount: 380,
    repostedFrom: null,
    repostedBy: null,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "post_5",
    userId: "osh_admin",
    type: "photo",
    mediaURL: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80",
    caption: "Вечерний уют в лучших заведениях южной столицы. Город Ош развивается с каждым днём! ☕✨ #bloggerosh #citylife #osh2026",
    hashtags: ["bloggerosh", "citylife", "osh2026"],
    likes: ["traveler_osh", "reels_star", "photo_kg"],
    saves: ["osh_admin"],
    commentsCount: 1,
    viewsCount: 820,
    repostedFrom: null,
    repostedBy: null,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  }
];

const generateMockReels = () => {
  const users = ["reels_star", "traveler_osh", "photo_kg", "osh_admin"];
  const localVideos = [
    { url: "/videos/video1.mp4", caption: "Невероятное подводное путешествие! Красота морских глубин, кристально чистая вода и коралловые рифы. 🌊🐠", tags: ["travel", "nature", "ocean", "diving", "adventure"] },
    { url: "/videos/video2.mp4", caption: "Дикая природа нашего края! Бурый медведь ловит рыбу в чистейшей горной реке Алайского хребта. Потрясающие кадры! 🐻🏔️", tags: ["nature", "wildlife", "kyrgyzstan", "mountains", "bear"] },
    { url: "/videos/video3.mp4", caption: "Создание 3D-анимации. Наш новый проект забавного короткометражного мультфильма про кролика! 🐰🎨", tags: ["animation", "3d", "cartoon", "creative", "art"] },
    { url: "/videos/video5.mp4", caption: "Весна в городе Ош! Невероятное макро-видео цветения весенних бутонов в центральном парке. 🌸🌱", tags: ["osh", "spring", "flowers", "nature", "macro"] }
  ];

  const mashaVideos = [
    { url: "/videos/video3.mp4", caption: "👧🐻 Маша и Медведь - «День Варенья»! 🍓🍯 Забавные приключения Маши в волшебном лесу!", tags: ["машаимедведь", "мультики", "masha", "kids"] },
    { url: "/videos/video5.mp4", caption: "👧🎈 Маша и Медведь - «Большая Стирка»! 🧼💦 Смотрите оригинальный мультик прямо тут!", tags: ["машаимедведь", "мультики", "masha", "funny"] },
    { url: "/videos/video3.mp4", caption: "👧🎣 Маша и Медведь - «Ловись, рыбка!» 🐟 Полет Маши над горами и волшебные истории!", tags: ["машаимедведь", "мультики", "cartoons"] }
  ];

  const a4Videos = [
    { url: "/videos/video1.mp4", caption: "1,000 ЗАДАНИЙ за 24 ЧАСА ЧЕЛЛЕНДЖ ! 😱 Большой выпуск! Смотри прямо тут 👇", tags: ["a4", "challenge", "24hours", "longvideo"] },
    { url: "/videos/video2.mp4", caption: "Успей за 7 секунд челлендж! ⏱️⚡ Кто проиграет — выполняет наказание!", tags: ["a4", "challenge", "7seconds", "fun"] },
    { url: "/videos/video5.mp4", caption: "КАЖДЫЙ КТО НАЙДЕТ ПОЛУЧИТ $1000! 💵 Влад А4 прячется на необитаемом острове!", tags: ["a4", "challenge", "hideandseek", "a4team"] }
  ];

  const reels = [];
  
  // 1. Generate 35 Masha Reels
  for (let i = 1; i <= 35; i++) {
    const video = mashaVideos[(i - 1) % mashaVideos.length];
    reels.push({
      id: `reel_masha_${i}`,
      userId: "masha_medved",
      type: "reel",
      mediaURL: video.url,
      coverURL: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
      caption: `${video.caption} (Серия ${i}) 🍿✨`,
      hashtags: video.tags,
      likes: ["traveler_osh", "photo_kg", "osh_admin"],
      saves: ["masha_medved"],
      viewsCount: Math.floor(Math.random() * 20000) + 5000,
      commentsCount: Math.floor(Math.random() * 40),
      repostedFrom: null,
      repostedBy: null,
      createdAt: new Date(Date.now() - i * 4 * 3600 * 1000).toISOString()
    });
  }

  // 2. Generate 35 Vlad A4 Reels
  for (let i = 1; i <= 35; i++) {
    const video = a4Videos[(i - 1) % a4Videos.length];
    reels.push({
      id: `reel_a4_${i}`,
      userId: "vlad_a4",
      type: "reel",
      mediaURL: video.url,
      coverURL: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80",
      caption: `${video.caption} (Часть ${i}) ⚡🔥`,
      hashtags: video.tags,
      likes: ["reels_star", "photo_kg", "osh_admin"],
      saves: ["vlad_a4"],
      viewsCount: Math.floor(Math.random() * 15000) + 3000,
      commentsCount: Math.floor(Math.random() * 25),
      repostedFrom: null,
      repostedBy: null,
      createdAt: new Date(Date.now() - i * 5 * 3600 * 1000).toISOString()
    });
  }

  // 3. Generate 30 General/Local Reels
  for (let i = 1; i <= 30; i++) {
    const video = localVideos[(i - 1) % localVideos.length];
    const user = users[i % users.length];
    reels.push({
      id: `reel_${i}`,
      userId: user,
      type: "reel",
      mediaURL: video.url,
      coverURL: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
      caption: `${video.caption} Выпуск #${i} 🏔️✨`,
      hashtags: video.tags,
      likes: ["traveler_osh", "photo_kg"],
      saves: [],
      viewsCount: Math.floor(Math.random() * 5000) + 100,
      commentsCount: Math.floor(Math.random() * 5),
      repostedFrom: null,
      repostedBy: null,
      createdAt: new Date(Date.now() - i * 6 * 3600 * 1000).toISOString()
    });
  }

  return reels;
};

export const SEED_REELS = generateMockReels();

export const SEED_STORIES = [
  {
    id: "story_a4_1",
    userId: "vlad_a4",
    mediaURL: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80",
    type: "image",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: "story_cartoon_1",
    userId: "cartoon_master",
    mediaURL: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80",
    type: "image",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "story_1",
    userId: "traveler_osh",
    mediaURL: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    type: "image",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "story_2",
    userId: "photo_kg",
    mediaURL: "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=600&auto=format&fit=crop&q=80",
    type: "image",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "story_3",
    userId: "reels_star",
    mediaURL: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    type: "image",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
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
    lastMessageAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    unreadCount: {
      traveler_osh: 0,
      reels_star: 0
    }
  },
  {
    id: "conv_2",
    participants: ["osh_admin", "traveler_osh"],
    lastMessage: "Привет! Твой пост о плове попал в рекомендации. Отличная работа!",
    lastMessageAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
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
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: "msg_2",
    conversationId: "conv_1",
    senderId: "reels_star",
    text: "Привет! Да, заценила! Очень крутые цвета. Давай сделаем Reels вместе?",
    sharedPostId: null,
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString()
  },
  {
    id: "msg_3",
    conversationId: "conv_1",
    senderId: "traveler_osh",
    text: "Крутая идея! Какая тема?",
    sharedPostId: null,
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString()
  },
  {
    id: "msg_4",
    conversationId: "conv_1",
    senderId: "reels_star",
    text: "Ок, договорились, снимем коллаб завтра на Сулайман-Тоо!",
    sharedPostId: null,
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString()
  },
  {
    id: "msg_5",
    conversationId: "conv_2",
    senderId: "osh_admin",
    text: "Привет! Твой пост о плове попал в рекомендации. Отличная работа!",
    sharedPostId: "post_3", // Share post_3 in chat
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
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
