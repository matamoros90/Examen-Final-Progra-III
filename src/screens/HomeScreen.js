// Pantalla principal: muestra el resumen de gastos y la lista completa
import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllGastos, getTotalGastos, deleteGasto } from '../database/database';
import { notifyGastoEliminado } from '../notifications/notifications';
import ExpenseItem from '../components/ExpenseItem';
import EmptyState from '../components/EmptyState';

export default function HomeScreen({ navigation }) {
  const [gastos, setGastos] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Carga (o recarga) los datos desde SQLite
  const cargarDatos = useCallback(async () => {
    try {
      const [lista, suma] = await Promise.all([getAllGastos(), getTotalGastos()]);
      setGastos(lista);
      setTotal(suma);
    } catch (e) {
      console.error('Error cargando gastos:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Recarga cada vez que la pantalla obtiene foco (regreso del formulario)
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      cargarDatos();
    }, [cargarDatos])
  );

  const handleEdit = (gasto) => {
    navigation.navigate('Formulario', { gasto });
  };

  const handleDelete = async (gasto) => {
    await deleteGasto(gasto.id);
    await notifyGastoEliminado(gasto.descripcion);
    cargarDatos();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tarjeta de resumen */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total de gastos</Text>
        <Text style={styles.summaryAmount}>Q{total.toFixed(2)}</Text>
        <Text style={styles.summaryCount}>{gastos.length} registro{gastos.length !== 1 ? 's' : ''}</Text>
      </View>

      {/* Lista de gastos */}
      <FlatList
        data={gastos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ExpenseItem gasto={item} onEdit={handleEdit} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={gastos.length === 0 ? styles.emptyList : styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); cargarDatos(); }}
            colors={['#6C63FF']}
          />
        }
      />

      {/* FAB – botón flotante para agregar */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Formulario', { gasto: null })}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  summaryCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#6C63FF',
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  summaryLabel: { color: '#C7D2FE', fontSize: 13, fontWeight: '500' },
  summaryAmount: { color: '#fff', fontSize: 36, fontWeight: '800', marginTop: 4 },
  summaryCount: { color: '#A5B4FC', fontSize: 12, marginTop: 4 },
  list: { paddingBottom: 90 },
  emptyList: { flex: 1 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  fabText: { color: '#fff', fontSize: 32, lineHeight: 34 },
});
