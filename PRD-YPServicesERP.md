# PRD - YPServicesERP
## Documento de Requerimientos Técnicos
### Sistema ERP para Agencias de Diseño y Desarrollo Web

**Versión:** 1.0  
**Fecha:** Enero 2026  
**Autor:** YP Services  
**Estado:** En Desarrollo

---

## Índice

1. [Visión General del Producto](#1-visión-general-del-producto)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Roles y Permisos](#3-roles-y-permisos)
4. [Módulos del Sistema](#4-módulos-del-sistema)
5. [Modelo de Base de Datos](#5-modelo-de-base-de-datos)
6. [Flujos de Usuario](#6-flujos-de-usuario)
7. [Integraciones](#7-integraciones)
8. [Consideraciones Técnicas](#8-consideraciones-técnicas)
9. [Roadmap de Desarrollo](#9-roadmap-de-desarrollo)
10. [Anexos](#10-anexos)

---

## 1. Visión General del Producto

### 1.1 Descripción

YPServicesERP es un sistema de gestión empresarial (ERP) diseñado específicamente para agencias de diseño y desarrollo web. El sistema permite gestionar clientes, proyectos, tareas, facturación, empleados, movimientos financieros y generar reportes de inteligencia de negocio.

### 1.2 Modelo de Negocio

- **Tipo:** SaaS (Software as a Service) Multi-tenant
- **Monetización:** Setup inicial + Suscripción mensual/anual
- **Mercado objetivo:** Agencias de diseño web, desarrollo de software, marketing digital

### 1.3 Objetivos del Producto

| Objetivo | Descripción |
|----------|-------------|
| **Gestión centralizada** | Unificar clientes, proyectos, finanzas y equipo en una sola plataforma |
| **Rentabilidad visible** | Conocer la rentabilidad por proyecto, cliente y tipo de servicio |
| **Escalabilidad** | Permitir vender el sistema a otras agencias como SaaS |
| **Automatización** | Reducir tareas manuales con facturación recurrente y notificaciones |

### 1.4 Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| **Frontend** | HTML5, CSS3, JavaScript, Bootstrap 5.3 |
| **Backend** | PHP 8.x |
| **Base de Datos** | MySQL 8.x |
| **Gráficos** | Chart.js |
| **Iconos** | Bootstrap Icons |
| **Fuentes** | Plus Jakarta Sans (Google Fonts) |

---

## 2. Arquitectura del Sistema

### 2.1 Arquitectura Multi-Tenant

El sistema utiliza una arquitectura **multi-tenant con base de datos compartida**. Todas las empresas/agencias comparten la misma base de datos, pero los datos están aislados mediante un campo `tenant_id` en cada tabla.

```
┌─────────────────────────────────────────────────────────────┐
│                    APLICACIÓN YPServicesERP                  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Empresa A  │  │  Empresa B  │  │  Empresa C  │   ...   │
│  │  tenant_id=1│  │  tenant_id=2│  │  tenant_id=3│         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│                  BASE DE DATOS COMPARTIDA                    │
│    (Todas las tablas tienen campo tenant_id para aislar)    │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Estructura de Directorios

```
YPServicesERP/
├── admin/                    # Panel Super Admin (gestión SaaS)
│   ├── index.php
│   ├── tenants.php
│   ├── plans.php
│   └── billing.php
│
├── portal/                   # Portal para Clientes externos
│   ├── index.php
│   ├── projects.php
│   ├── invoices.php
│   └── quotes.php
│
├── app/                      # Aplicación principal ERP
│   ├── index.php            # Dashboard
│   ├── clients.php
│   ├── client.php
│   ├── projects.php
│   ├── project.php
│   ├── tasks.php
│   ├── task.php
│   ├── quotes.php           # NUEVO
│   ├── quote.php            # NUEVO
│   ├── invoices.php
│   ├── invoice.php
│   ├── subscriptions.php    # NUEVO
│   ├── subscription.php     # NUEVO
│   ├── employees.php
│   ├── employee.php
│   ├── movements.php
│   ├── services.php         # NUEVO
│   ├── calendar.php         # NUEVO
│   ├── reports.php
│   └── settings.php
│
├── assets/
│   ├── css/
│   ├── js/
│   └── img/
│
├── includes/
│   ├── config.php           # Configuración DB y constantes
│   ├── auth.php             # Autenticación y sesiones
│   ├── functions.php        # Funciones globales
│   ├── middleware.php       # Verificación de permisos
│   └── tenant.php           # Gestión de tenant actual
│
├── api/                      # API REST (para integraciones futuras)
│   ├── v1/
│   │   ├── clients.php
│   │   ├── projects.php
│   │   ├── invoices.php
│   │   └── ...
│   └── webhooks/
│       ├── stripe.php
│       └── paypal.php
│
├── auth/
│   ├── login.php
│   ├── logout.php
│   ├── forgot-password.php
│   └── reset-password.php
│
└── uploads/                  # Archivos subidos (por tenant)
    ├── tenant_1/
    ├── tenant_2/
    └── ...
```

### 2.3 Flujo de Autenticación

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Login   │────▶│ Validar  │────▶│  Cargar  │────▶│ Redirect │
│   Form   │     │  Usuario │     │  Tenant  │     │ Dashboard│
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                      │
                      ▼
              ┌──────────────┐
              │ Si es Super  │────▶ Redirect Admin Panel
              │    Admin     │
              └──────────────┘
```

---

## 3. Roles y Permisos

### 3.1 Matriz de Roles

| Rol | Nivel | Descripción |
|-----|-------|-------------|
| **Super Admin** | SaaS | Administrador de la plataforma SaaS completa |
| **Admin** | Tenant | Administrador de una empresa/agencia |
| **Project Manager** | Tenant | Gestiona proyectos y clientes |
| **Empleado** | Tenant | Trabaja en tareas asignadas |
| **Contador** | Tenant | Gestiona finanzas |
| **Cliente** | Portal | Usuario externo que ve sus proyectos |

### 3.2 Matriz de Permisos por Módulo

| Módulo | Super Admin | Admin | PM | Empleado | Contador | Cliente |
|--------|:-----------:|:-----:|:--:|:--------:|:--------:|:-------:|
| Panel Admin SaaS | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Dashboard | ✅ | ✅ | ✅ | 📊 Limitado | 📊 Finanzas | ❌ |
| Clientes | ✅ | ✅ | ✅ | 👁️ Ver | ❌ | ❌ |
| Proyectos | ✅ | ✅ | ✅ | 👁️ Asignados | 👁️ Ver | 👁️ Propios |
| Tareas | ✅ | ✅ | ✅ | ✅ Asignadas | ❌ | 👁️ Ver |
| Cotizaciones | ✅ | ✅ | ✅ | ❌ | 👁️ Ver | 👁️ Propias |
| Facturas | ✅ | ✅ | ✅ | ❌ | ✅ | 👁️ Propias |
| Suscripciones | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Empleados | ✅ | ✅ | 👁️ Ver | 👁️ Perfil | ❌ | ❌ |
| Movimientos | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Servicios | ✅ | ✅ | ✅ | 👁️ Ver | ❌ | ❌ |
| Calendario | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Reportes | ✅ | ✅ | 📊 Proyectos | ❌ | 📊 Finanzas | ❌ |
| Configuración | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

**Leyenda:**
- ✅ Acceso completo (CRUD)
- 👁️ Solo lectura
- 📊 Acceso parcial/filtrado
- ❌ Sin acceso

### 3.3 Permisos Detallados por Rol

#### Super Admin
```
- Crear/editar/eliminar tenants (empresas)
- Ver métricas globales del SaaS
- Gestionar planes y precios
- Facturación del SaaS a tenants
- Impersonar usuarios (soporte técnico)
- Acceso a logs del sistema
```

#### Admin (por tenant)
```
- Acceso total a todos los módulos de su tenant
- Crear/editar/eliminar usuarios
- Configurar empresa (datos fiscales, logo, etc.)
- Gestionar categorías, estados, métodos de pago
- Configurar integraciones
- Ver todos los reportes
```

#### Project Manager
```
- CRUD de clientes
- CRUD de proyectos
- CRUD de tareas (todas)
- CRUD de cotizaciones
- CRUD de facturas (crear, ver, editar)
- Ver empleados (no editar)
- Ver reportes de proyectos
- Calendario completo
```

#### Empleado
```
- Ver proyectos asignados
- Ver/editar tareas asignadas
- Registrar tiempo (time tracking)
- Ver su perfil
- Calendario (sus eventos)
```

#### Contador
```
- CRUD de facturas
- CRUD de movimientos
- CRUD de suscripciones
- Ver cotizaciones
- Ver reportes financieros
- Exportar datos
```

#### Cliente (Portal)
```
- Ver sus proyectos y estado
- Ver sus cotizaciones
- Aprobar/rechazar cotizaciones
- Ver sus facturas
- Descargar facturas PDF
- Ver calendario de entregas
```

---

## 4. Módulos del Sistema

### 4.1 Dashboard (index)

**Propósito:** Vista general del estado del negocio.

**Componentes:**

| Componente | Descripción |
|------------|-------------|
| KPIs | Ingresos del mes, proyectos activos, tareas pendientes, facturas por cobrar |
| Card BI | Resumen financiero con margen de ganancia |
| Gráfico de barras | Ingresos por proyecto |
| Gráfico circular | Estado de proyectos |
| Tabla actividad | Últimas acciones del sistema |

**Datos mostrados según rol:**
- Admin/PM: Todos los datos
- Empleado: Solo sus tareas y proyectos
- Contador: Solo datos financieros

---

### 4.2 Clientes (clients, client)

**Propósito:** Gestión de clientes de la agencia.

#### Listado (clients)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Avatar/Iniciales | Generado | Primeras letras del nombre |
| Nombre completo | Texto | Nombre + Apellido |
| Empresa | Texto | Nombre de la empresa |
| Email | Email | Correo principal |
| Teléfono | Texto | Número de contacto |
| Proyectos | Número | Cantidad de proyectos |
| Estado | Badge | Activo / Inactivo |

**Filtros:** Búsqueda, Estado

**Acciones:** Ver perfil, Editar, Eliminar

#### Detalle (client)

**Secciones:**

1. **Información Principal**
   - Datos personales
   - Datos de empresa
   - Datos fiscales (RFC/NIT, dirección fiscal)

2. **Contactos** (NUEVO - Múltiples)
   | Campo | Tipo | Requerido |
   |-------|------|-----------|
   | Nombre | Texto | ✅ |
   | Cargo | Texto | ❌ |
   | Email | Email | ✅ |
   | Teléfono | Texto | ❌ |
   | Tipo | Select | ✅ |
   | Es principal | Boolean | ✅ |

   **Tipos de contacto:** Principal, Facturación, Operativo, Técnico

3. **Proyectos del Cliente**
   - Lista de proyectos asociados
   - Estado y progreso de cada uno

4. **Facturas del Cliente**
   - Historial de facturación
   - Total facturado, pagado, pendiente

5. **Notas/Actividad**
   - Historial de interacciones

---

### 4.3 Proyectos (projects, project)

**Propósito:** Gestión de proyectos y seguimiento de avance.

#### Listado (projects)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Nombre | Texto | Nombre del proyecto |
| Cliente | Relación | Cliente asociado |
| Tipo de servicio | Select | Categoría del servicio |
| Fecha inicio | Fecha | Inicio planificado |
| Fecha fin | Fecha | Entrega planificada |
| Presupuesto | Moneda | Monto total del proyecto |
| Progreso | Porcentaje | Avance calculado por tareas |
| Estado | Badge | Propuesta, En Progreso, Completado, etc. |

**Filtros:** Búsqueda, Cliente, Estado, Tipo de servicio

#### Detalle (project)

**Secciones:**

1. **Cabecera del Proyecto**
   - Nombre, cliente, estado
   - Fechas y presupuesto
   - Barra de progreso
   - Equipo asignado

2. **KPIs del Proyecto**
   - Total tareas / Completadas / En progreso / Pendientes

3. **Tabs:**
   - **Tareas:** Lista de tareas con filtros
   - **Archivos:** Documentos del proyecto
   - **Actividad:** Timeline de acciones
   - **Finanzas:** (NUEVO) Costos y rentabilidad

4. **Panel Lateral:**
   - Información del cliente
   - Equipo asignado
   - Fechas importantes
   - Acciones rápidas

**Campos para Rentabilidad (NUEVO):**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Presupuesto | Moneda | Monto acordado con cliente |
| Facturado | Moneda | Total facturado (calculado) |
| Costos directos | Moneda | Suma de movimientos asociados |
| Margen bruto | Porcentaje | (Facturado - Costos) / Facturado |

---

### 4.4 Tareas (tasks, task)

**Propósito:** Gestión de tareas y seguimiento de trabajo.

#### Listado (tasks)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Título | Texto | Nombre de la tarea |
| Proyecto | Relación | Proyecto asociado |
| Asignado | Relación | Empleado responsable |
| Prioridad | Badge | Alta, Media, Baja |
| Fecha límite | Fecha | Deadline |
| Estado | Badge | Pendiente, En Progreso, Completada |
| Tiempo estimado | Horas | Estimación |
| Tiempo registrado | Horas | Time tracking |

**Vistas:** Lista, Kanban (por estado)

#### Detalle (task)

**Secciones:**

1. **Información de la Tarea**
   - Título, descripción
   - Proyecto y cliente
   - Asignado y prioridad
   - Fechas

2. **Time Tracking** (NUEVO)
   | Campo | Tipo | Descripción |
   |-------|------|-------------|
   | Fecha | Date | Día del registro |
   | Horas | Decimal | Tiempo trabajado |
   | Descripción | Texto | Qué se hizo |
   | Usuario | Relación | Quien registra |

3. **Checklist**
   - Subtareas con checkbox

4. **Comentarios**
   - Comunicación del equipo

5. **Archivos**
   - Adjuntos de la tarea

---

### 4.5 Cotizaciones (quotes, quote) - NUEVO

**Propósito:** Crear presupuestos para clientes que pueden convertirse en facturas.

#### Listado (quotes)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Número | Texto | QUO-2026-XXXX (autogenerado) |
| Cliente | Relación | Cliente destinatario |
| Título | Texto | Descripción breve |
| Fecha | Fecha | Fecha de emisión |
| Válido hasta | Fecha | Fecha de vencimiento |
| Monto | Moneda | Total de la cotización |
| Estado | Badge | Borrador, Enviada, Aprobada, Rechazada, Expirada |

**Filtros:** Búsqueda, Cliente, Estado

**Acciones:** Ver, Editar, Duplicar, Enviar, Convertir a Factura, Eliminar

#### Detalle/Formulario (quote)

**Campos de cabecera:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| Cliente | Select | ✅ | Cliente destinatario |
| Contacto | Select | ❌ | Contacto específico del cliente |
| Título | Texto | ✅ | Nombre descriptivo |
| Fecha emisión | Date | ✅ | Default: hoy |
| Válido hasta | Date | ✅ | Default: +30 días |
| Moneda | Select | ✅ | USD / EUR |
| Notas | Textarea | ❌ | Términos y condiciones |

**Líneas de detalle (items):**

| Campo | Tipo | Requerido |
|-------|------|-----------|
| Servicio | Select/Texto | ✅ |
| Descripción | Texto | ❌ |
| Cantidad | Número | ✅ |
| Precio unitario | Moneda | ✅ |
| Descuento | Porcentaje | ❌ |
| Subtotal | Moneda | Calculado |

**Totales:**
- Subtotal
- Descuento global (opcional)
- Impuestos (configurable)
- **Total**

**Flujo de estados:**
```
Borrador ──▶ Enviada ──▶ Aprobada ──▶ Convertida a Factura
                │
                └──▶ Rechazada
                │
                └──▶ Expirada (automático si pasa fecha válido hasta)
```

---

### 4.6 Facturas (invoices, invoice)

**Propósito:** Facturación a clientes.

#### Listado (invoices)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Número | Texto | INV-2026-XXXX (autogenerado) |
| Cliente | Relación | Cliente |
| Proyecto | Relación | Proyecto asociado (opcional) |
| Cotización | Relación | Cotización origen (si aplica) |
| Fecha emisión | Fecha | Fecha de la factura |
| Fecha vencimiento | Fecha | Deadline de pago |
| Monto | Moneda | Total |
| Estado | Badge | Borrador, Enviada, Pagada, Vencida, Cancelada |

**KPIs:**
- Total facturado
- Total pagado
- Pendiente de cobro
- Vencido

#### Detalle (invoice)

Similar a cotización con campos adicionales:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Fecha vencimiento | Date | Para cálculo de "vencida" |
| Método de pago | Select | Cómo se espera el pago |
| Referencia pago | Texto | Número de transacción |
| Fecha de pago | Date | Cuándo se recibió |

**Acciones:**
- Enviar por email
- Marcar como pagada (crea movimiento automático)
- Descargar PDF
- Duplicar
- Cancelar

---

### 4.7 Suscripciones (subscriptions, subscription) - NUEVO

**Propósito:** Gestionar facturación recurrente (mantenimiento, hosting, retainers).

#### Listado (subscriptions)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Cliente | Relación | Cliente |
| Servicio | Texto | Descripción del servicio |
| Monto | Moneda | Precio recurrente |
| Frecuencia | Select | Mensual, Trimestral, Semestral, Anual |
| Próxima factura | Fecha | Cuándo se genera |
| Estado | Badge | Activa, Pausada, Cancelada |
| Facturas generadas | Número | Contador |

#### Detalle/Formulario (subscription)

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| Cliente | Select | ✅ | Cliente |
| Servicio | Select/Texto | ✅ | Del catálogo o personalizado |
| Descripción | Textarea | ❌ | Detalles |
| Monto | Moneda | ✅ | Precio por período |
| Frecuencia | Select | ✅ | Mensual/Trimestral/Semestral/Anual |
| Fecha inicio | Date | ✅ | Cuándo comienza |
| Fecha fin | Date | ❌ | Cuándo termina (vacío = indefinido) |
| Generar automático | Boolean | ✅ | Crear factura automáticamente |
| Días antes | Número | ❌ | Días antes de generar factura |

**Lógica de negocio:**
- Sistema verifica diariamente suscripciones activas
- Si `próxima_factura <= hoy + días_antes` → Genera factura borrador
- Admin revisa y envía la factura
- Actualiza `próxima_factura` según frecuencia

---

### 4.8 Empleados (employees, employee)

**Propósito:** Gestión del equipo de trabajo.

#### Listado (employees)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Nombre | Texto | Nombre completo |
| Cargo | Texto | Puesto |
| Tipo | Badge | Fijo / Freelance |
| Email | Email | Correo |
| Teléfono | Texto | Contacto |
| Proyectos | Número | Asignados actualmente |
| Estado | Badge | Activo / Inactivo |

#### Detalle (employee)

**Secciones:**

1. **Información Personal**
   - Datos de contacto
   - Foto/Avatar

2. **Información Laboral**
   | Campo | Tipo | Descripción |
   |-------|------|-------------|
   | Tipo | Select | Fijo / Freelance |
   | Cargo | Texto | Puesto |
   | Fecha ingreso | Date | Inicio laboral |
   | Fecha salida | Date | Si aplica |
   | Tarifa hora | Moneda | Para freelance |
   | Salario mensual | Moneda | Para fijos |
   | Rol sistema | Select | Admin/PM/Empleado/Contador |

3. **Contratos** (NUEVO)
   | Campo | Tipo |
   |-------|------|
   | Tipo contrato | Select (Indefinido, Por proyecto, Temporal) |
   | Fecha inicio | Date |
   | Fecha fin | Date |
   | Documento | Archivo |
   | Notas | Textarea |

4. **Proyectos Asignados**
   - Lista de proyectos actuales

5. **Pagos Realizados**
   - Historial de pagos (desde movimientos)

6. **Estadísticas**
   - Horas registradas (time tracking)
   - Tareas completadas
   - Proyectos completados

---

### 4.9 Movimientos (movements)

**Propósito:** Registro de ingresos y egresos.

#### Listado (movements)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Fecha | Fecha | Fecha del movimiento |
| Descripción | Texto | Detalle |
| Categoría | Badge | Tipo de movimiento |
| Flujo | Badge | Ingreso / Egreso |
| Relacionado | Link | Proyecto, Empleado, Factura |
| Monto | Moneda | Cantidad (+ o -) |

**KPIs:**
- Ingresos del mes
- Egresos del mes
- Balance neto
- Total movimientos

**Filtros:** Flujo, Categoría, Empleado, Proyecto, Período

#### Categorías de Movimientos (Configurables)

**Ingresos:**
- Factura cobrada
- Anticipo de proyecto
- Otro ingreso

**Egresos:**
- Pago a equipo (nómina)
- Pago a freelance
- Servicio/Herramienta (Figma, hosting, etc.)
- Gasto de proyecto
- Gasto operativo
- Impuestos
- Otro egreso

#### Formulario Nuevo Movimiento

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| Tipo | Radio | ✅ | Ingreso / Egreso |
| Fecha | Date | ✅ | Fecha del movimiento |
| Categoría | Select | ✅ | Según tipo |
| Descripción | Texto | ✅ | Detalle |
| Monto | Moneda | ✅ | Cantidad |
| Proyecto | Select | ❌ | Si está relacionado |
| Empleado | Select | ❌ | Si es pago a equipo |
| Factura | Select | ❌ | Si es cobro de factura |
| Método de pago | Select | ❌ | Banco, PayPal, Stripe, Efectivo |
| Referencia | Texto | ❌ | Número de transacción |
| Comprobante | Archivo | ❌ | Adjuntar recibo |

**Movimientos Automáticos:**
- Al marcar factura como "Pagada" → Crea ingreso automático
- Al generar nómina → Crea egresos por empleado

---

### 4.10 Servicios/Productos (services) - NUEVO

**Propósito:** Catálogo de servicios que ofrece la agencia.

#### Listado (services)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Nombre | Texto | Nombre del servicio |
| Categoría | Badge | Tipo de servicio |
| Precio base | Moneda | Precio referencial |
| Unidad | Select | Por proyecto, Por hora, Por mes |
| Estado | Badge | Activo / Inactivo |

#### Formulario

| Campo | Tipo | Requerido |
|-------|------|-----------|
| Nombre | Texto | ✅ |
| Descripción | Textarea | ❌ |
| Categoría | Select | ✅ |
| Precio base | Moneda | ✅ |
| Unidad | Select | ✅ |
| Es recurrente | Boolean | ❌ |

**Categorías de servicios (configurables):**
- Diseño Web
- Desarrollo Web
- E-commerce
- Branding / Logo
- Mantenimiento
- Hosting
- SEO
- Marketing Digital
- Consultoría

**Uso:**
- Al crear cotización → Seleccionar servicio precarga precio
- En reportes → Rentabilidad por tipo de servicio
- En proyectos → Asociar tipo de servicio

---

### 4.11 Calendario (calendar) - NUEVO

**Propósito:** Visualización de fechas importantes.

#### Vista

- Vista mensual (default)
- Vista semanal
- Vista de lista/agenda

#### Tipos de Eventos

| Tipo | Color | Origen |
|------|-------|--------|
| Deadline proyecto | 🔴 Rojo | Fecha fin de proyecto |
| Deadline tarea | 🟠 Naranja | Fecha límite de tarea |
| Factura por vencer | 🟡 Amarillo | Fecha vencimiento factura |
| Reunión | 🔵 Azul | Creado manualmente |
| Entrega | 🟢 Verde | Hito de proyecto |
| Recordatorio | 🟣 Morado | Creado manualmente |

#### Crear Evento Manual

| Campo | Tipo | Requerido |
|-------|------|-----------|
| Título | Texto | ✅ |
| Tipo | Select | ✅ |
| Fecha inicio | DateTime | ✅ |
| Fecha fin | DateTime | ❌ |
| Todo el día | Boolean | ❌ |
| Descripción | Textarea | ❌ |
| Proyecto | Select | ❌ |
| Cliente | Select | ❌ |
| Participantes | Multi-select | ❌ |
| Recordatorio | Select | ❌ |

---

### 4.12 Reportes (reports)

**Propósito:** Análisis e inteligencia de negocio.

#### Vistas de Reportes

El módulo tendrá un selector para cambiar entre diferentes reportes:

```
┌─────────────────────────────────────────────────────────┐
│  📊 Reportes                                             │
│  ┌─────────────────────────────────────────────────────┐│
│  │ Seleccionar reporte: [▼ Resumen General          ] ││
│  │                                                     ││
│  │  • Resumen General                                  ││
│  │  • Rentabilidad por Proyecto                        ││
│  │  • Rentabilidad por Cliente                         ││
│  │  • Rentabilidad por Servicio                        ││
│  │  • Proyección de Ingresos                           ││
│  │  • Productividad del Equipo                         ││
│  │  • Flujo de Caja                                    ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

#### 1. Resumen General (actual)

**KPIs:**
- Ingresos totales
- Egresos totales
- Ganancia neta
- Margen de ganancia

**Gráficos:**
- Ingresos vs Egresos (6 meses)
- Distribución de gastos (doughnut)
- Rentabilidad por proyecto (barras)
- Desglose de egresos (tabla)

#### 2. Rentabilidad por Proyecto

**Tabla:**
| Proyecto | Cliente | Facturado | Costos | Ganancia | Margen % |
|----------|---------|-----------|--------|----------|----------|

**Gráfico:** Barras comparativas (Facturado vs Costos por proyecto)

**Filtros:** Período, Estado del proyecto, Cliente

#### 3. Rentabilidad por Cliente

**Tabla:**
| Cliente | Proyectos | Facturado | Costos | Ganancia | Margen % |
|---------|-----------|-----------|--------|----------|----------|

**Gráfico:** Top 10 clientes por rentabilidad

**Filtros:** Período

#### 4. Rentabilidad por Tipo de Servicio

**Tabla:**
| Servicio | Proyectos | Facturado | Costos | Ganancia | Margen % |
|----------|-----------|-----------|--------|----------|----------|

**Gráfico:** Pie chart de distribución de ingresos por servicio

**Filtros:** Período

#### 5. Proyección de Ingresos (Pipeline)

**Datos:**
- Cotizaciones pendientes (potencial)
- Proyectos en curso (por facturar)
- Suscripciones activas (recurrente mensual)
- Facturas pendientes de cobro

**Gráfico:** Proyección a 3/6/12 meses

#### 6. Productividad del Equipo

**Tabla:**
| Empleado | Horas registradas | Tareas completadas | Proyectos | Eficiencia % |
|----------|-------------------|-------------------|-----------|--------------|

**Gráfico:** Comparativa de productividad

**Filtros:** Período, Empleado

#### 7. Flujo de Caja

**Gráfico:** Línea temporal de ingresos/egresos diarios o semanales

**Tabla:** Movimientos del período con totales

**Filtros:** Período, Categoría

---

### 4.13 Configuración (settings)

**Propósito:** Ajustes del sistema y empresa.

#### Secciones

**1. General**
- Tema (claro/oscuro)
- Idioma
- Moneda principal
- Formato de fecha

**2. Perfil**
- Datos del usuario actual
- Cambiar contraseña
- Foto de perfil

**3. Empresa**
- Nombre de la empresa
- Logo
- Datos fiscales (RFC/NIT)
- Dirección
- Teléfono
- Email
- Sitio web

**4. Facturación**
- Prefijo de facturas (INV-)
- Prefijo de cotizaciones (QUO-)
- Número siguiente
- Términos y condiciones default
- Pie de página de facturas
- Impuestos (nombre, porcentaje)

**5. Categorías** (NUEVO)
- Categorías de movimientos (Ingreso/Egreso)
- Categorías de servicios
- Estados de proyecto (personalizables)
- Métodos de pago

**6. Usuarios**
- Lista de usuarios del tenant
- Crear/Editar/Desactivar usuarios
- Asignar roles

**7. Integraciones** (NUEVO - Maqueta)
- Stripe (configurar API keys)
- PayPal (configurar)
- Gmail (conectar cuenta)
- Google Drive (conectar)

**8. Seguridad**
- Autenticación de dos factores (2FA)
- Sesiones activas
- Logs de acceso

---

### 4.14 Panel Super Admin (admin/) - NUEVO

**Propósito:** Gestión de la plataforma SaaS.

#### Dashboard Admin

**KPIs:**
- Total de empresas/tenants
- Usuarios activos
- Ingresos MRR (Monthly Recurring Revenue)
- Tasa de conversión

#### Gestión de Tenants

**Listado:**
| Empresa | Plan | Usuarios | Creado | Estado | MRR |
|---------|------|----------|--------|--------|-----|

**Acciones:**
- Crear nuevo tenant
- Ver detalles
- Cambiar plan
- Suspender/Reactivar
- Eliminar

**Crear Tenant:**
| Campo | Tipo |
|-------|------|
| Nombre empresa | Texto |
| Email admin | Email |
| Plan | Select |
| Usuario admin | Texto |
| Contraseña temporal | Generada |

#### Gestión de Planes

**Planes sugeridos:**

| Plan | Usuarios | Clientes | Proyectos | Almacenamiento | Precio/mes |
|------|----------|----------|-----------|----------------|------------|
| **Starter** | 2 | 10 | 5 | 1 GB | $29 |
| **Professional** | 5 | 50 | 25 | 5 GB | $79 |
| **Business** | 15 | Ilimitado | Ilimitado | 20 GB | $149 |
| **Enterprise** | Ilimitado | Ilimitado | Ilimitado | 100 GB | Contactar |

#### Facturación SaaS

- Historial de pagos de cada tenant
- Facturas generadas
- Recordatorios de pago

---

## 5. Modelo de Base de Datos

### 5.1 Diagrama Entidad-Relación (Simplificado)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   tenants   │────<│    users    │     │   clients   │
└─────────────┘     └─────────────┘     └──────┬──────┘
       │                   │                    │
       │                   │            ┌───────┴───────┐
       │                   │            │               │
       │            ┌──────┴──────┐     │      ┌────────┴────────┐
       │            │             │     │      │                 │
       │     ┌──────┴─────┐ ┌─────┴─────┴─┐   ┌┴─────────┐ ┌─────┴─────┐
       │     │  projects  │ │   quotes    │   │ invoices │ │ contacts  │
       │     └──────┬─────┘ └─────────────┘   └──────────┘ └───────────┘
       │            │
       │     ┌──────┴──────┐
       │     │    tasks    │
       │     └──────┬──────┘
       │            │
       │     ┌──────┴──────┐
       │     │ time_entries│
       │     └─────────────┘
       │
       │     ┌─────────────┐     ┌─────────────┐
       └────<│  employees  │────<│  movements  │
             └─────────────┘     └─────────────┘
                    │
             ┌──────┴──────┐
             │  contracts  │
             └─────────────┘
```

### 5.2 Tablas del Sistema

#### Tabla: `tenants`
```sql
CREATE TABLE tenants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    logo VARCHAR(255),
    
    -- Datos fiscales
    tax_id VARCHAR(50),
    tax_name VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    
    -- Configuración
    currency VARCHAR(3) DEFAULT 'USD',
    timezone VARCHAR(50) DEFAULT 'America/New_York',
    date_format VARCHAR(20) DEFAULT 'DD/MM/YYYY',
    invoice_prefix VARCHAR(10) DEFAULT 'INV-',
    quote_prefix VARCHAR(10) DEFAULT 'QUO-',
    invoice_next_number INT DEFAULT 1,
    quote_next_number INT DEFAULT 1,
    invoice_terms TEXT,
    invoice_footer TEXT,
    
    -- Plan y límites
    plan_id INT,
    max_users INT DEFAULT 2,
    max_clients INT DEFAULT 10,
    max_projects INT DEFAULT 5,
    max_storage_mb INT DEFAULT 1024,
    
    -- Estado
    status ENUM('active', 'suspended', 'cancelled') DEFAULT 'active',
    trial_ends_at DATETIME,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    INDEX idx_status (status),
    INDEX idx_slug (slug)
);
```

#### Tabla: `users`
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    
    -- Datos básicos
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    avatar VARCHAR(255),
    
    -- Rol y permisos
    role ENUM('super_admin', 'admin', 'project_manager', 'employee', 'accountant') NOT NULL,
    
    -- Estado
    status ENUM('active', 'inactive') DEFAULT 'active',
    email_verified_at TIMESTAMP NULL,
    last_login_at TIMESTAMP NULL,
    
    -- Seguridad
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    remember_token VARCHAR(100),
    password_reset_token VARCHAR(100),
    password_reset_expires TIMESTAMP NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    UNIQUE KEY unique_email_tenant (email, tenant_id),
    INDEX idx_tenant (tenant_id),
    INDEX idx_role (role),
    INDEX idx_status (status)
);
```

#### Tabla: `clients`
```sql
CREATE TABLE clients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    
    -- Datos básicos
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    
    -- Empresa
    company_name VARCHAR(255),
    company_website VARCHAR(255),
    
    -- Datos fiscales
    tax_id VARCHAR(50),
    tax_name VARCHAR(255),
    billing_address TEXT,
    billing_city VARCHAR(100),
    billing_state VARCHAR(100),
    billing_country VARCHAR(100),
    billing_postal_code VARCHAR(20),
    
    -- Estado
    status ENUM('active', 'inactive') DEFAULT 'active',
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    INDEX idx_tenant (tenant_id),
    INDEX idx_status (status),
    INDEX idx_company (company_name)
);
```

#### Tabla: `client_contacts`
```sql
CREATE TABLE client_contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    
    name VARCHAR(255) NOT NULL,
    position VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    type ENUM('primary', 'billing', 'operational', 'technical') DEFAULT 'primary',
    is_primary BOOLEAN DEFAULT FALSE,
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    INDEX idx_client (client_id),
    INDEX idx_type (type)
);
```

#### Tabla: `services`
```sql
CREATE TABLE services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INT,
    base_price DECIMAL(12,2) NOT NULL,
    unit ENUM('project', 'hour', 'month', 'year') DEFAULT 'project',
    is_recurring BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_tenant (tenant_id),
    INDEX idx_category (category_id)
);
```

#### Tabla: `projects`
```sql
CREATE TABLE projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    
    -- Relaciones
    client_id INT NOT NULL,
    service_id INT,
    
    -- Datos básicos
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Fechas
    start_date DATE,
    end_date DATE,
    completed_at TIMESTAMP NULL,
    
    -- Financiero
    budget DECIMAL(12,2),
    
    -- Estado
    status_id INT,
    progress INT DEFAULT 0,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (status_id) REFERENCES project_statuses(id),
    INDEX idx_tenant (tenant_id),
    INDEX idx_client (client_id),
    INDEX idx_status (status_id)
);
```

#### Tabla: `project_statuses`
```sql
CREATE TABLE project_statuses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT,
    
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#6366f1',
    sort_order INT DEFAULT 0,
    is_system BOOLEAN DEFAULT FALSE,
    is_completed BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    INDEX idx_tenant (tenant_id)
);

-- Estados por defecto (se insertan al crear tenant)
-- INSERT: Propuesta, En Progreso, En Revisión, Completado, Cancelado
```

#### Tabla: `project_members`
```sql
CREATE TABLE project_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('manager', 'member') DEFAULT 'member',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_project_user (project_id, user_id)
);
```

#### Tabla: `tasks`
```sql
CREATE TABLE tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    
    -- Relaciones
    project_id INT NOT NULL,
    assigned_to INT,
    parent_id INT,
    
    -- Datos
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Fechas
    start_date DATE,
    due_date DATE,
    completed_at TIMESTAMP NULL,
    
    -- Estado y prioridad
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    
    -- Tiempo
    estimated_hours DECIMAL(5,2),
    
    -- Orden
    sort_order INT DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (parent_id) REFERENCES tasks(id),
    INDEX idx_tenant (tenant_id),
    INDEX idx_project (project_id),
    INDEX idx_assigned (assigned_to),
    INDEX idx_status (status)
);
```

#### Tabla: `time_entries`
```sql
CREATE TABLE time_entries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    
    date DATE NOT NULL,
    hours DECIMAL(5,2) NOT NULL,
    description TEXT,
    billable BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_tenant (tenant_id),
    INDEX idx_task (task_id),
    INDEX idx_user (user_id),
    INDEX idx_date (date)
);
```

#### Tabla: `quotes`
```sql
CREATE TABLE quotes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    
    -- Número
    quote_number VARCHAR(50) NOT NULL,
    
    -- Relaciones
    client_id INT NOT NULL,
    contact_id INT,
    project_id INT,
    
    -- Datos
    title VARCHAR(255) NOT NULL,
    notes TEXT,
    terms TEXT,
    
    -- Fechas
    issue_date DATE NOT NULL,
    valid_until DATE NOT NULL,
    
    -- Montos
    currency VARCHAR(3) DEFAULT 'USD',
    subtotal DECIMAL(12,2) DEFAULT 0,
    discount_type ENUM('percentage', 'fixed') DEFAULT 'percentage',
    discount_value DECIMAL(12,2) DEFAULT 0,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) DEFAULT 0,
    
    -- Estado
    status ENUM('draft', 'sent', 'approved', 'rejected', 'expired', 'converted') DEFAULT 'draft',
    approved_at TIMESTAMP NULL,
    rejected_at TIMESTAMP NULL,
    rejection_reason TEXT,
    
    -- Conversión
    converted_to_invoice_id INT,
    converted_at TIMESTAMP NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (contact_id) REFERENCES client_contacts(id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    INDEX idx_tenant (tenant_id),
    INDEX idx_client (client_id),
    INDEX idx_status (status),
    INDEX idx_quote_number (quote_number)
);
```

#### Tabla: `quote_items`
```sql
CREATE TABLE quote_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    quote_id INT NOT NULL,
    service_id INT,
    
    description VARCHAR(255) NOT NULL,
    details TEXT,
    quantity DECIMAL(10,2) DEFAULT 1,
    unit_price DECIMAL(12,2) NOT NULL,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    subtotal DECIMAL(12,2) NOT NULL,
    sort_order INT DEFAULT 0,
    
    FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id),
    INDEX idx_quote (quote_id)
);
```

#### Tabla: `invoices`
```sql
CREATE TABLE invoices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    
    -- Número
    invoice_number VARCHAR(50) NOT NULL,
    
    -- Relaciones
    client_id INT NOT NULL,
    contact_id INT,
    project_id INT,
    quote_id INT,
    subscription_id INT,
    
    -- Datos
    title VARCHAR(255),
    notes TEXT,
    terms TEXT,
    footer TEXT,
    
    -- Fechas
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_at TIMESTAMP NULL,
    
    -- Montos
    currency VARCHAR(3) DEFAULT 'USD',
    subtotal DECIMAL(12,2) DEFAULT 0,
    discount_type ENUM('percentage', 'fixed') DEFAULT 'percentage',
    discount_value DECIMAL(12,2) DEFAULT 0,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) DEFAULT 0,
    amount_paid DECIMAL(12,2) DEFAULT 0,
    
    -- Pago
    payment_method_id INT,
    payment_reference VARCHAR(255),
    
    -- Estado
    status ENUM('draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled') DEFAULT 'draft',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (contact_id) REFERENCES client_contacts(id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (quote_id) REFERENCES quotes(id),
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id),
    INDEX idx_tenant (tenant_id),
    INDEX idx_client (client_id),
    INDEX idx_status (status),
    INDEX idx_invoice_number (invoice_number),
    INDEX idx_due_date (due_date)
);
```

#### Tabla: `invoice_items`
```sql
CREATE TABLE invoice_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_id INT NOT NULL,
    service_id INT,
    
    description VARCHAR(255) NOT NULL,
    details TEXT,
    quantity DECIMAL(10,2) DEFAULT 1,
    unit_price DECIMAL(12,2) NOT NULL,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    subtotal DECIMAL(12,2) NOT NULL,
    sort_order INT DEFAULT 0,
    
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id),
    INDEX idx_invoice (invoice_id)
);
```

#### Tabla: `subscriptions`
```sql
CREATE TABLE subscriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    
    -- Relaciones
    client_id INT NOT NULL,
    service_id INT,
    
    -- Datos
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Precio y frecuencia
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    frequency ENUM('monthly', 'quarterly', 'semi_annual', 'annual') DEFAULT 'monthly',
    
    -- Fechas
    start_date DATE NOT NULL,
    end_date DATE,
    next_invoice_date DATE NOT NULL,
    last_invoice_date DATE,
    
    -- Configuración
    auto_generate BOOLEAN DEFAULT TRUE,
    days_before INT DEFAULT 5,
    
    -- Estado
    status ENUM('active', 'paused', 'cancelled', 'ended') DEFAULT 'active',
    
    -- Contador
    invoices_generated INT DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    INDEX idx_tenant (tenant_id),
    INDEX idx_client (client_id),
    INDEX idx_status (status),
    INDEX idx_next_invoice (next_invoice_date)
);
```

#### Tabla: `employees`
```sql
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    user_id INT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    
    -- Datos personales
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    avatar VARCHAR(255),
    
    -- Datos laborales
    position VARCHAR(100),
    type ENUM('fixed', 'freelance') DEFAULT 'freelance',
    hire_date DATE,
    termination_date DATE,
    
    -- Pagos
    hourly_rate DECIMAL(10,2),
    monthly_salary DECIMAL(12,2),
    
    -- Estado
    status ENUM('active', 'inactive') DEFAULT 'active',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_tenant (tenant_id),
    INDEX idx_status (status),
    INDEX idx_type (type)
);
```

#### Tabla: `employee_contracts`
```sql
CREATE TABLE employee_contracts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    
    type ENUM('indefinite', 'project', 'temporary') DEFAULT 'indefinite',
    start_date DATE NOT NULL,
    end_date DATE,
    document VARCHAR(255),
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    INDEX idx_employee (employee_id)
);
```

#### Tabla: `movements`
```sql
CREATE TABLE movements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    
    -- Tipo
    type ENUM('income', 'expense') NOT NULL,
    category_id INT NOT NULL,
    
    -- Datos
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    date DATE NOT NULL,
    
    -- Relaciones opcionales
    project_id INT,
    employee_id INT,
    invoice_id INT,
    
    -- Pago
    payment_method_id INT,
    reference VARCHAR(255),
    
    -- Adjunto
    attachment VARCHAR(255),
    
    -- Flags
    is_automatic BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (invoice_id) REFERENCES invoices(id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id),
    INDEX idx_tenant (tenant_id),
    INDEX idx_type (type),
    INDEX idx_category (category_id),
    INDEX idx_date (date),
    INDEX idx_project (project_id)
);
```

#### Tabla: `categories`
```sql
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT,
    
    name VARCHAR(100) NOT NULL,
    type ENUM('income', 'expense', 'service') NOT NULL,
    color VARCHAR(7) DEFAULT '#6366f1',
    icon VARCHAR(50),
    is_system BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    INDEX idx_tenant (tenant_id),
    INDEX idx_type (type)
);

