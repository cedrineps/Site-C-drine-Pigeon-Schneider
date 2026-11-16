import { ReactNode, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';

interface ScrollRevealProps {
  children: ReactNode;
  reducedMotion?: boolean;
  delay?: number;
  yOffset?: number;
  xOffset?: number;
  parallax?: boolean;
  className?: string;
}

export function ScrollReveal({
  children,
  reducedMotion = false,
  delay = 0,
  yOffset = 28,
  xOffset = 0,
  parallax = false,
  className = '',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const rawParallaxY = useTransform(scrollYProgress, [0, 0.5, 1], [18, 0, -14]);
  const smoothParallaxY = useSpring(rawParallaxY, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={parallax ? { y: smoothParallaxY } : undefined}
        initial={{ opacity: 0, y: yOffset, x: xOffset }}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{
          duration: 0.65,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
