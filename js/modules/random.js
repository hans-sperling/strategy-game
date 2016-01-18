/**
 * Returns a random number between the given min and max values.
 *
 * @param   {number} min - Minimum number
 * @param   {number} max - Maximum number
 * @returns {number} Returns a random number
 */
function getSimpleRandom(min, max) {
    if (min > max) { return -1; }
    if (min == max) { return min; }
    var r; do { r = Math.random(); }
    while(r == 1.0);
    return min + parseInt(r * (max - min + 1));
}
