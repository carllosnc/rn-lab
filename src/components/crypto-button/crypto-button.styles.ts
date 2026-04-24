import { StyleSheet } from 'react-native';
import { FONTS } from '../../constants/settings';

export const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  root: {
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 5,
  },
  buttonContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 0,
    flex: 1,
    gap: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bitcoinIcon: {
    width: 48,
    height: 48,
    marginRight: 12,
  },
  coinTitle: {
    color: 'white',
    fontSize: 24,
    fontFamily: FONTS.inter.semiBold,
    flex: 1,
  },
  buyButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buyText: {
    color: 'black',
    fontFamily: FONTS.inter.bold,
    fontSize: 14,
  },
  priceContainer: {
  },
  currencyLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontFamily: FONTS.inter.bold,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },
  row: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  priceText: {
    color: 'white',
    fontSize: 48,
    fontFamily: FONTS.inter.bold,
  },
  percentageText: {
    color: '#00FFA3',
    fontSize: 18,
    fontFamily: FONTS.inter.medium,
  },
  timestamp: {
    color: '#ffffffff',
    fontSize: 15,
    fontFamily: FONTS.inter.regular,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartSpace: {
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: '#ffffff25',
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff25',
    height: 100,
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeChip: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  chipText: {
    color: 'white',
    fontSize: 16,
    fontFamily: FONTS.inter.medium,
  },
  chipTextActive: {
    color: 'white',
    fontSize: 16,
    fontFamily: FONTS.inter.bold,
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  closeButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    width: 60,
    height: 60,
    borderRadius: 36,
    backgroundColor: '#ff0000ff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  }
});
