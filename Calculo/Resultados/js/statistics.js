// Archivo para las funciones de cálculo estadístico

export function calculateMean(data) {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, val) => acc + val, 0);
    return sum / data.length;
}

export function calculateMedian(data) {
    if (data.length === 0) return 0;
    const sortedData = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sortedData.length / 2);
    if (sortedData.length % 2 === 0) {
        return (sortedData[mid - 1] + sortedData[mid]) / 2;
    } else {
        return sortedData[mid];
    }
}

export function calculateMode(data) {
    if (data.length === 0) return [];
    const frequencyMap = {};
    data.forEach(num => {
        frequencyMap[num] = (frequencyMap[num] || 0) + 1;
    });

    let maxFrequency = 0;
    let modes = [];
    for (const num in frequencyMap) {
        if (frequencyMap[num] > maxFrequency) {
            maxFrequency = frequencyMap[num];
            modes = [parseFloat(num)];
        } else if (frequencyMap[num] === maxFrequency) {
            modes.push(parseFloat(num));
        }
    }
    if (Object.keys(frequencyMap).length === modes.length && modes.length > 1) {
        return []; // No distinct mode
    }
    return modes;
}

export function calculateMin(data) {
    if (data.length === 0) return 0;
    return Math.min(...data);
}

export function calculateMax(data) {
    if (data.length === 0) return 0;
    return Math.max(...data);
}

export function calculateRange(data) {
    if (data.length === 0) return 0;
    return calculateMax(data) - calculateMin(data);
}

export function calculateFrequencyTable(data) {
    if (data.length === 0) return [];

    const sortedData = [...data].sort((a, b) => a - b);
    const n = sortedData.length;
    const frequencyTable = {};

    // Calculate fi (absolute frequency)
    sortedData.forEach(value => {
        frequencyTable[value] = (frequencyTable[value] || 0) + 1;
    });

    let fiAccumulated = 0;
    let frAccumulated = 0;
    const tableRows = [];

    for (const value of Object.keys(frequencyTable).map(Number).sort((a, b) => a - b)) {
        const fi = frequencyTable[value];
        const fr = fi / n;
        fiAccumulated += fi;
        frAccumulated += fr;

        tableRows.push({
            value: value,
            fi: fi,
            fr: fr,
            Fi: fiAccumulated,
            Fr: frAccumulated
        });
    }

    return tableRows;
}

// Funciones para Operaciones con Conjuntos
export function parseSetInput(inputString) {
    return new Set(inputString.split(',')
                              .map(s => {
                                  const cleaned = s.trim().replace(/\s/g, '');
                                  const num = parseFloat(cleaned);
                                  return isNaN(num) ? cleaned : num; // Return number if valid, else string
                              })
                              .filter(s => s !== ''));
}

export function union(setA, setB) {
    const _union = new Set(setA);
    for (const elem of setB) {
        _union.add(elem);
    }
    return _union;
}

export function intersection(setA, setB) {
    const _intersection = new Set();
    for (const elem of setA) {
        if (setB.has(elem)) {
            _intersection.add(elem);
        }
    }
    return _intersection;
}

export function difference(setA, setB) {
    const _difference = new Set(setA);
    for (const elem of setB) {
        _difference.delete(elem);
    }
    return _difference;
}

export function complement(set, universalSet) {
    const _complement = new Set(universalSet);
    for (const elem of set) {
        _complement.delete(elem);
    }
    return _complement;
}

// Función para calcular probabilidad simple (regla de 3)
export function calculateSimpleProbability(affectedValue, totalValue) {
    // Basic validation
    if (isNaN(affectedValue) || isNaN(totalValue) || totalValue <= 0 || affectedValue < 0 || affectedValue > totalValue) {
        return { decimal: NaN, percentage: 'Entradas inválidas' };
    }

    const decimal = affectedValue / totalValue;
    const percentage = (decimal * 100).toFixed(2) + '%';
    
    return { decimal, percentage };
}

// Función para calcular probabilidad secuencial de eventos independientes
export function calculateSequentialIndependentProbability(rawProbabilities) {
    if (!Array.isArray(rawProbabilities) || rawProbabilities.length === 0) {
        return { decimal: NaN, percentage: 'No hay probabilidades para calcular.' };
    }

    const processedProbabilities = [];
    for (const rawProb of rawProbabilities) {
        let prob = rawProb;
        if (isNaN(rawProb)) {
            return { decimal: NaN, percentage: `Probabilidad inválida detectada: ${rawProb}. No es un número.` };
        }
        
        // Handle as percentage if > 1 and <= 100, otherwise as decimal
        if (rawProb > 1 && rawProb <= 100) {
            prob = rawProb / 100;
        }

        if (prob < 0 || prob > 1) {
            return { decimal: NaN, percentage: `Probabilidad fuera de rango: ${rawProb}. Debe estar entre 0 y 1 (o 0 y 100 para porcentajes).` };
        }
        processedProbabilities.push(prob);
    }

    const decimal = processedProbabilities.reduce((product, prob) => product * prob, 1);
    const percentage = (decimal * 100).toFixed(4) + '%'; // Increased precision for percentage display
    
    return { decimal, percentage };
}

// Helper function for factorial
function factorial(num) {
    if (num < 0) return NaN;
    if (num === 0 || num === 1) return 1;
    let result = 1;
    for (let i = 2; i <= num; i++) {
        result *= i;
    }
    return result;
}

export function calculatePermutations(n, r) {
    if (isNaN(n) || isNaN(r) || n < 0 || r < 0 || !Number.isInteger(n) || !Number.isInteger(r)) {
        return 'Entradas inválidas: n y r deben ser enteros no negativos.';
    }
    if (r > n) {
        return 'Entradas inválidas: r no puede ser mayor que n.';
    }
    return factorial(n) / factorial(n - r);
}

export function calculateCombinations(n, r) {
    if (isNaN(n) || isNaN(r) || n < 0 || r < 0 || !Number.isInteger(n) || !Number.isInteger(r)) {
        return 'Entradas inválidas: n y r deben ser enteros no negativos.';
    }
    if (r > n) {
        return 'Entradas inválidas: r no puede ser mayor que n.';
    }
    return factorial(n) / (factorial(r) * factorial(n - r));
}