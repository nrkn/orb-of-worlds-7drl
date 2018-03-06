"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CanvasConsole = require("canvas-console");
const game_1 = require("./game");
const point_1 = require("./point");
const directions_1 = require("./directions");
const keys_1 = require("./keys");
const b = document.body;
const viewport = document.getElementById('viewport');
if (!viewport) {
    throw Error('No #viewport');
}
/*
  View settings
*/
const viewSize = [25, 25];
const viewOff = [
    Math.floor(viewSize[point_1.X] / 2),
    Math.floor(viewSize[point_1.Y] / 2)
];
const fov = 6;
const start = async () => {
    const canvasConsole = await CanvasConsole(viewport, {
        viewSize: { width: viewSize[point_1.X], height: viewSize[point_1.Y] },
        spriteSize: { width: 8, height: 8 },
        spriteSource: '8x8.png',
        useCleanScaling: false
    });
    const canvas = document.querySelector('canvas');
    const { playerAction } = game_1.Game(viewSize, fov, canvasConsole.putChar);
    const mouseEventToTileLocation = (e) => {
        const x = e.offsetX / canvas.width;
        const y = e.offsetY / canvas.height;
        const tileX = Math.floor(x * viewSize[point_1.X]);
        const tileY = Math.floor(y * viewSize[point_1.Y]);
        return [tileX, tileY];
    };
    canvas.onclick = e => {
        const center = [canvas.width / 2, canvas.height / 2];
        const vector = [e.offsetX - center[point_1.X], e.offsetY - center[point_1.Y]];
        const radians = Math.atan2(vector[point_1.X], vector[point_1.Y]);
        const dir = (16 + Math.round(8 * radians / Math.PI)) % 16;
        let direction = directions_1.DIRECTION_NONE;
        if (dir >= 1 && dir < 3) {
            direction = directions_1.DIRECTION_SOUTH_EAST;
        }
        else if (dir >= 3 && dir < 5) {
            direction = directions_1.DIRECTION_EAST;
        }
        else if (dir >= 5 && dir < 7) {
            direction = directions_1.DIRECTION_NORTH_EAST;
        }
        else if (dir >= 7 && dir < 9) {
            direction = directions_1.DIRECTION_NORTH;
        }
        else if (dir >= 9 && dir < 11) {
            direction = directions_1.DIRECTION_NORTH_WEST;
        }
        else if (dir >= 11 && dir < 13) {
            direction = directions_1.DIRECTION_WEST;
        }
        else if (dir >= 13 && dir < 15) {
            direction = directions_1.DIRECTION_SOUTH_WEST;
        }
        else {
            direction = directions_1.DIRECTION_SOUTH;
        }
        playerAction(direction);
    };
    b.onkeydown = (e) => {
        const action = keys_1.actionFromKeycode(e.which);
        playerAction(action);
    };
};
start();
//# sourceMappingURL=index.js.map