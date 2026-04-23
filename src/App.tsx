import Hero from './sections/Hero';
import Ladder from './sections/Ladder';
import Engagement from './sections/Engagement';

export default function App() {
  return (
    <main className="bg-[#0E1424] text-primary min-h-screen">
      <Hero />
      <Ladder />
      <Engagement />
    </main>
  );
}
