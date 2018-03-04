import { Point, X, Y, move, neighbours } from '../point'
import { PutChar } from '../draw'
import { RgbaTuple } from 'canvas-console/dist/lib/color'
import { Game } from '../game'
import { randInt } from '../util'
import { CardinalDirection, DIRECTION_NORTH, DIRECTION_EAST, DIRECTION_SOUTH, DIRECTION_WEST, DIRECTION_NONE, Direction } from '../directions'
import { CHAR_DEAD, CHAR_WIN } from '../chars';
import { TILE_TYPE, TILE_TYPE_WALL, TILE_TYPE_FLOOR, TILE_TYPE_MONSTER, TILE_TYPE_POTION, TILE_TYPE_STAIRS_DOWN } from '../tile';

export const logGame = ( viewSize: Point, fov: number, logger: ( value: string ) => void ) => {
  let log: string = ''
  let won = false
  let dead = false

  let currentScreen: string = ''
  let currentRow: string = ''

  const putChar: PutChar = ( ch: string | number, column: number, row: number, fore: RgbaTuple | number, back: RgbaTuple | number ) => {
    if( row === 0 && column === 0 && ch === CHAR_DEAD ){
      dead = true
      return
    }

    if( row === 0 && column === 0 && ch === CHAR_WIN ){
      won = true
      return
    }

    if( won || dead ) return

    log += ch

    if( column === viewSize[ X ] - 1 ){
      log += '\n'
    }

    if( column === viewSize[ X ] - 1 && row === viewSize[ Y ] - 1 ){
      logger( log + '\n' )

      log = ''
    }
  }

  const { playerAction, playerPosition, atPoint } = Game( viewSize, fov, putChar )

  const canMove = ( position: Point ) => {
    const tileAt = atPoint( position )

    return tileAt && tileAt[ TILE_TYPE ] !== TILE_TYPE_WALL
  }

  while( !dead && !won ){
    const currentPosition = playerPosition()

    const neighbourPoints = neighbours( playerPosition() )
    const directions: Direction[] = []

    let dir

    for( let direction = 0; direction < neighbourPoints.length; direction++ ){
      if( dir ) break

      const p = neighbourPoints[ direction ]
      const tile = atPoint( p )

      if( tile ){
        if( 
          tile[ TILE_TYPE ] === TILE_TYPE_MONSTER ||
          tile[ TILE_TYPE ] === TILE_TYPE_POTION ||
          tile[ TILE_TYPE ] === TILE_TYPE_STAIRS_DOWN 
        ){
          dir = direction
        }
      } 

      if( !dir && canMove( p ) ){
        directions.push( <Direction>direction )
      }
    }

    if( !dir ){
      if( directions.length === 0 ){
        throw Error( "Can't move!" )
      }
  
      dir = directions[ randInt( directions.length ) ] 
    }


    playerAction( dir )
  }

  logger( dead ? 'Died' : 'Won' )
}
