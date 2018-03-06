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
    const levels = [];
    let currentLevel = 0;
    let level;
    const player = [
        0, 0, tile_1.TILE_TYPE_PLAYER, playerStartHP, chars_1.CHAR_PLAYER, colors_1.COLOR_PLAYER
    ];
    /*
      Level generator
    */
    const NewLevel = () => {
        if (levels[currentLevel]) {
            if (levels[currentLevel] !== level)
                level = levels[currentLevel];
            return;
        }
        const floors = [
            tile_1.floor(player)
        ];
        const mobs = [player];
        if (currentLevel > 0) {
            const stairsUp = [player[point_1.X], player[point_1.Y], tile_1.TILE_TYPE_STAIRS_UP, 1, chars_1.CHAR_STAIRS_UP, colors_1.COLOR_STAIRS_DOWN];
            mobs.push(stairsUp);
        }
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
        /*
          Would be ideal to not have stairs block corridors as it can make some parts
          of the map unreachable, but that's exprensive and the levels are at least
          always finishable
        */
        const stairs = level_1.addMob(level, tile_1.TILE_TYPE_STAIRS_DOWN, 1, currentLevel > 8 ? chars_1.CHAR_WIN : chars_1.CHAR_STAIRS_DOWN, currentLevel > 8 ? colors_1.COLOR_WIN : colors_1.COLOR_STAIRS_DOWN);
        const n = point_1.neighbours(stairs);
        n.forEach(p => {
            if (!util_1.collides(level[level_1.FLOORS], p)) {
                level[level_1.FLOORS].push(tile_1.floor(p));
            }
        });
        levels[currentLevel] = level;
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
        else if (currentTile && mob[tile_1.TILE_TYPE] === tile_1.TILE_TYPE_PLAYER &&
            currentTile[tile_1.TILE_TYPE] === tile_1.TILE_TYPE_STAIRS_UP) {
            currentLevel--;
            NewLevel();
            mob[point_1.X] = currentPosition[point_1.X];
            mob[point_1.Y] = currentPosition[point_1.Y];
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
//# sourceMappingURL=game.js.map