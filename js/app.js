$(document).ready(function() {
    'use strict';

    var player       = new Player();
    var world        = new World();
    var $world       = $('#world');          // Stores the jQueryScope of the world map
    var $tile        = null;                 // Stores the jQueryScope of the currently clicked tile
    var $tileSelect  = null;                 // Stores the jQueryScope of the selected tile
    var tile         = { x: null, y: null }; // Stores the coordinates of the currently clicked tile
    var selectedTile = { x: null, y: null }; // Stores the coordinates of the selected tile
    var bases        = [
        { x: 2, y: 5 },
        { x: 5, y: 1 }
    ];                // Stores the coordinates of the base of all players

    // -----------------------------------------------------------------------------------------------------------------
    // Helpers

    function resetSelectedTile() {
        selectedTile = { x: null, y: null };
    }

    function isEqualTile(selectedTile, tile) {
        var tx = tile.x, ty = tile.y,
            sx = selectedTile.x, sy = selectedTile.y;

        return sx == tx && sy== ty
    }

    function isSelectedTile(tile) {
        var x = tile.x, y = tile.y;

        return x !== null && y !== null
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Initial rendering

    // Render world map
    $world.html(world.getWorld());

    // Add all players

    // Set and render player and their bases
    $('#x-' + bases[0].x + '-y-' + bases[0].y).html(player.newPlayer(bases[0]));
    $('#x-' + bases[1].x + '-y-' + bases[1].y).html(player.newPlayer(bases[1]));


    //$('#x-2-y-5').html(base(baseTileP1,1));
    //$('#x-5-y-1').html(base(baseTileP2,2));

    // -----------------------------------------------------------------------------------------------------------------
    // Game logic - conditions

    // On click of any tile
    $world.on('click.tileClick', '.tile', function(e) {
        var x    = this.id.split('-')[1],
            y    = this.id.split('-')[3];

        // Stores the currently clicked tile coordinates
        tile  = { x: x, y: y };

        // Stores the currently clicked tile as jQueryScope
        $tile = $('#x-' + x + '-y-' + y);

        // Deselect common selection
        $world.find('.selected').removeClass('selected');

        // Select tile for the first time
        if (isSelectedTile(selectedTile)) {
            // Stores the selected tile as jQueryScope
            $tileSelect = $('#x-' + selectedTile.x + '-y-' + selectedTile.y);

            // Upgrade or merge units
            if (player.isOwnTile(tile)) {
                // Upgrade selected unit
                if (isEqualTile(selectedTile, tile)) {
                    var result = player.upgradeUnit(tile);

                    if (result) {
                        $tile.html(result);
                        player.nextPlayer();
                    }
                    else {
                        console.log('Upgrade of this unit is not valid! Please try another.');
                    }

                    resetSelectedTile();
                }
                else if (0){} // todo - Merge units logic
                else {}
            }
            // move selected unit to a free world tile
            else if (world.isFreeWorldTile(tile) && !player.isOccupiedTile(tile)) {
                player.moveUnit(selectedTile, tile);

                $tile.html($tileSelect.html());
                $tileSelect.html('');

                resetSelectedTile();
                player.nextPlayer();
            }
            // fight against an enemy
            else if (player.isEnemyTile(tile)) {
                // Player has won
                if (player.attack(selectedTile, tile)) {
                    $tile.html(player.downgradeUnit(tile));
                }
                else { // Enemy has won
                    $tileSelect.html(player.downgradeUnit(selectedTile));
                }

                resetSelectedTile();
                player.nextPlayer();
            }
            else { // deselect
                resetSelectedTile();
            }
        }
        else {
            // Set unit first time or select chosen tile
            if (world.isFreeWorldTile(tile) && !player.isOccupiedTile(tile)) {
                $tile.html(player.newUnit(tile, 1));

                resetSelectedTile();
                player.nextPlayer();
            }
            else if (player.isOwnTile(tile)) { // If the chosen tile is set by the current player itself
                selectedTile.x = x;
                selectedTile.y = y;
                $tile.addClass('selected');
            }
            else {
                resetSelectedTile();
            }
        }
    });
});
