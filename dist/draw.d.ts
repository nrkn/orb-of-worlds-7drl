import { Level } from './level';
import { Point } from './point';
import { RgbaTuple } from 'canvas-console/dist/lib/color';
export declare type PutChar = (ch: string | number, column: number, row: number, fore: RgbaTuple | number, back: RgbaTuple | number) => void;
export declare const drawLevel: (putChar: PutChar, level: Level, center: Point, viewSize: Point, fov: number) => void;
export declare const drawFilled: (putChar: PutChar, viewSize: Point, ch: string | number, fore: number | RgbaTuple, back?: number | RgbaTuple) => void;
