import { Point } from './point'

export type CardinalDirection = -1 | 0 | 1 | 2 | 3
export type VerticalDirection = -1 | 1 | 3
export type HorizontalDirection = -1 | 0 | 2
export type OrdinalDirection = -1 | 4 | 5 | 6 | 7
export type Direction = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

export const DIRECTION_NONE: Direction & CardinalDirection & OrdinalDirection & VerticalDirection & HorizontalDirection = -1
export const DIRECTION_WEST: Direction & CardinalDirection & HorizontalDirection = 0
export const DIRECTION_NORTH: Direction & CardinalDirection & VerticalDirection = 1
export const DIRECTION_EAST: Direction & CardinalDirection & HorizontalDirection = 2
export const DIRECTION_SOUTH: Direction & CardinalDirection & VerticalDirection = 3

export const DIRECTION_NORTH_WEST: Direction & OrdinalDirection = 4
export const DIRECTION_NORTH_EAST: Direction & OrdinalDirection = 5
export const DIRECTION_SOUTH_WEST: Direction & OrdinalDirection = 6
export const DIRECTION_SOUTH_EAST: Direction & OrdinalDirection = 7

const WEST  = -1
const NORTH = -1
const EAST = 1
const SOUTH = 1
const NONE = 0

const directionModifiers: Point[] = []

directionModifiers[ DIRECTION_WEST ] = [ WEST, NONE ]
directionModifiers[ DIRECTION_NORTH ] = [ NONE, NORTH ]
directionModifiers[ DIRECTION_EAST ] = [ EAST, NONE ]
directionModifiers[ DIRECTION_SOUTH ] = [ NONE, SOUTH ]

directionModifiers[ DIRECTION_NORTH_WEST ] = [ WEST, NORTH ]
directionModifiers[ DIRECTION_NORTH_EAST ] = [ EAST, NORTH ]
directionModifiers[ DIRECTION_SOUTH_WEST ] = [ WEST, SOUTH ]
directionModifiers[ DIRECTION_SOUTH_EAST ] = [ EAST, SOUTH ]

export const getModifier = ( direction: Direction ) : Point => {
  if( direction >= DIRECTION_WEST && direction <= DIRECTION_SOUTH_EAST ){
    return directionModifiers[ direction ]
  }

  return [ 0, 0 ]
}
