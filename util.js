/**
 * Generate random integer
 * @param {number} minValue
 * @param {number} maxValue
 */
function getRandomInteger(minValue, maxValue) {
    return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
}