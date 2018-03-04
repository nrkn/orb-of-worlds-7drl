import { Level, MOBS, FLOORS, atPoint } from './level'
import { Mob, TILE_TYPE_WALL, SEEN, CHAR, COLOR, Wall, wall } from './tile'
import { Point, X, Y } from './point'
import { collides } from './util';
import { CHAR_WALL } from './chars';
import { COLOR_WALL } from './colors';
import { RgbaTuple } from 'canvas-console/dist/lib/color'
import { CanvasConsoleApi } from 'canvas-console/dist/types'

export type PutChar = ( ch: string | number, column: number, row: number, fore: RgbaTuple | number, back: RgbaTuple | number ) => void

/*
  Almost like a raycaster, we create a viewport centered on the player and
  use the collision algorithm to decide what to draw for each tile we hit,
  gets rid of tedious bounds checking etc - good for byte count of code but
  super inefficient for the CPU. If you have a large viewport and large level
  it's very slow, even on a modern machine, but runs OK with the settings we're
  using
*/
export const drawLevel = ( putChar: PutChar, level: Level, center: Point, viewSize: Point, fov: number ) => {
  const viewOff: Point = [
    Math.floor( viewSize[ X ] / 2 ),
    Math.floor( viewSize[ Y ] / 2 )
  ]

  /*
    Iterate over tiles in viewport
  */
  for( let vY = 0; vY < viewSize[ Y ]; vY++ ){
    for( let vX = 0; vX < viewSize[ X ]; vX++ ){
      const x = center[ X ] - viewOff[ X ] + vX
      const y = center[ Y ] - viewOff[ Y ] + vY
      const tileLocation: Point = [ x, y ]

      /*
        See if we have first a mob, and if not, then a floor here
      */
      let current = atPoint( level, tileLocation )

      /*
        If nothing, add a wall at this location, then assign it to current
      */
      if( !current ){
        current = wall( tileLocation )
        const mobs = <Mob[]>level[ MOBS ]
        mobs.push( <Mob>current )
      }

      /*
        Add the seen flag to all tiles within the field of view
      */
      if(
        vX >= ( viewOff[ X ] - fov ) && vY >= ( viewOff[ Y ] - fov ) &&
        vX <= ( viewOff[ X ] + fov ) && vY <= ( viewOff[ Y ] + fov )
      ){
        current[ SEEN ] = true
      }

      const ch =
        current[ SEEN ] ?
        current[ CHAR ] :
        ' '

      putChar( ch, vX, vY, current[ COLOR ], [ 0, 0, 0, 255 ] )
    }
  }
}

export const drawFilled = ( putChar: PutChar, viewSize: Point, ch: string | number, fore: number | RgbaTuple , back: number | RgbaTuple = [ 0, 0, 0, 255 ] ) => {
  /*
    Iterate over tiles in viewport
  */
  for( let vY = 0; vY < viewSize[ Y ]; vY++ ){
    for( let vX = 0; vX < viewSize[ X ]; vX++ ){
      putChar( ch, vX, vY, fore, back )
    }
  }
}
