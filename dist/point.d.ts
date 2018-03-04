import { Direction } from './directions';
export declare const X = 0;
export declare const Y = 1;
export interface Point extends Array<any> {
    0: number;
    1: number;
}
export declare const move: (point: Point, direction: Direction) => void;
export declare const moveTowards: (point: Point, target: Point, pointFilter?: (p: Point) => boolean) => void;
export declare const add: (p1: Point, p2: Point) => Point;
export declare const distance: (p1: Point, p2: Point) => number;
export declare const neighbours: (point: Point, cardinalOnly?: boolean) => Point[];
