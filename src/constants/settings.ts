export const FONTS = {
  inter: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
  spaceGrotesk: {
    regular: 'SpaceGrotesk_400Regular',
    medium: 'SpaceGrotesk_500Medium',
    semiBold: 'SpaceGrotesk_600SemiBold',
    bold: 'SpaceGrotesk_700Bold',
  },
} as const;

export const SETTINGS = {
  DEFAULT_FONT: FONTS.inter.regular,
  HEADING_FONT: FONTS.spaceGrotesk.bold,
  ACCENT_FONT: FONTS.spaceGrotesk.medium,
};
