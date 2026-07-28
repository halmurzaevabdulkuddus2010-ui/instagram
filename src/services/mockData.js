// Seed data for Blogger Osh (Instagram Clone) in Mock Mode

export const SEED_USERS = [
  {
    uid: "osh_admin",
    username: "osh_admin",
    displayName: "Admin Blogger Osh",
    email: "admin@bloggerosh.kg",
    phone: "+996555112233",
    bio: "Официальный аккаунт администратора Blogger Osh. Управление контентом и пользователями.",
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
    mediaURL: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
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

export const SEED_REELS = [
  {
    id: "reel_masha_1",
    userId: "masha_medved",
    type: "reel",
    mediaURL: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    coverURL: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
    caption: "👧🐻 Маша и Медведь - «День Варенья»! 🍓🍯 Забавные приключения Маши в волшебном лесу! Смотрите со звуком! 🍿 #машаимедведь #мультики #masha #kids",
    hashtags: ["машаимедведь", "мультики", "masha", "kids"],
    likes: ["traveler_osh", "photo_kg", "reels_star", "osh_admin"],
    saves: ["masha_medved"],
    viewsCount: 28490,
    commentsCount: 35,
    repostedFrom: null,
    repostedBy: null,
    createdAt: new Date().toISOString()
  },
  {
    id: "reel_masha_2",
    userId: "masha_medved",
    type: "reel",
    mediaURL: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    coverURL: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
    caption: "👧🎈 Маша и Медведь - «Большая Стирка»! 🧼💦 Смотрите оригинальный мультик прямо тут! #машаимедведь #мультики #masha #funny",
    hashtags: ["машаимедведь", "мультики", "masha", "funny"],
    likes: ["traveler_osh", "reels_star", "osh_admin"],
    saves: [],
    viewsCount: 19800,
    commentsCount: 24,
    repostedFrom: null,
    repostedBy: null,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: "reel_masha_3",
    userId: "masha_medved",
    type: "reel",
    mediaURL: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    coverURL: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    caption: "👧🎣 Маша и Медведь - «Ловись, рыбка!» 🐟 Полет Маши над горами и волшебные истории! #машаимедведь #мультики #cartoons",
    hashtags: ["машаимедведь", "мультики", "cartoons"],
    likes: ["photo_kg", "reels_star"],
    saves: ["masha_medved"],
    viewsCount: 22100,
    commentsCount: 18,
    repostedFrom: null,
    repostedBy: null,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: "reel_a4_1",
    userId: "vlad_a4",
    type: "reel",
    mediaURL: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    coverURL: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80",
    caption: "1,000 ЗАДАНИЙ за 24 ЧАСА ЧЕЛЛЕНДЖ ! 😱 Большой выпуск! Смотри прямо тут 👇 #a4 #challenge #24hours #longvideo",
    hashtags: ["a4", "challenge", "24hours", "longvideo"],
    likes: ["traveler_osh", "photo_kg", "reels_star", "osh_admin"],
    saves: ["vlad_a4"],
    viewsCount: 15420,
    commentsCount: 22,
    repostedFrom: null,
    repostedBy: null,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: "reel_a4_2",
    userId: "vlad_a4",
    type: "reel",
    mediaURL: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    coverURL: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
    caption: "Успей за 7 секунд челлендж! ⏱️⚡ Кто проиграет — выполняет наказание! #a4 #challenge #7seconds #fun",
    hashtags: ["a4", "challenge", "7seconds", "fun"],
    likes: ["reels_star", "photo_kg"],
    saves: [],
    viewsCount: 12890,
    commentsCount: 14,
    repostedFrom: null,
    repostedBy: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "reel_a4_3",
    userId: "vlad_a4",
    type: "reel",
    mediaURL: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    coverURL: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
    caption: "ЕДА ИЗ МУЛЬТИКОВ ЧЕЛЛЕНДЖ ! 🍔🍿 Пробуем реальные блюда из Симпсонов и Губки Боба! #a4 #food #cartoon #yummy",
    hashtags: ["a4", "food", "cartoon", "yummy"],
    likes: ["traveler_osh", "reels_star", "osh_admin"],
    saves: ["vlad_a4"],
    viewsCount: 9410,
    commentsCount: 8,
    repostedFrom: null,
    repostedBy: null,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "reel_cartoon_3",
    userId: "cartoon_master",
    type: "reel",
    mediaURL: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoylikes.mp4",
    coverURL: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    caption: "🍿 Мультфильм: Приключения Большого Кролика! Весёлая анимация в HD 🐰✨ #cartoon #мультики #animation #funny #kids",
    hashtags: ["cartoon", "мультики", "animation", "funny", "kids"],
    likes: ["traveler_osh", "photo_kg", "reels_star", "osh_admin"],
    saves: ["traveler_osh"],
    viewsCount: 5890,
    commentsCount: 12,
    repostedFrom: null,
    repostedBy: null,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: "reel_cartoon_4",
    userId: "cartoon_master",
    type: "reel",
    mediaURL: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    coverURL: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
    caption: "👽 Танец Инопланетянина — 3D Мультик! Попробуй повторить движения! 💃🕺 #cartoon #мультики #dance #3d #funny",
    hashtags: ["cartoon", "мультики", "dance", "3d", "funny"],
    likes: ["reels_star", "photo_kg", "osh_admin"],
    saves: [],
    viewsCount: 7120,
    commentsCount: 9,
    repostedFrom: null,
    repostedBy: null,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "reel_cartoon_5",
    userId: "cartoon_master",
    type: "reel",
    mediaURL: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    coverURL: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    caption: "🐲 Сказка про Маленького Дракона! Полет над волшебными горами 🏔️✨ #cartoon #мультики #dragon #magic #fantasy",
    hashtags: ["cartoon", "мультики", "dragon", "magic", "fantasy"],
    likes: ["traveler_osh", "reels_star"],
    saves: ["cartoon_master"],
    viewsCount: 4390,
    commentsCount: 7,
    repostedFrom: null,
    repostedBy: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "reel_cartoon_1",
    userId: "cartoon_master",
    type: "reel",
    mediaURL: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    coverURL: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    caption: "3D Мультфильм: Веселые приключения в парке! 🐱🚀 Смотрите со звуком! 🍿 #cartoon #animation #funny #reels #anime",
    hashtags: ["cartoon", "animation", "funny", "reels", "anime"],
    likes: ["traveler_osh", "photo_kg", "reels_star", "osh_admin"],
    saves: ["traveler_osh"],
    viewsCount: 3420,
    commentsCount: 6,
    repostedFrom: null,
    repostedBy: null,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "reel_cartoon_2",
    userId: "cartoon_master",
    type: "reel",
    mediaURL: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    coverURL: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
    caption: "Анимированный трейлер волшебной сказки. Скоро во всех кинотеатрах! 🎨✨ #anime #animation #cinema #cartoons",
    hashtags: ["anime", "animation", "cinema", "cartoons"],
    likes: ["reels_star", "photo_kg"],
    saves: ["osh_admin"],
    viewsCount: 2890,
    commentsCount: 4,
    repostedFrom: null,
    repostedBy: null,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "reel_1",
    userId: "reels_star",
    type: "reel",
    mediaURL: "https://vjs.zencdn.net/v/oceans.mp4",
    coverURL: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    caption: "Огни ночного Оша 🌃✨ Неоновая эстетика нашего города. Любите ночные прогулки? #osh #nightlife #aesthetic #reels #mood",
    hashtags: ["osh", "nightlife", "aesthetic", "reels", "mood"],
    likes: ["traveler_osh", "photo_kg", "osh_admin"],
    saves: ["traveler_osh"],
    viewsCount: 1245,
    commentsCount: 3,
    repostedFrom: null,
    repostedBy: null,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "reel_2",
    userId: "traveler_osh",
    type: "reel",
    mediaURL: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    coverURL: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
    caption: "Где-то высоко в горах Алайского хребта. Чистейшая горная река и шум воды 🏔️💧 Лучший релакс! #nature #alaivalley #relax #mountains #kyrgyzstan",
    hashtags: ["nature", "alaivalley", "relax", "mountains", "kyrgyzstan"],
    likes: ["reels_star", "photo_kg"],
    saves: [],
    viewsCount: 980,
    commentsCount: 2,
    repostedFrom: null,
    repostedBy: null,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "reel_3",
    userId: "photo_kg",
    type: "reel",
    mediaURL: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
    coverURL: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&auto=format&fit=crop&q=80",
    caption: "Ретро вайб. Атмосфера винила и старой классики 📻🎶 #vinyl #retro #music #reelsvideo #osh",
    hashtags: ["vinyl", "retro", "music", "reelsvideo", "osh"],
    likes: ["traveler_osh"],
    saves: ["osh_admin"],
    viewsCount: 654,
    commentsCount: 1,
    repostedFrom: null,
    repostedBy: null,
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "reel_4",
    userId: "osh_admin",
    type: "reel",
    mediaURL: "https://vjs.zencdn.net/v/oceans.mp4",
    coverURL: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&auto=format&fit=crop&q=80",
    caption: "Добро пожаловать в Blogger Osh! Присоединяйтесь к сообществу креативных блогеров 🚀✨ #bloggerosh #osh #kyrgyzstan",
    hashtags: ["bloggerosh", "osh", "kyrgyzstan"],
    likes: ["traveler_osh", "reels_star"],
    saves: [],
    viewsCount: 2150,
    commentsCount: 5,
    repostedFrom: null,
    repostedBy: null,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  }
];

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
