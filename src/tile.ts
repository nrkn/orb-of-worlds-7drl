import { RgbaTuple } from 'canvas-console/dist/lib/color'
import { Point, X, Y } from './point'
import { CHAR_FLOOR, CHAR_WALL } from './chars';
import { COLOR_FLOOR, COLOR_WALL } from './colors';

export const TileIndice = 0 | 1 | 2 | 3 | 4 | 5 | 6

export const TILE_TYPE = 2
export const HP = 3
export const CHAR = 4
export const COLOR = 5
export const SEEN = 6

export type FloorType = 0
export type PlayerType = 1
export type WallType = 5
export type MobType = 1 | 2 | 3 | 4 | 5
export type TileType = FloorType | MobType

export const TILE_TYPE_FLOOR: TileType & FloorType = 0
export const TILE_TYPE_PLAYER: TileType & MobType & PlayerType = 1
export const TILE_TYPE_MONSTER: TileType & MobType = 2
export const TILE_TYPE_STAIRS_DOWN: TileType & MobType = 3
export const TILE_TYPE_POTION: TileType & MobType = 4
export const TILE_TYPE_WALL: TileType & MobType & WallType = 5

export interface Tile extends Point {
  2: TileType
  3: number
  4: string | number
  5: RgbaTuple
  6?: boolean | undefined
}

export interface Mob extends Tile {
  2: MobType
}

export interface Floor extends Tile {
  2: FloorType
}

export interface Player extends Mob {
  2: PlayerType
}

export interface Wall extends Mob {
  2: WallType
}

export const floor = ( point: Point ) : Floor => {
  return [ point[ X ], point[ Y ], TILE_TYPE_FLOOR, 1, CHAR_FLOOR, COLOR_FLOOR ]
}

export const wall = ( point: Point ) : Wall => {
  return [ point[ X ], point[ Y ], TILE_TYPE_WALL, 1, CHAR_WALL, COLOR_WALL ]
}