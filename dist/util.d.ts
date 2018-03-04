import { Point } from './point';
import { Tile } from './tile';
import { CardinalDirection } from './directions';
export declare const randInt: (exclusiveMax: any) => number;
export declare const randItem: (arr: any[]) => any;
export declare const collides: (tiles: Tile[], point: Point) => Tile | undefined;
export declare const towardsOrDirection: (point: Point, target: Point, direction: CardinalDirection, towards?: boolean, pointFilter?: (p: Point) => boolean) => void;
