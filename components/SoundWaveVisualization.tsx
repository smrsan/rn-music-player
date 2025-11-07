import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const WaveBar: React.FC<{ delay: number }> = ({ delay }) => {
  const heightAnim = useRef(new Animated.Value(4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(heightAnim, {
          toValue: 20,
          duration: 300,
          delay,
          useNativeDriver: false,
        }),
        Animated.timing(heightAnim, {
          toValue: 4,
          duration: 300,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [heightAnim, delay]);

  return <Animated.View style={[styles.bar, { height: heightAnim }]} />;
};

const SoundWaveVisualization: React.FC = () => {
  const bars = [0, 100, 200, 150, 50];

  return (
    <View style={styles.container} accessibilityLabel="Audio is playing">
      {bars.map((delay, index) => (
        <WaveBar key={index} delay={delay} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  bar: {
    width: 2,
    backgroundColor: '#10B981',
    borderRadius: 2,
    marginHorizontal: 1,
  },
});

export default SoundWaveVisualization;