// Capa de acceso a datos: maneja todas las operaciones SQLite sobre la tabla "gastos"
import * as SQLite from 'expo-sqlite';

let db;

// Abre (o crea) la base de datos y crea la tabla si no existe
export async function initDB() {
  db = await SQLite.openDatabaseAsync('gastos.db');

  // execAsync ejecuta sentencias DDL que no devuelven resultados
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS gastos (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      descripcion TEXT    NOT NULL,
      monto       REAL    NOT NULL,
      categoria   TEXT    NOT NULL,
      fecha       TEXT    NOT NULL,
      notas       TEXT
    );`
  );
}

// CREATE – inserta un nuevo gasto y devuelve el id generado
export async function insertGasto({ descripcion, monto, categoria, fecha, notas }) {
  const result = await db.runAsync(
    'INSERT INTO gastos (descripcion, monto, categoria, fecha, notas) VALUES (?, ?, ?, ?, ?);',
    [descripcion, monto, categoria, fecha, notas ?? '']
  );
  return result.lastInsertRowId;
}

// READ – devuelve todos los gastos ordenados por fecha descendente
export async function getAllGastos() {
  return await db.getAllAsync('SELECT * FROM gastos ORDER BY fecha DESC;');
}

// READ (uno) – devuelve un gasto por su id
export async function getGastoById(id) {
  return await db.getFirstAsync('SELECT * FROM gastos WHERE id = ?;', [id]);
}

// UPDATE – actualiza los campos de un gasto existente
export async function updateGasto({ id, descripcion, monto, categoria, fecha, notas }) {
  await db.runAsync(
    'UPDATE gastos SET descripcion=?, monto=?, categoria=?, fecha=?, notas=? WHERE id=?;',
    [descripcion, monto, categoria, fecha, notas ?? '', id]
  );
}

// DELETE – elimina un gasto por su id
export async function deleteGasto(id) {
  await db.runAsync('DELETE FROM gastos WHERE id = ?;', [id]);
}

// Suma total de gastos (para el resumen en home)
export async function getTotalGastos() {
  const row = await db.getFirstAsync('SELECT SUM(monto) AS total FROM gastos;');
  return row?.total ?? 0;
}
