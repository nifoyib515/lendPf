import Hero from './sections/Hero';
import Ladder from './sections/Ladder';
import Engagement from './sections/Engagement';

export default function App() {
  return (
    <main className="text-primary min-h-screen">
      <Hero />
      <div className="hidden md:block">
        <Ladder />
        <Engagement />
      </div>
    </main>
  );
}
