// Decide se o arrasto da alça deve fechar a sheet: passou de 25% da altura
// medida da sheet, ou foi um "flick" rápido para baixo.
export function shouldCloseSheet(dy: number, vy: number, sheetHeight: number): boolean {
  if (dy <= 0) return false;
  const threshold = sheetHeight > 0 ? sheetHeight * 0.25 : 150;
  const isFastFlick = vy > 1.2 && dy > 20;
  return dy > threshold || isFastFlick;
}
