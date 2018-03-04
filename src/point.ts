import {
  CardinalDirection, DIRECTION_NORTH, DIRECTION_EAST, DIRECTION_SOUTH, 
  DIRECTION_WEST, Direction, getModifier, DIRECTION_SOUTH_EAST, DIRECTION_NONE
} from './directions'

export const X = 0
export const Y = 1

export interface Point extends Array<any>{
  0: number
  1: number
}

export const move = ( point: Point, direction: Direction ) => {
  const modifier = getModifier( direction )

  point[ X ] += modifier[ X ]
  point[ Y ] += modifier[ Y ]
}

export const moveTowards = ( point: Point, target: Point, pointFilter: ( p: Point ) => boolean = p => true ) => {
  // which neighbour of point is closest to target?
  const neighbourPoints = neighbours( point )

  let min = Infinity
  let dir: Direction = DIRECTION_NONE

  for( let direction = DIRECTION_WEST; direction < DIRECTION_SOUTH_EAST; direction++ ){
    const p = neighbourPoints[ direction ]
    const dist = distance( p, target )

    if( dist < min && pointFilter( p ) ){
      min = dist
      dir = <Direction>direction
    }
  }

  const modifier = getModifier( dir )

  point[ X ] += modifier[ X ]
  point[ Y ] += modifier[ Y ]
}

export const add = ( p1: Point, p2: Point ) : Point => 
  [ p1[ X ] + p2[ X ], p1[ Y ] + p2[ Y ] ]
 
export const distance = ( p1: Point, p2: Point ) : number => {
  const dX = p2[ X ] - p1[ X ]
  const dY = p2[ Y ] - p1[ Y ]

  const xS = dX * dX
  const yS = dY * dY

  return Math.sqrt( xS + yS )
}

export const neighbours = ( point: Point, cardinalOnly: boolean = false ) : Point[] => {
  const n: Point[] = []

  const endRange = cardinalOnly ? DIRECTION_SOUTH : DIRECTION_SOUTH_EAST

  for( let dir = DIRECTION_WEST; dir <= endRange; dir++ ){
    const neighbourPoint = add( point, getModifier( dir ) )
    
    n.push( neighbourPoint )
  }

  return n
}