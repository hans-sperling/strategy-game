function World() {
    var tileTypes = {
        0 : 'water',
        1 : 'sand',
        2 : 'grass',
        3 : 'wood',
        4 : 'rock'
    };

    var map = null;

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Returns the markup for thw world.
     *
     * @returns {string} Returns the markup string
     */
    this.newWorld = function newWorld(worldMap) {
        var markup = '',
            amount = worldMap.length,
            x      = 0,
            y      = 0,
            id;

        if (map === null) {
            map = worldMap;
        }
        else {
            console.log('There is allready a worldmap')
        }



        for (; y < amount; y++) {
            x = 0;
            for (; x < amount; x++) {
                id      = 'x-' + x + '-y-' + y;
                markup += '<div id="' + id + '" class="tile ' + tileTypes[map[y][x]] + '"></div>';
            }
        }

        return markup;
    };


    /**
     * Checks if the given tile is a ree-to-set-something tile
     *
     * @param   {object}  tile - Tile to check for
     * @returns {boolean} Returns true if the current tile is a valid free-to-set-something tile
     */
    this.isFreeWorldTile = function isFreeWordTile(tile) {
        var x        = tile.x,
            y        = tile.y,
            tileType = tileTypes[map[y][x]];

        return !!(tileType == 'sand' || tileType == 'grass' || tileType == 'wood');
    };
}
