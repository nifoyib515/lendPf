import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef } from 'react';

function AnimatedLetter({
  char,
  range,
  progress,
}: {
  char: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  if (char === ' ') return <span>{'\u00A0'}</span>;
  return <motion.span style={{ opacity }}>{char}</motion.span>;
}

export function AnimatedParagraph({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });
  const chars = Array.from(text);
  const total = chars.length;

  return (
    <p ref={ref} className={className}>
      {chars.map((c, i) => {
        const cp = i / total;
        const range: [number, number] = [
          Math.max(0, cp - 0.1),
          Math.min(1, cp + 0.05),
        ];
        return (
          <AnimatedLetter
            key={i}
            char={c}
            range={range}
            progress={scrollYProgress}
          />
        );
      })}
    </p>
  );
}
