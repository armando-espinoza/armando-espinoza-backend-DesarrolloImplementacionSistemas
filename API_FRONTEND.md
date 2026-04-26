# API para Frontend (Proyecto Sanji)

Base URL (local):
- `http://localhost:1919`

Headers recomendados:
- `Content-Type: application/json`

Notas:
- `fecha` usa formato `YYYY-MM-DD`
- `mes` usa formato `YYYY-MM`
- `idSucursal`, `idEmpleado`, etc. son numéricos

---

## Sucursales

### GET `/API/Sucursales`
Lista sucursales.

### GET `/API/Sucursales/:id`
Obtiene una sucursal por id.

### POST `/API/Sucursales`
Crea sucursal.

Body:
```json
{
  "nombre": "Sucursal Centro",
  "direccion": "Calle 123"
}
```

### DELETE `/API/Sucursales/:id`
Elimina sucursal.

---

## Empleados

### GET `/API/Empleados`
Lista empleados.

### GET `/API/Empleados/:id`
Obtiene empleado por id.

### POST `/API/Empleados`
Crea empleado.

Body:
```json
{
  "nombre": "Juan",
  "puesto": "Cocinero",
  "sueldoBase": 2500,
  "idSucursal": 1
}
```

### DELETE `/API/Empleados/:id`
Elimina empleado.

---

## Nóminas

### GET `/API/Nominas`
Lista nóminas (incluye `empleado: { nombre, puesto }`).

### GET `/API/Nominas/:id`
Obtiene nómina por id (incluye `empleado`).

### POST `/API/Nominas`
Crea nómina (el backend calcula `total = pagoDiario * diasLaborados`).

Body:
```json
{
  "idEmpleado": 1,
  "diasLaborados": 6,
  "pagoDiario": 300,
  "fecha": "2026-04-26"
}
```

### DELETE `/API/Nominas/:id`
Elimina nómina.

### GET `/API/Nominas/Periodo?inicio=YYYY-MM-DD&fin=YYYY-MM-DD`
Lista nóminas dentro del periodo.

### GET `/API/Nominas/Comparar?mes=YYYY-MM`
Compara total del mes vs mes anterior.

---

## Gastos (Egresos)

### GET `/API/Gastos`
Lista gastos.

### GET `/API/Gastos/:id`
Obtiene gasto por id.

### POST `/API/Gastos`
Registra gasto.

Body (nuevo):
```json
{
  "fecha": "2026-04-26",
  "monto": 250.50,
  "concepto": "Proveedor",
  "idSucursal": 1,
  "metodoPago": "efectivo"
}
```

`metodoPago` permitido:
- `"efectivo"`
- `"tarjeta"`

Si no mandas `metodoPago`, el backend usa `"efectivo"`.

### DELETE `/API/Gastos/:id`
Elimina gasto.

### GET `/API/Gastos/Periodo?inicio=YYYY-MM-DD&fin=YYYY-MM-DD`
Lista gastos dentro del periodo.

### GET `/API/Gastos/Comparar?mes=YYYY-MM`
Compara total del mes vs mes anterior.

---

## Ingresos

### GET `/API/Ingresos`
Lista ingresos.

### GET `/API/Ingresos/:id`
Obtiene ingreso por id.

### POST `/API/Ingresos`
Registra ingreso desglosado (el backend calcula `total`).

Body (nuevo recomendado):
```json
{
  "fecha": "2026-04-26",
  "montoEfectivo": 1000,
  "montoTarjeta": 6000,
  "montoTransferencia": 500,
  "idSucursal": 1
}
```

Compatibilidad (payload viejo):
```json
{
  "fecha": "2026-04-26",
  "montoEfectivo": 1000,
  "montoCuenta": 6500,
  "idSucursal": 1
}
```

En compat, `montoCuenta` se interpreta como `montoTransferencia`.

### DELETE `/API/Ingresos/:id`
Elimina ingreso.

### GET `/API/Ingresos/Periodo?inicio=YYYY-MM-DD&fin=YYYY-MM-DD`
Lista ingresos dentro del periodo.

### GET `/API/Ingresos/Comparar?mes=YYYY-MM`
Compara total del mes vs mes anterior.

---

## Corte del día (resumen)

### GET `/API/CorteDia?fecha=YYYY-MM-DD&idSucursal=1&inicioEfectivo=1000&inicioCuenta=2000&fondoCaja=500`
Devuelve ingresos/egresos desglosados, saldos finalizados y el `fondoCaja` (dinero que se deja en caja para dar feria al día siguiente).

Ejemplo:
- `GET /API/CorteDia?fecha=2026-04-26&idSucursal=1&inicioEfectivo=1000&inicioCuenta=2000&fondoCaja=500`

Respuesta (forma):
```json
{
  "fecha": "2026-04-26",
  "idSucursal": 1,
  "inicio": { "efectivo": 1000, "cuenta": 2000 },
  "fondoCaja": 500,
  "ingresos": {
    "efectivo": 1000,
    "tarjeta": 6000,
    "transferencia": 500,
    "total": 7500
  },
  "egresos": {
    "efectivo": 0,
    "tarjeta": 0,
    "total": 0
  },
  "final": { "efectivo": 2000, "cuenta": 8500, "efectivoDisponible": 1500 }
}
```

Fórmulas usadas:
- `final.efectivo = inicio.efectivo + ingresos.efectivo - egresos.efectivo`
- `final.cuenta = inicio.cuenta + ingresos.tarjeta + ingresos.transferencia - egresos.tarjeta`
- `final.efectivoDisponible = final.efectivo - fondoCaja`

### GET `/API/CorteDia/Inicio?fecha=YYYY-MM-DD&idSucursal=1`
Devuelve valores sugeridos para iniciar el día usando el cierre del día anterior (por sucursal):
- `inicioEfectivo = fondoCaja del día anterior` (NO es ingreso)
- `inicioCuenta = finalCuenta del día anterior`

### POST `/API/CorteDia`
Guarda (o actualiza) el cierre del día para esa sucursal y fecha.

Body:
```json
{
  "fecha": "2026-04-26",
  "idSucursal": 1,
  "inicioEfectivo": 1000,
  "inicioCuenta": 2000,
  "fondoCaja": 500
}
```

---

## Validación por sucursal (ingresos + gastos)

### GET `/API/Validacion/Sucursal?idSucursal=1&fecha=YYYY-MM-DD`
Devuelve:
- Conteo de registros
- Totales de ingresos (efectivo/tarjeta/transferencia) y egresos (efectivo/tarjeta)
- Listas completas de ingresos y gastos del filtro

### GET `/API/Validacion/Sucursal?idSucursal=1&inicio=YYYY-MM-DD&fin=YYYY-MM-DD`
Misma respuesta pero por rango.

