// Entrada escalonada (animate-rise em global.css). O atraso é arredondado para
// os passos de 20ms gerados em tailwind.config.js.
export const riseClass = (delayMs = 0): string =>
  `animate-rise anim-delay-${Math.min(2000, Math.max(0, Math.round(delayMs / 20) * 20))}`;
