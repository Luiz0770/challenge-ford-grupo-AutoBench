import { shouldCloseSheet } from '../utils/dragToClose';

describe('shouldCloseSheet', () => {
  it('não fecha quando o arrasto é para cima', () => {
    expect(shouldCloseSheet(-50, -0.5, 600)).toBe(false);
  });

  it('não fecha com um arrasto pequeno e lento', () => {
    expect(shouldCloseSheet(30, 0.1, 600)).toBe(false);
  });

  it('fecha quando o arrasto passa de 25% da altura da sheet', () => {
    expect(shouldCloseSheet(160, 0.1, 600)).toBe(true);
  });

  it('fecha com um flick rápido para baixo mesmo com pouco arrasto', () => {
    expect(shouldCloseSheet(30, 1.5, 600)).toBe(true);
  });

  it('usa um limiar fixo quando a altura da sheet ainda não foi medida (0)', () => {
    expect(shouldCloseSheet(140, 0.1, 0)).toBe(false);
    expect(shouldCloseSheet(160, 0.1, 0)).toBe(true);
  });
});
