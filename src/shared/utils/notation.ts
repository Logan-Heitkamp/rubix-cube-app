import { Move } from '../../entities/types';

export interface ParsedMove {
  face: string;
  modifier: '' | "'" | '2';
}

export function parseNotation(notation: string): Move[] {
  const moves = notation.split(/\s+/).filter((m) => m.length > 0);
  return moves as Move[];
}

export function isValidMove(move: string): boolean {
  const faces = ['U', 'D', 'F', 'B', 'L', 'R'];
  const modifiers = ['', "'", '2'];

  if (move.length < 1 || move.length > 3) return false;

  const face = move.charAt(0);
  const modifier = move.slice(1);

  return faces.includes(face) && modifiers.includes(modifier);
}

export function parseMove(move: Move): ParsedMove {
  const face = move.charAt(0);
  const modifier = move.slice(1) as '' | "'" | '2';
  return { face, modifier };
}

export function invertMove(move: Move): Move {
  if (move.endsWith("'")) return move.slice(0, -1);
  if (move.endsWith('2')) return move;
  return `${move}'`;
}

export function reverseNotation(notation: string): string {
  const moves = parseNotation(notation);
  return moves.map(invertMove).reverse().join(' ');
}

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
