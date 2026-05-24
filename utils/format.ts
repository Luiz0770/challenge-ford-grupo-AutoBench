export const fmtBRLFromReais = (reais: number): string =>
  'R$ ' +
  Math.round(reais).toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
