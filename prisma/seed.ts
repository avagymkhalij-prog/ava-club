// Seed file: populates the database with the exact Ava Club schedule data.
// Sessions are grouped per sport via the `slug` field.
// Uses upsert-style logic so it can be run multiple times safely.
// Run with: npx tsx prisma/seed.ts   (or: npm run db:seed)

import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./prisma/dev.db" } as never);
const prisma = new PrismaClient({ adapter });

// dayType → dayOfWeek (for sorting): فرد = شنبه/دوشنبه/چهارشنبه، زوج = یکشنبه/سه‌شنبه/پنجشنبه
const DAY_TYPE_ORDER: Record<string, number> = {
  "روزهای فرد": 0,
  "روزهای زوج": 1,
  "پنجشنبه و جمعه": 2,
};

// ---------- Rich Persian descriptions per sport ----------
// One description per sport (slug) — shared by all its sessions.
export const sportDescriptions: Record<string, string> = {
  yoga:
    "یوگا سفری آرام به سوی تعادل واقعی میان ذهن و بدن است. با تمرینات تنفس آگاهانه، حالت‌های کششی و مدیتیشن، استرس انباشته روزمره را آزاد می‌کنید و انعطاف‌پذیری بدنتان را جلسه به جلسه بیشتر می‌بینید. اگر دنبال آرامش عمیق، خواب بهتر و ستون فقرات سالم هستید، این کلاس از همین هفته نقطه شروع شماست.",
  cx:
    "CX Worx تمرین علمی و هدفمندی است که به‌طور تخصصی روی عضلات مرکزی بدن (Core) تمرکز می‌کند. حرکات فانکشنال و کنترل‌شده این کلاس، تعادل، قدرت و استقامت عضلات شکم و کمر را به‌شکل چشمگیری ارتقا می‌دهد و به اصلاح انحنای ناشی از نشستن طولانی کمک می‌کند. نتیجه‌اش؟ قامت صاف‌تر، اندام جمع‌وجورتر و عملکرد بهتر در تمام ورزش‌های دیگر.",
  "body-rhythm":
    "بادی ریتم یک سفر موزون میان حرکات هوازی و کششی است که با ریتم موزیک، هماهنگی کامل بدن و ذهن را تمرین می‌کند. در هر جلسه، چابکی، قدرت عضلانی و فرم اندام را همزمان تقویت می‌کنید و در فضایی پرانرژی و شاد، کالری‌سوزی بالا را با لذت تجربه می‌کنید. بهترین انتخاب برای کسانی که ورزش تکراری را دوست ندارند!",
  "bunji-rhythm":
    "بانجی ریتم تمرینی متفاوت و هیجان‌انگیز با بندهای الاستیک سقفی است که حس پرواز را به ورزش شما اضافه می‌کند. فشار بسیار کم به مفاصل زانو و کمر، آن را برای همه سنین مناسب می‌کند، در حالی که سوزاندن کالری، تقویت عضلات مرکزی و بهبود چابکی با سرعت چشمگیری اتفاق می‌افتد. ورزشی که با لبخند تمام می‌شود!",
  gymnastics:
    "ژیمناستیک پایه‌ای‌ترین و کامل‌ترین ورزش برای پرورش انعطاف‌پذیری، تعادل و قدرت عضلانی است. برنامه تمرینی این کلاس از حرکات پایه و امن شروع می‌شود و قدم‌به‌قدم تا تکنیک‌های پیشرفته همراه شماست؛ همه این‌ها زیر نظر مربیان مجرب و در محیطی ایمن و استاندارد. چه کودک باشید چه بزرگسال، ژیمناستیک حالت بدن، اعتمادبه‌نفس و کنترل حرکتی شما را متحول می‌کند.",
  trx:
    "TRX تمرینی هوشمندانه با بندهای تعلیقی است که وزن بدن خودتان را به‌عنوان وزنه استفاده می‌کند. هر حرکت، ثبات مرکزی، قدرت عملی و تعادل را همزمان درگیر می‌کند و چون شدت تمرین با تغییر زاویه بدن قابل تنظیم است، از مبتدی تا حرفه‌ای برای همه مناسب است. کم‌جاست، متنوع است و نتایجش را در فرم اندام به‌سرعت خواهید دید.",
  "kung-fu-kickboxing":
    "کونگ فو و کیک بوکس ترکیبی جذاب از هنرهای رزمی اصیل و تمرینات قدرتی مدرن است. در این کلاس هم تکنیک‌های دفاع شخصی واقعی را یاد می‌گیرید، هم سرعت واکنش، قدرت ضربه و استقامت قلبی-عروقی‌تان به‌شکل قابل لمسی بالا می‌رود. بیش از هر چیز، تمرین منظم رزمی اعتمادبه‌نفس و قدرت روحیه شما را چند برابر می‌کند.",
  crossfit:
    "کراس فیت با WODهای متنوع و چالشی، همه اجزای آمادگی جسمانی — قدرت، سرعت، استقامت، چابکی و انعطاف — را همزمان توسعه می‌دهد. هر جلسه یک چالش تازه است و پیشرفت خود را با اعداد و رکوردها به‌صورت ملموس می‌بینید؛ همین حس دستاورد است که کراس فیت را اعتیادآور می‌کند. اگر به دنبال تغییر واقعی در فرم و توان بدنی هستید، جای درستی آمده‌اید.",
  aerobics:
    "ایروبیک ضربان قلب را بالا می‌برد، قلب و عروق را تقویت می‌کند و یکی از مؤثرترین روش‌های چربی‌سوزی و تناسب اندام است. حرکات ریتمیک گروهی همراه با موزیک، انرژی و خلق‌وخوی شما را در طول روز بالا می‌برد و حس نشاط را به زندگی برمی‌گرداند. در محیطی دوستانه و پرانرژی، ورزش کردن را به بخشی لذت‌بخش از روزتان تبدیل کنید.",
  "aerobics-combo":
    "کلاس ترکیبی ایروبیک بهترینِ دو دنیاست: حرکات هوازی برای چربی‌سوزی و تمرینات قدرتی و کششی برای فرم‌دهی و انعطاف. در یک جلسه کامل، متابولیسم بدن بالا می‌رود، عضلات شکل می‌گیرند و استقامت قلبی-عروقی بهبود می‌یابد. تنوع حرکات باعث می‌شود هیچ‌وقت از تمرین خسته نشوید و هر جلسه انتظار یک تجربه تازه را داشته باشید.",
  taekwondo:
    "تکواندو، هنر رزمی المپیکی کره‌ای، با تمرکز بر ضربات پا و انضباط اخلاقی، سرعت، تمرکز و کنترل بدن را به سطحی حرفه‌ای می‌رساند. تمرینات این کلاس زیر نظر مربی رسمی فدراسیون انجام می‌شود و مسیر صعود تا کمربند مشکی برای علاقه‌مندان جدی باز است. علاوه بر دفاع شخصی، تکواندو احترام به نفس، پشتکار و آرامش ذهنی را هم پرورش می‌دهد.",
  "fitness-bodybuilding":
    "فیتنس بدنسازی با برنامه تمرینی هدفمند و اصولی، اندام را فرم می‌دهد، عضلات را تقویت می‌کند و متابولیسم پایه بدن را بالا می‌برد. تمرینات با دستگاه و وزنه آزاد، زیر نظر مربی و متناسب با سطح هر فرد طراحی می‌شود تا هم از آسیب جلوگیری شود و هم پیشرفت پیوسته باشد. ترکیب هوشمندانه‌ای از قدرت، زیبایی اندام و سلامت استخوان‌ها و مفاصل.",
  "karate-kyokushin":
    "کاراته کیوکوشین معروف‌ترین سبک سخت‌کوش کاراته در جهان است؛ جایی که قدرت ضربه، استقامت ذهنی و روحیه جنگندگی واقعی ساخته می‌شود. تمرینات این سبک، علاوه بر دفاع شخصی کاربردی، انضباط اخلاقی، احترام و پشتکاری را در وجود شما نهادینه می‌کند که فراتر از باشگاه، در زندگی روزمره هم اثر می‌گذارد. برای کسانی که مرزهای خود را جابه‌جا می‌خواهند.",
};

