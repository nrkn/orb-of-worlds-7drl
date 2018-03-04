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
        const [tileX, tileY] = mouseEventToTileLocation(e);
        const vertical = tileY < viewOff[point_1.Y] ?
            directions_1.DIRECTION_NORTH :
            tileY > viewOff[point_1.Y] ?
                directions_1.DIRECTION_SOUTH :
                directions_1.DIRECTION_NONE;
        const horizontal = tileX < viewOff[point_1.X] ?
            directions_1.DIRECTION_WEST :
            tileX > viewOff[point_1.X] ?
                directions_1.DIRECTION_EAST :
                directions_1.DIRECTION_NONE;
        let direction = directions_1.DIRECTION_NONE;
        const distanceX = Math.abs(tileX - viewOff[point_1.X]);
        const distanceY = Math.abs(tileY - viewOff[point_1.Y]);
        if (horizontal !== directions_1.DIRECTION_NONE && vertical === directions_1.DIRECTION_NONE) {
            direction = horizontal;
        }
        else if (vertical !== directions_1.DIRECTION_NONE && horizontal === directions_1.DIRECTION_NONE) {
            direction = vertical;
        }
        else {
            if (distanceX > distanceY) {
                direction = horizontal;
            }
            else if (distanceY > distanceX) {
                direction = vertical;
            }
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