-- Categorías por defecto (insertar al crear tenant)
-- Ingresos: Factura cobrada, Anticipo, Otro ingreso
-- Egresos: Pago a equipo, Pago freelance, Servicio/Tool, Gasto proyecto, Gasto operativo, Impuestos, Otro
-- Servicios: Diseño Web, Desarrollo Web, E-commerce, Branding, Mantenimiento, Hosting, SEO, Marketing, Consultoría
```

#### Tabla: `payment_methods`
```sql
CREATE TABLE payment_methods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT,
    
    name VARCHAR(100) NOT NULL,
    type ENUM('bank', 'cash', 'paypal', 'stripe', 'zelle', 'other') DEFAULT 'bank',
    details TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    INDEX idx_tenant (tenant_id)
);
```

#### Tabla: `calendar_events`
```sql
CREATE TABLE calendar_events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('meeting', 'deadline', 'delivery', 'reminder', 'other') DEFAULT 'meeting',
    
    start_datetime DATETIME NOT NULL,
    end_datetime DATETIME,
    all_day BOOLEAN DEFAULT FALSE,
    
    -- Relaciones opcionales
    project_id INT,
    client_id INT,
    
    -- Recordatorio
    reminder_minutes INT,
    
    -- Creador
    created_by INT NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_tenant (tenant_id),
    INDEX idx_start (start_datetime),
    INDEX idx_type (type)
);
```

#### Tabla: `calendar_event_attendees`
```sql
CREATE TABLE calendar_event_attendees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    
    FOREIGN KEY (event_id) REFERENCES calendar_events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_event_user (event_id, user_id)
);
```

#### Tabla: `notifications`
```sql
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    user_id INT NOT NULL,
    
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    link VARCHAR(255),
    
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user (user_id),
    INDEX idx_read (is_read),
    INDEX idx_created (created_at)
);
```

#### Tabla: `activity_log`
```sql
CREATE TABLE activity_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    user_id INT,
    
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id INT,
    
    old_values JSON,
    new_values JSON,
    
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_tenant (tenant_id),
    INDEX idx_user (user_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created (created_at)
);
```

#### Tabla: `files`
```sql
CREATE TABLE files (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    
    name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100),
    size INT,
    
    -- Relación polimórfica
    fileable_type VARCHAR(100) NOT NULL,
    fileable_id INT NOT NULL,
    
    uploaded_by INT NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (uploaded_by) REFERENCES users(id),
    INDEX idx_tenant (tenant_id),
    INDEX idx_fileable (fileable_type, fileable_id)
);
```

#### Tabla: `comments`
```sql
CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    user_id INT NOT NULL,
    
    -- Relación polimórfica
    commentable_type VARCHAR(100) NOT NULL,
    commentable_id INT NOT NULL,
    
    content TEXT NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_tenant (tenant_id),
    INDEX idx_commentable (commentable_type, commentable_id)
);
```

---

## 6. Flujos de Usuario

### 6.1 Flujo: Nuevo Proyecto Completo

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Crear/Selec │────▶│   Crear     │────▶│   Crear     │
│   Cliente   │     │  Cotización │     │  Proyecto   │
└─────────────┘     └──────┬──────┘     └──────┬──────┘
                           │                    │
                    ┌──────▼──────┐      ┌──────▼──────┐
                    │   Enviar    │      │   Asignar   │
                    │  al cliente │      │   Equipo    │
                    └──────┬──────┘      └──────┬──────┘
                           │                    │
                    ┌──────▼──────┐      ┌──────▼──────┐
                    │   Cliente   │      │   Crear     │
                    │   Aprueba   │      │   Tareas    │
                    └──────┬──────┘      └──────┬──────┘
                           │                    │
                    ┌──────▼──────┐      ┌──────▼──────┐
                    │  Convertir  │      │  Ejecutar   │
                    │  a Factura  │      │  Proyecto   │
                    └─────────────┘      └──────┬──────┘
                                                │
                                         ┌──────▼──────┐
                                         │  Completar  │
                                         │  y Facturar │
                                         └─────────────┘
```

