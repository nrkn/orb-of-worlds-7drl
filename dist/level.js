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
//# sourceMappingURL=level.js.map