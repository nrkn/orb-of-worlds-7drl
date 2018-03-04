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
//# sourceMappingURL=keys.js.map