import { 
  DIRECTION_EAST, DIRECTION_NORTH_EAST, DIRECTION_WEST, DIRECTION_NONE, 
  DIRECTION_NORTH, DIRECTION_SOUTH, DIRECTION_NORTH_WEST, DIRECTION_SOUTH_WEST, 
  DIRECTION_SOUTH_EAST 
} from './directions'

import { Action } from './actions'

const actionKeys : number[][] = []

actionKeys[ DIRECTION_WEST ] = [ 37, 100 ]
actionKeys[ DIRECTION_NORTH ] = [ 38, 104 ]
actionKeys[ DIRECTION_EAST ] = [ 39, 102 ]
actionKeys[ DIRECTION_SOUTH ] = [ 40, 98 ]
actionKeys[ DIRECTION_NORTH_WEST ] = [ 36, 103 ]
actionKeys[ DIRECTION_NORTH_EAST ] = [ 33, 105 ]
actionKeys[ DIRECTION_SOUTH_WEST ] = [ 35, 97 ]
actionKeys[ DIRECTION_SOUTH_EAST ] = [ 34, 99 ]

export const actionFromKeycode = ( keycode : number ) : Action => {
  for( let action = 0; action < actionKeys.length; action++ ){
    if( actionKeys[ action ].includes( keycode ) ) return <Action>action
  }

  return <Action>DIRECTION_NONE
}
