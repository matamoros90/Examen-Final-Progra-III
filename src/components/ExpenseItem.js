// Componente visual para cada fila de gasto en la lista
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

// Mapa de colores e íconos por categoría
const CATEGORIA_CONFIG = {
  Alimentación:   { color: '#FF6B6B', icon: '🍔' },
  Transporte:     { color: '#4ECDC4', icon: '🚗' },
  Entretenimiento:{ color: '#A855F7', icon: '🎬' },
  Salud:          { color: '#22C55E', icon: '💊' },
  Educación:      { color: '#3B82F6', icon: '📚' },
  Otros:          { color: '#F59E0B', icon: '📦' },
};

export default function ExpenseItem({ gasto, onEdit, onDelete }) {
  const config = CATEGORIA_CONFIG[gasto.categoria] ?? CATEGORIA_CONFIG.Otros;

  const confirmarEliminacion = () => {
    Alert.alert(
      'Eliminar gasto',
      `¿Estás seguro de que deseas eliminar "${gasto.descripcion}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => onDelete(gasto) },
      ]
    );
  };

  return (
    <View style={[styles.card, { borderLeftColor: config.color }]}>
      {/* Ícono + descripción y categoría */}
      <View style={styles.left}>
        <Text style={styles.icon}>{config.icon}</Text>
        <View>
          <Text style={styles.descripcion} numberOfLines={1}>{gasto.descripcion}</Text>
          <Text style={styles.meta}>{gasto.categoria} · {gasto.fecha}</Text>
          {gasto.notas ? <Text style={styles.notas} numberOfLines={1}>{gasto.notas}</Text> : null}
        </View>
      </View>

      {/* Monto y botones de acción */}
      <View style={styles.right}>
        <Text style={styles.monto}>Q{Number(gasto.monto).toFixed(2)}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnEdit} onPress={() => onEdit(gasto)}>
            <Text style={styles.btnText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnDelete} onPress={confirmarEliminacion}>
            <Text style={styles.btnText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  icon: { fontSize: 28, marginRight: 12 },
  descripcion: { fontSize: 15, fontWeight: '600', color: '#1E293B', maxWidth: 160 },
  meta: { fontSize: 12, color: '#64748B', marginTop: 2 },
  notas: { fontSize: 11, color: '#94A3B8', marginTop: 1, fontStyle: 'italic' },
  right: { alignItems: 'flex-end' },
  monto: { fontSize: 16, fontWeight: '700', color: '#6C63FF' },
  actions: { flexDirection: 'row', marginTop: 6, gap: 6 },
  btnEdit: {
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    padding: 6,
  },
  btnDelete: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 6,
  },
  btnText: { fontSize: 14 },
});