### 6.2 Flujo: Facturación Recurrente

```
┌─────────────────────────────────────────────────────────────┐
│                     CRON JOB DIARIO                          │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Buscar suscripciones donde:                                 │
│  - status = 'active'                                         │
│  - next_invoice_date <= TODAY + days_before                  │
└─────────────────────────────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
    ┌─────────────────┐       ┌─────────────────┐
    │ auto_generate   │       │ auto_generate   │
    │    = TRUE       │       │    = FALSE      │
    └────────┬────────┘       └────────┬────────┘
             │                         │
             ▼                         ▼
    ┌─────────────────┐       ┌─────────────────┐
    │ Crear factura   │       │   Notificar     │
    │   borrador      │       │    admin        │
    └────────┬────────┘       └─────────────────┘
             │
             ▼
    ┌─────────────────┐
    │ Actualizar      │
    │ next_invoice    │
    │ según frecuencia│
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Notificar admin │
    │ para revisar    │
    └─────────────────┘
```

### 6.3 Flujo: Registro de Pago de Factura

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Factura    │────▶│   Marcar    │────▶│   Crear     │
│  Pendiente  │     │ como Pagada │     │ Movimiento  │
└─────────────┘     └──────┬──────┘     │ Automático  │
                           │            └──────┬──────┘
                           │                   │
                    ┌──────▼──────┐     ┌──────▼──────┐
                    │  Ingresar   │     │ Tipo:Ingreso│
                    │  Detalles:  │     │ Cat:Factura │
                    │  - Método   │     │ Ref:Factura │
                    │  - Ref      │     └─────────────┘
                    │  - Fecha    │
                    └─────────────┘
