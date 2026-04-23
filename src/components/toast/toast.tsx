import React, { createContext, useContext, useState, useCallback, memo } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  Canvas, 
  RoundedRect, 
  LinearGradient, 
  vec, 
} from '@shopify/react-native-skia';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  runOnJS,
  Easing,
} from 'react-native-reanimated';

export type ToastType = 'success' | 'error' | 'message';

interface ToastOptions {
  title: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastData extends ToastOptions {
  id: string;
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const { width } = Dimensions.get('window');
const TOAST_WIDTH = width - 40;
const TOAST_SPACING = 12;

const ToastItem = memo(({
  item,
  index,
  onHide
}: {
  item: ToastData;
  index: number;
  onHide: (id: string) => void;
}) => {
  const [contentHeight, setContentHeight] = useState(80); // Default fallback
  const translateY = useSharedValue(-150);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      translateY.value = withTiming(-150, { 
        duration: 400, 
        easing: Easing.in(Easing.back(1)) 
      });
      opacity.value = withTiming(0, { duration: 300 }, () => {
        runOnJS(onHide)(item.id);
      });
    }, item.duration || 4000);

    return () => clearTimeout(timer);
  }, []); 

  React.useEffect(() => {
    const isVisible = index < 3;
    const stackOffset = index * 10;
    const stackScale = 1 - index * 0.05;

    // Use a safe vertical position that accounts for dynamic height stacking
    // For simplicity in a stack, we use a fixed starting Y and offset by index
    translateY.value = withTiming(isVisible ? 60 - stackOffset : -150, {
      duration: 500,
      easing: Easing.out(Easing.back(1.5)),
    });
    opacity.value = withTiming(isVisible ? 1 : 0, { duration: 400 });
    scale.value = withTiming(isVisible ? stackScale : 0.8, { 
      duration: 500, 
      easing: Easing.out(Easing.back(1.5)) 
    });
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ],
    opacity: opacity.value,
    zIndex: 1000 - index,
  }));

  const getTheme = () => {
    switch (item.type) {
      case 'success':
        return {
          colors: ['#00441b', '#000000ff'] as [string, string],
          icon: 'checkmark-circle' as const,
          iconColor: '#00E676',
        };
      case 'error':
        return {
          colors: ['#440000', '#000000ff'] as [string, string],
          icon: 'alert-circle' as const,
          iconColor: '#FF5252',
        };
      case 'message':
      default:
        return {
          colors: ['#08146bff', '#000000ff'] as [string, string],
          icon: 'information-circle' as const,
          iconColor: '#38BDF8',
        };
    }
  };

  const theme = getTheme();

  return (
    <Animated.View style={[styles.toastContainer, animatedStyle]}>
      <Canvas style={styles.canvas}>
        {/* Main Background */}
        <RoundedRect
          x={0}
          y={0}
          width={TOAST_WIDTH}
          height={contentHeight}
          r={24}
        >
          <LinearGradient
            start={vec(0, 0)}
            end={vec(TOAST_WIDTH, contentHeight)}
            colors={theme.colors}
          />
        </RoundedRect>

        {/* White Border */}
        <RoundedRect
          x={0.5}
          y={0.5}
          width={TOAST_WIDTH - 1}
          height={contentHeight - 1}
          r={24}
          color="rgba(255,255,255,0.4)"
          style="stroke"
          strokeWidth={1}
        />
      </Canvas>

      <View
        style={styles.content}
        onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={theme.icon} size={32} color={theme.iconColor} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.message}>{item.message}</Text>
        </View>
      </View>
    </Animated.View>
  );
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [{ ...options, id }, ...prev]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {toasts.map((toast, index) => (
          <ToastItem 
            key={toast.id} 
            item={toast} 
            index={index} 
            onHide={removeToast} 
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    minHeight: 80,
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    marginBottom: 2,
  },
  message: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});
