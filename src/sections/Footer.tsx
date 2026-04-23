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

export default function Footer() {
  const loop = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <footer
      className="w-full overflow-hidden border-t border-black/20"
      style={{ background: '#FFCC00' }}
    >
      <div className="flex whitespace-nowrap animate-marquee py-3 md:py-4">
        {loop.map((item, i) => (
          <span
            key={i}
            className="flex items-center shrink-0 text-base sm:text-xl md:text-3xl lg:text-4xl font-medium tracking-tight"
          >
            <MarqueeItem item={item} />
            <span className="text-black/30 text-xl md:text-4xl font-thin">|</span>
          </span>
        ))}
      </div>
    </footer>
  );
}