```

---

## 7. Integraciones

### 7.1 Stripe (Pagos)

**Propósito:** Permitir a los clientes pagar facturas online.

**Flujo:**
1. Cliente recibe factura por email con link de pago
2. Click en "Pagar ahora" → Redirect a Stripe Checkout
3. Cliente completa pago
4. Webhook de Stripe notifica al sistema
5. Sistema marca factura como pagada
6. Se crea movimiento de ingreso automático

**Configuración requerida:**
- Stripe Public Key
- Stripe Secret Key
- Webhook Secret

**Implementación futura:** Maqueta visual en Settings > Integraciones

---

### 7.2 PayPal (Pagos)

**Similar a Stripe** con PayPal Checkout.

---

### 7.3 Gmail (Email)

**Propósito:** Enviar emails desde el ERP (facturas, cotizaciones, notificaciones).

**Funcionalidades:**
- Enviar factura/cotización al cliente
- Notificaciones automáticas
- Recordatorios de pago

**Configuración:**
- OAuth 2.0 con cuenta de Gmail
- O SMTP credentials

---

### 7.4 Google Drive (Almacenamiento)

**Propósito:** Almacenar archivos de proyectos en la nube.

**Funcionalidades:**
- Subir archivos a Drive automáticamente
- Estructura: `/YPServicesERP/Clientes/{Cliente}/Proyectos/{Proyecto}/`
- Visualizar archivos desde el ERP

**Configuración:**
- Google API credentials
- OAuth 2.0

---

### 7.5 Cal.com (Scheduling/Reuniones)

**Propósito:** Permitir a los clientes agendar reuniones y llamadas con la agencia.

**¿Por qué Cal.com y no desarrollo propio?**
Cal.com es una plataforma open source especializada en scheduling que ya resuelve:
- Gestión de disponibilidad
- Manejo de zonas horarias
- Recordatorios automáticos por email
- Sincronización con Google Calendar / Outlook
- Prevención de conflictos de horarios
- Tipos de reuniones personalizables

Desarrollar esto desde cero tomaría semanas y no aportaría valor diferencial al ERP.

**Funcionalidades en YPServicesERP:**

| Ubicación | Funcionalidad |
|-----------|---------------|
| **Portal Cliente** | Embed del widget de Cal.com para que clientes agenden reuniones |
| **Dashboard** | Widget de "Próximas reuniones" sincronizado desde Cal.com |
| **Calendario interno** | Mostrar reuniones agendadas junto con deadlines y vencimientos |
| **Perfil de cliente** | Ver historial de reuniones con ese cliente |

**Flujo de integración:**

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Cliente accede  │────▶│  Widget Cal.com │────▶│ Selecciona hora │
│ al Portal       │     │  (embed)        │     │ y confirma      │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                        ┌─────────────────┐              │
                        │  Cal.com envía  │◀─────────────┘
                        │  confirmación   │
                        └────────┬────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
    ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
    │ Email a cliente │ │ Email a agencia │ │ Webhook a ERP   │
    │ con detalles    │ │ con detalles    │ │ (opcional)      │
    └─────────────────┘ └─────────────────┘ └────────┬────────┘
                                                     │
                                            ┌────────▼────────┐
                                            │ ERP registra    │
                                            │ evento en       │
                                            │ calendario      │
                                            └─────────────────┘
```

