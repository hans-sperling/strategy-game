function World() {
    var world = [
        ['water', 'water', 'water', 'water', 'water', 'water', 'water'],
        ['water', 'sand',  'sand',  'sand',  'water', 'sand',  'water'],
        ['water', 'wood',  'grass', 'sand',  'sand',  'sand',  'water'],
        ['water', 'wood',  'grass', 'rock',  'grass', 'wood',  'water'],
        ['water', 'sand',  'sand',  'sand',  'grass', 'wood',  'water'],
        ['water', 'water', 'sand',  'sand',  'rock',  'water', 'water'],
        ['water', 'water', 'water', 'water', 'water', 'water', 'water']]; // Simple list of the worlds tiles

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Returns the markup for thw world.
     *
     * @returns {string} Returns the markup string
     */
    this.getWorld = function getWorld() {
        var markup = '',
            amount = world.length,
            x      = 0,
            y      = 0,
            id;

        for (; y < amount; y++) {
            x = 0;
            for (; x < amount; x++) {
                id      = 'x-' + x + '-y-' + y;
                markup += '<div id="' + id + '" class="tile ' + world[y][x] + '"></div>';
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
            tileType = world[y][x];

        return !!(tileType == 'sand' || tileType == 'grass' || tileType == 'wood');
    };
}
