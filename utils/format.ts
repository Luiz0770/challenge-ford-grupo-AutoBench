export const fmtBRL = (cents: number): string => {
  const v = cents >= 100000 ? cents : cents * 100;
  return (
    'R$ ' +
    Math.round(v / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  );
};

export const fmtBRLFromReais = (reais: number): string =>
  'R$ ' +
  Math.round(reais).toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

export const fmtPct = (n: number, sign = false): string =>
  (sign && n > 0 ? '+' : '') +
  n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) +
  '%';
