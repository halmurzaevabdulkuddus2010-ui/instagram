// clinicData.js - Initial seed database for Dental Clinic «АКАК ТИШ»

export const CLINIC_BRANCHES = [
  {
    id: "branch_main",
    name: "Филиал Центр (Ош)",
    address: "г. Ош, ул. Курманжан Датка, 142 (ориентир: ЦУМ)",
    phone: "+996 (555) 70-00-11",
    workHours: "Пн-Сб: 08:30 - 20:00, Вс: 09:00 - 17:00",
    coords: { lat: 40.5283, lng: 72.7985 },
    is24Hours: false
  },
  {
    id: "branch_west",
    name: "Филиал Западно-Городской (Ош)",
    address: "г. Ош, пр. Масалиева, 88A (рядом с парком Навои)",
    phone: "+996 (770) 70-00-22",
    workHours: "Круглосуточно (24/7)",
    coords: { lat: 40.5191, lng: 72.7912 },
    is24Hours: true
  }
];

export const CLINIC_DOCTORS = [
  {
    id: "doc_1",
    name: "Д-р Алмаз Каримов",
    specialty: "Главный врач, Хирург-имплантолог",
    experience: "14 лет стажа",
    rating: 4.95,
    reviewsCount: 148,
    photoURL: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80",
    education: "КГМА им. И.К. Ахунбаева, Ординатура по челюстно-лицевой хирургии (Германия)",
    certificates: ["Международный сертификат Straumann (Швейцария)", "Нобель Биокер Имплантология 2023"],
    bio: "Специалист по одномоментной имплантации и сложным костно-пластическим операциям. Выполнил более 3,500 успешных операций.",
    schedule: ["Пн", "Вт", "Чт", "Пт"],
    priceFrom: "от 35,000 KGS"
  },
  {
    id: "doc_2",
    name: "Д-р Айсулу Сатыбалдиева",
    specialty: "Врач-ортодонт (Брекеты & Элайнеры)",
    experience: "9 лет стажа",
    rating: 4.98,
    reviewsCount: 210,
    photoURL: "https://images.unsplash.com/photo-1594824813566-8185b378f790?w=600&auto=format&fit=crop&q=80",
    education: "КРСУ им. Б.Н. Ельцина, Стажировка в Сеуле (Южная Корея)",
    certificates: ["Сертифицированный специалист Invisalign", "Ортодонтия премиум-класса Damon System"],
    bio: "Создает идеальные белоснежные улыбки у взрослых и детей с применением прозрачных элайнеров и самолигирующих брекетов.",
    schedule: ["Пн", "Ср", "Пт", "Сб"],
    priceFrom: "от 25,000 KGS"
  },
  {
    id: "doc_3",
    name: "Д-р Бакыт Жумабеков",
    specialty: "Стоматолог-терапевт, Эстетист (Виниры)",
    experience: "11 лет стажа",
    rating: 4.92,
    reviewsCount: 175,
    photoURL: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&auto=format&fit=crop&q=80",
    education: "ОшГУ Медицинский факультет, Магистратура по эстетической стоматологии (Италия)",
    certificates: ["Микроскопная эндодонтия Zeiss", "Керамические виниры и DSD-улыбки"],
    bio: "Специалист по художественной реставрации, установке тончайших ультраниров и сложному лечению каналов под микроскопом.",
    schedule: ["Вт", "Ср", "Чт", "Сб"],
    priceFrom: "от 2,500 KGS"
  },
  {
    id: "doc_4",
    name: "Д-р Гульзат Рахимова",
    specialty: "Детский стоматолог (Детская секция)",
    experience: "8 лет стажа",
    rating: 5.00,
    reviewsCount: 312,
    photoURL: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&auto=format&fit=crop&q=80",
    education: "КГМА им. И.К. Ахунбаева, Курсы детской седации и адаптологии (Турция)",
    certificates: ["Детская стоматология без страха и боли", "Лечение молочных зубов с закисью азота"],
    bio: "Любимый доктор маленьких пациентов. Проводит лечение молочных и постоянных зубов игровой методикой без боли.",
    schedule: ["Пн", "Вт", "Ср", "Пт", "Вс"],
    priceFrom: "от 1,800 KGS"
  }
];

