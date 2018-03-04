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
//# sourceMappingURL=draw.js.map