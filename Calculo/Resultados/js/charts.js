// Archivo para la creación y renderizado de gráficos
import { calculateFrequencyTable } from './statistics.js'; // Importar para la Ojiva

function getBinsAndFrequencies(data, numBins = 10) { // Aumentado a 10 para más detalle
    if (data.length === 0) return { labels: [], frequencies: [] };

    const min = Math.min(...data);
    const max = Math.max(...data);
    let range = max - min;
    
    // Safeguard for identical values
    if (range === 0) range = 1; 
    
    const binWidth = range / numBins;

    const bins = Array.from({ length: numBins }, (_, i) => min + i * binWidth);
    const labels = bins.map((bin, i) => {
        const lower = bin.toFixed(2);
        const upper = (bin + binWidth).toFixed(2);
        return `${lower} - ${upper}`;
    });

    const frequencies = Array(numBins).fill(0);
    data.forEach(value => {
        let binIndex = Math.floor((value - min) / binWidth);
        if (binIndex >= numBins) binIndex = numBins - 1; // Handle max value
        if (binIndex < 0) binIndex = 0;
        frequencies[binIndex]++;
    });

    return { labels, frequencies, binCenters: bins.map(bin => bin + binWidth / 2) };
}

const celesteColor = '#85c1e9'; // Un buen celeste profesional
const celesteFadeColor = 'rgba(133, 193, 233, 0.6)'; // Con algo de transparencia

export function createHistogram(data, chartId, chartInstance) {
    const { labels, frequencies } = getBinsAndFrequencies(data);
    const canvas = document.getElementById(chartId);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');

    if (chartInstance && chartInstance.canvas.id === chartId) { // Verificar que sea el mismo canvas
        chartInstance.data.labels = labels;
        chartInstance.data.datasets[0].data = frequencies;
        chartInstance.update();
        return chartInstance;
    } else {
        if (chartInstance) chartInstance.destroy();
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Frecuencia',
                    data: frequencies,
                    backgroundColor: celesteFadeColor,
                    borderColor: celesteColor,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: { color: '#ecf0f1' },
                        grid: { color: 'rgba(236, 240, 241, 0.1)' },
                        title: { display: true, text: 'Valores', color: '#bdc3c7' }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#ecf0f1' },
                        grid: { color: 'rgba(236, 240, 241, 0.1)' },
                        title: { display: true, text: 'Frecuencia', color: '#bdc3c7' }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#ecf0f1' } }
                }
            }
        });
    }
}

export function createFrequencyPolygon(data, chartId, chartInstance) {
    const { binCenters, frequencies } = getBinsAndFrequencies(data);
    const canvas = document.getElementById(chartId);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');

    if (chartInstance && chartInstance.canvas.id === chartId) {
        chartInstance.data.labels = binCenters.map(center => center.toFixed(2));
        chartInstance.data.datasets[0].data = frequencies;
        chartInstance.update();
        return chartInstance;
    } else {
        if (chartInstance) chartInstance.destroy();
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: binCenters.map(center => center.toFixed(2)),
                datasets: [{
                    label: 'Frecuencia',
                    data: frequencies,
                    fill: false,
                    borderColor: celesteColor,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: { color: '#ecf0f1' },
                        grid: { color: 'rgba(236, 240, 241, 0.1)' },
                        title: { display: true, text: 'Punto Medio de Clase', color: '#bdc3c7' }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#ecf0f1' },
                        grid: { color: 'rgba(236, 240, 241, 0.1)' },
                        title: { display: true, text: 'Frecuencia', color: '#bdc3c7' }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#ecf0f1' } }
                }
            }
        });
    }
}

export function createOgive(data, chartId, chartInstance) {
    const frequencyTable = calculateFrequencyTable(data);
    const labels = frequencyTable.map(row => row.value);
    const cumulativeRelativeFrequencies = frequencyTable.map(row => row.Fr);
    const canvas = document.getElementById(chartId);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');

    if (chartInstance && chartInstance.canvas.id === chartId) {
        chartInstance.data.labels = labels;
        chartInstance.data.datasets[0].data = cumulativeRelativeFrequencies;
        chartInstance.update();
        return chartInstance;
    } else {
        if (chartInstance) chartInstance.destroy();
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Frecuencia Relativa Acumulada',
                    data: cumulativeRelativeFrequencies,
                    fill: true,
                    borderColor: celesteColor,
                    backgroundColor: celesteFadeColor,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: { color: '#ecf0f1' },
                        grid: { color: 'rgba(236, 240, 241, 0.1)' },
                        title: { display: true, text: 'Valores', color: '#bdc3c7' }
                    },
                    y: {
                        beginAtZero: true,
                        max: 1,
                        ticks: { color: '#ecf0f1' },
                        grid: { color: 'rgba(236, 240, 241, 0.1)' },
                        title: { display: true, text: 'Frecuencia Relativa Acumulada', color: '#bdc3c7' }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#ecf0f1' } }
                }
            }
        });
    }
}

export function createParetoChart(data, chartId, chartInstance) {
    if (data.length === 0) return null;

    const frequencyMap = {};
    data.forEach(value => {
        frequencyMap[value] = (frequencyMap[value] || 0) + 1;
    });

    const sortedFrequencies = Object.keys(frequencyMap)
        .map(key => ({ value: key, count: frequencyMap[key] }))
        .sort((a, b) => b.count - a.count);

    // Limit Pareto to top 20 items to avoid visual clutter with many values
    const limitedFrequencies = sortedFrequencies.slice(0, 20);

    const labels = limitedFrequencies.map(item => item.value);
    const counts = limitedFrequencies.map(item => item.count);
    const totalCount = Object.values(frequencyMap).reduce((sum, count) => sum + count, 0);

    let cumulativePercentage = [];
    let cumulativeSum = 0;
    sortedFrequencies.forEach((item, index) => {
        cumulativeSum += item.count;
        if (index < 20) {
            cumulativePercentage.push((cumulativeSum / totalCount) * 100);
        }
    });

    const canvas = document.getElementById(chartId);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');

    if (chartInstance && chartInstance.canvas.id === chartId) {
        chartInstance.data.labels = labels;
        chartInstance.data.datasets[0].data = counts;
        chartInstance.data.datasets[1].data = cumulativePercentage;
        chartInstance.update();
        return chartInstance;
    } else {
        if (chartInstance) chartInstance.destroy();
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Frecuencia',
                        data: counts,
                        backgroundColor: celesteFadeColor,
                        borderColor: celesteColor,
                        borderWidth: 1,
                        order: 1
                    },
                    {
                        label: 'Porcentaje Acumulado',
                        data: cumulativePercentage,
                        type: 'line',
                        borderColor: '#f39c12',
                        backgroundColor: 'rgba(243, 156, 18, 0.2)',
                        fill: false,
                        yAxisID: 'y1',
                        order: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                scales: {
                    x: {
                        ticks: { color: '#ecf0f1' },
                        grid: { color: 'rgba(236, 240, 241, 0.1)' },
                        title: { display: true, text: 'Categorías (Top 20)', color: '#bdc3c7' }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#ecf0f1' },
                        grid: { color: 'rgba(236, 240, 241, 0.1)' },
                        title: { display: true, text: 'Frecuencia', color: '#bdc3c7' }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: '#ecf0f1' },
                        grid: { drawOnChartArea: false, color: 'rgba(236, 240, 241, 0.1)' },
                        title: { display: true, text: 'Porcentaje Acumulado', color: '#bdc3c7' }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#ecf0f1' } }
                }
            }
        });
    }
}