export const CLINIC_SERVICES = [
  {
    id: "serv_caries",
    category: "Лечение кариеса",
    title: "Лечение кариеса & Эстетическая пломба",
    description: "Безболезненное лечение кариеса любой сложности с применением японских фотополимерных материалов Estelite и изоляцией раббердамом.",
    price: 2500,
    duration: "45 минут",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80",
    faq: [
      { q: "Больно ли лечить кариес?", a: "Совершенно безболезненно. Мы применяем анестетики последнего поколения с гарантией комфорта." }
    ]
  },
  {
    id: "serv_implant",
    category: "Имплантация",
    title: "Имплантация зубов Straumann (Швейцария)",
    description: "Премиальная швейцарская система имплантации с приживаемостью 99.6% и пожизненной международной гарантией.",
    price: 45000,
    duration: "60 минут",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=80",
    faq: [
      { q: "Какой срок службы импланта?", a: "Швейцарские импланты Straumann устанавливаются раз и на всю жизнь с пожизненной гарантией завода." }
    ]
  },
  {
    id: "serv_brackets",
    category: "Брекеты & Ортодонтия",
    title: "Сапфировые & Керамические брекеты Damon",
    description: "Эстетичное исправление прикуса и выравнивание зубного ряда за рекордные сроки без удаления здоровых зубов.",
    price: 35000,
    duration: "90 минут",
    image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&auto=format&fit=crop&q=80",
    faq: [
      { q: "Сколько носят брекеты?", a: "В среднем от 10 до 18 месяцев в зависимости от сложности клинического случая." }
    ]
  },
  {
    id: "serv_veneers",
    category: "Виниры",
    title: "Ультратонкие фарфоровые виниры E-max",
    description: "Голливудская белоснежная улыбка! Тончайшие микропротезы (0.3 мм), не требующие сильной обточки ваших эмалей.",
    price: 18000,
    duration: "2 визита",
    image: "https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=800&auto=format&fit=crop&q=80",
    faq: [
      { q: "Меняют ли виниры цвет со временем?", a: "Нет, немецкий прессованный фарфор E-max не впитывает кофе, чай и не тускнеет десятилетиями." }
    ]
  },
  {
    id: "serv_whitening",
    category: "Отбеливание",
    title: "Безопасное фотоотбеливание Zoom 4 WhiteSpeed",
    description: "Осветление эмали до 8 оттенков за 1 час без вреда для чувствительности зубов с гелем Relief ACP.",
    price: 12000,
    duration: "60 минут",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80",
    faq: [
      { q: "На сколько хватает отбеливания?", a: "Результат сохраняется от 2 до 4 лет при соблюдении «белой диеты» и гигиены." }
    ]
  },
  {
    id: "serv_cleaning",
    category: "Чистка зубов",
    title: "Комплексный спа-гигиенический уход AirFlow + Ультразвук",
    description: "Полное удаление зубного камня, пигментированного налета от кофе/курения, полировка пастой и фторирование эмали.",
    price: 3500,
    duration: "40 минут",
    image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&auto=format&fit=crop&q=80",
    faq: [
      { q: "Как часто нужно делать чистку AirFlow?", a: "Рекомендуется проходить процедуру 1 раз в 6 месяцев для профилактики кариеса." }
    ]
  },
  {
    id: "serv_kids",
    category: "Детская стоматология",
    title: "Лечение детских зубок без боли & Герметизация фиссур",
    description: "Детская адаптивная терапия без слез в игровой форме. Лечение кариеса молочных зубов и укрепление минералами.",
    price: 1800,
    duration: "30 минут",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80",
    faq: [
      { q: "Нужно ли лечить молочные зубы?", a: "Обязательно! Инфекция в молочном зубе может повредить зачаток постоянного зуба." }
    ]
  },
  {
    id: "serv_surgery",
    category: "Хирургия",
    title: "Атравматичное удаление зуба мудрости",
    description: "Быстрое и бескровное удаление ретинированных или сложных зубов мудрости ультразвуковым скальпелем Piezosurgery.",
    price: 4500,
    duration: "40 минут",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=80",
    faq: [
      { q: "Как долго заживает лунка?", a: "Благодаря ультразвуковой хирургии заживление происходит в 2 раза быстрее (3-5 дней)." }
    ]
  }
];

