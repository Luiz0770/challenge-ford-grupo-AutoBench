export const colors = {
  bg: {
    canvas: '#F8F9FA',
    surface: '#FFFFFF',
    elevated: '#F1F3F5',
    subtle: '#FBFCFD',
    border: '#EEF0F3',
    borderStrong: '#E9ECEF',
  },
  text: {
    primary: '#212529',
    heading: '#001C46',
    secondary: '#6C757D',
    muted: '#ADB5BD',
    inverse: '#FFFFFF',
  },
  brand: {
    navy: '#001C46',
    navyDeep: '#050E26',
    navyLight: '#003478',
    blue: '#0066CC',
    blueLight: '#2589E6',
    blueSoft: '#60A5FA',
  },
  accent: {
    amber: '#F59E0B',
    amberLight: '#FBBF24',
    amberSoft: '#FCD34D',
    amberBg: '#FEF3C7',
  },
  status: {
    success: '#0F766E',
    warning: '#B45309',
    danger: '#B91C1C',
    info: '#0066CC',
  },
  divider: '#F1F3F5',
} as const;

export const fonts = {
  sans: 'Geist_400Regular',
  sansMedium: 'Geist_500Medium',
  sansSemibold: 'Geist_600SemiBold',
  sansBold: 'Geist_700Bold',
  mono: 'GeistMono_400Regular',
  monoMedium: 'GeistMono_500Medium',
  monoSemibold: 'GeistMono_600SemiBold',
  monoBold: 'GeistMono_700Bold',
} as const;
