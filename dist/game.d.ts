import { Point } from './point';
import { PutChar } from './draw';
import { Tile } from './tile';
import { Direction } from './directions';
export declare const Game: (viewSize: Point, fov: number, putChar: PutChar) => {
    playerAction: (action: Direction) => void;
    playerPosition: () => Point;
    atPoint: (point: Point, levelTileIndice?: 0 | 1 | undefined) => Tile | undefined;
};
