import { X, Y, Point, moveTowards, move } from './point'
import { Tile, HP } from './tile'
import { CardinalDirection } from './directions'

export const randInt = exclusiveMax =>
  Math.floor( Math.random() * exclusiveMax )

export const randItem = ( arr: any[] ) => arr[ randInt( arr.length ) ]

export const collides = ( tiles: Tile[], point: Point ) => {
  for( let i = 0; i < tiles.length; i++ ){
    if(
      tiles[ i ][ HP ] &&
      point[ X ] === tiles[ i ][ X ] &&
      point[ Y ] === tiles[ i ][ Y ]
    ) return tiles[ i ]
  }
}

export const towardsOrDirection = ( point: Point, target: Point, direction: CardinalDirection, towards: boolean = false, pointFilter: ( p: Point ) => boolean = p => true ) => {
  if( towards ){
    moveTowards( point, target, pointFilter )
  } else {
    move( point, direction )
  }
}