type SeedSession = {
  slug: string;
  title: string;
  dayType: string;
  time: string;
  trainerName: string;
  price: number;
};

const seedSessions: SeedSession[] = [
  // ---------- ODD DAYS (شنبه، دوشنبه، چهارشنبه) ----------
  { slug: "yoga", title: "یوگا", dayType: "روزهای فرد", time: "۸ تا ۹", trainerName: "زهرا قاسمی", price: 850000 },
  { slug: "cx", title: "CX", dayType: "روزهای فرد", time: "۹ تا ۱۰", trainerName: "زهره قاسمی", price: 950000 },
  { slug: "body-rhythm", title: "بادی ریتم", dayType: "روزهای فرد", time: "۱۰ تا ۱۱:۳۰", trainerName: "زهره قاسمی", price: 900000 },
  { slug: "bunji-rhythm", title: "بانجی ریتم", dayType: "روزهای فرد", time: "۱۲:۳۰ تا ۱۳:۳۰", trainerName: "خانم حسینی", price: 1000000 },
  { slug: "gymnastics", title: "ژیمناستیک", dayType: "روزهای فرد", time: "۱۴ تا ۱۵", trainerName: "خانم شریفی", price: 800000 },
  { slug: "gymnastics", title: "ژیمناستیک", dayType: "روزهای فرد", time: "۱۵ تا ۱۶", trainerName: "آقای شریفی ۲", price: 800000 },
  { slug: "trx", title: "TRX", dayType: "روزهای فرد", time: "زمان نامشخص", trainerName: "خانم مانوری", price: 1100000 },
  { slug: "kung-fu-kickboxing", title: "کونگ فو / کیک بوکس", dayType: "روزهای فرد", time: "۱۸:۳۰ تا ۱۹:۴۵", trainerName: "خانم حاجی زاده", price: 1200000 },
  { slug: "crossfit", title: "کراس فیت", dayType: "روزهای فرد", time: "۱۹:۴۵ تا ۲۰:۴۵", trainerName: "خانم فرتوتی", price: 1200000 },
  // ---------- EVEN DAYS (یکشنبه، سه‌شنبه، پنجشنبه) ----------
  { slug: "aerobics", title: "ایروبیک", dayType: "روزهای زوج", time: "۸ تا ۹", trainerName: "زهرا قاسمی", price: 850000 },
  { slug: "aerobics-combo", title: "ترکیبی - ایروبیک", dayType: "روزهای زوج", time: "۹ تا ۱۰", trainerName: "زهرا قاسمی", price: 850000 },
  { slug: "taekwondo", title: "تکواندو", dayType: "روزهای زوج", time: "۱۰ تا ۱۱:۱۵", trainerName: "خانم صادقی", price: 1100000 },
  { slug: "crossfit", title: "کراس فیت", dayType: "روزهای زوج", time: "۱۲:۱۵ تا ۱۳:۱۵", trainerName: "خانم فرتوتی", price: 1200000 },
  { slug: "fitness-bodybuilding", title: "فیتنس بدنسازی", dayType: "روزهای زوج", time: "۱۳:۲۰ تا ۱۴:۲۵", trainerName: "خانم حسینی", price: 1000000 },
  { slug: "trx", title: "TRX", dayType: "روزهای زوج", time: "۱۴:۳۰ تا ۱۶", trainerName: "خانم مانوری", price: 1100000 },
  { slug: "taekwondo", title: "تکواندو", dayType: "روزهای زوج", time: "۱۶:۱۰ تا ۱۷:۱۰", trainerName: "خانم صادقی", price: 1100000 },
  { slug: "gymnastics", title: "ژیمناستیک", dayType: "روزهای زوج", time: "۱۷:۱۵ تا ۱۸:۱۵", trainerName: "خانم یوسفلوئی", price: 800000 },
  { slug: "trx", title: "TRX", dayType: "روزهای زوج", time: "۱۸:۲۰ تا ۱۹:۲۰", trainerName: "زهرا قاسمی", price: 1100000 },
  { slug: "karate-kyokushin", title: "کاراته کیوکوشین", dayType: "روزهای زوج", time: "۱۹:۲۵ تا ۲۰:۵۰", trainerName: "خانم عسکری", price: 1150000 },
];

