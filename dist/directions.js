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
//# sourceMappingURL=directions.js.map