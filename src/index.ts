import * as CanvasConsole from 'canvas-console'

import { CanvasConsoleApi } from 'canvas-console/dist/types'
import { Game } from './game'
import { Point, X, Y } from './point'

import {
  CardinalDirection, VerticalDirection, HorizontalDirection, DIRECTION_NORTH,
  DIRECTION_EAST, DIRECTION_SOUTH, DIRECTION_WEST, DIRECTION_NONE, Direction,
  DIRECTION_SOUTH_EAST, DIRECTION_NORTH_EAST, DIRECTION_NORTH_WEST,
  DIRECTION_SOUTH_WEST
} from './directions'

import { actionFromKeycode } from './keys';

const b = document.body

const viewport = document.getElementById( 'viewport' )

if( !viewport ){
  throw Error( 'No #viewport' )
}

/*
  View settings
*/
const viewSize: Point = [ 25, 25 ]
const viewOff: Point = [
  Math.floor( viewSize[ X ] / 2 ),
  Math.floor( viewSize[ Y ] / 2 )
]
const fov = 6

const start = async () => {
  const canvasConsole = await CanvasConsole( viewport, {
    viewSize: { width: viewSize[ X ], height: viewSize[ Y ] },
    spriteSize: { width: 8, height: 8 },
    spriteSource: '8x8.png',
    useCleanScaling: false
  })

  const canvas = document.querySelector( 'canvas' )!

  const { playerAction } = Game( viewSize, fov, canvasConsole.putChar )

  const mouseEventToTileLocation = ( e: MouseEvent ) : Point => {
    const x = e.offsetX / canvas.width
    const y = e.offsetY / canvas.height

    const tileX = Math.floor( x * viewSize[ X ] )
    const tileY = Math.floor( y * viewSize[ Y ] )

    return [ tileX, tileY ]
  }

  canvas.onclick = e => {
    const center = [ canvas.width / 2, canvas.height / 2 ]
    const vector = [ e.offsetX - center[ X ], e.offsetY - center[ Y ] ]
    const radians = Math.atan2( vector[ X ], vector[ Y ] )
    const dir = ( 16 + Math.round( 8 * radians / Math.PI ) ) % 16

    let direction: Direction = DIRECTION_NONE

    if( dir >= 1 && dir < 3 ){
      direction = DIRECTION_SOUTH_EAST
    } else if( dir >= 3 && dir < 5 ){
      direction = DIRECTION_EAST
    } else if( dir >= 5 && dir < 7 ){
      direction = DIRECTION_NORTH_EAST
    } else if( dir >= 7 && dir < 9 ){
      direction = DIRECTION_NORTH
    } else if( dir >= 9 && dir < 11 ){
      direction = DIRECTION_NORTH_WEST
    } else if( dir >= 11 && dir < 13 ){
      direction = DIRECTION_WEST
    } else if( dir >= 13 && dir < 15 ){
      direction = DIRECTION_SOUTH_WEST
    } else {
      direction = DIRECTION_SOUTH
    }

    playerAction( direction )
  }

  b.onkeydown = ( e : KeyboardEvent ) => {
    const action = actionFromKeycode( e.which )

    playerAction( <Direction>action )
  }
}

start()
