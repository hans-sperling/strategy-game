$(document).ready(function() {
    'use strict';

    var $world      = $('#world');
    var $tile       = null;
    var $tileSelect = null;
    var selectedTile = { x: null, y: null };
    var selectedUnitX = null;
    var selectedUnitY = null;

    // Initial drawing
    $world.html(getMap());

    // Set player bases
$('#x-2-y-5').html(base(2,5,1));
    $('#x-5-y-1').html(base(5,1,2));


    function resetSelectedTile() {
        selectedTile = { x: null, y: null };
    }

    // On click
    $world.on('click.tileClick', '.tile', function(e) {
        var x = this.id.split('-')[1];
        var y = this.id.split('-')[3];
        $tile = $('#x-' + x + '-y-' + y);

        // Deselect common selection
        $world.find('.selected').removeClass('selected');


        // Select tile for the first time
        if (selectedTile.x !== null && selectedTile.y !== null) {
            $tileSelect = $('#x-' + selectedTile.x + '-y-' + selectedTile.y);

            // Upgrade or merge units
            if (isOwnTile(x, y)) {
                // Upgrade selected unit
                if (selectedTile.x == x && selectedTile.y== y) {
                    var result = upgradeUnit(x, y);
                    if (result) {
                        $tile.html(result);
                    }

                    resetSelectedTile();
                    nextPlayer();
                }
                // Merge units logic
                else if (0){}
                else {}
            }
            // move selected unit to a free world tile
            else if (isFreeWordTile(x, y) && !isOccupiedTile(x, y)) {
                moveUnit(selectedTile.x, selectedTile.y, x, y);

                $tile.html($tileSelect.html());
                $tileSelect.html('');

                resetSelectedTile();
                nextPlayer();
            }
            // fight against an enemy
            else if (isEnemyTile(x, y)) {
                // Player has won
                if (attack(selectedTile.x, selectedTile.y, x, y)) {
                    $tile.html(downgradeUnit(x, y));
                }
                // Enemy has won
                else {
                    $tileSelect.html(downgradeUnit(selectedTile.x, selectedTile.y));
                }

                resetSelectedTile();
                nextPlayer();
            }
            // de mark
            else {
                resetSelectedTile();
            }
        }
        else {
            // Set unit first time or select choosen tile
            if (isFreeWordTile(x, y) && !isOccupiedTile(x, y)) {
                $tile.html(unit(x, y, 1));

                resetSelectedTile();
                nextPlayer();
            }
            // If the chosen tile is set by the current player itself
            else if (isOwnTile(x, y)) {
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
