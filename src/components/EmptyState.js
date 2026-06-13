// Pantalla vacía cuando no hay gastos registrados
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmptyState() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>💸</Text>
      <Text style={styles.title}>Sin gastos aún</Text>
      <Text style={styles.subtitle}>
        Toca el botón <Text style={styles.bold}>+</Text> para registrar tu primer gasto.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#1E293B', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 22 },
  bold: { fontWeight: '700', color: '#6C63FF' },
});
