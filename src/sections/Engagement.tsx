import {
  useScroll,
  useTransform,
  useMotionValueEvent,
  MotionValue,
} from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ArrowRight, Users } from 'lucide-react';
import { WordsPullUpMultiStyle } from '../components/WordsPullUpMultiStyle';

// ---- Notifications (arrive on scroll) ----
interface Notif {
  from: string;
  text: string;
  time: string;
  letter: string;
  tint: string;
  threshold: number;
}

const NOTIFS: Notif[] = [
  { from: 'Заявка #241', text: 'Пришла новая заявка с сайта', time: '10:12', letter: '✦', tint: '#FFCC00', threshold: 0.12 },
  { from: 'Заявка #242', text: 'Пришла новая заявка с сайта', time: '10:24', letter: '✦', tint: '#FFCC00', threshold: 0.26 },
  { from: 'Заявка #243', text: 'Пришла новая заявка с сайта', time: '10:37', letter: '✦', tint: '#FFCC00', threshold: 0.40 },
  { from: 'Заявка #244', text: 'Пришла новая заявка с сайта', time: '10:51', letter: '✦', tint: '#FFCC00', threshold: 0.54 },
  { from: 'Заявка #245', text: 'Пришла новая заявка с сайта', time: '11:15', letter: '✦', tint: '#FFCC00', threshold: 0.68 },
  { from: 'Заявка #246', text: 'Пришла новая заявка с сайта', time: '11:38', letter: '✦', tint: '#FFCC00', threshold: 0.82 },
];

const NOTIF_H = 64; // px — natural height of each notification
const NOTIF_GAP = 6; // px — margin-top between notifications

// Bypass framer's useTransform for this (it doesn't clamp correctly in this
// version past the input range). Subscribe to progress and drive a boolean
// "visible" state — CSS transitions handle the smooth grow-in.
function NotifRow({ n, progress }: { n: Notif; progress: MotionValue<number> }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let raf: number;
    const check = () => {
      const v = progress.get() >= n.threshold;
      if (v !== visible) setVisible(v);
    };
    const onChange = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(check); };
    check();
    const unsub = progress.on('change', onChange);
    return () => { unsub(); cancelAnimationFrame(raf); };
  }, [progress, n.threshold, visible]);
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        maxHeight: visible ? `${NOTIF_H}px` : '0px',
        marginTop: visible ? `${NOTIF_GAP}px` : '0px',
        overflow: 'hidden',
        transition:
          'opacity 300ms ease-out, max-height 300ms ease-out, margin-top 300ms ease-out',
      }}
      className="bg-[#0A1228]/65 backdrop-blur-xl rounded-xl ring-1 ring-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]"
    >
      <div className="p-2.5 flex gap-2 items-start" style={{ height: `${NOTIF_H}px` }}>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-bold shrink-0"
          style={{
            background: n.tint,
            color: '#000',
          }}
        >
          {n.letter}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-bold truncate" style={{ color: '#FFFFFF' }}>{n.from}</span>
            <span className="text-gray-500 shrink-0">{n.time}</span>
          </div>
          <div className="text-[10.5px] text-gray-300 leading-snug line-clamp-2">{n.text}</div>
        </div>
      </div>
    </div>
  );
}

// ---- Chart drawing helpers ----
// A smooth growing curve: y = startVal + (endVal - startVal) * easeOut(x * progress)
function makeLinePath(
  w: number,
  h: number,
  startVal: number,
  endVal: number,
  maxY: number, // absolute max used to normalize (0 at bottom, 1 at top)
  progress: number,
  steps = 40,
  curve = 2.0, // exponent to bend the growth
): string {
  if (progress <= 0) {
    const y = h - 6 - (startVal / maxY) * (h - 16);
    return `M0,${y} L${w},${y}`;
  }
  const px: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Only render points up to t <= progress; beyond, pin to current position
    const tt = Math.min(t, progress) / Math.max(progress, 0.001);
    const val = startVal + (endVal - startVal) * Math.pow(tt, curve);
    const x = t * w;
    const y = h - 6 - (val / maxY) * (h - 16);
    px.push(`${x},${y}`);
  }
  return 'M' + px.join(' L');
}

