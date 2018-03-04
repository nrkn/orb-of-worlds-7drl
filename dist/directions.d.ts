import { Point } from './point';
export declare type CardinalDirection = -1 | 0 | 1 | 2 | 3;
export declare type VerticalDirection = -1 | 1 | 3;
export declare type HorizontalDirection = -1 | 0 | 2;
export declare type OrdinalDirection = -1 | 4 | 5 | 6 | 7;
export declare type Direction = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export declare const DIRECTION_NONE: Direction & CardinalDirection & OrdinalDirection & VerticalDirection & HorizontalDirection;
export declare const DIRECTION_WEST: Direction & CardinalDirection & HorizontalDirection;
export declare const DIRECTION_NORTH: Direction & CardinalDirection & VerticalDirection;
export declare const DIRECTION_EAST: Direction & CardinalDirection & HorizontalDirection;
export declare const DIRECTION_SOUTH: Direction & CardinalDirection & VerticalDirection;
export declare const DIRECTION_NORTH_WEST: Direction & OrdinalDirection;
export declare const DIRECTION_NORTH_EAST: Direction & OrdinalDirection;
export declare const DIRECTION_SOUTH_WEST: Direction & OrdinalDirection;
export declare const DIRECTION_SOUTH_EAST: Direction & OrdinalDirection;
export declare const getModifier: (direction: Direction) => Point;
