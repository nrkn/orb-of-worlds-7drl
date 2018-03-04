import * as CanvasConsole from 'canvas-console'

import { CanvasConsoleApi } from 'canvas-console/dist/types'
import { Game } from './game'
import { Point, X, Y } from './point'

import {
  CardinalDirection, VerticalDirection, HorizontalDirection, DIRECTION_NORTH,
  DIRECTION_EAST, DIRECTION_SOUTH, DIRECTION_WEST, DIRECTION_NONE, Direction
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
    const [ tileX, tileY ] = mouseEventToTileLocation( e )

    const vertical: VerticalDirection =
      tileY < viewOff[ Y ] ?
      DIRECTION_NORTH :
      tileY > viewOff[ Y ] ?
      DIRECTION_SOUTH :
      DIRECTION_NONE

    const horizontal: HorizontalDirection =
      tileX < viewOff[ X ] ?
      DIRECTION_WEST :
      tileX > viewOff[ X ] ?
      DIRECTION_EAST :
      DIRECTION_NONE

    let direction: CardinalDirection = DIRECTION_NONE

    const distanceX = Math.abs( tileX - viewOff[ X ] )
    const distanceY = Math.abs( tileY - viewOff[ Y ] )

    if( horizontal !== DIRECTION_NONE && vertical === DIRECTION_NONE ){
      direction = horizontal
    } else if( vertical !== DIRECTION_NONE && horizontal === DIRECTION_NONE ){
      direction = vertical
    } else {
      if( distanceX > distanceY ){
        direction = horizontal
      } else if( distanceY > distanceX ){
        direction = vertical
      }
    }

    playerAction( direction )
  }

  b.onkeydown = ( e : KeyboardEvent ) => {
    const action = actionFromKeycode( e.which )

    playerAction( <Direction>action )
  }
}

start()
