import { useState, useEffect, useRef } from 'react';

export default function AnimatedNumber({
  value,
  duration = 1500,
  decimals = 0,
  prefix = '',
  suffix = '',
}) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const startValueRef = useRef(0);
  const targetRef = useRef(value);

  useEffect(() => {
    startValueRef.current = display;
    targetRef.current = value;
    startTimeRef.current = null;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    const animate = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);

      const current =
        startValueRef.current +
        (targetRef.current - startValueRef.current) * eased;
      setDisplay(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplay(targetRef.current);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
    // Only re-trigger when target value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  const formatted = Number(display).toFixed(decimals);

  return (
    <span>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
