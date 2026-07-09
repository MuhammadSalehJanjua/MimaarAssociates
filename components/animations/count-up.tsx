"use client";

import { useEffect, useRef } from "react";
import { useInView, useSpring, useTransform, motion } from "framer-motion";

interface CountUpProps {
  end: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function CountUp({ end, suffix = "", prefix = "", className = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 20,
  });

  const displayValue = useTransform(springValue, (current) => {
    return `${prefix}${Math.round(current).toLocaleString()}${suffix}`;
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(end);
    }
  }, [isInView, end, springValue]);

  return (
    <motion.span ref={ref} className={className}>
      {displayValue}
    </motion.span>
  );
}
