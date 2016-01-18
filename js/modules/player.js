var player = [
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null]];
var maxPlayer     = 2;
var maxUnit       = 4;
var currentPlayer = 1;

// ---------------------------------------------------------------------------------------------------------------------

function isOwnTile(x, y) {
    return !!(player[y][x] !== null && player[y][x].player == currentPlayer);
}


function isEnemyTile(x, y) {
    return !!(player[y][x] !== null && !isOwnTile(x, y));
}


function isOccupiedTile(x,y) {
    return player[y][x] !== null;
}

function nextPlayer() {
    currentPlayer = ((currentPlayer) % maxPlayer) + 1;
}


function base(x, y, p) {
    player[y][x] = { player: p, unit: 0 };
    return '<div class="player p' + p + ' base"></div>';
}


function unit(x, y, u) {
    player[y][x] = { player: currentPlayer, unit: u };
    return '<div class="player p' + currentPlayer + ' unit u' + u + '"></div>';
}

function upgradeUnit(x, y) {
    var currentUnit = player[y][x].unit;
    if (currentUnit < maxUnit) {
        currentUnit++;
        player[y][x] = { player: currentPlayer, unit: currentUnit };
        return '<div class="player p' + currentPlayer + ' unit u' + currentUnit + '"></div>';
    }
    return false;
}


function downgradeUnit(x, y) {
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


function moveUnit(sx, sy, x, y) {
    player[y][x]   = player[sy][sx];
    player[sy][sx] = null;
}


function attack (playerX, playerY, enemyX, enemyY) {
    var unitPlayer = player[playerY][playerX].unit;
    var unitEnemy  = player[enemyY][enemyX].unit;

    var mergedUnitAmount = unitPlayer + unitEnemy;
    var random = getSimpleRandom(1, mergedUnitAmount);

    return random <= unitPlayer;
}
