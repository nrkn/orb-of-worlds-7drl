import { Floor, Mob, Tile, MobType, TILE_TYPE_FLOOR, floor } from './tile'
import { RgbaTuple } from 'canvas-console/dist/lib/color'
import { randInt, collides, towardsOrDirection } from './util'
import { Point, X, Y, add, neighbours } from './point'
import { CHAR_FLOOR } from './chars';
import { COLOR_FLOOR } from './colors';
import { CardinalDirection, DIRECTION_WEST, DIRECTION_SOUTH_EAST, Direction, getModifier } from './directions';

export type LevelIndice = 0 | 1 | 2
export type LevelTileIndice = 0 | 1

export const FLOORS: LevelIndice & LevelTileIndice = 0
export const MOBS: LevelIndice & LevelTileIndice = 1
export const SIZE: LevelIndice = 2

export interface Level extends Array<any> {
  0: Floor[]
  1: Mob[],
  2: Point
}

export interface Neighbours extends Array<Tile|undefined> {
  0?: Tile
  1?: Tile
  2?: Tile
  3?: Tile
  4?: Tile
  5?: Tile
  6?: Tile
  7?: Tile
}

/*
  Add a new mob, even stairs are mobs to save bytes
*/
export const addMob = ( level: Level, tileType: MobType, hp: number, ch: string | number, color: RgbaTuple ) : Mob => {
  const [ levelWidth, levelHeight ] = level[ SIZE ]

  // new mob at random location
  const mob: Mob = [
    randInt( levelWidth ), randInt( levelHeight ),
    tileType, hp, ch, color
  ]

  /*
    Has to collide with a floor tile to be on map, but also has to be the
    only mob at this point on the map
  */
  if(
    collides( level[ FLOORS ], mob ) &&
    !collides( level[ MOBS ], mob )
  ){
    level[ MOBS ].push( mob )

    return mob
  }

  /*
    Call recursively if couldn't place, saves a while loop
  */
  return addMob( level, tileType, hp, ch, color )
}

/*
  Modified drunkard's walk algorithm to tunnel out a cave between p1 and p2
*/
export const drunkardsWalk = ( level: Level, p1: Point, p2: Point, drunkenness: number = 3 ) => {
  /*
    Always place p2 if it doesn't exist
  */
  if( !collides( level[ FLOORS ], p2 ) ){
    level[ FLOORS ].push(
      floor( p2 )
    )
  }

  /*
    If we reached the goal, stop
  */
  if( p1[ X ] === p2[ X ] && p1[ Y ] === p2[ Y ] ) return

  /*
    Pick a random direction to move in
  */
  const direction = <CardinalDirection>randInt( 4 )

  /*
    Either move in that random direction, or 1 in 4 chance it moves towards
    goal - better to have it move randomly most of the time, or you just end
    up with a series of connected L shaped corridors
  */
  towardsOrDirection( p2, p1, direction, !randInt( drunkenness ) )

  /*
    Call again, this will keep happening until we reach the goal
  */
  drunkardsWalk( level, p1, p2, drunkenness )
}

export const atPoint = ( level: Level, point: Point, levelTileIndice?: LevelTileIndice ) : Tile | undefined => {
  if( levelTileIndice === undefined ){
    return collides( level[ MOBS ], point ) || collides( level[ FLOORS ], point )
  }

  return collides( level[ levelTileIndice ], point )
}

export const neighbourTiles = ( level: Level, point: Point, levelTileIndice?: LevelTileIndice ) : Neighbours => {
  const neighbourPoints = neighbours( point )

  const tiles = neighbourPoints.map( p => atPoint( level, p, levelTileIndice ) )

  return tiles
}
