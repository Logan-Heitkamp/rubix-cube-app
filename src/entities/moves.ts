import { RotationAxis } from './types';

/** Represents a single Rubik's Cube move */
export interface CubeMove {
  name: string; // Notation (U, U', U2, etc.)
  axis: RotationAxis;
  direction: 1 | -1; // 1 = clockwise, -1 = counter-clockwise
  slice: number; // -1, 0, or 1 (layer to turn)
  angle: number; // Total rotation angle in degrees
}

/**
 * Standard Rubik's Cube Notation:
 * U = Up face (top) - y=1
 * D = Down face (bottom) - y=-1
 * L = Left face - x=-1
 * R = Right face - x=1
 * F = Front face - z=1
 * B = Back face - z=-1
 *
 * Prime (') = counter-clockwise (90 degrees)
 * 2 = 180 degrees
 *
 * Lowercase = wide turns (2 layers)
 * M = Middle slice (between L and R)
 * E = Equatorial slice (between U and D)
 * S = Standing slice (between F and B)
 *
 * x, y, z = whole cube rotations
 */

// Face turns (single layer)
// Standard notation: Clockwise = 1, Counter-clockwise = -1 (when looking at the face)
export const FACE_MOVES: Record<string, CubeMove> = {
  // Top face (U) - looking from top: U is clockwise, U' is counter-clockwise
  'U': { name: 'U', axis: 'y', direction: -1, slice: 1, angle: 90 },
  "U'": { name: "U'", axis: 'y', direction: 1, slice: 1, angle: 90 },
  'U2': { name: 'U2', axis: 'y', direction: -1, slice: 1, angle: 180 },

  // Bottom face (D) - looking from bottom: D is clockwise, D' is counter-clockwise
  'D': { name: 'D', axis: 'y', direction: 1, slice: -1, angle: 90 },
  "D'": { name: "D'", axis: 'y', direction: -1, slice: -1, angle: 90 },
  'D2': { name: 'D2', axis: 'y', direction: 1, slice: -1, angle: 180 },

  // Left face (L) - looking from left: L is clockwise, L' is counter-clockwise
  'L': { name: 'L', axis: 'x', direction: 1, slice: -1, angle: 90 },
  "L'": { name: "L'", axis: 'x', direction: -1, slice: -1, angle: 90 },
  'L2': { name: 'L2', axis: 'x', direction: 1, slice: -1, angle: 180 },

  // Right face (R) - looking from right: R is clockwise, R' is counter-clockwise
  'R': { name: 'R', axis: 'x', direction: -1, slice: 1, angle: 90 },
  "R'": { name: "R'", axis: 'x', direction: 1, slice: 1, angle: 90 },
  'R2': { name: 'R2', axis: 'x', direction: -1, slice: 1, angle: 180 },

  // Front face (F) - looking from front: F is clockwise, F' is counter-clockwise
  'F': { name: 'F', axis: 'z', direction: -1, slice: 1, angle: 90 },
  "F'": { name: "F'", axis: 'z', direction: 1, slice: 1, angle: 90 },
  'F2': { name: 'F2', axis: 'z', direction: -1, slice: 1, angle: 180 },

  // Back face (B) - looking from back: B is clockwise, B' is counter-clockwise
  'B': { name: 'B', axis: 'z', direction: 1, slice: -1, angle: 90 },
  "B'": { name: "B'", axis: 'z', direction: -1, slice: -1, angle: 90 },
  'B2': { name: 'B2', axis: 'z', direction: 1, slice: -1, angle: 180 },

  // Wide turns (2 layers)
  // u = U + E (top + middle)
  'u': { name: 'u', axis: 'y', direction: -1, slice: 1, angle: 90 },
  "u'": { name: "u'", axis: 'y', direction: 1, slice: 1, angle: 90 },
  'u2': { name: 'u2', axis: 'y', direction: -1, slice: 1, angle: 180 },

  // d = D + E (bottom + middle)
  'd': { name: 'd', axis: 'y', direction: 1, slice: -1, angle: 90 },
  "d'": { name: "d'", axis: 'y', direction: -1, slice: -1, angle: 90 },
  'd2': { name: 'd2', axis: 'y', direction: -1, slice: -1, angle: 180 },

  // l = L + M (left + middle)
  'l': { name: 'l', axis: 'x', direction: 1, slice: -1, angle: 90 },
  "l'": { name: "l'", axis: 'x', direction: -1, slice: -1, angle: 90 },
  'l2': { name: 'l2', axis: 'x', direction: 1, slice: -1, angle: 180 },

  // r = R + M (right + middle)
  'r': { name: 'r', axis: 'x', direction: -1, slice: 1, angle: 90 },
  "r'": { name: "r'", axis: 'x', direction: 1, slice: 1, angle: 90 },
  'r2': { name: 'r2', axis: 'x', direction: -1, slice: 1, angle: 180 },

  // f = F + S (front + standing)
  'f': { name: 'f', axis: 'z', direction: -1, slice: 1, angle: 90 },
  "f'": { name: "f'", axis: 'z', direction: 1, slice: 1, angle: 90 },
  'f2': { name: 'f2', axis: 'z', direction: -1, slice: 1, angle: 180 },

  // b = B + S (back + standing)
  'b': { name: 'b', axis: 'z', direction: 1, slice: -1, angle: 90 },
  "b'": { name: "b'", axis: 'z', direction: -1, slice: -1, angle: 90 },
  'b2': { name: 'b2', axis: 'z', direction: 1, slice: -1, angle: 180 },

  // Slice moves (middle layer only)
  'M': { name: 'M', axis: 'x', direction: 1, slice: 0, angle: 90 },
  "M'": { name: "M'", axis: 'x', direction: -1, slice: 0, angle: 90 },
  'M2': { name: 'M2', axis: 'x', direction: 1, slice: 0, angle: 180 },

  'E': { name: 'E', axis: 'y', direction: 1, slice: 0, angle: 90 },     // E = opposite of D
  "E'": { name: "E'", axis: 'y', direction: -1, slice: 0, angle: 90 },   // E' = opposite of U
  'E2': { name: 'E2', axis: 'y', direction: 1, slice: 0, angle: 180 },

  'S': { name: 'S', axis: 'z', direction: -1, slice: 0, angle: 90 },     // S = opposite of F
  "S'": { name: "S'", axis: 'z', direction: 1, slice: 0, angle: 90 },   // S' = opposite of B
  'S2': { name: 'S2', axis: 'z', direction: -1, slice: 0, angle: 180 },

  // Whole cube rotations
  'x': { name: 'x', axis: 'x', direction: -1, slice: 0, angle: 90 },
  "x'": { name: "x'", axis: 'x', direction: 1, slice: 0, angle: 90 },
  'x2': { name: 'x2', axis: 'x', direction: -1, slice: 0, angle: 180 },

  'y': { name: 'y', axis: 'y', direction: -1, slice: 0, angle: 90 },     // y = opposite of U
  "y'": { name: "y'", axis: 'y', direction: 1, slice: 0, angle: 90 },   // y' = opposite of D
  'y2': { name: 'y2', axis: 'y', direction: 1, slice: 0, angle: 180 },

  'z': { name: 'z', axis: 'z', direction: -1, slice: 0, angle: 90 },     // z = opposite of F
  "z'": { name: "z'", axis: 'z', direction: 1, slice: 0, angle: 90 },   // z' = opposite of B
  'z2': { name: 'z2', axis: 'z', direction: 1, slice: 0, angle: 180 },
};

/**
 * Parse a move notation string into a CubeMove
 */
export function parseMove(notation: string): CubeMove | null {
  // Normalize notation
  const normalized = notation.trim();

  // Check if it's a standard move
  if (FACE_MOVES[normalized]) {
    return FACE_MOVES[normalized];
  }

  return null;
}

/**
 * Parse a sequence of moves (algorithm) into an array of CubeMoves
 */
export function parseAlgorithm(notation: string): CubeMove[] {
  // Split by spaces and filter empty strings
  const tokens = notation.split(/\s+/).filter(t => t.length > 0);

  return tokens.map(token => {
    const move = parseMove(token);
    if (move) {
      return move;
    }
    // If we can't parse a move, skip it
    return null;
  }).filter((m): m is CubeMove => m !== null);
}

/**
 * Get the opposite move
 */
export function getOppositeMove(move: CubeMove): CubeMove {
  const direction = move.direction === 1 ? -1 : 1;
  return {
    ...move,
    direction,
  };
}
