import { RgbaTuple } from 'canvas-console/dist/lib/color';
import { Point } from './point';
export declare const TileIndice: number;
export declare const TILE_TYPE = 2;
export declare const HP = 3;
export declare const CHAR = 4;
export declare const COLOR = 5;
export declare const SEEN = 6;
export declare type FloorType = 0;
export declare type PlayerType = 1;
export declare type WallType = 5;
export declare type MobType = 1 | 2 | 3 | 4 | 5 | 6;
export declare type TileType = FloorType | MobType;
export declare const TILE_TYPE_FLOOR: TileType & FloorType;
export declare const TILE_TYPE_PLAYER: TileType & MobType & PlayerType;
export declare const TILE_TYPE_MONSTER: TileType & MobType;
export declare const TILE_TYPE_STAIRS_DOWN: TileType & MobType;
export declare const TILE_TYPE_POTION: TileType & MobType;
export declare const TILE_TYPE_WALL: TileType & MobType & WallType;
export declare const TILE_TYPE_STAIRS_UP: TileType & MobType;
export interface Tile extends Point {
    2: TileType;
    3: number;
    4: string | number;
    5: RgbaTuple;
    6?: boolean | undefined;
}
export interface Mob extends Tile {
    2: MobType;
}
export interface Floor extends Tile {
    2: FloorType;
}
export interface Player extends Mob {
    2: PlayerType;
}
export interface Wall extends Mob {
    2: WallType;
}
export declare const floor: (point: Point) => Floor;
export declare const wall: (point: Point) => Wall;
