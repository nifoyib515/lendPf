# ТЗ: Скроллителлинг-блок «От #28 до TOP-1»

Создай одну sticky-секцию-параллакс на React + Vite + TypeScript + Tailwind CSS 3 + framer-motion. Блок — часть тёмного cinematic-лендинга про SEO/Яндекс (warm cream палитра, Almarai для текста, Instrument Serif italic для акцентов). Весь блок привязан к одному `scrollYProgress` — при прокрутке синхронно двигаются позиция сайта, карточка в выдаче, уведомления на телефоне и цифры метрик.

---

## ТЕХ-СТЕК И ЗАВИСИМОСТИ

- React 18 + Vite + TypeScript
- Tailwind CSS 3 (с `colors.primary: '#DEDBC8'` и `fontFamily.serif: ['"Instrument Serif"', 'serif']`)
- framer-motion (`motion`, `useScroll`, `useTransform`, `useMotionValueEvent`, `MotionValue`)
- Google Fonts: Almarai (300/400/700/800) — global; Instrument Serif italic — для курсивных акцентов
- Иконки — lucide-react (Check, ArrowRight), но в этом блоке не используются

## ПАЛИТРА (точные значения)

- Фон секции: `#000000`
- Карточка выдачи Яндекса: `#101010`
- Строки конкурентов: `#181818`
- Строка «Ваш сайт»: `#1a1a1a` с `ring-1 ring-[#DEDBC8]/80` (cream-обводка)
- Карточки метрик: `#161616`
- Корпус телефона: `#1a1a1a` с `ring-1 ring-white/5`, экран `#0b0b0b`
- Cream-подсветка primary: `#DEDBC8`
- Основной текст: `#E1E0CC` (через inline style)
- Муттированный текст: `#a8a89a` (title конкурента)
- Серый / плейсхолдеры: `text-gray-400`, `text-gray-500`, `text-gray-600`
- Аватарки-тинты в уведомлениях (bg = `${tint}20`, fg = `tint`):
  - WhatsApp — `#25d366`
  - Telegram — `#29a9ea`
  - Форма/Заявка — `#DEDBC8` (bg заливка, иконка чёрная)

## РАЗМЕРЫ И ПРОПОРЦИИ

- Секция: `height: 550vh` (5.5 экрана скролла)
- Внутри — sticky-stage: `sticky top-0 h-screen overflow-hidden flex flex-col justify-center`
- Контейнер: `max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12`
- Сетка основного контента: `grid grid-cols-1 lg:grid-cols-[1.1fr_0.8fr_1fr] gap-4 md:gap-5 items-start`
  - Колонка 1 — выдача Яндекса
  - Колонка 2 — телефон клиента
  - Колонка 3 — позиция + статус + метрики
- Высота одной строки выдачи: `ROW_H = 56px`, `ROW_GAP = 8px`, `PITCH = 64px`
- Телефон: `w-[240px] sm:w-[260px]`, `h-[460px] sm:h-[500px]`, `rounded-[1.8rem]`, корпус `rounded-[2.2rem] p-2`
- Border-radius карточек: `rounded-2xl md:rounded-3xl` для крупных, `rounded-xl` для строк и уведомлений

## ДАННЫЕ

### Конкуренты (7 штук, фиксированные ранги)

```ts
const COMPETITORS = [
  { rank: 1,  title: 'Ремонт квартир в Москве — цены от 3 900 ₽/м²', domain: 'remont-plus.ru',  letter: 'Р' },
  { rank: 3,  title: 'Ремонт под ключ — дизайн и смета бесплатно',   domain: 'kvartstroy.ru',   letter: 'К' },
  { rank: 5,  title: 'Дизайнерский ремонт квартир в Москве и МО',    domain: 'interior-msk.ru', letter: 'И' },
  { rank: 10, title: 'Ремонт новостроек — сметы онлайн за 3 минуты', domain: 'smeta24.ru',      letter: 'С' },
  { rank: 15, title: 'Мастер-Дом — ремонт квартир под ключ, 15 лет', domain: 'master-dom.ru',   letter: 'М' },
  { rank: 20, title: 'Ремонт квартир недорого — выгодные цены',      domain: 'remont-bz.ru',    letter: 'Р' },
  { rank: 28, title: 'Ремонт квартир — частные мастера и бригады',   domain: 'master-prime.ru', letter: 'М' },
];
```

