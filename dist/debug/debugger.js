"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_1 = require("../point");
const game_1 = require("../game");
const util_1 = require("../util");
const chars_1 = require("../chars");
const tile_1 = require("../tile");
exports.logGame = (viewSize, fov, logger) => {
    let log = '';
    let won = false;
    let dead = false;
    let currentScreen = '';
    let currentRow = '';
    const putChar = (ch, column, row, fore, back) => {
        if (row === 0 && column === 0 && ch === chars_1.CHAR_DEAD) {
            dead = true;
            return;
        }
        if (row === 0 && column === 0 && ch === chars_1.CHAR_WIN) {
            won = true;
            return;
        }
        if (won || dead)
            return;
        log += ch;
        if (column === viewSize[point_1.X] - 1) {
            log += '\n';
        }
        if (column === viewSize[point_1.X] - 1 && row === viewSize[point_1.Y] - 1) {
            logger(log + '\n');
            log = '';
        }
    };
    const { playerAction, playerPosition, atPoint } = game_1.Game(viewSize, fov, putChar);
    const canMove = (position) => {
        const tileAt = atPoint(position);
        return tileAt && tileAt[tile_1.TILE_TYPE] !== tile_1.TILE_TYPE_WALL;
    };
    while (!dead && !won) {
        const currentPosition = playerPosition();
        const neighbourPoints = point_1.neighbours(playerPosition());
        const directions = [];
        let dir;
        for (let direction = 0; direction < neighbourPoints.length; direction++) {
            if (dir)
                break;
            const p = neighbourPoints[direction];
            const tile = atPoint(p);
            if (tile) {
                if (tile[tile_1.TILE_TYPE] === tile_1.TILE_TYPE_MONSTER ||
                    tile[tile_1.TILE_TYPE] === tile_1.TILE_TYPE_POTION ||
                    tile[tile_1.TILE_TYPE] === tile_1.TILE_TYPE_STAIRS_DOWN) {
                    dir = direction;
                }
            }
            if (!dir && canMove(p)) {
                directions.push(direction);
            }
        }
        if (!dir) {
            if (directions.length === 0) {
                throw Error("Can't move!");
            }
            dir = directions[util_1.randInt(directions.length)];
        }
        playerAction(dir);
    }
    logger(dead ? 'Died' : 'Won');
};
//# sourceMappingURL=debugger.js.map