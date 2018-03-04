import { Point, X, Y } from './point'
import { Floor, Mob } from './tile'
import { randInt } from './util'
import { drunkardsWalk, Level, FLOORS } from './level'

export const Cave = ( size: Point, rooms: number, floors: Floor[] = [], mobs: Mob[] = [] ) => {
  const level: Level = [ floors, mobs, size ]

  /*
    Tunnel out several chambers in the cave, between a random point and a
    randomly selected existing point
  */
  for( let i = 0; i < rooms; i++ ){
    drunkardsWalk(
      level,
      level[ FLOORS ][ randInt( level[ FLOORS ].length ) ],
      [ randInt( size[ X ] ), randInt( size[ Y ] ) ]
    )
  }

  return level
}
