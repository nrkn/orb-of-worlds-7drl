(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_1 = require("./point");
const util_1 = require("./util");
const level_1 = require("./level");
exports.Cave = (size, rooms, floors = [], mobs = []) => {
    const level = [floors, mobs, size];
    /*
      Tunnel out several chambers in the cave, between a random point and a
      randomly selected existing point
    */
    for (let i = 0; i < rooms; i++) {
        level_1.drunkardsWalk(level, level[level_1.FLOORS][util_1.randInt(level[level_1.FLOORS].length)], [util_1.randInt(size[point_1.X]), util_1.randInt(size[point_1.Y])]);
    }
    return level;
};

},{"./level":9,"./point":10,"./util":12}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAR_PLAYER = '@';
exports.CHAR_WALL = '#';
exports.CHAR_FLOOR = '.';
exports.CHAR_MONSTER = 'm';
exports.CHAR_STAIRS_DOWN = '>';
exports.CHAR_POTION = '!';
exports.CHAR_WIN = '$';
exports.CHAR_DEAD = '0';

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLOR_PLAYER = [85, 170, 255, 255];
exports.COLOR_WALL = [85, 85, 85, 255];
exports.COLOR_FLOOR = [85, 85, 85, 255];
exports.COLOR_MONSTER = [255, 0, 0, 255];
exports.COLOR_STAIRS_DOWN = [255, 255, 255, 255];
exports.COLOR_POTION = [255, 170, 0, 255];
exports.COLOR_WIN = [255, 255, 0, 255];

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIRECTION_NONE = -1;
exports.DIRECTION_WEST = 0;
exports.DIRECTION_NORTH = 1;
exports.DIRECTION_EAST = 2;
exports.DIRECTION_SOUTH = 3;
exports.DIRECTION_NORTH_WEST = 4;
exports.DIRECTION_NORTH_EAST = 5;
exports.DIRECTION_SOUTH_WEST = 6;
exports.DIRECTION_SOUTH_EAST = 7;
const WEST = -1;
const NORTH = -1;
const EAST = 1;
const SOUTH = 1;
const NONE = 0;
const directionModifiers = [];
directionModifiers[exports.DIRECTION_WEST] = [WEST, NONE];
directionModifiers[exports.DIRECTION_NORTH] = [NONE, NORTH];
directionModifiers[exports.DIRECTION_EAST] = [EAST, NONE];
directionModifiers[exports.DIRECTION_SOUTH] = [NONE, SOUTH];
directionModifiers[exports.DIRECTION_NORTH_WEST] = [WEST, NORTH];
directionModifiers[exports.DIRECTION_NORTH_EAST] = [EAST, NORTH];
directionModifiers[exports.DIRECTION_SOUTH_WEST] = [WEST, SOUTH];
directionModifiers[exports.DIRECTION_SOUTH_EAST] = [EAST, SOUTH];
exports.getModifier = (direction) => {
    if (direction >= exports.DIRECTION_WEST && direction <= exports.DIRECTION_SOUTH_EAST) {
        return directionModifiers[direction];
    }
    return [0, 0];
};

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const level_1 = require("./level");
const tile_1 = require("./tile");
const point_1 = require("./point");
/*
  Almost like a raycaster, we create a viewport centered on the player and
  use the collision algorithm to decide what to draw for each tile we hit,
  gets rid of tedious bounds checking etc - good for byte count of code but
  super inefficient for the CPU. If you have a large viewport and large level
  it's very slow, even on a modern machine, but runs OK with the settings we're
  using
*/
exports.drawLevel = (putChar, level, center, viewSize, fov) => {
    const viewOff = [
        Math.floor(viewSize[point_1.X] / 2),
        Math.floor(viewSize[point_1.Y] / 2)
    ];
    /*
      Iterate over tiles in viewport
    */
    for (let vY = 0; vY < viewSize[point_1.Y]; vY++) {
        for (let vX = 0; vX < viewSize[point_1.X]; vX++) {
            const x = center[point_1.X] - viewOff[point_1.X] + vX;
            const y = center[point_1.Y] - viewOff[point_1.Y] + vY;
            const tileLocation = [x, y];
            /*
              See if we have first a mob, and if not, then a floor here
            */
            let current = level_1.atPoint(level, tileLocation);
            /*
              If nothing, add a wall at this location, then assign it to current
            */
            if (!current) {
                current = tile_1.wall(tileLocation);
                const mobs = level[level_1.MOBS];
                mobs.push(current);
            }
            /*
              Add the seen flag to all tiles within the field of view
            */
            if (vX >= (viewOff[point_1.X] - fov) && vY >= (viewOff[point_1.Y] - fov) &&
                vX <= (viewOff[point_1.X] + fov) && vY <= (viewOff[point_1.Y] + fov)) {
                current[tile_1.SEEN] = true;
            }
            const ch = current[tile_1.SEEN] ?
                current[tile_1.CHAR] :
                ' ';
            putChar(ch, vX, vY, current[tile_1.COLOR], [0, 0, 0, 255]);
        }
    }
};
exports.drawFilled = (putChar, viewSize, ch, fore, back = [0, 0, 0, 255]) => {
    /*
      Iterate over tiles in viewport
    */
    for (let vY = 0; vY < viewSize[point_1.Y]; vY++) {
        for (let vX = 0; vX < viewSize[point_1.X]; vX++) {
            putChar(ch, vX, vY, fore, back);
        }
    }
};

},{"./level":9,"./point":10,"./tile":11}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_1 = require("./point");
const draw_1 = require("./draw");
const level_1 = require("./level");
const tile_1 = require("./tile");
const chars_1 = require("./chars");
const colors_1 = require("./colors");
const util_1 = require("./util");
const cave_generator_1 = require("./cave-generator");
exports.Game = (viewSize, fov, putChar) => {
    /*
      Dungeon settings
  
      width and height are the bounds for randomly placing initial points for
      waypoints, but aside from placing those initial points, no bounding checks are
      done, to save bytes - the draw algorithm and movement checks are designed
      around points being potentially at any coordinate including negative ones
    */
    const width = 10;
    const height = 10;
    const roomCount = 2;
    const monsterCount = 2;
    const playerStartHP = 10;
    /*
      Game state
    */
    let currentLevel = 0;
    let level;
    const player = [
        0, 0, tile_1.TILE_TYPE_PLAYER, playerStartHP, chars_1.CHAR_PLAYER, colors_1.COLOR_PLAYER
    ];
    /*
      Level generator
    */
    const NewLevel = () => {
        const floors = [
            tile_1.floor(player)
        ];
        const mobs = [player];
        /*
          Cave more likely to be larger and have more monsters etc as you move down
          the levels
        */
        const levelWidth = util_1.randInt(currentLevel * width) + width;
        const levelHeight = util_1.randInt(currentLevel * height) + height;
        const levelRooms = util_1.randInt(currentLevel * roomCount) + roomCount;
        const levelMonsters = util_1.randInt(currentLevel * monsterCount) + monsterCount;
        const levelPotions = util_1.randInt(currentLevel * monsterCount) + monsterCount;
        level = cave_generator_1.Cave([levelWidth, levelHeight], levelRooms, floors, mobs);
        /*
          Would be ideal to not have stairs block corridors as it can make some parts
          of the map unreachable, but that's exprensive and the levels are at least
          always finishable
        */
        level_1.addMob(level, tile_1.TILE_TYPE_STAIRS_DOWN, 1, currentLevel > 8 ? chars_1.CHAR_WIN : chars_1.CHAR_STAIRS_DOWN, currentLevel > 8 ? colors_1.COLOR_WIN : colors_1.COLOR_STAIRS_DOWN);
        /*
          Place monsters at random free floor locations
        */
        for (let i = 0; i < levelMonsters; i++) {
            level_1.addMob(level, tile_1.TILE_TYPE_MONSTER, 1, chars_1.CHAR_MONSTER, colors_1.COLOR_MONSTER);
        }
        /*
          Place healing potions (coins) at random free floor locations
        */
        for (let i = 0; i < levelPotions; i++) {
            level_1.addMob(level, tile_1.TILE_TYPE_POTION, 1, chars_1.CHAR_POTION, colors_1.COLOR_POTION);
        }
    };
    const draw = () => {
        const isDead = player[tile_1.HP] < 1;
        const hasWon = currentLevel > 9;
        if (isDead || hasWon) {
            const ch = hasWon ? chars_1.CHAR_WIN : chars_1.CHAR_DEAD;
            draw_1.drawFilled(putChar, viewSize, ch, colors_1.COLOR_WIN);
        }
        else {
            draw_1.drawLevel(putChar, level, player, viewSize, fov);
        }
        /*
          Draw status bar if hasn't won or died, showing current level and HP (coins)
          left
        */
        if (!isDead && !hasWon) {
            const s = `${1 + currentLevel} ${chars_1.CHAR_POTION}${player[tile_1.HP]}`;
            for (let i = 0; i < viewSize[point_1.X]; i++) {
                const ch = s[i] || ' ';
                putChar(ch, i, viewSize[point_1.Y] - 1, 14, colors_1.COLOR_PLAYER);
            }
        }
    };
    /*
      Movement for both payers and monsters
    */
    const moveMob = (mob, direction) => {
        /*
          initial position
        */
        let currentPosition = [mob[point_1.X], mob[point_1.Y]];
        /*
          Monsters, one in five chance doesn't move towards player, otherwise try to
          move closer - the move algorithm  creates very predictable movement but is
          also very cheap - the chance not to move towards player helps to stop
          monsters getting permanently stuck and makes it feel less mechanical
        */
        util_1.towardsOrDirection(currentPosition, player, direction, mob[tile_1.TILE_TYPE] === tile_1.TILE_TYPE_MONSTER && !!util_1.randInt(5), p => !!util_1.collides(level[level_1.FLOORS], p));
        /*
          See if anything is at the point we tried to move to
        */
        let currentTile = util_1.collides(level[level_1.MOBS], currentPosition);
        /*
          If we're a monster and the tile we tried to move to has a player on it,
          try to hit them instead of moving there (50% chance)
        */
        if (currentTile && mob[tile_1.TILE_TYPE] === tile_1.TILE_TYPE_MONSTER &&
            currentTile[tile_1.TILE_TYPE] === tile_1.TILE_TYPE_PLAYER && util_1.randInt(2)) {
            currentTile[tile_1.HP]--;
        }
        else if (currentTile && mob[tile_1.TILE_TYPE] === tile_1.TILE_TYPE_PLAYER &&
            currentTile[tile_1.TILE_TYPE] === tile_1.TILE_TYPE_MONSTER && util_1.randInt(2)) {
            currentTile[tile_1.HP]--;
        }
        else if (currentTile && mob[tile_1.TILE_TYPE] === tile_1.TILE_TYPE_PLAYER &&
            currentTile[tile_1.TILE_TYPE] === tile_1.TILE_TYPE_STAIRS_DOWN) {
            currentLevel++;
            NewLevel();
        }
        else if (currentTile && currentTile[tile_1.TILE_TYPE] === tile_1.TILE_TYPE_POTION) {
            mob[tile_1.HP]++;
            currentTile[tile_1.HP]--;
        }
        else if (util_1.collides(level[level_1.FLOORS], currentPosition) && !currentTile) {
            mob[point_1.X] = currentPosition[point_1.X];
            mob[point_1.Y] = currentPosition[point_1.Y];
        }
    };
    const playerAction = (action) => {
        /*
          Player moves first, slight advantage
        */
        moveMob(player, action);
        /*
          Search the mobs for monsters, try to randomly move any that aren't dead
          Monsters prefer to move towards player but there's a chance they'll use
          this passed in random direction instead
        */
        for (let i = 0; i < level[level_1.MOBS].length; i++) {
            if (level[level_1.MOBS][i][tile_1.HP] &&
                level[level_1.MOBS][i][tile_1.TILE_TYPE] === tile_1.TILE_TYPE_MONSTER)
                moveMob(level[level_1.MOBS][i], util_1.randInt(8));
        }
        /*
          Redraw on movement
        */
        draw();
    };
    /*
      Generate first level, draw initial view
    */
    NewLevel();
    draw();
    const playerPosition = () => [player[point_1.X], player[point_1.Y]];
    return {
        playerAction,
        playerPosition,
        atPoint: (point, levelTileIndice) => level_1.atPoint(level, point, levelTileIndice)
    };
};

},{"./cave-generator":1,"./chars":2,"./colors":3,"./draw":5,"./level":9,"./point":10,"./tile":11,"./util":12}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CanvasConsole = require("canvas-console");
const game_1 = require("./game");
const point_1 = require("./point");
const directions_1 = require("./directions");
const keys_1 = require("./keys");
const b = document.body;
const viewport = document.getElementById('viewport');
if (!viewport) {
    throw Error('No #viewport');
}
/*
  View settings
*/
const viewSize = [25, 25];
const viewOff = [
    Math.floor(viewSize[point_1.X] / 2),
    Math.floor(viewSize[point_1.Y] / 2)
];
const fov = 6;
const start = async () => {
    const canvasConsole = await CanvasConsole(viewport, {
        viewSize: { width: viewSize[point_1.X], height: viewSize[point_1.Y] },
        spriteSize: { width: 8, height: 8 },
        spriteSource: '8x8.png',
        useCleanScaling: false
    });
    const canvas = document.querySelector('canvas');
    const { playerAction } = game_1.Game(viewSize, fov, canvasConsole.putChar);
    const mouseEventToTileLocation = (e) => {
        const x = e.offsetX / canvas.width;
        const y = e.offsetY / canvas.height;
        const tileX = Math.floor(x * viewSize[point_1.X]);
        const tileY = Math.floor(y * viewSize[point_1.Y]);
        return [tileX, tileY];
    };
    canvas.onclick = e => {
        const [tileX, tileY] = mouseEventToTileLocation(e);
        const vertical = tileY < viewOff[point_1.Y] ?
            directions_1.DIRECTION_NORTH :
            tileY > viewOff[point_1.Y] ?
                directions_1.DIRECTION_SOUTH :
                directions_1.DIRECTION_NONE;
        const horizontal = tileX < viewOff[point_1.X] ?
            directions_1.DIRECTION_WEST :
            tileX > viewOff[point_1.X] ?
                directions_1.DIRECTION_EAST :
                directions_1.DIRECTION_NONE;
        let direction = directions_1.DIRECTION_NONE;
        const distanceX = Math.abs(tileX - viewOff[point_1.X]);
        const distanceY = Math.abs(tileY - viewOff[point_1.Y]);
        if (horizontal !== directions_1.DIRECTION_NONE && vertical === directions_1.DIRECTION_NONE) {
            direction = horizontal;
        }
        else if (vertical !== directions_1.DIRECTION_NONE && horizontal === directions_1.DIRECTION_NONE) {
            direction = vertical;
        }
        else {
            if (distanceX > distanceY) {
                direction = horizontal;
            }
            else if (distanceY > distanceX) {
                direction = vertical;
            }
        }
        playerAction(direction);
    };
    b.onkeydown = (e) => {
        const action = keys_1.actionFromKeycode(e.which);
        playerAction(action);
    };
};
start();

},{"./directions":4,"./game":6,"./keys":8,"./point":10,"canvas-console":14}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const directions_1 = require("./directions");
const actionKeys = [];
actionKeys[directions_1.DIRECTION_WEST] = [37, 100];
actionKeys[directions_1.DIRECTION_NORTH] = [38, 104];
actionKeys[directions_1.DIRECTION_EAST] = [39, 102];
actionKeys[directions_1.DIRECTION_SOUTH] = [40, 98];
actionKeys[directions_1.DIRECTION_NORTH_WEST] = [36, 103];
actionKeys[directions_1.DIRECTION_NORTH_EAST] = [33, 105];
actionKeys[directions_1.DIRECTION_SOUTH_WEST] = [35, 97];
actionKeys[directions_1.DIRECTION_SOUTH_EAST] = [34, 99];
exports.actionFromKeycode = (keycode) => {
    for (let action = 0; action < actionKeys.length; action++) {
        if (actionKeys[action].includes(keycode))
            return action;
    }
    return directions_1.DIRECTION_NONE;
};

},{"./directions":4}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tile_1 = require("./tile");
const util_1 = require("./util");
const point_1 = require("./point");
exports.FLOORS = 0;
exports.MOBS = 1;
exports.SIZE = 2;
/*
  Add a new mob, even stairs are mobs to save bytes
*/
exports.addMob = (level, tileType, hp, ch, color) => {
    const [levelWidth, levelHeight] = level[exports.SIZE];
    // new mob at random location
    const mob = [
        util_1.randInt(levelWidth), util_1.randInt(levelHeight),
        tileType, hp, ch, color
    ];
    /*
      Has to collide with a floor tile to be on map, but also has to be the
      only mob at this point on the map
    */
    if (util_1.collides(level[exports.FLOORS], mob) &&
        !util_1.collides(level[exports.MOBS], mob)) {
        level[exports.MOBS].push(mob);
        return mob;
    }
    /*
      Call recursively if couldn't place, saves a while loop
    */
    return exports.addMob(level, tileType, hp, ch, color);
};
/*
  Modified drunkard's walk algorithm to tunnel out a cave between p1 and p2
*/
exports.drunkardsWalk = (level, p1, p2, drunkenness = 3) => {
    /*
      Always place p2 if it doesn't exist
    */
    if (!util_1.collides(level[exports.FLOORS], p2)) {
        level[exports.FLOORS].push(tile_1.floor(p2));
    }
    /*
      If we reached the goal, stop
    */
    if (p1[point_1.X] === p2[point_1.X] && p1[point_1.Y] === p2[point_1.Y])
        return;
    /*
      Pick a random direction to move in
    */
    const direction = util_1.randInt(4);
    /*
      Either move in that random direction, or 1 in 4 chance it moves towards
      goal - better to have it move randomly most of the time, or you just end
      up with a series of connected L shaped corridors
    */
    util_1.towardsOrDirection(p2, p1, direction, !util_1.randInt(drunkenness));
    /*
      Call again, this will keep happening until we reach the goal
    */
    exports.drunkardsWalk(level, p1, p2, drunkenness);
};
exports.atPoint = (level, point, levelTileIndice) => {
    if (levelTileIndice === undefined) {
        return util_1.collides(level[exports.MOBS], point) || util_1.collides(level[exports.FLOORS], point);
    }
    return util_1.collides(level[levelTileIndice], point);
};
exports.neighbourTiles = (level, point, levelTileIndice) => {
    const neighbourPoints = point_1.neighbours(point);
    const tiles = neighbourPoints.map(p => exports.atPoint(level, p, levelTileIndice));
    return tiles;
};

},{"./point":10,"./tile":11,"./util":12}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const directions_1 = require("./directions");
exports.X = 0;
exports.Y = 1;
exports.move = (point, direction) => {
    const modifier = directions_1.getModifier(direction);
    point[exports.X] += modifier[exports.X];
    point[exports.Y] += modifier[exports.Y];
};
exports.moveTowards = (point, target, pointFilter = p => true) => {
    // which neighbour of point is closest to target?
    const neighbourPoints = exports.neighbours(point);
    let min = Infinity;
    let dir = directions_1.DIRECTION_NONE;
    for (let direction = directions_1.DIRECTION_WEST; direction < directions_1.DIRECTION_SOUTH_EAST; direction++) {
        const p = neighbourPoints[direction];
        const dist = exports.distance(p, target);
        if (dist < min && pointFilter(p)) {
            min = dist;
            dir = direction;
        }
    }
    const modifier = directions_1.getModifier(dir);
    point[exports.X] += modifier[exports.X];
    point[exports.Y] += modifier[exports.Y];
};
exports.add = (p1, p2) => [p1[exports.X] + p2[exports.X], p1[exports.Y] + p2[exports.Y]];
exports.distance = (p1, p2) => {
    const dX = p2[exports.X] - p1[exports.X];
    const dY = p2[exports.Y] - p1[exports.Y];
    const xS = dX * dX;
    const yS = dY * dY;
    return Math.sqrt(xS + yS);
};
exports.neighbours = (point, cardinalOnly = false) => {
    const n = [];
    const endRange = cardinalOnly ? directions_1.DIRECTION_SOUTH : directions_1.DIRECTION_SOUTH_EAST;
    for (let dir = directions_1.DIRECTION_WEST; dir <= endRange; dir++) {
        const neighbourPoint = exports.add(point, directions_1.getModifier(dir));
        n.push(neighbourPoint);
    }
    return n;
};

},{"./directions":4}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_1 = require("./point");
const chars_1 = require("./chars");
const colors_1 = require("./colors");
exports.TileIndice = 0 | 1 | 2 | 3 | 4 | 5 | 6;
exports.TILE_TYPE = 2;
exports.HP = 3;
exports.CHAR = 4;
exports.COLOR = 5;
exports.SEEN = 6;
exports.TILE_TYPE_FLOOR = 0;
exports.TILE_TYPE_PLAYER = 1;
exports.TILE_TYPE_MONSTER = 2;
exports.TILE_TYPE_STAIRS_DOWN = 3;
exports.TILE_TYPE_POTION = 4;
exports.TILE_TYPE_WALL = 5;
exports.floor = (point) => {
    return [point[point_1.X], point[point_1.Y], exports.TILE_TYPE_FLOOR, 1, chars_1.CHAR_FLOOR, colors_1.COLOR_FLOOR];
};
exports.wall = (point) => {
    return [point[point_1.X], point[point_1.Y], exports.TILE_TYPE_WALL, 1, chars_1.CHAR_WALL, colors_1.COLOR_WALL];
};

},{"./chars":2,"./colors":3,"./point":10}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_1 = require("./point");
const tile_1 = require("./tile");
exports.randInt = exclusiveMax => Math.floor(Math.random() * exclusiveMax);
exports.randItem = (arr) => arr[exports.randInt(arr.length)];
exports.collides = (tiles, point) => {
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i][tile_1.HP] &&
            point[point_1.X] === tiles[i][point_1.X] &&
            point[point_1.Y] === tiles[i][point_1.Y])
            return tiles[i];
    }
};
exports.towardsOrDirection = (point, target, direction, towards = false, pointFilter = p => true) => {
    if (towards) {
        point_1.moveTowards(point, target, pointFilter);
    }
    else {
        point_1.move(point, direction);
    }
};

},{"./point":10,"./tile":11}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spriteSize = {
    width: 8,
    height: 16
};
exports.viewSize = {
    width: 80,
    height: 25
};
exports.palette = [
    [0, 0, 0, 255],
    [0, 0, 170, 255],
    [0, 170, 0, 255],
    [0, 170, 170, 255],
    [170, 0, 0, 255],
    [170, 0, 170, 255],
    [170, 85, 0, 255],
    [170, 170, 170, 255],
    [85, 85, 85, 255],
    [85, 85, 255, 255],
    [85, 255, 85, 255],
    [85, 255, 255, 255],
    [255, 85, 85, 255],
    [255, 85, 255, 255],
    [255, 255, 85, 255],
    [255, 255, 255, 255]
];
exports.spriteSource = `data:image/png;base64,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`;
exports.useCleanScaling = true;

},{}],14:[function(require,module,exports){
"use strict";
const default_options_1 = require("./default-options");
const geometry_1 = require("./lib/geometry");
const image_1 = require("./lib/image");
const image_data_1 = require("./lib/image-data");
const predicates_1 = require("./lib/predicates");
const defaultOptions = {
    spriteSize: default_options_1.spriteSize, viewSize: default_options_1.viewSize, palette: default_options_1.palette, spriteSource: default_options_1.spriteSource, useCleanScaling: default_options_1.useCleanScaling
};
const displayCanvasStyle = {
    display: 'block',
    margin: 'auto'
};
const CanvasConsole = async (container, options) => {
    const settings = Object.assign(defaultOptions, options);
    const { spriteSize, viewSize, palette, spriteSource, useCleanScaling } = settings;
    const unscaledSize = {
        width: spriteSize.width * viewSize.width,
        height: spriteSize.height * viewSize.height
    };
    const displayCanvas = document.createElement('canvas');
    const c = displayCanvas.getContext('2d');
    const buffer = c.createImageData(unscaledSize.width, unscaledSize.height);
    Object.assign(displayCanvas.style, displayCanvasStyle);
    const sprites = await image_1.loadSprites(spriteSource, spriteSize);
    let scaledBuffer;
    const blit = () => {
        image_data_1.nearestNeighbourCopy(buffer, scaledBuffer);
        c.putImageData(scaledBuffer, 0, 0);
        requestAnimationFrame(blit);
    };
    const onResize = () => {
        const parentSize = geometry_1.ElementInnerSize(container);
        let scale = geometry_1.scaleRectInRect(parentSize, unscaledSize);
        if (useCleanScaling)
            scale = (scale > 1 ? Math.floor(scale) : scale);
        const scaledSize = geometry_1.scaleSize(unscaledSize, scale);
        Object.assign(displayCanvas, scaledSize);
        displayCanvas.style.marginTop =
            geometry_1.center(parentSize.height, scaledSize.height) + 'px';
        scaledBuffer = c.createImageData(scaledSize.width, scaledSize.height);
    };
    const putChar = (ch, column, row, fore = 7, back = 0) => {
        const { width, height } = spriteSize;
        const spriteIndex = predicates_1.isNumber(ch) ? ch : ch.charCodeAt(0);
        const sprite = sprites[spriteIndex];
        const x = column * width;
        const y = row * height;
        fore = predicates_1.isNumber(fore) ? palette[fore] : fore;
        back = predicates_1.isNumber(back) ? palette[back] : back;
        image_data_1.drawColored(sprite, buffer, x, y, fore, back);
    };
    container.appendChild(displayCanvas);
    window.addEventListener('resize', onResize);
    onResize();
    blit();
    const api = {
        putChar,
        get width() { return viewSize.width; },
        get height() { return viewSize.height; }
    };
    return api;
};
module.exports = CanvasConsole;

},{"./default-options":13,"./lib/geometry":16,"./lib/image":18,"./lib/image-data":17,"./lib/predicates":19}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.R = 0;
exports.G = 1;
exports.B = 2;
exports.A = 3;
/*
  Only checks the red channel of sourceColor, assumes background if 0 or
  foreground if anything else.
*/
exports.recolorTwoBit = (sourceColor, fore, back) => sourceColor[0] ? fore : back;

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scaleRectInRect = (parentSize, childSize) => Math.min(parentSize.width / childSize.width, parentSize.height / childSize.height);
exports.scaleSize = (size, scale) => {
    return {
        width: size.width * scale,
        height: size.height * scale
    };
};
exports.center = (parent, child) => (parent - child) / 2;
exports.ElementInnerSize = (el) => {
    const boundingRect = el.getBoundingClientRect();
    const styles = window.getComputedStyle(el);
    const width = boundingRect.width - parseFloat(styles.paddingLeft) -
        parseFloat(styles.paddingRight);
    const height = boundingRect.height - parseFloat(styles.paddingTop) -
        parseFloat(styles.paddingBottom);
    return { width, height };
};

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = require("./color");
exports.getIndex = (image, x, y) => (y * image.width + x) * 4;
exports.getColor = (image, x, y) => {
    const i = exports.getIndex(image, x, y);
    const r = image.data[i];
    const g = image.data[i + 1];
    const b = image.data[i + 2];
    const a = image.data[i + 3];
    return [r, g, b, a];
};
exports.putColor = (image, color, x, y) => {
    const i = exports.getIndex(image, x, y);
    image.data[i] = color[color_1.R];
    image.data[i + 1] = color[color_1.G];
    image.data[i + 2] = color[color_1.B];
    image.data[i + 3] = color[color_1.A];
};
exports.nearestNeighbourCopy = (source, target) => {
    const fX = source.width / target.width;
    const fY = source.height / target.height;
    for (let y = 0; y < target.height; y++) {
        for (let x = 0; x < target.width; x++) {
            const sX = Math.floor(x * fX);
            const sY = Math.floor(y * fY);
            const sourceColor = exports.getColor(source, sX, sY);
            exports.putColor(target, sourceColor, x, y);
        }
    }
};
exports.drawMapped = (source, target, tX, tY, mapper) => {
    const { width, height } = source;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const sourceColor = exports.getColor(source, x, y);
            const targetColor = mapper(sourceColor);
            exports.putColor(target, targetColor, x + tX, y + tY);
        }
    }
};
exports.drawColored = (source, target, tX, tY, fore, back) => {
    const mapper = (sourceColor) => color_1.recolorTwoBit(sourceColor, fore, back);
    exports.drawMapped(source, target, tX, tY, mapper);
};

},{"./color":15}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSprites = (img, spriteSize) => {
    const { width, height } = spriteSize;
    const canvas = document.createElement('canvas');
    const c = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    c.drawImage(img, 0, 0);
    const sprites = [];
    for (let y = 0; y < img.height; y += height) {
        for (let x = 0; x < img.width; x += width) {
            const sprite = c.getImageData(x, y, width, height);
            sprites.push(sprite);
        }
    }
    return sprites;
};
exports.loadImage = async (uri) => new Promise((resolve, reject) => {
    try {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = uri;
    }
    catch (err) {
        reject(err);
    }
});
exports.loadSprites = async (uri, spriteSize) => {
    const spriteSheet = await exports.loadImage(uri);
    return exports.getSprites(spriteSheet, spriteSize);
};

},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumber = (value) => typeof value === 'number';
exports.isString = (value) => typeof value === 'string';
exports.isBoolean = (value) => typeof value === 'boolean';
exports.isSize = (value) => value && exports.isNumber(value.width) && exports.isNumber(value.height);
exports.isRgba = (value) => Array.isArray(value) && value.length === 4 && value.every(exports.isNumber);
exports.isPalette = (value) => Array.isArray(value) && value.every(exports.isRgba);
exports.isSettings = (value) => value && exports.isSize(value.spriteSize) && exports.isSize(value.viewSize) &&
    exports.isPalette(value.palette) && exports.isString(value.spriteSource) &&
    exports.isBoolean(value.useCleanScaling);

},{}]},{},[7]);
