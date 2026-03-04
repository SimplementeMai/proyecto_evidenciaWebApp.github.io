// Archivo para la gestión de datos

export let currentDataset = [];

export function generateRandomData(count, min = 1, max = 100) {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    currentDataset = data;
    return data;
}

export function parseManualData(dataString) {
    const data = dataString.split(',')
                          .map(s => parseFloat(s.trim()))
                          .filter(n => !isNaN(n)); // Filter out any non-numeric values
    currentDataset = data;
    return data;
}

export function getCurrentDataset() {
    return currentDataset;
}

export function setCurrentDataset(newDataset) {
    currentDataset = newDataset;
}