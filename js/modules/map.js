
var world = [
    ['water', 'water', 'water', 'water', 'water', 'water', 'water'],
    ['water', 'sand',  'sand',  'sand',  'water', 'sand',  'water'],
    ['water', 'wood',  'grass', 'sand',  'sand',  'sand',  'water'],
    ['water', 'wood',  'grass', 'rock',  'grass', 'wood',  'water'],
    ['water', 'sand',  'sand',  'sand',  'grass', 'wood',  'water'],
    ['water', 'water', 'sand',  'sand',  'rock',  'water', 'water'],
    ['water', 'water', 'water', 'water', 'water', 'water', 'water']
];

function getMap() {
    var markup = '',
        i = 0,
        amount = world.length, x = 0, y = 0, id;


    for (; y < amount; y++) {
        x = 0;
        for (; x < amount; x++) {
            id = 'x-' + x + '-y-' + y;
            markup += '<div id="' + id + '" class="tile ' + world[y][x] + '"></div>';

        }
    }

    return markup;
}

function isFreeWordTile(x, y) {
    var tileType = world[y][x];

    return !!(tileType == 'sand' || tileType == 'grass' || tileType == 'wood');
}

