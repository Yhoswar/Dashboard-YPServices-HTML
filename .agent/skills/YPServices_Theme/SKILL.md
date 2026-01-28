---
name: Diseño Theme YPServices
description: Guía de estilos oficial y sistema de diseño para YPServicesERP. Referencia obligatoria para mantener la consistencia visual en todas las secciones.
---

# 🎨 Sistema de Diseño YPServicesERP

---

## 1. Arquitectura CSS

### Core CSS (`main.css`)
El archivo `main.css` solo importa estilos **core/tema**:
| Archivo | Propósito |
|---------|-----------|
| `variables.css` | Tokens de diseño (colores, radios, transiciones) |
| `base.css` | Reset, tipografía, animaciones |
| `layout.css` | Sidebar, header, estructura |
| `components.css` | Cards, botones, tablas, badges |
| `pages.css` | Estilos de página compartidos |
| `responsive.css` | Media queries |

### CSS de Página (cargado individualmente)
Cada página HTML carga su CSS específico después de `main.css`:
```html
<link href="assets/css/main.css" rel="stylesheet">
<link href="assets/css/client.css" rel="stylesheet">
```

| Página(s) | CSS |
|-----------|-----|
| `client.html` | `client.css` |
| `employee.html` | `employee.css` |
| `project.html` | `project.css` |
| `task.html`, `tasks.html` | `tasks.css` |
| `invoice.html`, `invoices.html` | `invoices.css` |
| `reports.html` | `reports.css` |
| `movements.html` | `movements.css` |
| Auth pages | `auth.css` |

---

## 2. Paleta de Colores (`variables.css`)

### Principales
| Token | Color | Uso |
|-------|-------|-----|
| `--primary` | `#6366f1` | Acciones principales |
| `--primary-light` | `#818cf8` | Hover, acentos |
| `--primary-dark` | `#4f46e5` | Active state |
| `--secondary` | `#8b5cf6` | Elementos decorativos |

### Estados
| Token | Color | Significado |
|-------|-------|-------------|
| `--success` | `#10b981` | Éxito, Ingresos ✅ |
| `--warning` | `#f59e0b` | Pendiente, Costos ⚠️ |
| `--danger` | `#ef4444` | Error, Egresos ❌ |
| `--info` | `#3b82f6` | Información ℹ️ |

### Textos (Light Mode)
| Token | Color | Uso |
|-------|-------|-----|
| `--text-primary` | `#1e293b` | Títulos, contenido principal |
| `--text-secondary` | `#475569` | Subtítulos |
| `--text-muted` | `#64748b` | Metadata, placeholders |

---

## 3. Tipografía (`base.css`)

- **Font Family:** `'Plus Jakarta Sans', sans-serif`
- **Uso:** Importar desde Google Fonts

---

## 4. Componentes UI (`components.css`)

### 📊 KPI Cards
```html
<div class="kpi-card">
    <div class="kpi-header">
        <div class="kpi-icon primary"><i class="bi bi-currency-dollar"></i></div>
        <span class="kpi-trend up"><i class="bi bi-arrow-up"></i> 12.5%</span>
    </div>
    <div class="kpi-label">Título</div>
    <div class="kpi-value">$24,500</div>
    <div class="kpi-sublabel">Comparativa</div>
</div>
```
**Variantes icon:** `.primary`, `.success`, `.warning`, `.info`, `.danger`

### 🔖 Status Badges
```html
<span class="status-badge active">Activo</span>
<span class="status-badge pending">Pendiente</span>
<span class="status-badge progress">En Progreso</span>
<span class="status-badge overdue">Vencido</span>
```

### 🔘 Botones
| Clase | Uso |
|-------|-----|
| `.btn-custom-primary` | Acción principal |
| `.btn-custom-secondary` | Acción secundaria |
| `.btn-custom-danger` | Eliminar/Cancelar |
| `.action-btn` | Iconos en tablas |
| `.action-btn.delete` | Delete (hover rojo) |

