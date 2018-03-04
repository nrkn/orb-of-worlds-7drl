import { Floor, Mob, Tile, MobType } from './tile';
import { RgbaTuple } from 'canvas-console/dist/lib/color';
import { Point } from './point';
export declare type LevelIndice = 0 | 1 | 2;
export declare type LevelTileIndice = 0 | 1;
export declare const FLOORS: LevelIndice & LevelTileIndice;
export declare const MOBS: LevelIndice & LevelTileIndice;
export declare const SIZE: LevelIndice;
export interface Level extends Array<any> {
    0: Floor[];
    1: Mob[];
    2: Point;
}
export interface Neighbours extends Array<Tile | undefined> {
    0?: Tile;
    1?: Tile;
    2?: Tile;
    3?: Tile;
    4?: Tile;
    5?: Tile;
    6?: Tile;
    7?: Tile;
}
export declare const addMob: (level: Level, tileType: MobType, hp: number, ch: string | number, color: RgbaTuple) => Mob;
export declare const drunkardsWalk: (level: Level, p1: Point, p2: Point, drunkenness?: number) => void;
export declare const atPoint: (level: Level, point: Point, levelTileIndice?: 0 | 1 | undefined) => Tile | undefined;
export declare const neighbourTiles: (level: Level, point: Point, levelTileIndice?: 0 | 1 | undefined) => Neighbours;
