// Shared section heading: small badge + title + subtitle, RTL centered.
type SectionHeadingProps = {
  badge: string;
  title: string;
  subtitle?: string;
};

export default function SectionHeading({
  badge,
  title,
  subtitle,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <span className="text-xs font-bold uppercase tracking-widest text-primary-500">
        {badge}
      </span>
      <h2 className="mt-2 text-3xl font-bold text-plum sm:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-base leading-7 text-plum/60">{subtitle}</p>
      )}
    </div>
  );
}