**Configuración requerida:**
- Cuenta de Cal.com (gratis o de pago)
- API Key de Cal.com
- ID del calendario/evento a embeber
- Webhook URL (opcional, para sincronización automática)

**Tipos de reuniones sugeridos:**
- Llamada inicial / Discovery call (30 min)
- Revisión de proyecto (45 min)
- Presentación de propuesta (30 min)
- Soporte técnico (15 min)

**Implementación:** Maqueta visual en Settings > Integraciones con campos para configurar la conexión.

---

## 8. Consideraciones Técnicas

### 8.1 Seguridad

| Aspecto | Implementación |
|---------|----------------|
| **Autenticación** | Sesiones PHP con tokens seguros |
| **Passwords** | Hash con `password_hash()` (bcrypt) |
| **SQL Injection** | Prepared statements (PDO) |
| **XSS** | Escape de output con `htmlspecialchars()` |
| **CSRF** | Tokens en formularios |
| **Tenant Isolation** | Middleware que filtra por `tenant_id` en cada query |
| **Rate Limiting** | Límite de requests por IP/usuario |
| **2FA** | Opcional con TOTP (Google Authenticator) |

### 8.2 Performance

| Aspecto | Implementación |
|---------|----------------|
| **Índices DB** | En campos de búsqueda y relaciones |
| **Paginación** | Límite de registros por página (20-50) |
| **Lazy Loading** | Cargar datos bajo demanda |
| **Caching** | Cache de queries frecuentes (Redis/Memcached futuro) |
| **Assets** | Minificación de CSS/JS en producción |
| **Imágenes** | Compresión y thumbnails |