Каждый конкурент — `position: absolute` на своём Y (индекс × PITCH). Первый конкурент (#1) скрывается (`opacity-0 transition-opacity duration-300`), когда `youAtTop === true` (pos ≤ 1).

### Статусы по позиции

```ts
const STATUS_FOR = (pos: number): string => {
  if (pos >= 24) return 'в конце выдачи · никто не видит';
  if (pos >= 18) return 'вторая страница · мимо клиентов';
  if (pos >= 12) return 'оптимизация запущена · прогресс пошёл';
  if (pos >= 7)  return 'первая страница · трафик растёт';
  if (pos >= 4)  return 'в топ-10 · клиенты находят';
  if (pos >= 2)  return 'в топ-5 · трафик льётся рекой';
  return 'TOP-1 · лидер выдачи';
};
```

### Уведомления (5 штук, с порогами по scrollYProgress)

```ts
const NOTIFS = [
  { from: 'Алексей',      text: 'Здравствуйте! Нашёл вас в Яндексе, подскажите цену ремонта однушки?', time: '10:24', letter: 'W', tint: '#25d366', threshold: 0.34 },
  { from: 'Марина',       text: 'Можно смету на двушку 54 м² в Химках?',                                time: '10:37', letter: 'T', tint: '#29a9ea', threshold: 0.48 },
  { from: 'Заявка #247',  text: 'Новый клиент с органики · Иван · +7 (903) ***-**-12',                  time: '10:41', letter: '✦', tint: '#DEDBC8', threshold: 0.62 },
  { from: 'Екатерина',    text: 'Добрый день! Свободны ли вы на следующую неделю для замера?',          time: '11:15', letter: 'W', tint: '#25d366', threshold: 0.76 },
  { from: 'Дмитрий',      text: 'Увидел ваш сайт в топе Яндекса, хочу обсудить проект',                 time: '11:29', letter: 'T', tint: '#29a9ea', threshold: 0.88 },
];
```

## АНИМАЦИИ (всё через один useScroll)

```ts
const ref = useRef<HTMLDivElement>(null);
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ['start start', 'end end'],
});
```

### 1. Позиция сайта `#N`: 28 → 1

```ts
const posMV = useTransform(scrollYProgress, [0, 1], [28, 1]);
// Подписка через useMotionValueEvent: округлить до int, хранить в state для текстов
```

### 2. Y-координата карточки «Ваш сайт» (absolute top)

Интерполяция между Y первого и последнего конкурента:

```ts
const yourYFromPos = (pos: number) => {
  const top = COMP_Y[1];   // 0
  const bot = COMP_Y[28];  // (COMPETITORS.length - 1) * PITCH = 384
  return bot - ((28 - pos) / 27) * (bot - top);
};
const yourTopMV = useTransform(posMV, yourYFromPos);
// style={{ top: yourTopMV, height: ROW_H }}
```

Карточка «Ваш сайт» рендерится **один раз**, поверх всей выдачи (`z-10`), абсолютно спозиционированная. НИКАКОЙ `layout`-анимации — это было багом. Движение плавное за счёт `useTransform` напрямую на `top`.

### 3. Метрики (экспоненциальные по прогрессу)

```ts
const impressionsMV = useTransform(scrollYProgress, (p) => 12 + Math.pow(p, 2.3) * (42786 - 12));
const clicksMV      = useTransform(scrollYProgress, (p) => Math.pow(p, 2.5) * 5428);
const ctrMV         = useTransform(scrollYProgress, (p) => Math.pow(p, 2)   * 12.7);
const leadsMV       = useTransform(scrollYProgress, (p) => Math.pow(p, 2.8) * 247);
const revenueMV     = useTransform(scrollYProgress, (p) => 12 + Math.pow(p, 3) * (2100 - 12));
```

Форматирование: `Math.round(n).toLocaleString('ru-RU')` с заменой запятой на пробел. CTR — `.toFixed(1) + '%'`. Выручка — `Nк ₽` до 1000, потом `N,NM ₽` (запятая как десятичный разделитель).

### 4. Уведомления на телефоне (slide-in по scroll-порогам)

Каждое уведомление — отдельный `motion.div`, которому через `useTransform` привязан opacity и translateX:

```tsx
function NotifRow({ n, progress }) {
  const opacity = useTransform(progress, [n.threshold - 0.015, n.threshold + 0.035], [0, 1]);
  const x       = useTransform(progress, [n.threshold - 0.015, n.threshold + 0.035], [60, 0]);
  return <motion.div style={{ opacity, x }}>...</motion.div>;
}
```

Окно появления — `~5% прогресса` вокруг порога. Уведомление въезжает справа (x: 60 → 0), проявляется (opacity 0 → 1), остаётся на экране. Двигаешь скролл обратно — уведомление исчезает (реверсивно).

### 5. Счётчик уведомлений `+N новых`

Считать количество уведомлений, у которых `prog >= threshold - 0.015`, через state (`useMotionValueEvent(scrollYProgress, ...)`). Если 0 — показывать плейсхолдер «Нет новых уведомлений» по центру экрана телефона.

## СТРУКТУРА JSX

```
<section ref={ref} style={{ height: '550vh' }}>
  <div className="bg-noise opacity-[0.08] absolute inset-0 pointer-events-none" />
  <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
    <div className="relative w-full px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto">
      
      {/* ЗАГОЛОВОК (сверху) */}
      <div className="mb-4 md:mb-6 flex items-end justify-between gap-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-[1.05] max-w-2xl">
          <WordsPullUpMultiStyle segments={[
            { text: 'От #28 до',    className: 'text-primary' },
            { text: 'TOP-1',        className: 'font-serif italic text-primary' },
            { text: '—',            className: 'text-gray-500' },
            { text: 'сайт растёт,', className: 'text-primary' },
            { text: 'заявки летят.', className: 'font-serif italic text-primary' },
          ]} />
        </h2>
        <span className="hidden md:inline-block text-[10px] text-gray-500 uppercase tracking-widest shrink-0 pb-1">
          Скроллируйте ↓
        </span>
      </div>

      {/* 3-КОЛОНОЧНАЯ СЕТКА */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.8fr_1fr] gap-4 md:gap-5 items-start">

        {/* КОЛОНКА 1: ВЫДАЧА ЯНДЕКСА */}
        <div className="bg-[#101010] rounded-2xl md:rounded-3xl p-4 sm:p-5">
          <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">Выдача Яндекса</div>
          <div className="relative" style={{ height: COMPETITORS.length * PITCH }}>
            {COMPETITORS.map(c => (
              <div
                key={c.rank}
                style={{ top: COMP_Y[c.rank], height: ROW_H }}
                className={`absolute left-0 right-0 flex items-center gap-3 rounded-xl px-3 py-2.5 bg-[#181818] transition-opacity duration-300 ${c.rank === 1 && youAtTop ? 'opacity-0' : ''}`}
              >
                <span className="text-xs w-10 text-gray-500">#{c.rank}</span>
                <span className="w-7 h-7 rounded-md bg-[#2a2a2a] text-[#9a9a8a] text-xs font-bold flex items-center justify-center">{c.letter}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm truncate" style={{ color: '#a8a89a' }}>{c.title}</div>
                  <div className="text-[10px] text-gray-500 truncate">{c.domain}</div>
                </div>
                {c.rank === 1 && !youAtTop && (
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">top</span>
                )}
              </div>
            ))}

            {/* ВАША КАРТОЧКА — absolute поверх */}
            <motion.div
              style={{ top: yourTopMV, height: ROW_H }}
              className="absolute left-0 right-0 z-10 flex items-center gap-3 rounded-xl px-3 bg-[#1a1a1a] ring-1 ring-[#DEDBC8]/80"
            >
              <span className="text-xs w-10 text-primary font-bold">#{pos}</span>
              <span className="w-7 h-7 rounded-md text-xs font-bold flex items-center justify-center" style={{ background: '#DEDBC8', color: '#000' }}>В</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm truncate font-bold" style={{ color: '#E1E0CC' }}>
                  Ваш сайт — продвижение через поведенческий фактор
                </div>
                <div className="text-[10px] text-gray-500 truncate">
                  ваш-сайт.ru <span className="text-primary ml-1">· Ваш сайт</span>
                </div>
              </div>
              {youAtTop && <span className="text-primary text-lg shrink-0 pr-1">✓</span>}
            </motion.div>
          </div>
        </div>

        {/* КОЛОНКА 2: ТЕЛЕФОН */}
        <div className="flex flex-col items-center">
          <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Телефон клиента</div>
          <div className="relative rounded-[2.2rem] p-2 bg-[#1a1a1a] ring-1 ring-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
            <div className="relative w-[240px] sm:w-[260px] h-[460px] sm:h-[500px] rounded-[1.8rem] bg-[#0b0b0b] overflow-hidden">
              {/* Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-10" />
              {/* Status bar */}
              <div className="relative pt-8 px-4 flex items-center justify-between text-[10px] text-primary/80">
                <span>9:41</span><span>••</span>
              </div>
              {/* Содержимое */}
              <div className="px-2.5 pt-3 flex flex-col gap-1.5">
                <div className="flex items-center justify-between px-1 text-[10px] text-gray-500">
                  <span>Уведомления</span>
                  {notifCount > 0 ? <span className="text-primary">+{notifCount} новых</span> : <span className="text-gray-600">0 новых</span>}
                </div>
                {notifCount === 0 && <EmptyPlaceholder />}
                {NOTIFS.map((n, i) => <NotifRow key={i} n={n} progress={scrollYProgress} />)}
              </div>
            </div>
          </div>
        </div>

        {/* КОЛОНКА 3: ПОЗИЦИЯ + СТАТУС + МЕТРИКИ */}
        <div className="flex flex-col gap-3 md:gap-4">
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5">Позиция в Яндексе</div>
            <div className="text-6xl sm:text-7xl md:text-[5.5rem] font-medium leading-none tracking-tight" style={{ color: '#E1E0CC' }}>
              #{pos}
            </div>
          </div>
          <div className="text-base sm:text-lg md:text-xl leading-[1.2]" style={{ color: youAtTop ? '#DEDBC8' : '#c8c8bb' }}>
            {STATUS_FOR(pos)}
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">Метрики за 30 дней</div>
          <div className="grid grid-cols-2 gap-2">
            <Metric label="Показы" value={formatNum(impressions)} />
            <Metric label="Клики"  value={formatNum(clicks)} />
            <Metric label="CTR"    value={`${ctr.toFixed(1)}%`} />
            <Metric label="Заявки" value={formatNum(leads)} />
          </div>
          <div className="flex items-center justify-between bg-[#161616] rounded-xl px-3 py-2 text-xs">
            <span className="text-gray-500 uppercase tracking-widest text-[10px]">Выручка</span>
            <span style={{ color: '#E1E0CC' }}>{revenueFormatted}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

