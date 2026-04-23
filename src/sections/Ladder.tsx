import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { WordsPullUpMultiStyle } from '../components/WordsPullUpMultiStyle';

// ---- Competitors (fixed rows) ----
interface Competitor {
  rank: number;
  title: string;
  domain: string;
  letter: string;
}

const COMPETITORS: Competitor[] = [
  { rank: 1,  title: 'Ремонт квартир в Москве — цены от 3 900 ₽/м²', domain: 'remont-plus.ru',  letter: 'Р' },
  { rank: 3,  title: 'Ремонт под ключ — дизайн и смета бесплатно',   domain: 'kvartstroy.ru',   letter: 'К' },
  { rank: 5,  title: 'Дизайнерский ремонт квартир в Москве и МО',    domain: 'interior-msk.ru', letter: 'И' },
  { rank: 10, title: 'Ремонт новостроек — сметы онлайн за 3 минуты', domain: 'smeta24.ru',      letter: 'С' },
  { rank: 15, title: 'Мастер-Дом — ремонт квартир под ключ, 15 лет', domain: 'master-dom.ru',   letter: 'М' },
  { rank: 20, title: 'Ремонт квартир недорого — выгодные цены',      domain: 'remont-bz.ru',    letter: 'Р' },
  { rank: 28, title: 'Ремонт квартир — частные мастера и бригады',   domain: 'master-prime.ru', letter: 'М' },
];

const ROW_H = 56; // px per row
const ROW_GAP = 8;
const PITCH = ROW_H + ROW_GAP;

// Fixed Y position per competitor (by index)
const COMP_Y: Record<number, number> = {};
COMPETITORS.forEach((c, i) => (COMP_Y[c.rank] = i * PITCH));

const STATUS_FOR = (pos: number): string => {
  if (pos >= 24) return 'в конце выдачи · никто не видит';
  if (pos >= 18) return 'вторая страница · мимо клиентов';
  if (pos >= 12) return 'оптимизация запущена · прогресс пошёл';
  if (pos >= 7)  return 'первая страница · трафик растёт';
  if (pos >= 4)  return 'в топ-10 · клиенты находят';
  if (pos >= 2)  return 'в топ-5 · трафик льётся рекой';
  return 'TOP-1 · лидер выдачи';
};

// Your card's visual Y interpolated between COMP_Y[28] (bottom) and COMP_Y[1] (top)
// pos 28 -> COMP_Y[28] (360),  pos 1 -> COMP_Y[1] (0)
const yourYFromPos = (pos: number) => {
  const top = COMP_Y[1];
  const bot = COMP_Y[28];
  return bot - ((28 - pos) / 27) * (bot - top);
};

function formatNum(n: number): string {
  return Math.round(n).toLocaleString('ru-RU').replace(/,/g, ' ');
}

function Metric({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: 'yellow' | 'red' | 'white' }) {
  const color = accent === 'yellow' ? '#FFCC00' : accent === 'red' ? '#FC3F1D' : '#FFFFFF';
  return (
    <div className="bg-[#111929] ring-1 ring-white/5 rounded-2xl p-3 sm:p-4 flex flex-col gap-1">
      <div className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest">
        {label}
      </div>
      <div className="text-xl sm:text-2xl md:text-3xl font-normal" style={{ color }}>
        {value}
      </div>
      {sub && <div className="text-[10px] text-gray-500">{sub}</div>}
    </div>
  );
}

// Yandex palette
const Y_YELLOW = '#FFCC00';
const Y_RED = '#FC3F1D';
const Y_WHITE = '#FFFFFF';

function posColor(pos: number): string {
  if (pos >= 15) return Y_RED;
  if (pos <= 3)  return Y_YELLOW;
  return Y_WHITE;
}

