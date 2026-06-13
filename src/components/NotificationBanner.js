// Banner animado que simula una notificación del sistema (slide desde arriba)
import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';

export default function NotificationBanner({ notification }) {
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!notification) return;

    // Reinicia posición para que cada notificación anime desde arriba
    translateY.setValue(-120);
    opacity.setValue(0);

    // Entra deslizando hacia abajo
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    // Sale automáticamente a los 3 segundos
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -120,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, 3000);

    return () => clearTimeout(timer);
  }, [notification]);

  if (!notification) return null;

  return (
    <Animated.View
      style={[styles.banner, { transform: [{ translateY }], opacity }]}
    >
      <View style={styles.dot} />
      <View style={styles.textContainer}>
        <Text style={styles.titulo} numberOfLines={1}>{notification.titulo}</Text>
        <Text style={styles.cuerpo} numberOfLines={2}>{notification.cuerpo}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: '#1E1B4B',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6C63FF',
    marginRight: 12,
  },
  textContainer: { flex: 1 },
  titulo: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2,
  },
  cuerpo: {
    color: '#C7D2FE',
    fontSize: 12,
    lineHeight: 17,
  },
});
