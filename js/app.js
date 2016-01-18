$(document).ready(function() {
    'use strict';

    var $world       = $('#world');          // Stores the jQueryScope of the world map
    var $tile        = null;                 // Stores the jQueryScope of the currently clicked tile
    var $tileSelect  = null;                 // Stores the jQueryScope of the selected tile
    var tile         = { x: null, y: null }; // Stores the coordinates of the currently clicked tile
    var selectedTile = { x: null, y: null }; // Stores the coordinates of the selected tile
    var baseTileP1   = { x: 2,    y: 5 };    // Stores the coordinates of the base of player1
    var baseTileP2   = { x: 5,    y: 1 };    // Stores the coordinates of the base of player2

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
    $world.html(getMap());

    // Set and render player bases
    $('#x-2-y-5').html(base(baseTileP1,1));
    $('#x-5-y-1').html(base(baseTileP2,2));

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
            if (isOwnTile(tile)) {
                // Upgrade selected unit
                if (isEqualTile(selectedTile, tile)) {
                    var result = upgradeUnit(tile);

                    if (result) {
                        $tile.html(result);
                    }

                    resetSelectedTile();
                    nextPlayer();
                }
                else if (0){} // todo - Merge units logic
                else {}
            }
            // move selected unit to a free world tile
            else if (isFreeWordTile(tile) && !isOccupiedTile(tile)) {
                moveUnit(selectedTile, tile);

                $tile.html($tileSelect.html());
                $tileSelect.html('');

                resetSelectedTile();
                nextPlayer();
            }
            // fight against an enemy
            else if (isEnemyTile(tile)) {
                // Player has won
                if (attack(selectedTile, tile)) {
                    $tile.html(downgradeUnit(tile));
                }
                else { // Enemy has won
                    $tileSelect.html(downgradeUnit(selectedTile));
                }

                resetSelectedTile();
                nextPlayer();
            }
            else { // deselect
                resetSelectedTile();
            }
        }
        else {
            // Set unit first time or select chosen tile
            if (isFreeWordTile(tile) && !isOccupiedTile(tile)) {
                $tile.html(unit(tile, 1));

                resetSelectedTile();
                nextPlayer();
            }
            else if (isOwnTile(tile)) { // If the chosen tile is set by the current player itself
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