export default function Ladder() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Clamped scroll progress — metrics reach peak at 0.7 and stay for last 30%
  const climbProg = useTransform(scrollYProgress, [0, 0.7], [0, 1]);

  // Position 28 → 1 linearly by climb progress (clamps at 1 for scroll > 0.7)
  const posMV = useTransform(climbProg, [0, 1], [28, 1]);
  const yourTopMV = useTransform(posMV, (p: number) => yourYFromPos(p));

  // Metrics
  const impressionsMV = useTransform(climbProg, (p) => 12 + Math.pow(p, 2.3) * (42786 - 12));
  const clicksMV      = useTransform(climbProg, (p) => Math.pow(p, 2.5) * 5428);
  const ctrMV         = useTransform(climbProg, (p) => Math.pow(p, 2) * 12.7);
  const leadsMV       = useTransform(climbProg, (p) => Math.pow(p, 2.8) * 247);
  const revenueMV     = useTransform(climbProg, (p) => 12 + Math.pow(p, 3) * (2100 - 12));

  const [pos, setPos] = useState(28);
  const [impressions, setImpressions] = useState(12);
  const [clicks, setClicks] = useState(0);
  const [ctr, setCtr] = useState(0);
  const [leads, setLeads] = useState(0);
  const [revenueK, setRevenueK] = useState(12);

  useMotionValueEvent(posMV,         'change', (v) => setPos(Math.round(v as number)));
  useMotionValueEvent(impressionsMV, 'change', (v) => setImpressions(v as number));
  useMotionValueEvent(clicksMV,      'change', (v) => setClicks(v as number));
  useMotionValueEvent(ctrMV,         'change', (v) => setCtr(v as number));
  useMotionValueEvent(leadsMV,       'change', (v) => setLeads(v as number));
  useMotionValueEvent(revenueMV,     'change', (v) => setRevenueK(v as number));

  const youAtTop = pos <= 1;
  const ladderHeight = COMPETITORS.length * PITCH;

  return (
    <section ref={ref} className="relative bg-[#0E1424]" style={{ height: '800vh' }}>


      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <div className="relative w-full px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto">
          {/* Title */}
          <div className="mb-4 md:mb-6 flex items-end justify-between gap-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal leading-[1.05] max-w-2xl">
              <WordsPullUpMultiStyle
                centered={false}
                segments={[
                  { text: 'От #28 до', className: 'text-primary' },
                  { text: 'TOP-1', className: 'font-serif italic text-primary' },
                  { text: '—', className: 'text-gray-500' },
                  { text: 'сайт растёт,', className: 'text-primary' },
                  { text: 'заявки летят.', className: 'font-serif italic text-primary' },
                ]}
              />
            </h2>
            <span className="hidden md:inline-block text-[10px] text-gray-500 uppercase tracking-widest shrink-0 pb-1">
              Скроллируйте ↓
            </span>
          </div>

          {/* Main 2-column grid: SERP | metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-4 md:gap-6 items-start">
            {/* LEFT: SERP ladder */}
            <div className="bg-[#121a2d] rounded-2xl md:rounded-3xl p-4 sm:p-5 relative">
              {/* Yandex-style search bar */}
              <div className="mb-4 flex items-center gap-3 bg-[#0E1424] border border-white/10 rounded-full pl-1 pr-4 py-1">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-base"
                  style={{ background: '#FD3D20', borderColor: '#FC3F1D' }}
                >
                  Я
                </span>
                <span className="text-sm sm:text-base text-white flex-1 truncate">
                  ремонт квартир
                </span>
                <span className="text-gray-500 text-lg leading-none shrink-0">×</span>
              </div>

              {/* SERP pill container — выдача внутри контура */}
              <div className="rounded-2xl border border-white/10 p-3 relative" style={{ background: 'rgba(255,255,255,0.01)' }}>
              <div className="relative" style={{ height: ladderHeight }}>
                {/* Competitor rows (static) */}
                {COMPETITORS.map((c) => {
                  const hide = c.rank === 1 && youAtTop;
                  return (
                    <div
                      key={c.rank}
                      className={`absolute left-0 right-0 flex items-center gap-3 rounded-xl px-3 py-2.5 bg-[#151c30] transition-opacity duration-300 ${
                        hide ? 'opacity-0' : 'opacity-100'
                      }`}
                      style={{
                        top: COMP_Y[c.rank],
                        height: ROW_H,
                      }}
                    >
                      <span className="text-xs w-10 shrink-0 text-gray-500">#{c.rank}</span>
                      <span className="w-7 h-7 rounded-md bg-white flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${c.domain}&sz=64`}
                          alt=""
                          width={20}
                          height={20}
                          className="w-5 h-5"
                          loading="lazy"
                          onError={(e) => {
                            const t = e.currentTarget as HTMLImageElement;
                            t.style.display = 'none';
                            const parent = t.parentElement as HTMLElement;
                            parent.textContent = c.letter;
                            parent.className = 'w-7 h-7 rounded-md bg-[#1e2844] text-[#9a9aaa] flex items-center justify-center text-xs font-bold shrink-0';
                          }}
                        />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-xs sm:text-sm truncate font-normal"
                          style={{ color: '#a8a89a' }}
                        >
                          {c.title}
                        </div>
                        <div className="text-[10px] text-gray-500 truncate">{c.domain}</div>
                      </div>
                      {c.rank === 1 && !youAtTop && (
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">top</span>
                      )}
                    </div>
                  );
                })}

                {/* YOUR CARD (absolutely positioned, smooth y via motion) */}
                <motion.div
                  style={{
                    top: yourTopMV,
                    height: ROW_H,
                    boxShadow: youAtTop ? `0 0 0 2px ${Y_YELLOW}` : '0 0 0 1.5px rgba(255,204,0,0.6)',
                  }}
                  className="absolute left-0 right-0 z-10 flex items-center gap-3 rounded-xl px-3 bg-[#172036]"
                >
                  <span className="text-xs w-10 shrink-0 font-bold" style={{ color: posColor(pos) }}>
                    #{pos}
                  </span>
                  <span className="w-7 h-7 rounded-md bg-white flex items-center justify-center shrink-0 overflow-hidden">
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" aria-hidden fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M3 12h18" />
                      <path d="M12 3c2.5 3 2.5 15 0 18" />
                      <path d="M12 3c-2.5 3-2.5 15 0 18" />
                    </svg>
                  </span>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-xs sm:text-sm truncate font-bold"
                      style={{ color: Y_WHITE }}
                    >
                      Ваш сайт — продвижение через поведенческий фактор
                    </div>
                    <div className="text-[10px] text-gray-500 truncate">
                      ваш-сайт.ru{' '}
                      <span className="ml-1" style={{ color: Y_YELLOW }}>
                        · Ваш сайт
                      </span>
                    </div>
                  </div>
                  {youAtTop && (
                    <span
                      className="text-lg shrink-0 pr-1 font-bold"
                      style={{ color: Y_YELLOW }}
                      aria-hidden
                    >
                      ✓
                    </span>
                  )}
                </motion.div>
              </div>
              </div>{/* end SERP pill container */}
            </div>

            {/* RIGHT: position + status + metrics */}
            <div className="flex flex-col gap-3 md:gap-4">
              <div>
                <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest mb-1.5">
                  Позиция в Яндексе
                </div>
                <div
                  className="text-6xl sm:text-7xl md:text-[5.5rem] font-medium leading-none tracking-tight transition-colors duration-200"
                  style={{ color: posColor(pos) }}
                >
                  #{pos}
                </div>
              </div>

              <div
                key={STATUS_FOR(pos)}
                className="text-base sm:text-lg md:text-xl leading-[1.2] font-normal"
                style={{ color: youAtTop ? Y_YELLOW : '#e8e8e8' }}
              >
                {STATUS_FOR(pos)}
              </div>

              <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest mt-2">
                Метрики за 30 дней
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Metric label="Показы" value={formatNum(impressions)} accent="white" />
                <Metric label="Клики"  value={formatNum(clicks)} accent="white" />
                <Metric label="CTR"    value={`${ctr.toFixed(1)}%`} accent="yellow" />
                <Metric label="Заявки" value={formatNum(leads)} accent="yellow" />
              </div>
              <div className="flex items-center justify-between rounded-xl px-3 py-2 text-xs" style={{ background: Y_YELLOW }}>
                <span className="uppercase tracking-widest text-[10px] text-black/70 font-semibold">Выручка</span>
                <span className="font-bold text-black text-sm">
                  {revenueK < 1000
                    ? `${formatNum(revenueK)}к ₽`
                    : `${(revenueK / 1000).toFixed(1).replace('.', ',')}M ₽`}
                </span>
              </div>

              {/* Repeat-result CTA — visible only at TOP-1 */}
              <a
                href="https://t.me/TopPfBot"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-between rounded-xl px-4 py-3 mt-1 transition-all duration-500 ${
                  youAtTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
                }`}
                style={{ background: '#FFFFFF', color: '#000' }}
              >
                <span className="text-sm font-semibold">Повторить результат</span>
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: '#000' }}
                >
                  <ArrowRight size={14} color="#FFCC00" strokeWidth={2.5} />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
