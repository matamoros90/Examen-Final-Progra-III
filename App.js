/**
 * GastoApp – Examen Final Programación III (UMG 2026)
 *
 * Arquitectura en capas:
 *   src/database/      → acceso a datos (SQLite)
 *   src/notifications/ → notificaciones locales (banner animado)
 *   src/screens/       → pantallas (UI)
 *   src/components/    → componentes reutilizables
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { initDB } from './src/database/database';
import { setNotificationHandler, scheduleRecordatorioDiario } from './src/notifications/notifications';

import HomeScreen from './src/screens/HomeScreen';
import FormScreen from './src/screens/FormScreen';
import NotificationBanner from './src/components/NotificationBanner';

const Stack = createNativeStackNavigator();

export default function App() {
  // La BD debe estar lista antes de renderizar las pantallas
  const [dbReady, setDbReady] = useState(false);
  const [notif, setNotif] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // Espera a que initDB() termine ANTES de mostrar las pantallas
    initDB()
      .then(() => setDbReady(true))
      .catch((e) => {
        console.error('Error inicializando BD:', e);
        setDbReady(true); // Muestra la app aunque la BD falle
      });

    // Conecta el banner de notificación
    setNotificationHandler((nueva) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setNotif(nueva);
      timerRef.current = setTimeout(() => setNotif(null), 3500);
    });

    scheduleRecordatorioDiario(20, 0);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Splash mientras la BD no está lista
  if (!dbReady) {
    return (
      <View style={styles.splash}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#6C63FF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: '💸 Mis Gastos' }}
        />
        <Stack.Screen
          name="Formulario"
          component={FormScreen}
          options={{ title: 'Nuevo gasto' }}
        />
      </Stack.Navigator>

      {/* Banner animado de notificación local */}
      <NotificationBanner notification={notif} />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