### 📝 Formularios
```html
<label class="form-label-custom">Label</label>
<input type="text" class="form-control-custom" placeholder="...">
<select class="form-select-custom"><option>...</option></select>
```

---

## 5. Layout (`layout.css`)

| Elemento | Descripción |
|----------|-------------|
| `.sidebar` | Navegación lateral (siempre oscura) |
| `.main-content` | Contenido principal |
| `.app-container` | Wrapper flex |
| `--sidebar-width` | `260px` (expandido) |
| `--sidebar-collapsed` | `80px` (colapsado) |

---

## 6. Reglas

1. **NO hardcodear colores** → Usar `var(--variable)`
2. **Espaciado** → Bootstrap utilities: `p-*`, `m-*`, `gap-*`
3. **Iconos** → Bootstrap Icons: `bi bi-[nombre]`
4. **Dark Mode** → Siempre verificar con `data-theme="dark"`
5. **CSS por página** → Cargar CSS específico individualmente

---
---
*Actualizado: 2026-01-25*

## 7. Responsive Breakpoints (`responsive.css`)

El sistema utiliza 4 breakpoints principales para adaptar la interfaz:

| Breakpoint | Ancho | Comportamiento |
|------------|-------|----------------|
| **XL** | `≥ 1200px` | Escritorio: Sidebar expandido/colapsable con botón. |
| **LG/MD** | `< 1200px` | Tablet: Sidebar oculto por defecto (offcanvas), toggle hamburguesa visible. |
| **SM** | `< 768px` | Móvil Landscape: Reducción de paddings, fuentes y ajustes en tablas. |
| **XS** | `< 576px` | Móvil Portrait: Vista de tarjetas para tablas, fuentes reducidas, modales full-width. |

---

## 8. Estructura de Layout (`layout.css`)

```html
<div class="app-container">
    <!-- Sidebar -->
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">...</div>
        <nav class="sidebar-nav">...</nav>
        <div class="sidebar-footer">...</div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Header Sticky -->
        <header class="main-header">
            <button class="menu-toggle">...</button>
            <div class="search-box">...</div>
            <div class="header-actions">...</div>
        </header>

        <!-- Page Content -->
        <div class="page-content">
           <!-- Contenido dinámico -->
        </div>
    </main>
</div>
```

---

## 9. Componentes Adicionales (`components.css`)

### 📋 Tablas (`.table-custom`)
Tablas limpias con bordes suaves y hover effects.
```html
<div class="table-responsive">
    <table class="table table-custom">
        <thead>
            <tr><th>Encabezado</th></tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <div class="d-flex align-items-center gap-3">
                        <div class="table-avatar">JD</div> <!-- Avatar -->
                        <div>
                            <span class="table-user-name">John Doe</span>
                            <span class="table-user-email">john@example.com</span>
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</div>
```

### 🖥️ Modales (`.modal-custom`)
Modales flotantes con bordes redondeados y sombra suave.
```html
<div class="modal fade modal-custom" id="miModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Título</h5>
                <button type="button" class="modal-close-btn" data-bs-dismiss="modal">
                    <i class="bi bi-x"></i>
                </button>
            </div>
            <div class="modal-body">...</div>
            <div class="modal-footer">...</div>
        </div>
    </div>
</div>
```

### 🍞 Toasts (`.toast-custom`)
Notificaciones flotantes en la esquina inferior derecha.
```html
<div class="toast-container-custom">
    <div class="toast toast-custom show align-items-center border-0" role="alert">
        <div class="d-flex">
            <div class="toast-body d-flex align-items-center gap-2">
                <i class="bi bi-check-circle-fill text-success"></i>
                <div>
                    <h6 class="mb-0">Éxito</h6>
                    <small>Operación completada.</small>
                </div>
            </div>
            <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    </div>
</div>
```
