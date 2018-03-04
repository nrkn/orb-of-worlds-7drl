import { Point } from './point';
import { Floor, Mob } from './tile';
import { Level } from './level';
export declare const Cave: (size: Point, rooms: number, floors?: Floor[], mobs?: Mob[]) => Level;
