/**
 * YPServicesERP - Reports Module
 * Gráficos y análisis de rentabilidad
 * @version 2.0.0
 */

const Reports = (function() {
    'use strict';

    // Colores del tema
    const COLORS = {
        primary: '#6366f1',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6',
        secondary: '#64748b'
    };

    // Instancias de gráficos
    let charts = {};

    /**
     * Inicializa el módulo
     */
    function init() {
        // Configurar Chart.js
        Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
        Chart.defaults.color = getComputedStyle(document.documentElement)
            .getPropertyValue('--text-secondary').trim() || '#64748b';

        // Inicializar gráficos
        initIncomeExpenseChart();
        initExpenseDistributionChart();
        initProjectProfitChart();

        // Listener para cambio de período
        const periodSelect = document.getElementById('reportPeriod');
        if (periodSelect) {
            periodSelect.addEventListener('change', handlePeriodChange);
        }

        // Listener para cambio de tema
        document.addEventListener('themeChanged', updateChartsTheme);

        console.log('Reports module initialized');
    }

    /**
     * Gráfico: Ingresos vs Egresos (últimos 6 meses)
     */
    function initIncomeExpenseChart() {
        const ctx = document.getElementById('incomeExpenseChart');
        if (!ctx) return;

        charts.incomeExpense = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene'],
                datasets: [
                    {
                        label: 'Ingresos',
                        data: [9500, 11200, 10800, 12500, 13200, 10650],
                        backgroundColor: COLORS.success,
                        borderRadius: 6,
                        borderSkipped: false
                    },
                    {
                        label: 'Egresos',
                        data: [4800, 5200, 4900, 5800, 6100, 4100],
                        backgroundColor: COLORS.danger,
                        borderRadius: 6,
                        borderSkipped: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 20,
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleFont: { size: 13, weight: '600' },
                        bodyFont: { size: 12 },
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': $' + context.raw.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: { size: 11, weight: '500' }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: { size: 11 },
                            callback: function(value) {
                                return '$' + (value / 1000) + 'k';
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Gráfico: Distribución de Gastos (Doughnut)
     */
    function initExpenseDistributionChart() {
        const ctx = document.getElementById('expenseDistributionChart');
        if (!ctx) return;

        charts.expenseDistribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Pagos Equipo', 'Servicios/Tools', 'Gastos Proyecto', 'Otros'],
                datasets: [{
                    data: [18500, 8400, 2500, 1500],
                    backgroundColor: [
                        COLORS.primary,
                        COLORS.warning,
                        COLORS.info,
                        COLORS.secondary
                    ],
                    borderWidth: 0,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 15,
                            font: {
                                size: 11,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleFont: { size: 13, weight: '600' },
                        bodyFont: { size: 12 },
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.raw / total) * 100).toFixed(1);
                                return '$' + context.raw.toLocaleString() + ' (' + percentage + '%)';
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Gráfico: Rentabilidad por Proyecto (Barras Horizontales)
     */
    function initProjectProfitChart() {
        const ctx = document.getElementById('projectProfitChart');
        if (!ctx) return;

        charts.projectProfit = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['E-commerce TechStore', 'App FinanceTrack', 'Sistema CRM', 'Landing Promo', 'Web Corporativa'],
                datasets: [{
                    label: 'Ganancia',
                    data: [12500, 9800, 7200, 4500, 2950],
                    backgroundColor: function(context) {
                        const value = context.raw;
                        if (value >= 10000) return COLORS.success;
                        if (value >= 5000) return COLORS.primary;
                        if (value >= 3000) return COLORS.info;
                        return COLORS.warning;
                    },
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleFont: { size: 13, weight: '600' },
                        bodyFont: { size: 12 },
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return 'Ganancia: $' + context.raw.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: { size: 11 },
                            callback: function(value) {
                                return '$' + (value / 1000) + 'k';
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: { size: 11, weight: '500' }
                        }
                    }
                }
            }
        });
    }

    /**
     * Maneja cambio de período
     */
    function handlePeriodChange(e) {
        const period = e.target.value;
        console.log('Period changed to:', period);

        // Mostrar toast informativo
        if (typeof Toast !== 'undefined') {
            Toast.info('Período actualizado', 'Los datos se actualizarán con el período seleccionado.');
        }

        // Aquí se conectaría con el backend para obtener datos del período
        // updateChartsData(period);
    }

    /**
     * Actualiza colores de gráficos según tema
     */
    function updateChartsTheme() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
        const textColor = isDark ? '#94a3b8' : '#64748b';

        Chart.defaults.color = textColor;

        // Actualizar cada gráfico
        Object.values(charts).forEach(chart => {
            if (chart.options.scales) {
                if (chart.options.scales.x) {
                    chart.options.scales.x.grid.color = gridColor;
                    chart.options.scales.x.ticks.color = textColor;
                }
                if (chart.options.scales.y) {
                    chart.options.scales.y.grid.color = gridColor;
                    chart.options.scales.y.ticks.color = textColor;
                }
            }
            if (chart.options.plugins && chart.options.plugins.legend) {
                chart.options.plugins.legend.labels.color = textColor;
            }
            chart.update();
        });
    }

    /**
     * Exportar a PDF (preparado para backend)
     */
    function exportPDF() {
        if (typeof Toast !== 'undefined') {
            Toast.info('Exportando...', 'El reporte se está generando. Esta función requiere conexión con el backend.');
        }
        
        // Aquí se conectaría con el backend para generar PDF
        console.log('Export PDF requested');
    }

    // API Pública
    return {
        init: init,
        exportPDF: exportPDF
    };

})();

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', Reports.init);
