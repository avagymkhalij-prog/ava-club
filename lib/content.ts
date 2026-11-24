// Static landing-page content (placeholder copy).
// Later phases can move this to the database via the admin panel.

import {
  Activity,
  Dumbbell,
  Flower2,
  StretchHorizontal,
  Music,
  Anchor,
  PartyPopper,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

// ---------- Classes ----------
export type ClassItem = {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const CLASSES: ClassItem[] = [
  {
    slug: "aerobics",
    title: "ایروبیک",
    description: "کلاس‌های گروهی پرانرژی برای تقویت قلب و عروق و تناسب اندام.",
    icon: Activity,
  },
  {
    slug: "crossfit",
    title: "کراس‌فیت",
    description: "تمرینات ترکیبی شدید برای افزایش قدرت، استقامت و سرعت.",
    icon: Dumbbell,
  },
  {
    slug: "yoga",
    title: "یوگا",
    description: "آرامش ذهن، انعطاف بدن و تعادل در محیطی ساکت و دلنشین.",
    icon: Flower2,
  },
  {
    slug: "pilates",
    title: "پیلاتس",
    description: "تقویت عضلات مرکزی بدن، اصلاح حالت قرارگیری اندام و کشیدگی.",
    icon: StretchHorizontal,
  },
  {
    slug: "zumba",
    title: "زومبا",
    description: "رقص‌های لاتین با ریتم موزیکال — کالری‌سوزی با هیجان.",
    icon: Music,
  },
  {
    slug: "trx",
    title: "TRX",
    description: "تمرین با بندهای تعلیقی برای قدرت عملی و ثبات بدن.",
    icon: Anchor,
  },
  {
    slug: "dance-fitness",
    title: "فیتنس رقص",
    description: "ترکیب رقص و حرکات هوازی در فضایی شاد و زنانه.",
    icon: PartyPopper,
  },
  {
    slug: "stretching",
    title: "حرکات کششی",
    description: "افزایش دامنه حرکتی، کاهش سفتی عضلات و پیشگیری از آسیب.",
    icon: Sparkles,
  },
];

// ---------- Trainers ----------
export type Trainer = {
  name: string;
  specialty: string;
  bio: string;
  // Placeholder images live in /public/images/trainers
  image: string;
};

export const TRAINERS: Trainer[] = [
  {
    name: "سارا محمدی",
    specialty: "یوگا و پیلاتس",
    bio: "مربی رسمی با ۸ سال سابقه تدریس یوگا و پیلاتس.",
    image: "/images/trainers/trainer-1.svg",
  },
  {
    name: "نگار کریمی",
    specialty: "کراس‌فیت و TRX",
    bio: "مربی توانبخشی و قهرمان کشوری کراس‌فیت.",
    image: "/images/trainers/trainer-2.svg",
  },
  {
    name: "مریم حسینی",
    specialty: "زومبا و فیتنس رقص",
    bio: "مدرس بین‌المللی زومبا با روحیه‌ای پرانرژی.",
    image: "/images/trainers/trainer-3.svg",
  },
  {
    name: "الهام رضایی",
    specialty: "ایروبیک و حرکات کششی",
    bio: "متخصص کلاس‌های گروهی ایروبیک و انعطاف‌پذیری.",
    image: "/images/trainers/trainer-4.svg",
  },
];

// ---------- Weekly schedule ----------
// day -> sessions
export type ScheduleSession = {
  time: string;
  classTitle: string;
  trainer: string;
};

export const SCHEDULE: Record<string, ScheduleSession[]> = {
  "شنبه": [
    { time: "۰۹:۰۰ – ۱۰:۰۰", classTitle: "ایروبیک", trainer: "الهام رضایی" },
    { time: "۱۷:۰۰ – ۱۸:۰۰", classTitle: "یوگا", trainer: "سارا محمدی" },
  ],
  "یکشنبه": [
    { time: "۱۰:۰۰ – ۱۱:۰۰", classTitle: "پیلاتس", trainer: "سارا محمدی" },
    { time: "۱۸:۰۰ – ۱۹:۰۰", classTitle: "کراس‌فیت", trainer: "نگار کریمی" },
  ],
  "دوشنبه": [
    { time: "۰۹:۰۰ – ۱۰:۰۰", classTitle: "زومبا", trainer: "مریم حسینی" },
    { time: "۱۷:۳۰ – ۱۸:۳۰", classTitle: "TRX", trainer: "نگار کریمی" },
  ],
  "سه‌شنبه": [
    { time: "۱۰:۰۰ – ۱۱:۰۰", classTitle: "حرکات کششی", trainer: "الهام رضایی" },
    { time: "۱۸:۰۰ – ۱۹:۰۰", classTitle: "فیتنس رقص", trainer: "مریم حسینی" },
  ],
  "چهارشنبه": [
    { time: "۰۹:۰۰ – ۱۰:۰۰", classTitle: "کراس‌فیت", trainer: "نگار کریمی" },
    { time: "۱۷:۰۰ – ۱۸:۰۰", classTitle: "ایروبیک", trainer: "الهام رضایی" },
  ],
  "پنجشنبه": [
    { time: "۱۰:۰۰ – ۱۱:۳۰", classTitle: "یوگا", trainer: "سارا محمدی" },
    { time: "۱۷:۰۰ – ۱۸:۰۰", classTitle: "زومبا", trainer: "مریم حسینی" },
  ],
};

// ---------- Pricing plans ----------
export type Plan = {
  name: string;
  monthlyPrice: string; // Toman, formatted Persian
  features: string[];
  highlighted?: boolean;
};

export const PLANS: Plan[] = [
  {
    name: "پایه",
    monthlyPrice: "۸۵۰,۰۰۰",
    features: [
      "دسترسی به ۲ کلاس در هفته",
      "کلاس‌های ایروبیک و کششی",
      "بدون تعلیق عضویت",
    ],
  },
  {
    name: "استاندارد",
    monthlyPrice: "۱,۴۵۰,۰۰۰",
    features: [
      "دسترسی نامحدود به همه کلاس‌ها",
      "برنامه تمرینی اختصاصی",
      "مشاوره تغذیه ماهانه",
      "امکان رزرو آنلاین کلاس",
    ],
    highlighted: true,
  },
  {
    name: "ویژه",
    monthlyPrice: "۲,۲۵۰,۰۰۰",
    features: [
      "همه مزایای طرح استاندارد",
      "جلسات خصوصی با مربی (۴ جلسه)",
      "آنالیز بدن حرفه‌ای ماهانه",
      "دسترسی ساعات طلایی",
    ],
  },
];

// ---------- Testimonials ----------
export type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "رضا – ۳۴ ساله",
    role: "عضو از ۱۴۰۱",
    quote: "فضای باشگاه واقعاً آرامش‌بخش است و مربیان بسیار حرفه‌ای. بعد از سه ماه یوگا و پیلاتس، دردهای کمرم کاملاً از بین رفت.",
  },
  {
    name: "مهسا – ۲۸ ساله",
    role: "عضو کلاس زومبا",
    quote: "هر جلسه زومبا مثل یک جشن است! انرژی مربی و موزیک‌ها باعث می‌شود ورزش را دوست داشته باشم.",
  },
  {
    name: "شیرین – ۴۱ ساله",
    role: "عضو کراس‌فیت",
    quote: "اول فکر می‌کردم کراس‌فیت برای من سنگین است، اما برنامه‌ریزی مربی‌ها دقیقاً متناسب با سطح من بود. الان قوی‌تر از همیشه‌ام.",
  },
  {
    name: "آیدا – ۲۲ ساله",
    role: "عضو جدید",
    quote: "از اولین جلسه احساس کردم جای درستی آمده‌ام. رزرو آنلاین کلاس‌ها هم خیلی راحت است.",
  },
];

// ---------- Contact info ----------
export const CONTACT = {
  phone: "۰۲۱-۱۲۳۴۵۶۷۸",
  mobile: "۰۹۱۲-۱۲۳۴۵۶۷",
  address: "تهران، خیابان نمونه، پلاک ۱۲، ساختمان آوا",
  hours: "شنبه تا پنجشنبه — ۸ صبح تا ۹ شب",
  instagram: "https://instagram.com",
  telegram: "https://telegram.org",
  whatsapp: "https://wa.me/989120000000",
};
