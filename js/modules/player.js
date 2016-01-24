// ---------------------------------------------------------------------------------------------------------------------

function Player() {
    var player = [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null]];    // List of the current player-unit positions
    var errorCodes = {
        upgradeMaxLevelReached : { id : 0, message : 'Maximum upgrade level reached.' },
        isNotOwnTile           : { id : 1, message : 'Not your own tile.' },
        notValidTile           : { id : 2, message : 'Not a valid tile.' },
        noNeighbourTile        : { id : 3, message : 'Not a neighbour tile.' },
        noEnemyTile            : { id : 4, message : 'Not an enemy tile.'}
    };
    var maxPlayer     = 0; // Amount of maximum players of this game
    var maxUnit       = 4; // Amount of maximum upgrading unit size of any player
    var currentPlayer = 1; // Id of the current player / starting player


    // -----------------------------------------------------------------------------------------------------------------


    /**
     * ErrorExceptionHelper
     *
     * @param {object} error
     */
    function ErrorException (error) {
        this.id      = error.id;
        this.message = error.message;
    }


    function validateTile (tile) {
        if (typeof(tile) === 'object') {
            return {
                x : Number(tile.x),
                y : Number(tile.y)
            };
        }
        else {
            return {
                x : null,
                y : null
            };
        }
    }


    // -----------------------------------------------------------------------------------------------------------------


    /**
     *
     *
     * @param   {object}  tile
     * @returns {boolean} Returns true if the tile is owned by the current player itself
     */
    this.isOwnTile = function isOwnTile(tile) {
        var x, y;

        tile = validateTile(tile);
        x    = tile.x;
        y    = tile.y;

        return !!(player[y][x] !== null && player[y][x].player == currentPlayer);
    };


    /**
     *
     *
     * @param   {object}  tile
     * @returns {boolean} Returns true if there is an enemy on the selected tile
     */
    this.isEnemyTile = function isEnemyTile(tile) {
        var x, y;

        tile = validateTile(tile);
        x    = tile.x;
        y    = tile.y;

        return !!(player[y][x] !== null && !this.isOwnTile(tile));
    };


    /**
     *
     *
     * @param   {object}  tile
     * @returns {boolean} Returns true if tile is not set
     */
    this.isOccupiedTile = function isOccupiedTile(tile) {
        var x, y;

        tile = validateTile(tile);
        x    = tile.x;
        y    = tile.y;

        return player[y][x] !== null;
    };


    /**
     * Returns if the given tile is next to an set players tile. Not diagonal!
     *
     * @param   {object} tile
     * @returns {boolean} Returns true if tile is direct next from a tile of the current user
     */
    this.isNeighbourTile = function isNeighbourTile(tile) {
        var x, y;

        tile = validateTile(tile);
        x    = tile.x;
        y    = tile.y;

        return !!(
            (player[y - 1][x] !== null && player[y - 1][x].player == currentPlayer) ||
            (player[y][x + 1] !== null && player[y][x + 1].player == currentPlayer) ||
            (player[y + 1][x] !== null && player[y + 1][x].player == currentPlayer) ||
            (player[y][x - 1] !== null && player[y][x - 1].player == currentPlayer)
        );
    };


    // -----------------------------------------------------------------------------------------------------------------


    /**
     * Sets a new player and a base at a given tile and returns the valid markup of the tile.
     *
     * @param   {object} baseTile Tile the base has to set to
     * @returns {string} Returns a valid markup string for the tile
     */
    this.newPlayer = function newPlayer(baseTile) {
        var x = baseTile.x,
            y = baseTile.y;

        maxPlayer++;
        player[y][x] = { player: maxPlayer, unit: 0 };

        return '<div class="player p' + maxPlayer + ' base"></div>';
    };


    /**
     * Sets the next player by incrementing the player id.
     * Increments currentPlayer until maxPlayer is reached, then start from 1 again
     */
    this.nextPlayer = function nextPlayer() {
        currentPlayer = ((currentPlayer) % maxPlayer) + 1;
    };


    /**
     * Sets the given unit-size at the given tile of the current player and returns the valid markup of the tile.
     *
     * @param   {object} tile - Tile the unit has to set to
     * @param   {number} u    - Amount / Id / strength of the unit
     * @returns {string|boolean} Returns a valid markup string for the tile
     * @throws  {error} Throws an error object if there are not any direct neighbour tiles of the current player
     */
    this.newUnit = function newUnit(tile, u) {
        var x, y;

        tile = validateTile(tile);
        x    = tile.x;
        y    = tile.y;

        if (this.isNeighbourTile(tile)) {
            player[y][x] = { player: currentPlayer, unit: u };

            return '<div class="player p' + currentPlayer + ' unit u' + u + '"></div>';
        }
        else {
            throw(errorCodes.noNeighbourTile);
        }
    };


    /**
     * Increments the existing unit-size at the given tile of the current player and returns the valid markup of the tile.
     *
     * @param   {object} tile - Tile of the current players unit
     * @returns {string} Returns a valid markup string for the tile or an empty one if the unit can not be upgraded
     * @throws  {object} Will throw an error object if the unit can not be upgraded
     */
    this.upgradeUnit = function upgradeUnit(tile) {
        var x, y, currentUnit;

        tile = validateTile(tile);
        x    = tile.x;
        y    = tile.y;

        if (this.isOwnTile(tile)) {
            currentUnit = player[y][x].unit;
            if (currentUnit < maxUnit) {
                currentUnit++;
                player[y][x] = { player: currentPlayer, unit: currentUnit };

                return '<div class="player p' + currentPlayer + ' unit u' + currentUnit + '"></div>';
            }
            else {
                throw new ErrorException(errorCodes.upgradeMaxLevelReached);
            }
        }
        else {
            throw new ErrorException(errorCodes.isNotOwnTile);
        }

    };


    /**
     * Decrements the existing unit-size at the given tile of the current player and returns the valid markup of the tile.
     *
     * @param   {object}  tile - Tile of the current players unit
     * @param   {boolean|undefined} mustBeCurrentPlayer - If you does not want to check if the tile is the one the current player - Default is true
     * @returns {string} Returns a valid markup string for the tile
     * @throws  {object} Will throw an error object if the chosen tile is not a tile of the current player
     */
    this.downgradeUnit = function downgradeUnit(tile, mustBeCurrentPlayer) {
        var isCurrentPlayer = mustBeCurrentPlayer === undefined,
            x, y, currentUnit,

        tile = validateTile(tile);
        x    = tile.x;
        y    = tile.y;

        if (isCurrentPlayer || this.isOwnTile(tile)) {
            currentUnit = player[y][x].unit;
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
        else {
            throw new ErrorException(errorCodes.isNotOwnTile);
        }
    };


    /**
     * Moves the data from startTile to targetTile.
     *
     * @param   {object}  startTile  - Source-Tile of the current object on this tile
     * @param   {object}  targetTile - Target-Tile the source-tile object has to moved to
     */
    this.moveUnit = function moveUnit(startTile, targetTile) {
        var sx, sy, tx, ty;

        startTile  = validateTile(startTile);
        targetTile = validateTile(targetTile);
        sx         = startTile.x;
        sy         = startTile.y;
        tx         = targetTile.x;
        ty         = targetTile.y;

        if (this.isOwnTile(startTile)) {
            if (this.isNeighbourTile(targetTile)) {
                player[ty][tx] = player[sy][sx];
                player[sy][sx] = null;
            }
            else {
                throw(errorCodes.noNeighbourTile);
            }
        }
        else {
            throw new ErrorException(errorCodes.isNotOwnTile);
        }
    };


    /**
     * Returns the result of an attack determine by a weighted random.
     * @param   {object}  playerTile - Tile of the current player
     * @param   {object}  enemyTile  - Tile of the enemy
     * @returns {boolean} Returns true if the current player decides the battle for itself.
     */
    this.attack = function attack (playerTile, enemyTile) {
        var px, py, ex, ey, unitPlayer, unitEnemy, mergedUnitAmount, random;

        playerTile = validateTile(playerTile);
        enemyTile  = validateTile(enemyTile);
        px         = playerTile.x;
        py         = playerTile.y;
        ex         = enemyTile.x;
        ey         = enemyTile.y;

        if (this.isOwnTile(playerTile)) {
            if (this.isNeighbourTile(enemyTile)) {
                if (this.isEnemyTile(enemyTile)) {
                    unitPlayer       = player[py][px].unit;
                    unitEnemy        = player[ey][ex].unit;
                    mergedUnitAmount = unitPlayer + unitEnemy;
                    random           = getSimpleRandom(1, mergedUnitAmount);

                    return random <= unitPlayer;
                }
                else {
                    throw new ErrorException(errorCodes.noEnemyTile)
                }
            }
            else {
                throw(errorCodes.noNeighbourTile);
            }
        }
        else {
            throw new ErrorException(errorCodes.isNotOwnTile);
        }
    };
}
