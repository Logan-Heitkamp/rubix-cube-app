import { Move } from '../../entities/types';

/**
 * Represents a parsed Rubik's Cube move
 */
export interface ParsedMove {
  face: string;
  modifier: '' | "'" | '2';
}

/**
 * Parses a move notation string into an array of moves
 * @param notation - The move notation string (e.g., "R U R' U'")
 * @returns Array of move strings
 */
export function parseNotation(notation: string): Move[] {
  const moves = notation.split(/\s+/).filter((m) => m.length > 0);
  return moves as Move[];
}

/**
 * Validates if a move string is a valid Rubik's Cube move
 * @param move - The move string to validate
 * @returns true if valid, false otherwise
 */
export function isValidMove(move: string): boolean {
  const faces = ['U', 'D', 'F', 'B', 'L', 'R'];
  const modifiers = ['', "'", '2'];

  if (move.length < 1 || move.length > 3) return false;

  const face = move.charAt(0);
  const modifier = move.slice(1);

  return faces.includes(face) && modifiers.includes(modifier);
}

/**
 * Parses a single move string into face and modifier
 * @param move - The move string (e.g., "R", "U'", "F2")
 * @returns Object with face and modifier properties
 */
export function parseMove(move: Move): ParsedMove {
  const face = move.charAt(0);
  const modifier = move.slice(1) as '' | "'" | '2';
  return { face, modifier };
}

/**
 * Inverts a single move (adds or removes prime)
 * @param move - The move to invert
 * @returns The inverted move
 */
export function invertMove(move: Move): Move {
  if (move.endsWith("'")) return move.slice(0, -1);
  if (move.endsWith('2')) return move;
  return `${move}'`;
}

/**
 * Reverses a notation sequence with inverted moves
 * @param notation - The move notation string
 * @returns The reversed notation string
 */
export function reverseNotation(notation: string): string {
  const moves = parseNotation(notation);
  return moves.map(invertMove).reverse().join(' ');
}

/**
 * Formats milliseconds into a time string
 * @param ms - Time in milliseconds
 * @returns Formatted time string (e.g., "1:23.456" or "45.123")
 */
export function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const milliseconds = ms % 1000;

  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  }
  return `${remainingSeconds}.${milliseconds.toString().padStart(3, '0')}`;
}