### 8.3 Escalabilidad

| Fase | Estrategia |
|------|------------|
| **Inicial** | Servidor único con MySQL |
| **Crecimiento** | Separar DB en servidor dedicado |
| **Escala** | Read replicas para queries de reportes |
| **Enterprise** | Considerar sharding por tenant o DB separada |

### 8.4 Backups

- Backup diario automático de base de datos
- Backup de archivos subidos
- Retención de 30 días
- Almacenamiento en ubicación externa (S3, etc.)

---

## 9. Roadmap de Desarrollo

### Fase 1: MVP Core (4-6 semanas)

**Objetivo:** Sistema funcional con módulos básicos.

| Semana | Entregables |
|--------|-------------|
| 1-2 | Setup proyecto PHP, estructura base, autenticación, middleware tenant |
| 3 | Módulo Clientes (CRUD completo + contactos) |
| 4 | Módulo Proyectos + Tareas |
| 5 | Módulo Facturas + Cotizaciones |
| 6 | Módulo Movimientos + Dashboard |

**Entregables:**
- ✅ Login/Logout/Reset password
- ✅ Dashboard con KPIs
- ✅ CRUD Clientes con contactos múltiples
- ✅ CRUD Proyectos con estados
- ✅ CRUD Tareas
- ✅ CRUD Cotizaciones → Convertir a Factura
- ✅ CRUD Facturas
- ✅ CRUD Movimientos básico
- ✅ Configuración básica