// ---- Main chart (big, CTR growth) ----
function MainChart({
  progress,
  ctrNow,
}: {
  progress: MotionValue<number>;
  ctrNow: number;
}) {
  const W = 640;
  const H = 180;
  const [prog, setProg] = useState(0);
  useMotionValueEvent(progress, 'change', (v) => setProg(v as number));
  const path = makeLinePath(W, H, 0.2, 12.6, 14, prog, 48, 2.2);
  const fillPts: string[] = [];
  for (let i = 0; i <= 48; i++) {
    const t = i / 48;
    const tt = Math.min(t, prog) / Math.max(prog, 0.001);
    const val = 0.2 + (12.6 - 0.2) * Math.pow(tt, 2.2);
    const x = t * W;
    const y = H - 6 - (val / 14) * (H - 16);
    fillPts.push(`${x},${y}`);
  }
  return (
    <div className="bg-[#0A1228]/60 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 sm:p-5 ring-1 ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <Users size={12} strokeWidth={2.2} className="text-[#FFCC00]" />
            Вовлечённость
          </div>
          <div className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight" style={{ color: '#FFCC00' }}>
            {ctrNow.toFixed(1)}%
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">рост</div>
          <div className="text-sm sm:text-base font-semibold" style={{ color: '#FC3F1D' }}>
            ×{(ctrNow / 0.2).toFixed(ctrNow > 1 ? 0 : 1)}
          </div>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-28 sm:h-32 md:h-36">
        <defs>
          <linearGradient id="eng-glow" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#FFCC00" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FFCC00" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1="0"
            x2={W}
            y1={H - 6 - f * (H - 16)}
            y2={H - 6 - f * (H - 16)}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        ))}
        <polygon
          fill="url(#eng-glow)"
          points={`0,${H} ${fillPts.join(' ')} ${W},${H}`}
        />
        <path
          d={path}
          fill="none"
          stroke="#FFCC00"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ---- Mini stat card with sparkline ----
