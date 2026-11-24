// Trainers section: photo cards with name, specialty, short bio.
// Renders real trainers passed in from the database via app/page.tsx.
import Image from "next/image";
import SectionHeading from "./SectionHeading";

export type LandingTrainer = {
  id: string;
  name: string;
  specialty?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
};

export default function Trainers({ trainers }: { trainers: LandingTrainer[] }) {
  return (
    <section
      id="trainers"
      className="bg-primary-50/50 py-20"
      aria-labelledby="trainers-title"
    >
      <div className="container-site">
        <SectionHeading
          badge="مربیان ما"
          title="با مربیان آوا آشنا شوید"
          subtitle="تیمی از مجرب‌ترین مربیان، کنار شما در هر مسیر."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trainers.length === 0 && (
            <p className="col-span-full text-center text-plum/60">
              هنوز مربی‌ای ثبت نشده است.
            </p>
          )}

          {trainers.map((t) => (
            <article
              key={t.id}
              className="overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-soft transition duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[3/4] w-full bg-primary-100">
                <Image
                  src={t.photoUrl || "/images/trainers/trainer-1.svg"}
                  alt={`عکس مربی ${t.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-5 text-center">
                <h3 className="text-lg font-bold text-plum">{t.name}</h3>
                {t.specialty && (
                  <p className="mt-1 text-sm font-medium text-primary-500">
                    {t.specialty}
                  </p>
                )}
                {t.bio && (
                  <p className="mt-2 text-sm leading-6 text-plum/60">{t.bio}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