### Компонент Metric

```tsx
function Metric({ label, value }) {
  return (
    <div className="bg-[#161616] rounded-2xl p-3 sm:p-4 flex flex-col gap-1">
      <div className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest">{label}</div>
      <div className="text-xl sm:text-2xl md:text-3xl" style={{ color: '#E1E0CC' }}>{value}</div>
    </div>
  );
}
```

### Компонент NotifRow

```tsx
function NotifRow({ n, progress }) {
  const opacity = useTransform(progress, [n.threshold - 0.015, n.threshold + 0.035], [0, 1]);
  const x       = useTransform(progress, [n.threshold - 0.015, n.threshold + 0.035], [60, 0]);
  return (
    <motion.div style={{ opacity, x }} className="bg-[#1a1a1a] rounded-xl p-2.5 flex gap-2">
      <div className="w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0"
           style={{
             background: n.tint === '#DEDBC8' ? '#DEDBC8' : `${n.tint}20`,
             color: n.tint === '#DEDBC8' ? '#000' : n.tint,
           }}>
        {n.letter}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-primary font-bold truncate">{n.from}</span>
          <span className="text-gray-500 shrink-0">{n.time}</span>
        </div>
        <div className="text-[10px] text-gray-400 leading-snug line-clamp-2">{n.text}</div>
      </div>
    </motion.div>
  );
}
```

