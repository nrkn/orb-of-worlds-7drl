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
//# sourceMappingURL=util.js.map