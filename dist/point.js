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
//# sourceMappingURL=point.js.map