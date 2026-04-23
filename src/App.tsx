import Hero from './sections/Hero';
import Ladder from './sections/Ladder';
import Engagement from './sections/Engagement';
import Footer from './sections/Footer';

export default function App() {
  return (
    <main className="text-primary min-h-screen">
      <Hero />
      <Ladder />
      <Engagement />
      <Footer />
    </main>
  );
}
