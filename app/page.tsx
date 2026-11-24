import Hero from "@/components/landing/Hero";
import Classes from "@/components/landing/Classes";
import Trainers from "@/components/landing/Trainers";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Classes />
      <Trainers trainers={[]} />
    </main>
  );
}