export const CLINIC_PROMOTIONS = [
  {
    id: "promo_1",
    title: "Скидка -20% на Швейцарскую Имплантацию",
    badge: "АКЦИЯ МЕСЯЦА",
    description: "Установите имплант премиум-класса Straumann с керамической коронкой по специальной цене!",
    discountText: "Успейте до конца месяца",
    bgGradient: "from-cyan-500 to-blue-600",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "promo_2",
    title: "Бесплатная 3D КТ Диагностика при записи онлайн",
    badge: "ПОДАРОК 🎁",
    description: "Запишитесь на первичный осмотр через приложение и получите компьютерную томографию челюсти БЕСПЛАТНО!",
    discountText: "Экономия 2,000 KGS",
    bgGradient: "from-blue-600 to-indigo-700",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "promo_3",
    title: "Семейная чистка AirFlow: 2+1 В ПОДАРОК",
    badge: "СЕМЕЙНЫЙ ПАКЕТ",
    description: "Приходите всей семьей! При чистке двух взрослых — чистка ребенку бесплатно.",
    discountText: "Выгода 1,800 KGS",
    bgGradient: "from-teal-500 to-emerald-600",
    image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&auto=format&fit=crop&q=80"
  }
];

export const CLINIC_REVIEWS = [
  {
    id: "rev_1",
    patientName: "Айжамал Нурматова",
    rating: 5,
    date: "15 июля 2026",
    service: "Лечение & Виниры E-max",
    comment: "Клиника «АКАК ТИШ» — это космический уровень! Д-р Бакыт сделал мне невероятную голливудскую улыбку. Сервис, кофе, забота персонала на 10 из 10!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aijamal&backgroundColor=ffdfbf"
  },
  {
    id: "rev_2",
    patientName: "Нурбек Абдуллаев",
    rating: 5,
    date: "10 июля 2026",
    service: "Имплантация Straumann",
    comment: "Очень боялся удалять зубы мудрости и ставить импланты. Д-р Алмаз Каримов — настоящий хирург от Бога. Всю операцию не чувствовал вообще никакой боли!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nurbek&backgroundColor=b6e3f4"
  },
  {
    id: "rev_3",
    patientName: "Динара Касымова",
    rating: 5,
    date: "2 июля 2026",
    service: "Детская стоматология",
    comment: "Дочка раньше плакала при одном виде врачей. В «АКАК ТИШ» д-р Гульзат вовлекла дочку в игру, включила мультики. Теперь ребенок сам просится на чистку!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dinara&backgroundColor=ffd5dc"
  }
];

export const INITIAL_PATIENT_DATA = {
  uid: "pat_demo_1",
  name: "Эркин Мамытов",
  phone: "+996 (772) 12-34-56",
  email: "erkin.m@gmail.com",
  dob: "14 мая 1994",
  medicalCardNo: "AT-2026-8841",
  bonusPoints: 1250,
  discountTier: "10% Гольд Пациент",
  familyMembers: [
    { id: "fam_1", name: "Алихан Мамытов (Сын)", age: "7 лет", cardNo: "AT-KIDS-104" },
    { id: "fam_2", name: "Айсулу Мамытова (Супруга)", age: "29 лет", cardNo: "AT-FAM-208" }
  ],
  upcomingAppointments: [
    {
      id: "app_up_1",
      doctorName: "Д-р Айсулу Сатыбалдиева",
      serviceTitle: "Осмотр & Коррекция брекетов",
      date: "25 Июля 2026",
      time: "14:30",
      branchName: "Филиал Центр (Ош)",
      status: "Подтверждено",
      statusColor: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40"
    }
  ],
  pastAppointments: [
    {
      id: "app_past_1",
      doctorName: "Д-р Бакыт Жумабеков",
      serviceTitle: "Лечение кариеса & Чистка AirFlow",
      date: "12 Мая 2026",
      cost: "6,000 KGS",
      branchName: "Филиал Центр"
    }
  ],
  xrayScans: [
    {
      id: "xray_1",
      title: "3D Томография челюсти (Панорама)",
      date: "12 Мая 2026",
      url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80"
    }
  ]
};
