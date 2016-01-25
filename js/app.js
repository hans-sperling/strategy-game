$(document).ready(function() {
    'use strict';
    var worldMap     = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 1, 0],
        [0, 3, 2, 1, 1, 1, 0],
        [0, 3, 2, 4, 2, 3, 0],
        [0, 1, 1, 1, 2, 3, 0],
        [0, 0, 1, 1, 4, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]];                // List of IDs used for creating a worldMap
    var player       = new Player();         // Instance for player functionality
    var world        = new World();          // Instance for world functionality
    var $DOM_World   = $('#world');          // Stores the jQueryScope of the world map
    var $tile        = null;                 // Stores the jQueryScope of the currently clicked tile
    var $tileSelect  = null;                 // Stores the jQueryScope of the selected tile
    var tile         = { x: null, y: null }; // Stores the coordinates of the currently clicked tile
    var selectedTile = { x: null, y: null }; // Stores the coordinates of the selected tile
    var bases        = [
        { x: 2, y: 5 },
        { x: 5, y: 1 }
    ];                // Stores the coordinates of the base of all players
    var i, result;

    // -----------------------------------------------------------------------------------------------------------------
    // Helpers


    function setSelectedTile(x, y) {
        selectedTile.x = x;
        selectedTile.y = y;

        $tile.addClass('selected');
    }


    /**
     * Deselect the selected tile.
     */
    function resetSelectedTile() {
        selectedTile = { x: null, y: null };
        $DOM_World.find('.selected').removeClass('selected');
    }

    /**
     * Returns if the given tiles are the same or not
     *
     * @param   {object} firstTile
     * @param   {object} secondTile
     * @returns {boolean}
     */
    function isEqualTile(firstTile, secondTile) {
        var fx = firstTile.x,  fy = firstTile.y,
            sx = secondTile.x, sy = secondTile.y;

        return fx == sx && fy == sy;
    }


    /**
     * Returns if the given tile is a selected one.
     *
     * @param   {object} tile
     * @returns {boolean} Returns true if the given tile is the same as the selected one
     */
    function isSelectedTile(tile) {
        var x = tile.x, y = tile.y;

        return x !== null && y !== null
    }


    // -----------------------------------------------------------------------------------------------------------------
    // Initial rendering

    // Set and render world map
    $DOM_World.html(world.newWorld(worldMap));

    // Set and render player and their bases
    for (i = 0; i < bases.length; i++) {
        result = player.newPlayer(bases[i]);

        $('#x-' + bases[i].x + '-y-' + bases[i].y).html('<div class="player p' + result.id + ' base"></div>');
    }


    // -----------------------------------------------------------------------------------------------------------------
    // Game logic - conditions

    // On click of any tile
    $DOM_World.on('click.tileClick', '.tile', function() {
        var x    = Number(this.id.split('-')[1]),
            y    = Number(this.id.split('-')[3]);

        // Stores the currently clicked tile coordinates
        tile  = { x: x, y: y };

        // Stores the currently clicked tile as jQueryScope
        $tile = $('#x-' + x + '-y-' + y);

        // Select tile for the first time
        if (isSelectedTile(selectedTile)) {
            // Stores the selected tile as jQueryScope
            $tileSelect = $('#x-' + selectedTile.x + '-y-' + selectedTile.y);

            // Upgrade or merge units
            if (player.isOwnTile(tile)) {

                // Upgrade selected unit
                if (isEqualTile(selectedTile, tile)) {
                    try {
                        $tile.html(player.upgradeUnit(tile));
                        player.nextPlayer();
                    }
                    catch (e) {
                        console.log('You can not upgrade! - ' + e.message);
                    }

                    resetSelectedTile();
                }
                else if (0){} // todo - Merge units logic
                else {}
            }
            // move selected unit to a free world tile
            else if (world.isFreeWorldTile(tile) && !player.isOccupiedTile(tile)) {

                try {
                    player.moveUnit(selectedTile, tile);
                    $tile.html($tileSelect.html());
                    $tileSelect.html('');
                    player.nextPlayer();
                }
                catch (e) {
                    console.log('You can not move! - ' + e.message);
                }

                resetSelectedTile();
            }
            // fight against an enemy
            else if (player.isEnemyTile(tile)) {
                try {
                    // Player has won
                    if (player.attack(selectedTile, tile)) {
                        $tile.html(player.downgradeUnit(tile));
                    }
                    else { // Enemy has won
                        console.log('Enemy has won');
                        $tileSelect.html(player.downgradeUnit(selectedTile, false));
                    }

                    player.nextPlayer();
                }
                catch (e) {
                    console.log('You can not attack! - ' + e.message);
                }

                resetSelectedTile();
            }
            else { // deselect
                resetSelectedTile();
            }
        }
        else {
            // Set unit first time or select chosen tile
            if (world.isFreeWorldTile(tile) && !player.isOccupiedTile(tile)) {
                try {
                    result = player.newUnit(tile, 1);
                    $tile.html('<div class="player p' + result.playerId + ' unit u' + result.unitId + '"></div>');


                    player.nextPlayer();
                }
                catch(e) {
                    console.log('You can not set a new unit here! - ' + e.message);
                }
                resetSelectedTile(); // No necessary here
            }
            else if (player.isOwnTile(tile)) { // If the chosen tile is set by the current player itself
                setSelectedTile(x, y);
            }
            else {
                resetSelectedTile(); // No necessary here
            }
        }
    });
});
