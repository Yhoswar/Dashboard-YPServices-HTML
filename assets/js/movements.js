/**
 * YPServicesERP - Movements Module
 * Gestión de movimientos financieros (ingresos y egresos)
 * @version 2.0.0
 */

const Movements = (function() {
    'use strict';

    // Modal instances
    let newModal, detailModal, deleteModal;
    let currentMovementId = null;
    let isEditMode = false;

    // Demo data - En producción vendría de la API
    const movementsData = {
        1: {
            type: 'income',
            category: 'factura',
            categoryLabel: 'Factura Cobrada',
            icon: 'bi-receipt-cutoff',
            description: 'Pago Factura #INV-2026-048',
            amount: 3500,
            date: '2026-01-15',
            employeeId: '',
            employee: null,
            projectId: '1',
            project: 'E-commerce TechStore',
            notes: 'Pago completo del proyecto',
            origin: 'auto',
            originLabel: 'Automático - Facturación',
            editable: false
        },
        2: {
            type: 'income',
            category: 'factura',
            categoryLabel: 'Factura Cobrada',
            icon: 'bi-receipt-cutoff',
            description: 'Pago Factura #INV-2026-045',
            amount: 7500,
            date: '2026-01-12',
            employeeId: '',
            employee: null,
            projectId: '2',
            project: 'App Móvil FinanceTrack',
            notes: '',
            origin: 'auto',
            originLabel: 'Automático - Facturación',
            editable: false
        },
        3: {
            type: 'expense',
            category: 'payment',
            categoryLabel: 'Pago a Equipo',
            icon: 'bi-person-fill',
            description: 'Pago quincenal - María García',
            amount: 1800,
            date: '2026-01-11',
            employeeId: '1',
            employee: 'María García',
            projectId: '',
            project: null,
            notes: 'Pago correspondiente a primera quincena de enero 2026',
            origin: 'auto',
            originLabel: 'Automático - Empleados',
            editable: false
        },
        4: {
            type: 'expense',
            category: 'payment',
            categoryLabel: 'Pago a Equipo',
            icon: 'bi-person-fill',
            description: 'Pago quincenal - Carlos López',
            amount: 2200,
            date: '2026-01-10',
            employeeId: '2',
            employee: 'Carlos López',
            projectId: '',
            project: null,
            notes: '',
            origin: 'auto',
            originLabel: 'Automático - Empleados',
            editable: false
        },
        5: {
            type: 'expense',
            category: 'service',
            categoryLabel: 'Servicio/Tool',
            icon: 'bi-cloud-fill',
            description: 'Suscripción AWS - Enero',
            amount: 450,
            date: '2026-01-08',
            employeeId: '',
            employee: null,
            projectId: '1',
            project: 'E-commerce TechStore',
            notes: 'Factura AWS-2026-0108',
            origin: 'manual',
            originLabel: 'Registro Manual',
            editable: true
        },
        6: {
            type: 'expense',
            category: 'project',
            categoryLabel: 'Gasto Proyecto',
            icon: 'bi-kanban-fill',
            description: 'Licencia plugin premium',
            amount: 79,
            date: '2026-01-05',
            employeeId: '',
            employee: null,
            projectId: '2',
            project: 'App Gestión Inventario',
            notes: 'Plugin WooCommerce para inventario',
            origin: 'manual',
            originLabel: 'Registro Manual',
            editable: true
        },
        7: {
            type: 'expense',
            category: 'service',
            categoryLabel: 'Servicio/Tool',
            icon: 'bi-palette-fill',
            description: 'Suscripción Figma Team',
            amount: 75,
            date: '2026-01-03',
            employeeId: '',
            employee: null,
            projectId: '',
            project: 'General',
            notes: 'Plan Team mensual',
            origin: 'manual',
            originLabel: 'Registro Manual',
            editable: true
        },
        8: {
            type: 'income',
            category: 'factura',
            categoryLabel: 'Factura Cobrada',
            icon: 'bi-receipt-cutoff',
            description: 'Abono proyecto Landing Page',
            amount: 2000,
            date: '2026-01-02',
            employeeId: '',
            employee: null,
            projectId: '3',
            project: 'Landing Page Promo',
            notes: 'Abono inicial 50%',
            origin: 'auto',
            originLabel: 'Automático - Facturación',
            editable: false
        },
        9: {
            type: 'expense',
            category: 'other',
            categoryLabel: 'Otro',
            icon: 'bi-globe',
            description: 'Dominio anual ypservices.com',
            amount: 15,
            date: '2026-01-01',
            employeeId: '',
            employee: null,
            projectId: '',
            project: 'General',
            notes: 'Renovación anual',
            origin: 'manual',
            originLabel: 'Registro Manual',
            editable: true
        }
    };

    /**
     * Initialize module
     */
    function init() {
        // Initialize modals
        const newModalEl = document.getElementById('newMovementModal');
        const detailModalEl = document.getElementById('detailMovementModal');
        const deleteModalEl = document.getElementById('deleteMovementModal');

        if (newModalEl) newModal = new bootstrap.Modal(newModalEl);
        if (detailModalEl) detailModal = new bootstrap.Modal(detailModalEl);
        if (deleteModalEl) deleteModal = new bootstrap.Modal(deleteModalEl);

        // Set default date
        setDefaultDate();

        // Setup event listeners
        setupEventListeners();

        console.log('Movements module initialized');
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Type change handler
        const typeSelect = document.getElementById('movementType');
        if (typeSelect) {
            typeSelect.addEventListener('change', handleTypeChange);
        }

        // Filter change handlers
        const filters = ['filterFlow', 'filterCategory', 'filterEmployee', 'filterProject', 'filterPeriod'];
        filters.forEach(filterId => {
            const el = document.getElementById(filterId);
            if (el) el.addEventListener('change', applyFilters);
        });

        // Reset form when modal closes
        const newModalEl = document.getElementById('newMovementModal');
        if (newModalEl) {
            newModalEl.addEventListener('hidden.bs.modal', function() {
                resetForm();
            });
        }
    }

    /**
     * Set default date to today
     */
    function setDefaultDate() {
        const dateInput = document.getElementById('movementDate');
        if (dateInput && !dateInput.value) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
    }

    /**
     * Handle type change
     */
    function handleTypeChange() {
        // En esta versión simplificada no hay campos condicionales
        // Los pagos a equipo y facturas son automáticos
    }

    /**
     * Apply filters (demo)
     */
    function applyFilters() {
        console.log('Applying filters...');
        if (typeof Toast !== 'undefined') {
            Toast.info('Filtros aplicados', 'Los resultados han sido actualizados.');
        }
    }

    /**
     * Open new movement modal
     */
    function openNew() {
        isEditMode = false;
        currentMovementId = null;
        resetForm();
        
        // Update modal title
        const title = document.getElementById('movementModalTitle');
        if (title) {
            title.innerHTML = '<i class="bi bi-plus-circle text-primary me-2"></i>Nuevo Movimiento';
        }
        
        if (newModal) newModal.show();
    }

    /**
     * Open detail modal (view only)
     * @param {number} id - Movement ID
     */
    function openDetail(id) {
        currentMovementId = id;
        const data = movementsData[id];
        
        if (!data) {
            console.error('Movement not found:', id);
            return;
        }

        // Update icon
        const iconEl = document.getElementById('detailIcon');
        if (iconEl) {
            // Remove all type classes
            iconEl.className = 'movement-icon-lg';
            // Add appropriate class
            if (data.type === 'income') {
                iconEl.classList.add('income');
            } else {
                iconEl.classList.add(data.category);
            }
            iconEl.innerHTML = `<i class="bi ${data.icon}"></i>`;
        }

        // Update description
        const descEl = document.getElementById('detailDescription');
        if (descEl) descEl.textContent = data.description;

        // Update type badge
        const typeEl = document.getElementById('detailType');
        if (typeEl) {
            typeEl.className = 'type-badge';
            if (data.type === 'income') {
                typeEl.classList.add('income');
            } else {
                typeEl.classList.add(data.category);
            }
            typeEl.textContent = data.categoryLabel;
        }

        // Update amount
        const amountEl = document.getElementById('detailAmount');
        if (amountEl) {
            if (data.type === 'income') {
                amountEl.textContent = `+$${data.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
                amountEl.className = 'col-7 fw-bold text-success';
            } else {
                amountEl.textContent = `-$${data.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
                amountEl.className = 'col-7 fw-bold text-danger';
            }
        }

        // Update date
        const dateEl = document.getElementById('detailDate');
        if (dateEl) {
            const date = new Date(data.date + 'T00:00:00');
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            dateEl.textContent = date.toLocaleDateString('es-ES', options);
        }

        // Update employee (show/hide row)
        const employeeRow = document.getElementById('detailEmployeeRow');
        const employeeEl = document.getElementById('detailEmployee');
        if (employeeRow && employeeEl) {
            if (data.employee) {
                employeeRow.style.display = '';
                employeeEl.textContent = data.employee;
            } else {
                employeeRow.style.display = 'none';
            }
        }

        // Update project
        const projectEl = document.getElementById('detailProject');
        if (projectEl) {
            projectEl.textContent = data.project || '—';
        }

        // Update notes
        const notesEl = document.getElementById('detailNotes');
        if (notesEl) {
            notesEl.textContent = data.notes || '—';
        }

        // Update origin
        const originEl = document.getElementById('detailOrigin');
        if (originEl) {
            if (data.origin === 'auto') {
                originEl.innerHTML = `<span class="badge bg-info bg-opacity-10 text-info">${data.originLabel}</span>`;
            } else {
                originEl.innerHTML = `<span class="badge bg-secondary bg-opacity-10 text-secondary">${data.originLabel}</span>`;
            }
        }

        // Show modal
        if (detailModal) detailModal.show();
    }

    /**
     * Open edit modal with pre-filled data
     * @param {number} id - Movement ID
     */
    function openEdit(id) {
        currentMovementId = id;
        isEditMode = true;
        const data = movementsData[id];
        
        if (!data) {
            console.error('Movement not found:', id);
            return;
        }

        // Check if editable
        if (!data.editable) {
            if (typeof Toast !== 'undefined') {
                Toast.warning('No editable', 'Los movimientos automáticos no se pueden editar.');
            }
            return;
        }

        // Close detail modal if open
        if (detailModal) detailModal.hide();

        // Update modal title
        const title = document.getElementById('movementModalTitle');
        if (title) {
            title.innerHTML = '<i class="bi bi-pencil text-primary me-2"></i>Editar Movimiento';
        }

        // Fill form with data
        const typeSelect = document.getElementById('movementType');
        if (typeSelect) {
            // Map category to select value
            const typeMap = {
                'service': 'servicio',
                'project': 'proyecto',
                'other': 'otro_egreso'
            };
            typeSelect.value = typeMap[data.category] || data.category;
        }

        const descInput = document.getElementById('movementDescription');
        if (descInput) descInput.value = data.description;

        const amountInput = document.getElementById('movementAmount');
        if (amountInput) amountInput.value = data.amount;

        const dateInput = document.getElementById('movementDate');
        if (dateInput) dateInput.value = data.date;

        const projectSelect = document.getElementById('movementProject');
        if (projectSelect) projectSelect.value = data.projectId || '';

        const notesInput = document.getElementById('movementNotes');
        if (notesInput) notesInput.value = data.notes || '';

        // Show modal
        if (newModal) newModal.show();
    }

    /**
     * Open delete confirmation modal
     * @param {number} id - Movement ID
     */
    function openDelete(id) {
        currentMovementId = id;
        const data = movementsData[id];

        if (!data) {
            console.error('Movement not found:', id);
            return;
        }

        // Check if editable
        if (!data.editable) {
            if (typeof Toast !== 'undefined') {
                Toast.warning('No eliminable', 'Los movimientos automáticos no se pueden eliminar.');
            }
            return;
        }

        if (deleteModal) deleteModal.show();
    }

    /**
     * Save movement (create or update)
     */
    function save() {
        const form = document.getElementById('newMovementForm');
        
        // Basic validation
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Get form data
        const formData = {
            type: document.getElementById('movementType').value,
            description: document.getElementById('movementDescription').value,
            amount: parseFloat(document.getElementById('movementAmount').value),
            date: document.getElementById('movementDate').value,
            projectId: document.getElementById('movementProject').value,
            notes: document.getElementById('movementNotes').value
        };

        console.log('Saving movement:', formData, 'Edit mode:', isEditMode);

        // Close modal
        if (newModal) newModal.hide();

        // Show success message
        const action = isEditMode ? 'actualizado' : 'creado';
        if (typeof Toast !== 'undefined') {
            Toast.success('Movimiento ' + action, 'El movimiento ha sido guardado correctamente.');
        }

        // Reset state
        resetForm();
    }

    /**
     * Confirm delete
     */
    function confirmDelete() {
        console.log('Deleting movement:', currentMovementId);

        // Close modal
        if (deleteModal) deleteModal.hide();

        // Show success message
        if (typeof Toast !== 'undefined') {
            Toast.success('Movimiento eliminado', 'El movimiento ha sido eliminado correctamente.');
        }

        currentMovementId = null;
    }

    /**
     * Reset form
     */
    function resetForm() {
        const form = document.getElementById('newMovementForm');
        if (form) form.reset();
        
        setDefaultDate();
        currentMovementId = null;
        isEditMode = false;
    }

    // Public API
    return {
        init: init,
        openNew: openNew,
        openDetail: openDetail,
        openEdit: openEdit,
        openDelete: openDelete,
        save: save,
        confirmDelete: confirmDelete
    };

})();

// Auto-init when DOM is ready
document.addEventListener('DOMContentLoaded', Movements.init);
