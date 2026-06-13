# 💸 GastoApp — Examen Final Programación III

**Universidad Mariano Gálvez de Guatemala — 2026**

App móvil en React Native para registrar y gestionar gastos personales con almacenamiento persistente en SQLite y notificaciones locales.

---

## Descripción general

GastoApp permite registrar y gestionar gastos personales de forma persistente. Utiliza **SQLite** (`expo-sqlite`) para almacenar los datos localmente en el dispositivo, soportando operaciones completas de **CRUD**: crear, leer, actualizar y eliminar gastos con descripción, monto, categoría, fecha y notas. Al realizar cualquier operación (guardar, editar o eliminar), la app dispara una **notificación local** mediante un banner animado que desliza desde la parte superior de la pantalla. La interfaz está organizada en dos pantallas: **Home** (muestra el total acumulado y la lista de gastos) y **Formulario** (para crear o editar un registro). El proyecto sigue una **arquitectura en capas** separando la lógica de datos, notificaciones, pantallas y componentes reutilizables.

---

## Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| Expo | ~54.0.0 | Framework principal |
| React Native | 0.81.5 | UI móvil |
| React | 19.1.0 | Librería de UI |
| expo-sqlite | ~16.0.10 | Base de datos local (SQLite) |
| React Navigation | ^6.x | Navegación entre pantallas |

---

## Estructura del proyecto

```
GastoApp/
├── App.js                          # Punto de entrada, navegación, splash de BD
├── app.json                        # Configuración de Expo
├── package.json
└── src/
    ├── database/
    │   └── database.js             # Capa de datos: initDB, CRUD con SQLite
    ├── notifications/
    │   └── notifications.js        # Notificaciones locales (banner animado)
    ├── screens/
    │   ├── HomeScreen.js           # Lista de gastos + total acumulado
    │   └── FormScreen.js           # Formulario crear / editar gasto
    └── components/
        ├── ExpenseItem.js          # Tarjeta individual de gasto
        ├── EmptyState.js           # Estado vacío cuando no hay registros
        └── NotificationBanner.js   # Banner animado de notificación
```

---

## Funcionalidades CRUD

| Operación | Descripción | Notificación |
|---|---|---|
| **Create** | Registrar nuevo gasto con categoría, monto y fecha | `💸 Gasto registrado` |
| **Read** | Listar todos los gastos ordenados por fecha + total | — |
| **Update** | Editar cualquier campo de un gasto existente | `✏️ Gasto actualizado` |
| **Delete** | Eliminar gasto con confirmación de alerta | `🗑️ Gasto eliminado` |

---

## Categorías disponibles

`🍔 Alimentación` · `🚗 Transporte` · `🎬 Entretenimiento` · `💊 Salud` · `📚 Educación` · `📦 Otros`

---

## Cómo ejecutar

```bash
# 1. Instalar dependencias
npm install --legacy-peer-deps

# 2. Iniciar el servidor (misma red WiFi)
npx expo start

# 3. Iniciar con túnel (distintas redes / datos móviles)
npx expo start --tunnel
```

Escanear el QR con **Expo Go** (SDK 54) desde el celular.

> **Nota:** `expo-notifications` fue removido de Expo Go en SDK 53+. Las notificaciones se implementan con un banner animado propio (`NotificationBanner.js`) usando la API `Animated` de React Native, lo que las hace 100% funcionales en Expo Go sin dependencias adicionales.

---

## Criterios de evaluación cubiertos

| Criterio | Implementación |
|---|---|
| CRUD con SQLite | `src/database/database.js` — `insertGasto`, `getAllGastos`, `updateGasto`, `deleteGasto` |
| Notificaciones locales | `NotificationBanner.js` + `notifications.js` — banner animado al crear/editar/eliminar |
| Interfaz organizada | Cards con color por categoría, FAB, total acumulado, pull-to-refresh |
| Arquitectura en capas | `database/` · `notifications/` · `screens/` · `components/` |
| Código limpio y comentado | Cada función y módulo documentado con comentarios de propósito |
| Valor agregado | Recordatorio diario programado, resumen de total, estado vacío animado |
