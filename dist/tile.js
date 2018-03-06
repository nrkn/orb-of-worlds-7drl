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
exports.TILE_TYPE_STAIRS_UP = 6;
exports.floor = (point) => {
    return [point[point_1.X], point[point_1.Y], exports.TILE_TYPE_FLOOR, 1, chars_1.CHAR_FLOOR, colors_1.COLOR_FLOOR];
};
exports.wall = (point) => {
    return [point[point_1.X], point[point_1.Y], exports.TILE_TYPE_WALL, 1, chars_1.CHAR_WALL, colors_1.COLOR_WALL];
};
//# sourceMappingURL=tile.js.map