// بادی ریتم also runs on پنجشنبه و جمعه
const thursdayFridaySession: SeedSession = {
  slug: "body-rhythm",
  title: "بادی ریتم",
  dayType: "پنجشنبه و جمعه",
  time: "۱۰ تا ۱۱:۳۰",
  trainerName: "زهره قاسمی",
  price: 900000,
};

async function main() {
  // Optional admin user (safe to re-run)
  await prisma.user.upsert({
    where: { email: "admin@ava.club" },
    update: {},
    create: {
      name: "مدیر آوا",
      email: "admin@ava.club",
      passwordHash: "$2a$12$LJ3m4sNKzEfUyVZH5pFYke", // replace with a real bcrypt hash in production
      role: "ADMIN",
    },
  });

  const allSessions = [...seedSessions, thursdayFridaySession];

  for (const s of allSessions) {
    const description =
      sportDescriptions[s.slug] ?? `${s.title} — کلاس تخصصی باشگاه آوا.`;

    // Upsert-style: find an existing session with the same unique combo first
    const existing = await prisma.class.findFirst({
      where: {
        slug: s.slug,
        dayType: s.dayType,
        startTime: s.time,
        trainerName: s.trainerName,
      },
    });

    if (existing) {
      await prisma.class.update({
        where: { id: existing.id },
        data: {
          title: s.title,
          description,
          price: s.price,
        },
      });
      continue;
    }

    await prisma.class.create({
      data: {
        slug: s.slug,
        title: s.title,
        description,
        dayType: s.dayType,
        startTime: s.time,
        endTime: s.time,
        trainerName: s.trainerName,
        dayOfWeek: DAY_TYPE_ORDER[s.dayType] ?? 0,
        capacity: 15,
        price: s.price,
      },
    });
  }

  const total = await prisma.class.count();
  console.log(`Seed complete. ${total} class sessions in the database.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
