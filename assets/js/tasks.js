/**
 * YPServicesERP - Tasks Module
 * Gestión de tareas: CRUD, vistas, calendario
 * @version 1.0.0
 */

const Tasks = (function() {
    'use strict';

    // DOM Elements
    let viewListBtn;
    let viewCalendarBtn;
    let taskListView;
    let taskCalendarView;
    let calendar = null;

    // Modals
    let taskModal;
    let taskDetailModal;
    let deleteModal;

    // Current state
    let currentTaskId = null;
    let isEditMode = false;

    /**
     * Inicializa el módulo de tareas
     */
    function init() {
        cacheElements();
        bindEvents();
        initFileUpload();
    }

    /**
     * Cache de elementos DOM
     */
    function cacheElements() {
        viewListBtn = document.getElementById('viewList');
        viewCalendarBtn = document.getElementById('viewCalendar');
        taskListView = document.getElementById('taskListView');
        taskCalendarView = document.getElementById('taskCalendarView');
    }

    /**
     * Bindea todos los eventos
     */
    function bindEvents() {
        // View toggle
        if (viewListBtn) {
            viewListBtn.addEventListener('click', showListView);
        }
        if (viewCalendarBtn) {
            viewCalendarBtn.addEventListener('click', showCalendarView);
        }

        // Project selection auto-fills client
        const taskProject = document.getElementById('taskProject');
        if (taskProject) {
            taskProject.addEventListener('change', handleProjectChange);
        }

        // Task checkboxes
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', handleTaskCheckbox);
        });

        // Reset modal on close
        const taskModalEl = document.getElementById('taskModal');
        if (taskModalEl) {
            taskModalEl.addEventListener('hidden.bs.modal', resetTaskModal);
        }
    }

    /* ========================================
       VIEW TOGGLE
    ======================================== */

    /**
     * Muestra vista de lista
     */
    function showListView() {
        viewListBtn.classList.add('active');
        viewCalendarBtn.classList.remove('active');
        taskListView.classList.remove('d-none');
        taskCalendarView.classList.add('d-none');
    }

    /**
     * Muestra vista de calendario
     */
    function showCalendarView() {
        viewCalendarBtn.classList.add('active');
        viewListBtn.classList.remove('active');
        taskListView.classList.add('d-none');
        taskCalendarView.classList.remove('d-none');

        // Initialize calendar if not already done
        if (!calendar) {
            initCalendar();
        }
    }

    /**
     * Inicializa FullCalendar
     */
    function initCalendar() {
        const calendarEl = document.getElementById('calendar');
        if (!calendarEl) return;

        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'es',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,listWeek'
            },
            buttonText: {
                today: 'Hoy',
                month: 'Mes',
                week: 'Semana',
                list: 'Lista'
            },
            events: getCalendarEvents(),
            eventClick: function(info) {
                openTaskDetail(info.event.id);
            },
            height: 'auto'
        });
        calendar.render();
    }

    /**
     * Obtiene eventos para el calendario
     * @returns {Array} Lista de eventos
     */
    function getCalendarEvents() {
        // En producción, esto vendría de la base de datos
        return [
            {
                id: '1',
                title: 'Diseño de mockups página principal',
                start: '2026-01-05',
                backgroundColor: '#10b981',
                borderColor: '#10b981'
            },
            {
                id: '2',
                title: 'Desarrollo del carrito de compras',
                start: '2026-01-05',
                end: '2026-01-12',
                backgroundColor: '#6366f1',
                borderColor: '#6366f1'
            },
            {
                id: '3',
                title: 'Integración pasarela de pagos',
                start: '2026-01-10',
                end: '2026-01-18',
                backgroundColor: '#6366f1',
                borderColor: '#6366f1'
            },
            {
                id: '4',
                title: 'Diseño UI pantallas de autenticación',
                start: '2026-01-08',
                backgroundColor: '#ef4444',
                borderColor: '#ef4444'
            },
            {
                id: '5',
                title: 'Configuración de base de datos',
                start: '2026-01-15',
                end: '2026-01-20',
                backgroundColor: '#f59e0b',
                borderColor: '#f59e0b'
            },
            {
                id: '6',
                title: 'Wireframes nueva arquitectura',
                start: '2026-01-18',
                end: '2026-01-25',
                backgroundColor: '#6366f1',
                borderColor: '#6366f1'
            }
        ];
    }

    /* ========================================
       TASK MODAL (Create/Edit)
    ======================================== */

    /**
     * Abre el modal para crear nueva tarea
     */
    function openNewTask() {
        isEditMode = false;
        currentTaskId = null;
        document.getElementById('taskModalTitle').textContent = 'Nueva Tarea';
        resetTaskForm();
        new bootstrap.Modal(document.getElementById('taskModal')).show();
    }

    /**
     * Abre el modal para editar una tarea
     * @param {number} taskId - ID de la tarea
     */
    function openEditTask(taskId) {
        isEditMode = true;
        currentTaskId = taskId;
        document.getElementById('taskModalTitle').textContent = 'Editar Tarea';
        
        // Cargar datos de la tarea (en producción vendría de la BD)
        loadTaskData(taskId);
        
        // Cerrar modal de detalle si está abierto
        const detailModal = bootstrap.Modal.getInstance(document.getElementById('taskDetailModal'));
        if (detailModal) {
            detailModal.hide();
        }
        
        new bootstrap.Modal(document.getElementById('taskModal')).show();
    }

    /**
     * Carga los datos de una tarea en el formulario
     * @param {number} taskId - ID de la tarea
     */
    function loadTaskData(taskId) {
        // Demo: En producción esto vendría de la base de datos
        const taskData = {
            2: {
                title: 'Desarrollo del carrito de compras',
                description: 'Desarrollar el módulo completo del carrito de compras...',
                project: '1',
                client: 'Juan Domínguez',
                assignees: [1, 2],
                startDate: '2026-01-05',
                dueDate: '2026-01-12',
                status: 'progress'
            }
        };

        const data = taskData[taskId];
        if (!data) return;

        document.getElementById('taskTitle').value = data.title || '';
        document.getElementById('taskDescription').value = data.description || '';
        document.getElementById('taskProject').value = data.project || '';
        document.getElementById('taskClient').value = data.client || '';
        document.getElementById('taskStartDate').value = data.startDate || '';
        document.getElementById('taskDueDate').value = data.dueDate || '';
        document.getElementById('taskStatus').value = data.status || 'pending';

        // Marcar asignados
        data.assignees.forEach(id => {
            const checkbox = document.getElementById('assign' + id);
            if (checkbox) checkbox.checked = true;
        });
    }

    /**
     * Guarda la tarea (crear o editar)
     */
    function saveTask() {
        const form = document.getElementById('taskForm');
        
        // Validación básica
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Cerrar modal
        bootstrap.Modal.getInstance(document.getElementById('taskModal')).hide();

        // Mostrar notificación
        const message = isEditMode ? 'La tarea se ha actualizado correctamente.' : 'La tarea se ha creado correctamente.';
        const title = isEditMode ? 'Tarea Actualizada' : 'Tarea Creada';
        
        if (typeof Toast !== 'undefined') {
            Toast.success(title, message);
        }

        // En producción: enviar datos al servidor y recargar lista
    }

    /**
     * Resetea el formulario de tarea
     */
    function resetTaskForm() {
        const form = document.getElementById('taskForm');
        if (form) form.reset();

        // Limpiar subtareas
        const container = document.getElementById('subtasksContainer');
        if (container) {
            container.innerHTML = `
                <div class="subtask-item">
                    <input type="text" class="form-control form-control-custom" placeholder="Agregar subtarea...">
                    <button type="button" class="btn-add-subtask" onclick="Tasks.addSubtask()"><i class="bi bi-plus-lg"></i></button>
                </div>
            `;
        }

        // Limpiar archivos
        const uploadedFiles = document.getElementById('uploadedFiles');
        if (uploadedFiles) uploadedFiles.innerHTML = '';

        // Desmarcar asignados
        document.querySelectorAll('.assignee-selector input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
    }

    /**
     * Resetea el modal al cerrarse
     */
    function resetTaskModal() {
        isEditMode = false;
        currentTaskId = null;
        resetTaskForm();
    }

    /**
     * Maneja el cambio de proyecto para autocompletar cliente
     */
    function handleProjectChange() {
        const selectedOption = this.options[this.selectedIndex];
        const client = selectedOption.getAttribute('data-client') || '';
        document.getElementById('taskClient').value = client;
    }

    /* ========================================
       SUBTASKS
    ======================================== */

    /**
     * Agrega una nueva subtarea
     */
    function addSubtask() {
        const container = document.getElementById('subtasksContainer');
        const lastInput = container.querySelector('.subtask-item:last-child input[type="text"]');

        if (!lastInput || lastInput.value.trim() === '') return;

        const newSubtask = document.createElement('div');
        newSubtask.className = 'subtask-item';
        newSubtask.innerHTML = `
            <div class="form-check">
                <input class="form-check-input" type="checkbox">
            </div>
            <input type="text" class="form-control form-control-custom" value="${escapeHtml(lastInput.value)}">
            <button type="button" class="btn-remove-subtask" onclick="Tasks.removeSubtask(this)"><i class="bi bi-x-lg"></i></button>
        `;

        container.insertBefore(newSubtask, container.lastElementChild);
        lastInput.value = '';
        lastInput.focus();
    }

    /**
     * Elimina una subtarea
     * @param {HTMLElement} btn - Botón que disparó la acción
     */
    function removeSubtask(btn) {
        btn.closest('.subtask-item').remove();
    }

    /* ========================================
       FILE UPLOAD
    ======================================== */

    /**
     * Inicializa el área de carga de archivos
     */
    function initFileUpload() {
        const fileUploadArea = document.getElementById('fileUploadArea');
        const taskFiles = document.getElementById('taskFiles');
        const uploadedFiles = document.getElementById('uploadedFiles');

        if (!fileUploadArea || !taskFiles) return;

        fileUploadArea.addEventListener('click', () => taskFiles.click());

        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.classList.add('dragover');
        });

        fileUploadArea.addEventListener('dragleave', () => {
            fileUploadArea.classList.remove('dragover');
        });

        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.classList.remove('dragover');
            handleFiles(e.dataTransfer.files);
        });

        taskFiles.addEventListener('change', () => {
            handleFiles(taskFiles.files);
        });
    }

    /**
     * Procesa archivos subidos
     * @param {FileList} files - Lista de archivos
     */
    function handleFiles(files) {
        const uploadedFiles = document.getElementById('uploadedFiles');
        if (!uploadedFiles) return;

        Array.from(files).forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'uploaded-file-item';
            fileItem.innerHTML = `
                <i class="bi bi-file-earmark"></i>
                <span>${escapeHtml(file.name)}</span>
                <small>${(file.size / 1024 / 1024).toFixed(2)} MB</small>
                <button type="button" onclick="this.parentElement.remove()"><i class="bi bi-x"></i></button>
            `;
            uploadedFiles.appendChild(fileItem);
        });
    }

    /* ========================================
       TASK DETAIL
    ======================================== */

    /**
     * Abre el modal de detalle de tarea
     * @param {number} taskId - ID de la tarea
     */
    function openTaskDetail(taskId) {
        currentTaskId = taskId;
        // En producción: cargar datos de la tarea
        new bootstrap.Modal(document.getElementById('taskDetailModal')).show();
    }

    /**
     * Marca la tarea como completada
     */
    function markAsComplete() {
        bootstrap.Modal.getInstance(document.getElementById('taskDetailModal')).hide();
        
        if (typeof Toast !== 'undefined') {
            Toast.success('Tarea Completada', 'La tarea ha sido marcada como completada.');
        }

        // En producción: actualizar en BD y refrescar lista
    }

    /* ========================================
       TASK ACTIONS
    ======================================== */

    /**
     * Duplica una tarea
     * @param {number} taskId - ID de la tarea
     */
    function duplicateTask(taskId) {
        if (typeof Toast !== 'undefined') {
            Toast.success('Tarea Duplicada', 'Se ha creado una copia de la tarea.');
        }
        // En producción: duplicar en BD y recargar lista
    }

    /**
     * Abre el modal de confirmación de eliminación
     * @param {string} type - Tipo de elemento
     * @param {string} name - Nombre del elemento
     */
    function openDeleteModal(type, name) {
        document.getElementById('deleteItemName').textContent = `${type}: ${name}`;
        new bootstrap.Modal(document.getElementById('deleteModal')).show();
    }

    /**
     * Confirma la eliminación
     */
    function confirmDelete() {
        bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
        
        if (typeof Toast !== 'undefined') {
            Toast.success('Eliminado', 'La tarea ha sido eliminada correctamente.');
        }
        // En producción: eliminar de BD y recargar lista
    }

    /**
     * Maneja el cambio de checkbox en la tabla
     */
    function handleTaskCheckbox() {
        const row = this.closest('.task-row');
        const title = row.querySelector('.task-title');

        if (this.checked) {
            row.classList.add('completed');
            title.classList.add('completed');
        } else {
            row.classList.remove('completed');
            title.classList.remove('completed');
        }

        // En producción: actualizar estado en BD
    }

    /* ========================================
       UTILITIES
    ======================================== */

    /**
     * Escapa HTML para prevenir XSS
     * @param {string} text - Texto a escapar
     * @returns {string}
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Public API
    return {
        init: init,
        openNewTask: openNewTask,
        openEditTask: openEditTask,
        saveTask: saveTask,
        addSubtask: addSubtask,
        removeSubtask: removeSubtask,
        openTaskDetail: openTaskDetail,
        markAsComplete: markAsComplete,
        duplicateTask: duplicateTask,
        openDeleteModal: openDeleteModal,
        confirmDelete: confirmDelete
    };

})();

// Auto-init cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', Tasks.init);
