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
//# sourceMappingURL=cave-generator.js.map