## ТИПОГРАФИКА

- Глобальный шрифт: Almarai (loaded via Google Fonts)
- Курсив serif-акценты: Instrument Serif italic (только курсив) — используется в заголовке для слов `TOP-1` и `заявки летят.`
- Размеры:
  - Заголовок `text-xl sm:text-2xl md:text-3xl lg:text-4xl`, `leading-[1.05]`, `max-w-2xl`
  - Позиция `#N` — `text-6xl sm:text-7xl md:text-[5.5rem]`, `font-medium`, `leading-none`, `tracking-tight`
  - Статус — `text-base sm:text-lg md:text-xl`, `leading-[1.2]`
  - Метрики значение — `text-xl sm:text-2xl md:text-3xl`
  - Лейблы — `text-[10px]`, `uppercase`, `tracking-widest`, `text-gray-500`

## РЕСПОНСИВ

- На `lg` (≥1024px): 3 колонки `[1.1fr_0.8fr_1fr]`
- На меньших экранах: всё стэкается в одну колонку (`grid-cols-1`). Телефон центрируется, метрики в 2 колонки
- Тексты масштабируются через Tailwind prefixes `sm:`/`md:`/`lg:`
- Высоту `550vh` можно уменьшить до `400vh` на мобилке если надо (или оставить)

## АНИМАЦИЯ ЗАГОЛОВКА (WordsPullUpMultiStyle)

