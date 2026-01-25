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
*Actualizado: 2026-01-25*
