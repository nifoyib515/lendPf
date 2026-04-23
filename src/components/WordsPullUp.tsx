import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface WordsPullUpProps {
  text: string;
  className?: string;
  delay?: number;
  showAsterisk?: boolean;
}

export function WordsPullUp({
  text,
  className = '',
  delay = 0,
  showAsterisk = false,
}: WordsPullUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const words = text.split(' ');

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        const lastChar = word.slice(-1);
        const rest = word.slice(0, -1);

        return (
          <motion.span
            key={`${word}-${i}`}
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.5,
              delay: delay + i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block mr-[0.25em] relative"
          >
            {isLast && showAsterisk ? (
              <>
                {rest}
                <span className="relative inline-block">
                  {lastChar}
                  <span
                    className="absolute top-[0.08em] -right-[0.30em] text-[0.31em] font-normal"
                    aria-hidden
                  >
                    *
                  </span>
                </span>
              </>
            ) : (
              word
            )}
          </motion.span>
        );
      })}
    </span>
  );
}
