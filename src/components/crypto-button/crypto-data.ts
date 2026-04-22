export const PERIODS = ['1 day', '1 week', '1 month', '1 year'] as const;
export type Period = typeof PERIODS[number];

const generateNormalizedData = (count: number, volatility: number = 20, trend: number = 0) => {
  const points = [];
  let currentY = 150;
  for (let i = 0; i < count; i++) {
    const x = (i / (count - 1)) * 400;
    const change = (Math.random() - 0.5) * volatility + trend;
    currentY = Math.max(50, Math.min(250, currentY + change));
    points.push({ x, y: +(currentY.toFixed(2)) });
  }
  return points;
};

export const BITCOIN_DATA: Record<Period, { x: number; y: number }[]> = {
  '1 day': generateNormalizedData(24, 15, 0.5), // Hourly points, slight upward trend
  '1 week': generateNormalizedData(35, 20, -1), // 5 points per day, downward trend
  '1 month': generateNormalizedData(60, 25, 2), // 2 points per day, strong upward trend
  '1 year': generateNormalizedData(100, 30, 0), // 100 points for smooth long-term view
};

export const CARDANO_DATA: Record<Period, { x: number; y: number }[]> = {
  '1 day': generateNormalizedData(24, 10, -0.2), 
  '1 week': generateNormalizedData(35, 15, 0.5),
  '1 month': generateNormalizedData(60, 20, -1),
  '1 year': generateNormalizedData(100, 40, 0.5),
};

export const AVALANCHE_DATA: Record<Period, { x: number; y: number }[]> = {
  '1 day': generateNormalizedData(24, 18, 0.3), 
  '1 week': generateNormalizedData(35, 22, 1.2),
  '1 month': generateNormalizedData(60, 25, -0.5),
  '1 year': generateNormalizedData(100, 35, 1),
};

export const DATA_POINTS = BITCOIN_DATA;