function MiniStat({
  label,
  progress,
  startVal,
  endVal,
  formatter,
  maxY,
  curve = 2.0,
}: {
  label: string;
  progress: MotionValue<number>;
  startVal: number;
  endVal: number;
  formatter: (v: number) => string;
  maxY: number;
  curve?: number;
}) {
  const W = 200;
  const H = 52;
  const [prog, setProg] = useState(0);
  const val = useTransform(progress, (p) => startVal + (endVal - startVal) * Math.pow(p, curve));
  const [valNow, setValNow] = useState(startVal);
  useMotionValueEvent(progress, 'change', (v) => setProg(v as number));
  useMotionValueEvent(val, 'change', (v) => setValNow(v as number));
  const path = makeLinePath(W, H, startVal, endVal, maxY, prog, 24, curve);
  return (
    <div className="bg-[#0A1228]/60 backdrop-blur-xl ring-1 ring-white/10 rounded-2xl p-3 sm:p-4 flex flex-col gap-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest">
        {label}
      </div>
      <div className="text-xl sm:text-2xl md:text-[1.75rem] font-normal leading-none" style={{ color: '#FFFFFF' }}>
        {formatter(valNow)}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-10 sm:h-12">
        <path
          d={path}
          fill="none"
          stroke="#FFCC00"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

export default function Engagement() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Main chart live value (CTR)
  const ctrMV = useTransform(scrollYProgress, (p) => 0.2 + (12.6 - 0.2) * Math.pow(p, 2.2));
  const [ctr, setCtr] = useState(0.2);
  const [prog, setProg] = useState(0);
  useMotionValueEvent(ctrMV, 'change', (v) => setCtr(v as number));
  useMotionValueEvent(scrollYProgress, 'change', (v) => setProg(v as number));

  const notifCount = NOTIFS.filter((n) => prog >= n.threshold - 0.015).length;

  return (
    <section ref={ref} className="relative" style={{ height: '400vh' }}>


      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <div className="relative w-full px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto">
          {/* Title — aligned with the right (charts) column, starts from phone's right edge */}
          <div className="mb-5 md:mb-8 grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-6 md:gap-8 items-end">
            <div className="hidden lg:block" />
            <div className="flex items-end justify-between gap-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal leading-[1.05] max-w-2xl">
                <WordsPullUpMultiStyle
                  centered={false}
                  segments={[
                    { text: 'Поведенческий фактор', className: 'text-primary' },
                    { text: '— ', className: 'text-gray-500' },
                    { text: 'вовлечённость', className: 'font-serif italic text-primary' },
                    { text: 'растёт,', className: 'text-primary' },
                    { text: 'заявки', className: 'font-serif italic text-primary' },
                    { text: 'тоже.', className: 'text-primary' },
                  ]}
                />
              </h2>
            </div>
          </div>

          {/* 2-col grid: Phone | Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-6 md:gap-8 items-start">
            {/* LEFT: Phone with notifications */}
            <div className="flex flex-col items-center">
              <div className="relative rounded-[2.2rem] p-2 bg-[#172036] ring-1 ring-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
                <div className="relative w-[260px] sm:w-[280px] h-[500px] sm:h-[540px] rounded-[1.8rem] bg-[#0E1424] overflow-hidden">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-10" />
                  <div className="relative pt-8 px-4 flex items-center justify-between text-[10px] text-primary/80">
                    <span>9:41</span>
                    <span>••</span>
                  </div>
                  <div className="px-2.5 pt-3 flex flex-col">
                    <div className="flex items-center justify-between px-1 text-[10px] text-gray-500 mb-0.5">
                      <span>Уведомления</span>
                      {notifCount > 0 ? (
                        <span className="font-bold" style={{ color: '#FC3F1D' }}>
                          +{notifCount} новых
                        </span>
                      ) : (
                        <span className="text-gray-600">0 новых</span>
                      )}
                    </div>

                    {notifCount === 0 && (
                      <div className="flex flex-col items-center justify-center text-center py-20 gap-2">
                        <div className="w-9 h-9 rounded-full bg-[#172036] flex items-center justify-center text-gray-600">
                          ○
                        </div>
                        <div className="text-[10px] text-gray-500">Нет новых уведомлений</div>
                      </div>
                    )}

                    {NOTIFS.map((n, i) => (
                      <NotifRow key={i} n={n} progress={scrollYProgress} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Dashboard of engagement charts */}
            <div className="flex flex-col gap-3 md:gap-4">
              <MainChart progress={scrollYProgress} ctrNow={ctr} />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
                <MiniStat
                  label="Время на сайте"
                  progress={scrollYProgress}
                  startVal={42}
                  endVal={268}
                  maxY={300}
                  curve={2.3}
                  formatter={formatTime}
                />
                <MiniStat
                  label="Глубина прокрутки"
                  progress={scrollYProgress}
                  startVal={18}
                  endVal={87}
                  maxY={100}
                  curve={1.8}
                  formatter={(v) => `${Math.round(v)}%`}
                />
                <MiniStat
                  label="Страниц за визит"
                  progress={scrollYProgress}
                  startVal={1.2}
                  endVal={4.6}
                  maxY={5}
                  curve={1.9}
                  formatter={(v) => v.toFixed(1)}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 justify-between">
                <div className="text-[11px] sm:text-xs text-gray-500 leading-relaxed max-w-xl flex-1">
                  Реальные пользовательские сигналы — CTR, dwell time, depth scroll — единственное,
                  что Яндекс учитывает при ранжировании. Растёт вовлечённость — растёт позиция, и
                  заявки идут сами.
                </div>
                <div className="shrink-0 flex flex-col items-start self-start sm:self-auto gap-1.5">
                  <a
                    href="https://t.me/TopPfBot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full pl-4 pr-1 py-1 text-sm sm:text-base font-semibold text-black hover:opacity-95 transition-opacity"
                    style={{ background: '#FFCC00' }}
                  >
                    <span>Протестировать 100 ботов бесплатно</span>
                    <span className="bg-black rounded-full w-8 h-8 flex items-center justify-center transition-transform group-hover:translate-x-0.5 shrink-0">
                      <ArrowRight size={14} color="#FFCC00" />
                    </span>
                  </a>
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 pl-1">
                    * платите только за результат
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
