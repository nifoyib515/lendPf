import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export interface Segment {
  text: string;
  className?: string;
}

interface Props {
  segments: Segment[];
  className?: string;
  delay?: number;
  centered?: boolean;
}

export function WordsPullUpMultiStyle({
  segments,
  className = '',
  delay = 0,
  centered = true,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  // Flatten all segments into a stream of words, preserving per-word className
  const words: { text: string; className?: string }[] = [];
  segments.forEach((seg) => {
    seg.text
      .split(' ')
      .filter(Boolean)
      .forEach((w) => words.push({ text: w, className: seg.className }));
  });

  return (
    <span
      ref={ref}
      className={`inline-flex flex-wrap ${
        centered ? 'justify-center' : ''
      } ${className}`}
    >
      {words.map((w, i) => (
        <motion.span
          key={`${w.text}-${i}`}
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`inline-block mr-[0.25em] ${w.className ?? ''}`}
        >
          {w.text}
        </motion.span>
      ))}
    </span>
  );
}