---

### Fase 2: Funcionalidades Avanzadas (3-4 semanas)

**Objetivo:** Completar módulos y añadir features clave.

| Semana | Entregables |
|--------|-------------|
| 7 | Módulo Empleados + Contratos |
| 8 | Módulo Suscripciones + Cron jobs |
| 9 | Módulo Servicios + Calendario |
| 10 | Reportes avanzados (BI) |

**Entregables:**
- ✅ CRUD Empleados con tipos y contratos
- ✅ Suscripciones con facturación recurrente
- ✅ Catálogo de servicios
- ✅ Calendario con eventos
- ✅ Time tracking en tareas
- ✅ Reportes: Rentabilidad proyecto/cliente/servicio
- ✅ Exportar reportes a PDF

---

### Fase 3: Multi-tenant & Admin (2-3 semanas)

**Objetivo:** Preparar para venta como SaaS.

| Semana | Entregables |
|--------|-------------|
| 11 | Panel Super Admin |
| 12 | Sistema de planes y límites |
| 13 | Onboarding de nuevos tenants |

**Entregables:**
- ✅ Panel Super Admin
- ✅ Gestión de tenants (crear, suspender, eliminar)
- ✅ Planes con límites
- ✅ Registro de nueva empresa
- ✅ Wizard de configuración inicial