Заголовок въезжает при появлении секции. Это тот же компонент, что используется во всём лендинге:
- Принимает `segments: { text, className }[]`
- Разбивает все сегменты на слова с сохранением `className` на каждом слове
- Каждое слово — `motion.span` с `initial={{ y: 20, opacity: 0 }}` → `animate={{ y: 0, opacity: 1 }}`
- `transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }`
- Триггер через `useInView(ref, { once: true, margin: '-10%' })`
- Оборачивает в `inline-flex flex-wrap`

## КЛЮЧЕВЫЕ ПРИНЦИПЫ

1. **Один `scrollYProgress` управляет всем.** Не создавать разные useScroll для разных элементов — всё должно быть синхронизировано
2. **Никакой layout-анимации** (`layout` prop) для карточки «Ваш сайт» — вместо этого absolute top с useTransform. Это критично для плавности
3. **Уведомления привязаны к прогрессу**, а не к useInView. При обратной прокрутке они реверсивно исчезают
4. **Все цифры тикают через useMotionValueEvent** — round + toLocaleString('ru-RU') для кириллических разделителей
5. **Flat дизайн** — никаких shadows на карточках кроме корпуса телефона. Вся иерархия через оттенки #101010 / #181818 / #1a1a1a / #161616
6. **Noise-текстура фона** — подключить `.bg-noise` (SVG feTurbulence, baseFrequency 0.9, 4 octaves) с `opacity-[0.08]`

## СВЯЗКА С ОСТАЛЬНЫМ ЛЕНДИНГОМ

Блок ставится ПОСЛЕ секции About и ПЕРЕД Features. Структура страницы:

```tsx
<Hero />
<About />
<Ladder />   {/* ← этот блок */}
<Features />
```
