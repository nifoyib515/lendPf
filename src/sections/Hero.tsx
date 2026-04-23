import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SplineScene } from '../components/ui/splite';

const MARQUEE_ITEMS = [
  'БЫСТРЫЙ ТОП 1',
  'ЗА 10 МИНУТ',
  'БЕЗОПАСНО',
  'ЯНДЕКС',
  'БЕЗОПАСНО',
];

function MarqueeItem({ item }: { item: string }) {
  if (item === 'ЯНДЕКС') {
    return (
      <span className="px-4 md:px-8 text-black font-semibold">
        <span style={{ color: '#FC3F1D' }}>Я</span>НДЕКС
      </span>
    );
  }
  return <span className="px-4 md:px-8 text-black">{item}</span>;
}

function MarqueeFooter() {
  const loop = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden border-t border-black/20"
      style={{ background: '#FFCC00' }}
    >
      <div className="flex whitespace-nowrap animate-marquee py-2 md:py-3">
        {loop.map((item, i) => (
          <span
            key={i}
            className="flex items-center shrink-0 text-sm sm:text-lg md:text-2xl lg:text-3xl font-medium tracking-tight"
          >
            <MarqueeItem item={item} />
            <span className="text-black/30 text-lg md:text-3xl font-thin">|</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function HeroTopBar() {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 px-6 sm:px-10 md:px-16 py-5 sm:py-6 md:py-8 pointer-events-none">
      <div className="text-center text-sm sm:text-base md:text-lg lg:text-xl text-white/85 uppercase tracking-[0.22em] leading-snug font-medium">
        Продвижение ключевых слов накруткой поведенческого фактора
      </div>
    </div>
  );
}

function Preloader({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-[60] bg-[#0E1424] flex items-center justify-center"
        >
          <div
            className="w-14 h-14 rounded-full border-[3px] border-white/10 animate-spin"
            style={{ borderTopColor: '#FFCC00' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Hero() {
  const [sceneLoaded, setSceneLoaded] = useState(false);

  return (
    <section className="h-screen w-full p-3 sm:p-4 md:p-6">
      <div className="relative w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden bg-[#0E1424]">
        {/* 3D robot background (Spline) */}
        <div className="absolute inset-0 z-0">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
            onLoad={() => setSceneLoaded(true)}
          />
        </div>

        {/* Noise overlay */}
        <div className="absolute inset-0 noise-overlay opacity-[0.3] mix-blend-overlay pointer-events-none z-[1]" />

        {/* Gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 pointer-events-none z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none z-[1]" />

        {/* Top bar: tagline + scroll indicator */}
        <HeroTopBar />

        {/* Running marquee footer */}
        <MarqueeFooter />

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-3 sm:px-6 md:px-8 pb-14 sm:pb-16 md:pb-20">
          <div className="grid grid-cols-12 gap-2 sm:gap-3 md:gap-6 items-end">
            {/* Heading: БЕСПЛАТНЫЙ / ТЕСТ */}
            <div className="col-span-12 md:col-span-8">
              <h1
                className="font-medium leading-[0.88] tracking-[-0.06em]"
                style={{ color: '#FFFFFF' }}
              >
                <motion.span
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-[10vw] sm:text-[8.5vw] md:text-[7.5vw] lg:text-[7vw] xl:text-[6.5vw]"
                >
                  БЕСПЛАТНЫЙ
                </motion.span>
                <motion.span
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-[10vw] sm:text-[8.5vw] md:text-[7.5vw] lg:text-[7vw] xl:text-[6.5vw] font-serif italic"
                  style={{ color: '#FFCC00' }}
                >
                  ТЕСТ
                </motion.span>
              </h1>
            </div>

            {/* Right column: description + CTA */}
            <div className="col-span-12 md:col-span-4 pb-1 md:pb-6 flex flex-col gap-2.5 md:gap-6">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.7,
                  delay: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-white/80 text-[11px] sm:text-sm md:text-base hidden sm:block"
                style={{ lineHeight: 1.3 }}
              >
                Выводим ваши ключевые запросы в ТОП{' '}
                <span style={{ color: '#FFCC00' }} className="font-semibold">
                  <span style={{ color: '#FC3F1D' }}>Я</span>ндекса
                </span>{' '}
                с минимальными затратами. Обученная нейросеть накручивает
                поведенческий фактор за вас — ботовые клики, безопасно, личная
                панель. Первые результаты — уже через 10&nbsp;минут.
              </motion.p>

              {/* Mobile-only shorter version */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-white/80 text-[11px] leading-snug sm:hidden"
              >
                Ключевые запросы в ТОП{' '}
                <span style={{ color: '#FFCC00' }} className="font-semibold">
                  <span style={{ color: '#FC3F1D' }}>Я</span>ндекса
                </span>{' '}
                с минимальной затратой. Нейросеть крутит ПФ за вас — первый
                результат через 10&nbsp;минут.
              </motion.p>

              <motion.a
                href="https://t.me/TopPfBot"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.7,
                  delay: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group inline-flex items-center justify-between gap-2 hover:gap-3 transition-[gap] rounded-full pl-4 sm:pl-6 pr-1 py-1 w-fit text-xs sm:text-base text-black font-semibold"
                style={{ background: '#FFCC00' }}
              >
                <span>Получить 100 ботов</span>
                <span className="bg-black rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                  <ArrowRight size={14} color="#FFCC00" />
                </span>
              </motion.a>
            </div>
          </div>
        </div>

        {/* Preloader overlay */}
        <Preloader visible={!sceneLoaded} />
      </div>
    </section>
  );
}
