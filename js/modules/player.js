var player = [
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null]];    // List of the current player-unit positions
var maxPlayer     = 2; // Amount of maximum players of this game
var maxUnit       = 4; // Amount of maximum upgrading unit size of any player
var currentPlayer = 1; // Id of the current player / starting player

// ---------------------------------------------------------------------------------------------------------------------

/**
 *
 *
 * @param   {object}  tile
 * @returns {boolean} Returns true if the tile is owned by the current player itself
 */
function isOwnTile(tile) {
    var x = tile.x, y = tile.y;
    return !!(player[y][x] !== null && player[y][x].player == currentPlayer);
}


/**
 *
 *
 * @param   {object}  tile
 * @returns {boolean} Returns true if there is an enemy on the selected tile
 */
function isEnemyTile(tile) {
    var x = tile.x, y = tile.y;
    return !!(player[y][x] !== null && !isOwnTile(tile));
}


/**
 *
 *
 * @param   {object}  tile
 * @returns {boolean} Returns true if tile is not set
 */
function isOccupiedTile(tile) {
    var x = tile.x, y = tile.y;
    return player[y][x] !== null;
}


/**
 * Sets the next player by incrementing the player id.
 */
function nextPlayer() {
    currentPlayer = ((currentPlayer) % maxPlayer) + 1;
}


/**
 * Sets the base of a given player at a given tile and returns the valid markup of the tile.
 *
 * @param   {object} tile - Tile the base has to set to
 * @param   {number} p    - Id of the players base
 * @returns {string} Returns a valid markup string for the tile
 */
function base(tile, p) {
    var x = tile.x, y = tile.y;
    player[y][x] = { player: p, unit: 0 };
    return '<div class="player p' + p + ' base"></div>';
}


/**
 * Sets the given unit-size at the given tile of the current player and returns the valid markup of the tile.
 *
 * @param   {object} tile - Tile the unit has to set to
 * @param   {number} u    - Amount / Id / strength of the unit
 * @returns {string} Returns a valid markup string for the tile
 */
function unit(tile, u) {
    var x = tile.x, y = tile.y;
    player[y][x] = { player: currentPlayer, unit: u };
    return '<div class="player p' + currentPlayer + ' unit u' + u + '"></div>';
}


/**
 * Increments the existing unit-size at the given tile of the current player and returns the valid markup of the tile.
 *
 * @param   {object} tile - Tile of the current players unit
 * @returns {string} Returns a valid markup string for the tile
 */
function upgradeUnit(tile) {
    var x = tile.x, y = tile.y;
    var currentUnit = player[y][x].unit;
    if (currentUnit < maxUnit) {
        currentUnit++;
        player[y][x] = { player: currentPlayer, unit: currentUnit };
        return '<div class="player p' + currentPlayer + ' unit u' + currentUnit + '"></div>';
    }
    return false;
}


/**
 * Decrements the existing unit-size at the given tile of the current player and returns the valid markup of the tile.
 *
 * @param   {object} tile - Tile of the current players unit
 * @returns {string} Returns a valid markup string for the tile
 */
function downgradeUnit(tile) {
    var x = tile.x, y = tile.y;
    var currentUnit = player[y][x].unit;
    if (currentUnit > 1) {
        currentUnit--;
        player[y][x].unit = currentUnit;
        return '<div class="player p' + player[y][x].player + ' unit u' + currentUnit + '"></div>';
    }
    else {
        player[y][x] = null;
        return '';
    }
}


/**
 * Moves the data from startTile to targetTile.
 *
 * @param   {object}  startTile  - Source-Tile of the current object on this tile
 * @param   {object}  targetTile - Target-Tile the source-tile object has to moved to
 */
function moveUnit(startTile, targetTile) {
    var sx = startTile.x,  sy = startTile.y;
    var tx = targetTile.x, ty = targetTile.y;
    player[ty][tx] = player[sy][sx];
    player[sy][sx] = null;
}


/**
 * Returns the result of an attack determine by a weighted random.
 * @param   {object}  playerTile - Tile of the current player
 * @param   {object}  enemyTile  - Tile of the enemy
 * @returns {boolean} Returns true if the current player decides the battle for itself.
 */
function attack (playerTile, enemyTile) {
    var px = playerTile.x, py = playerTile.y;
    var ex = enemyTile.x,  ey = enemyTile.y;
    var unitPlayer = player[py][px].unit;
    var unitEnemy  = player[ey][ex].unit;

    var mergedUnitAmount = unitPlayer + unitEnemy;
    var random = getSimpleRandom(1, mergedUnitAmount);

    return random <= unitPlayer;
}
