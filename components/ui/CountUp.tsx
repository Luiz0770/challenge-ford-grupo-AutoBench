import React, { useEffect, useState } from 'react';
import { Text, TextStyle } from 'react-native';

interface CountUpProps {
  to: number;
  duration?: number;
  delay?: number;
  format?: (n: number) => string;
  style?: TextStyle | TextStyle[];
}

export const CountUp: React.FC<CountUpProps> = ({
  to,
  duration = 900,
  delay = 0,
  format = (n) => String(Math.round(n)),
  style,
}) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    let timeout = 0;
    const start = () => {
      const t0 = Date.now();
      const step = () => {
        const elapsed = Date.now() - t0;
        const t = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(to * eased);
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    timeout = setTimeout(start, delay) as unknown as number;
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [to, duration, delay]);

  return <Text style={style}>{format(value)}</Text>;
};
