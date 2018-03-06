import { Point, X, Y, neighbours } from './point'
import { PutChar, drawFilled, drawLevel } from './draw'
import { Level, addMob, MOBS, FLOORS, atPoint, LevelTileIndice } from './level'

import {
  Mob, TILE_TYPE_PLAYER, Floor, floor, TILE_TYPE_STAIRS_DOWN, TILE_TYPE_MONSTER,
  TILE_TYPE_POTION, HP, TILE_TYPE, Tile, TILE_TYPE_STAIRS_UP
} from './tile'

import {
  CHAR_PLAYER, CHAR_WIN, CHAR_STAIRS_DOWN, CHAR_MONSTER, CHAR_POTION, CHAR_DEAD, CHAR_STAIRS_UP
} from './chars'

import {
  COLOR_PLAYER, COLOR_WIN, COLOR_STAIRS_DOWN, COLOR_MONSTER, COLOR_POTION
} from './colors'

import { randInt, towardsOrDirection, collides } from './util'
import { Cave } from './cave-generator'
import { CardinalDirection, Direction } from './directions'
import { Action } from './actions';

export const Game = ( viewSize: Point, fov: number, putChar: PutChar ) => {
  /*
    Dungeon settings

    width and height are the bounds for randomly placing initial points for
    waypoints, but aside from placing those initial points, no bounding checks are
    done, to save bytes - the draw algorithm and movement checks are designed
    around points being potentially at any coordinate including negative ones
  */
  const width = 10
  const height = 10
  const roomCount = 2
  const monsterCount = 2
  const playerStartHP = 10

  /*
    Game state
  */
  const levels: Level[] = []
  let currentLevel = 0
  let level: Level

  const player: Mob = [
    0, 0, TILE_TYPE_PLAYER, playerStartHP, CHAR_PLAYER, COLOR_PLAYER
  ]

  /*
    Level generator
  */
  const NewLevel = () => {
    if( levels[ currentLevel ] ){
      if( levels[ currentLevel ] !== level ) level = levels[ currentLevel ]
      return
    }

    const floors: Floor[] = [
      floor( player )
    ]

    const mobs: Mob[] = [ player ]

    if( currentLevel > 0 ){
      const stairsUp: Mob = 
        [ player[ X ], player[ Y ], TILE_TYPE_STAIRS_UP, 1, CHAR_STAIRS_UP, COLOR_STAIRS_DOWN ] 

      mobs.push( stairsUp )
    }

    /*
      Cave more likely to be larger and have more monsters etc as you move down
      the levels
    */
    const levelWidth = randInt( currentLevel * width ) + width
    const levelHeight = randInt( currentLevel * height ) + height
    const levelRooms = randInt( currentLevel * roomCount ) + roomCount
    const levelMonsters = randInt( currentLevel * monsterCount ) + monsterCount
    const levelPotions = randInt( currentLevel * monsterCount ) + monsterCount

    level = Cave( [ levelWidth, levelHeight ], levelRooms, floors, mobs )

    /*
      Place monsters at random free floor locations
    */
    for( let i = 0; i < levelMonsters; i++ ){
      addMob( level, TILE_TYPE_MONSTER, 1, CHAR_MONSTER, COLOR_MONSTER )
    }

    /*
      Place healing potions (coins) at random free floor locations
    */
    for( let i = 0; i < levelPotions; i++ ){
      addMob( level, TILE_TYPE_POTION, 1, CHAR_POTION, COLOR_POTION )
    }

    /*
      Would be ideal to not have stairs block corridors as it can make some parts
      of the map unreachable, but that's exprensive and the levels are at least
      always finishable
    */
    const stairs = addMob(
      level,
      TILE_TYPE_STAIRS_DOWN,
      1,
      currentLevel > 8 ? CHAR_WIN : CHAR_STAIRS_DOWN,
      currentLevel > 8 ? COLOR_WIN : COLOR_STAIRS_DOWN
    )

    const n = neighbours( stairs )

    n.forEach( p => {
      if( !collides( level[ FLOORS ], p ) ){
        (<Floor[]>level[ FLOORS ]).push( floor( p ) )
      }
    })

    levels[ currentLevel ] = level
  }

  const draw = () => {
    const isDead = player[ HP ] < 1
    const hasWon = currentLevel > 9

    if( isDead || hasWon ){
      const ch = hasWon ? CHAR_WIN : CHAR_DEAD

      drawFilled( putChar, viewSize, ch, COLOR_WIN )
    } else {
      drawLevel( putChar, level, player, viewSize, fov )
    }

    /*
      Draw status bar if hasn't won or died, showing current level and HP (coins)
      left
    */
    if( !isDead && !hasWon ){
      const s = `${ 1 + currentLevel } ${ CHAR_POTION }${ player[ HP ]}`

      for( let i = 0; i < viewSize[ X ]; i++ ){
        const ch = s[ i ] || ' '

        putChar( ch, i, viewSize[ Y ] - 1, 14, COLOR_PLAYER )
      }
    }
  }

  /*
    Movement for both payers and monsters
  */
  const moveMob = ( mob, direction ) => {
    /*
      initial position
    */
    let currentPosition: Point = [ mob[ X ], mob[ Y ] ]

    /*
      Monsters, one in five chance doesn't move towards player, otherwise try to
      move closer - the move algorithm  creates very predictable movement but is
      also very cheap - the chance not to move towards player helps to stop
      monsters getting permanently stuck and makes it feel less mechanical
    */
    towardsOrDirection(
      currentPosition, 
      player,
      direction, 
      mob[ TILE_TYPE ] === TILE_TYPE_MONSTER && !!randInt( 5 ),
      p => !!collides( level[ FLOORS ], p )
    )

    /*
      See if anything is at the point we tried to move to
    */
    let currentTile = collides( level[ MOBS ], currentPosition )

    /*
      If we're a monster and the tile we tried to move to has a player on it,
      try to hit them instead of moving there (50% chance)
    */
    if(
      currentTile && mob[ TILE_TYPE ] === TILE_TYPE_MONSTER &&
      currentTile[ TILE_TYPE ] === TILE_TYPE_PLAYER && randInt( 2 )
    ){
      currentTile[ HP ]--
    }
    /*
      Ditto for player moving onto monster
    */
    else if(
      currentTile && mob[ TILE_TYPE ] === TILE_TYPE_PLAYER &&
      currentTile[ TILE_TYPE ] === TILE_TYPE_MONSTER && randInt( 2 )
    ){
      currentTile[ HP ]--
    }
    /*
      Player moved on to stairs, create a new level
    */
    else if(
      currentTile && mob[ TILE_TYPE ] === TILE_TYPE_PLAYER &&
      currentTile[ TILE_TYPE ] === TILE_TYPE_STAIRS_DOWN
    ){
      currentLevel++
      NewLevel()
    }
    /*
      Player moved on to stairs up, go up one level
    */
    else if(
      currentTile && mob[ TILE_TYPE ] === TILE_TYPE_PLAYER &&
      currentTile[ TILE_TYPE ] === TILE_TYPE_STAIRS_UP
    ){       
      mob[ X ] = currentPosition[ X ]
      mob[ Y ] = currentPosition[ Y ]
      currentLevel--
      NewLevel()
    }
     /*
      Potion - note that monsters can also pick up potions - to change, check
      if mob is player, but this is more fun for game play as it creates some
      monsters that are stronger as the monsters traverse the level and get
      potions, also situations where the player is trying not to let the monster
      get it etc
    */
    else if( currentTile && currentTile[ TILE_TYPE ] === TILE_TYPE_POTION ){
      mob[ HP ]++
      currentTile[ HP ]--
    }
    /*
      Finally, if nothing else happened and this is a floor tile, we can move the
      mob onto it
    */
    else if(
      collides( level[ FLOORS ], currentPosition ) && !currentTile
    ){
      mob[ X ] = currentPosition[ X ]
      mob[ Y ] = currentPosition[ Y ]
    }
  }

  const playerAction = ( action: Action ) => {
    /*
      Player moves first, slight advantage
    */
    moveMob( player, action )

    /*
      Search the mobs for monsters, try to randomly move any that aren't dead
      Monsters prefer to move towards player but there's a chance they'll use
      this passed in random direction instead
    */
    for( let i = 0; i < level[ MOBS ].length; i++ ){
      if(
        level[ MOBS ][ i ][ HP ] &&
        level[ MOBS ][ i ][ TILE_TYPE ] === TILE_TYPE_MONSTER
      ) moveMob( level[ MOBS ][ i ], randInt( 8 ) )
    }

    /*
      Redraw on movement
    */
    draw()
  }

  /*
    Generate first level, draw initial view
  */
  NewLevel()
  draw()

  const playerPosition = () : Point => [ player[ X ], player[ Y ] ]

  return { 
    playerAction, 
    playerPosition, 
    atPoint: ( point: Point, levelTileIndice?: LevelTileIndice ) : Tile | undefined => 
      atPoint( level, point, levelTileIndice )
  }
}