---

### Fase 4: Integraciones & Portal (2-3 semanas)

**Objetivo:** Conectar con servicios externos.

| Semana | Entregables |
|--------|-------------|
| 14 | Integración Stripe/PayPal |
| 15 | Integración Email (Gmail/SMTP) |
| 16 | Portal de Cliente mejorado |

**Entregables:**
- ✅ Pago de facturas con Stripe
- ✅ Envío de emails automático
- ✅ Portal cliente: ver proyectos, facturas, cotizaciones
- ✅ Aprobar/rechazar cotizaciones desde portal

---

### Fase 5: Polish & Launch (2 semanas)

**Objetivo:** Pulir y preparar para producción.

| Semana | Entregables |
|--------|-------------|
| 17 | Testing, bug fixes, optimización |
| 18 | Documentación, deploy, launch |

**Entregables:**
- ✅ Testing completo
- ✅ Optimización de performance
- ✅ Documentación de usuario
- ✅ Deploy en producción
- ✅ Dominio y SSL configurado

---

## 10. Anexos

### 10.1 Glosario

| Término | Definición |
|---------|------------|
| **Tenant** | Empresa/agencia que usa el sistema (cliente del SaaS) |
| **Multi-tenant** | Arquitectura donde múltiples empresas comparten la misma instancia |
| **KPI** | Key Performance Indicator - Métrica clave de rendimiento |
| **BI** | Business Intelligence - Análisis de datos del negocio |
| **CRUD** | Create, Read, Update, Delete - Operaciones básicas |
| **MRR** | Monthly Recurring Revenue - Ingresos recurrentes mensuales |

### 10.2 Referencias de Diseño

- **Framework CSS:** Bootstrap 5.3
- **Iconos:** Bootstrap Icons
- **Fuente:** Plus Jakarta Sans
- **Colores principales:**
  - Primary: #6366f1
  - Success: #10b981
  - Warning: #f59e0b
  - Danger: #ef4444
  - Info: #3b82f6

### 10.3 Archivos HTML Existentes

**Ya creados:**
- index.html, clients.html, client.html
- projects.html, project.html
- tasks.html, task.html
- invoices.html, invoice.html
- employees.html, employee.html
- movements.html
- reports.html
- settings.html
- login.html, forgot-password.html, reset-password.html

**Por crear:**
- quotes.html, quote.html
- subscriptions.html, subscription.html
- services.html
- calendar.html
- admin/index.html, admin/tenants.html, admin/plans.html

---

## Control de Versiones del Documento

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | Enero 2026 | Versión inicial completa |

---

**Fin del Documento PRD - YPServicesERP**
