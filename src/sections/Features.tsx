import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { WordsPullUpMultiStyle } from '../components/WordsPullUpMultiStyle';

const CARD_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4';
const ICON_1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85';
const ICON_2 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85';
const ICON_3 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85';

interface CardProps {
  index: number;
  children: React.ReactNode;
  className?: string;
}

function Card({ index, children, className = '' }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`relative rounded-2xl overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}

function ChecklistCard({
  index,
  icon,
  number,
  title,
  items,
}: {
  index: number;
  icon: string;
  number: string;
  title: string;
  items: { title: string; desc: string }[];
}) {
  return (
    <Card index={index} className="bg-[#212121] p-5 sm:p-6 flex flex-col">
      <div className="flex items-start justify-between mb-6 md:mb-8">
        <img
          src={icon}
          alt=""
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
        />
        <span className="text-[10px] sm:text-xs text-gray-500 font-light tracking-widest">
          {number}
        </span>
      </div>

      <h3
        className="text-lg sm:text-xl md:text-2xl font-normal mb-5 md:mb-6"
        style={{ color: '#E1E0CC' }}
      >
        {title}
      </h3>

      <ul className="flex-1 flex flex-col gap-3 sm:gap-3.5 mb-6">
        {items.map((it) => (
          <li key={it.title} className="flex items-start gap-2.5">
            <Check
              size={16}
              className="text-primary mt-0.5 flex-shrink-0"
              strokeWidth={2.2}
            />
            <div className="text-xs sm:text-sm">
              <div className="text-primary font-normal">{it.title}</div>
              <div className="text-gray-400 leading-snug">{it.desc}</div>
            </div>
          </li>
        ))}
      </ul>

      <a
        href="#"
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-primary hover:opacity-80 transition-opacity"
      >
        <span>Подробнее</span>
        <ArrowRight size={14} style={{ transform: 'rotate(-45deg)' }} />
      </a>
    </Card>
  );
}

export default function Features() {
  return (
    <section className="relative min-h-screen bg-black px-4 md:px-6 pb-12 md:pb-16">
      <div className="absolute inset-0 bg-noise opacity-[0.15] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="pt-20 md:pt-32 pb-10 md:pb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal max-w-4xl leading-[1.15]">
            <WordsPullUpMultiStyle
              centered={false}
              segments={[
                {
                  text: 'Studio-grade инструменты для роста в ТОП.',
                  className: 'text-primary',
                },
                {
                  text: 'Только белые методы. Только реальный рост.',
                  className: 'text-gray-500',
                },
              ]}
            />
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2 md:gap-1 lg:h-[480px]">
          {/* Card 1: Video */}
          <Card index={0} className="relative min-h-[320px] lg:min-h-0">
            <video
              src={CARD_VIDEO}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 z-10">
              <p
                className="text-base sm:text-lg md:text-xl font-normal"
                style={{ color: '#E1E0CC' }}
              >
                Ваш сайт в ТОП Яндекса.
              </p>
            </div>
          </Card>

          {/* Card 2: Поведенческий фактор */}
          <ChecklistCard
            index={1}
            icon={ICON_1}
            number="01"
            title="Поведенческий фактор."
            items={[
              {
                title: 'Реальные пользовательские сигналы',
                desc: 'Живой CTR, dwell time, depth scroll',
              },
              {
                title: 'Рост кликабельности в выдаче',
                desc: 'Оптимизация title/description под запросы',
              },
              {
                title: 'Снижение pogo-sticking',
                desc: 'Пользователь остаётся на сайте, а не возвращается',
              },
              {
                title: 'Без серых схем',
                desc: 'Только white-hat SEO и чистая работа',
              },
            ]}
          />

          {/* Card 3: Аналитика */}
          <ChecklistCard
            index={2}
            icon={ICON_2}
            number="02"
            title="Аналитика позиций."
            items={[
              {
                title: 'Еженедельные отчёты',
                desc: 'Позиции по всем ключам прозрачно и в динамике',
              },
              {
                title: 'Анализ конкурентов в нише',
                desc: 'Что делают лидеры и как их обгоняем',
              },
              {
                title: 'Метрики: клики, CTR, заявки',
                desc: 'Связываем SEO с реальной выручкой',
              },
            ]}
          />

          {/* Card 4: Рост заявок */}
          <ChecklistCard
            index={3}
            icon={ICON_3}
            number="03"
            title="Рост заявок."
            items={[
              {
                title: 'Заявки с органики',
                desc: 'Без рекламного бюджета, на постоянной основе',
              },
              {
                title: 'Оптимизация посадочных',
                desc: 'Выше конверсия из визита в заявку',
              },
              {
                title: 'Сопровождение до продажи',
                desc: 'Помогаем закрыть первые сделки',
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
