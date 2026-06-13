// Pantalla de formulario: sirve tanto para crear como para editar un gasto
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { insertGasto, updateGasto } from '../database/database';
import { notifyGastoCreado, notifyGastoActualizado } from '../notifications/notifications';

const CATEGORIAS = ['Alimentación', 'Transporte', 'Entretenimiento', 'Salud', 'Educación', 'Otros'];

const CATEGORIA_ICONS = {
  Alimentación: '🍔', Transporte: '🚗', Entretenimiento: '🎬',
  Salud: '💊', Educación: '📚', Otros: '📦',
};

// Fecha de hoy en formato YYYY-MM-DD
function fechaHoy() {
  return new Date().toISOString().split('T')[0];
}

export default function FormScreen({ navigation, route }) {
  const gastoExistente = route.params?.gasto ?? null;
  const esEdicion = !!gastoExistente;

  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('Alimentación');
  const [fecha, setFecha] = useState(fechaHoy());
  const [notas, setNotas] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Prellenar campos en modo edición
  useEffect(() => {
    if (gastoExistente) {
      setDescripcion(gastoExistente.descripcion);
      setMonto(String(gastoExistente.monto));
      setCategoria(gastoExistente.categoria);
      setFecha(gastoExistente.fecha);
      setNotas(gastoExistente.notas ?? '');
    }
    navigation.setOptions({ title: esEdicion ? 'Editar gasto' : 'Nuevo gasto' });
  }, []);

  const validar = () => {
    if (!descripcion.trim()) { Alert.alert('Error', 'Escribe una descripción.'); return false; }
    if (!monto || isNaN(Number(monto)) || Number(monto) <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido mayor a 0.'); return false;
    }
    if (!fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
      Alert.alert('Error', 'La fecha debe tener el formato YYYY-MM-DD.'); return false;
    }
    return true;
  };

  const guardar = async () => {
    if (!validar()) return;
    setGuardando(true);

    const datos = {
      descripcion: descripcion.trim(),
      monto: Number(monto),
      categoria,
      fecha,
      notas: notas.trim(),
    };

    try {
      if (esEdicion) {
        await updateGasto({ id: gastoExistente.id, ...datos });
        await notifyGastoActualizado(datos.descripcion);
      } else {
        await insertGasto(datos);
        await notifyGastoCreado(datos.descripcion, datos.monto);
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar el gasto.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">

        {/* Campo descripción */}
        <Text style={styles.label}>Descripción *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Almuerzo, Taxi, Netflix..."
          value={descripcion}
          onChangeText={setDescripcion}
          maxLength={60}
        />

        {/* Campo monto */}
        <Text style={styles.label}>Monto (Q) *</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          value={monto}
          onChangeText={setMonto}
          keyboardType="decimal-pad"
        />

        {/* Selector de categoría */}
        <Text style={styles.label}>Categoría *</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIAS.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryBtn, categoria === cat && styles.categoryBtnActive]}
              onPress={() => setCategoria(cat)}
            >
              <Text style={styles.categoryIcon}>{CATEGORIA_ICONS[cat]}</Text>
              <Text style={[styles.categoryText, categoria === cat && styles.categoryTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Campo fecha */}
        <Text style={styles.label}>Fecha (YYYY-MM-DD) *</Text>
        <TextInput
          style={styles.input}
          placeholder="2025-06-13"
          value={fecha}
          onChangeText={setFecha}
          maxLength={10}
        />

        {/* Campo notas opcional */}
        <Text style={styles.label}>Notas (opcional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Detalles adicionales..."
          value={notas}
          onChangeText={setNotas}
          multiline
          numberOfLines={3}
          maxLength={200}
        />

        {/* Botón guardar */}
        <TouchableOpacity
          style={[styles.saveBtn, guardando && styles.saveBtnDisabled]}
          onPress={guardar}
          disabled={guardando}
          activeOpacity={0.8}
        >
          <Text style={styles.saveBtnText}>
            {guardando ? 'Guardando...' : esEdicion ? '✏️ Actualizar gasto' : '💾 Guardar gasto'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 6, marginTop: 16 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#1E293B',
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  categoryBtnActive: {
    borderColor: '#6C63FF',
    backgroundColor: '#EEF2FF',
  },
  categoryIcon: { fontSize: 16 },
  categoryText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  categoryTextActive: { color: '#6C63FF', fontWeight: '700' },
  saveBtn: {
    marginTop: 28,
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
