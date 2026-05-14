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
export const FACE_MOVES: Record<string, CubeMove> = {
  // Top face (U)
  'U': { name: 'U', axis: 'y', direction: -1, slice: 1, angle: 90 },    // U = counter-clockwise from top view
  "U'": { name: "U'", axis: 'y', direction: 1, slice: 1, angle: 90 },   // U' = clockwise
  'U2': { name: 'U2', axis: 'y', direction: -1, slice: 1, angle: 180 }, // U2 = 180 degrees

  // Bottom face (D)
  'D': { name: 'D', axis: 'y', direction: 1, slice: -1, angle: 90 },     // D = clockwise from bottom view
  "D'": { name: "D'", axis: 'y', direction: -1, slice: -1, angle: 90 },  // D' = counter-clockwise
  'D2': { name: 'D2', axis: 'y', direction: 1, slice: -1, angle: 180 },  // D2 = 180 degrees

  // Left face (L)
  'L': { name: 'L', axis: 'x', direction: -1, slice: -1, angle: 90 },    // L = counter-clockwise
  "L'": { name: "L'", axis: 'x', direction: 1, slice: -1, angle: 90 },   // L' = clockwise
  'L2': { name: 'L2', axis: 'x', direction: -1, slice: -1, angle: 180 }, // L2 = 180 degrees

  // Right face (R)
  'R': { name: 'R', axis: 'x', direction: 1, slice: 1, angle: 90 },      // R = clockwise
  "R'": { name: "R'", axis: 'x', direction: -1, slice: 1, angle: 90 },   // R' = counter-clockwise
  'R2': { name: 'R2', axis: 'x', direction: 1, slice: 1, angle: 180 },   // R2 = 180 degrees

  // Front face (F)
  'F': { name: 'F', axis: 'z', direction: -1, slice: 1, angle: 90 },     // F = counter-clockwise
  "F'": { name: "F'", axis: 'z', direction: 1, slice: 1, angle: 90 },    // F' = clockwise
  'F2': { name: 'F2', axis: 'z', direction: -1, slice: 1, angle: 180 },  // F2 = 180 degrees

  // Back face (B)
  'B': { name: 'B', axis: 'z', direction: 1, slice: -1, angle: 90 },     // B = clockwise
  "B'": { name: "B'", axis: 'z', direction: -1, slice: -1, angle: 90 },  // B' = counter-clockwise
  'B2': { name: 'B2', axis: 'z', direction: 1, slice: -1, angle: 180 },  // B2 = 180 degrees

  // Wide turns (2 layers)
  // u = U + E (top + middle)
  'u': { name: 'u', axis: 'y', direction: -1, slice: 1, angle: 90 },
  "u'": { name: "u'", axis: 'y', direction: 1, slice: 1, angle: 90 },
  'u2': { name: 'u2', axis: 'y', direction: -1, slice: 1, angle: 180 },

  // d = D + E (bottom + middle)
  'd': { name: 'd', axis: 'y', direction: 1, slice: -1, angle: 90 },
  "d'": { name: "d'", axis: 'y', direction: -1, slice: -1, angle: 90 },
  'd2': { name: 'd2', axis: 'y', direction: 1, slice: -1, angle: 180 },

  // l = L + M (left + middle)
  'l': { name: 'l', axis: 'x', direction: -1, slice: -1, angle: 90 },
  "l'": { name: "l'", axis: 'x', direction: 1, slice: -1, angle: 90 },
  'l2': { name: 'l2', axis: 'x', direction: -1, slice: -1, angle: 180 },

  // r = R + M (right + middle)
  'r': { name: 'r', axis: 'x', direction: 1, slice: 1, angle: 90 },
  "r'": { name: "r'", axis: 'x', direction: -1, slice: 1, angle: 90 },
  'r2': { name: 'r2', axis: 'x', direction: 1, slice: 1, angle: 180 },

  // f = F + S (front + standing)
  'f': { name: 'f', axis: 'z', direction: -1, slice: 1, angle: 90 },
  "f'": { name: "f'", axis: 'z', direction: 1, slice: 1, angle: 90 },
  'f2': { name: 'f2', axis: 'z', direction: -1, slice: 1, angle: 180 },

  // b = B + S (back + standing)
  'b': { name: 'b', axis: 'z', direction: 1, slice: -1, angle: 90 },
  "b'": { name: "b'", axis: 'z', direction: -1, slice: -1, angle: 90 },
  'b2': { name: 'b2', axis: 'z', direction: 1, slice: -1, angle: 180 },

  // Slice moves (middle layer only)
  'M': { name: 'M', axis: 'x', direction: 1, slice: 0, angle: 90 },      // M = same direction as L
  "M'": { name: "M'", axis: 'x', direction: -1, slice: 0, angle: 90 },   // M' = same direction as R
  'M2': { name: 'M2', axis: 'x', direction: 1, slice: 0, angle: 180 },

  'E': { name: 'E', axis: 'y', direction: -1, slice: 0, angle: 90 },     // E = same direction as D
  "E'": { name: "E'", axis: 'y', direction: 1, slice: 0, angle: 90 },    // E' = same direction as U
  'E2': { name: 'E2', axis: 'y', direction: -1, slice: 0, angle: 180 },

  'S': { name: 'S', axis: 'z', direction: -1, slice: 0, angle: 90 },     // S = same direction as F
  "S'": { name: "S'", axis: 'z', direction: 1, slice: 0, angle: 90 },    // S' = same direction as B
  'S2': { name: 'S2', axis: 'z', direction: -1, slice: 0, angle: 180 },

  // Whole cube rotations
  'x': { name: 'x', axis: 'x', direction: 1, slice: 0, angle: 90 },      // x = same as R
  "x'": { name: "x'", axis: 'x', direction: -1, slice: 0, angle: 90 },   // x' = same as L
  'x2': { name: 'x2', axis: 'x', direction: 1, slice: 0, angle: 180 },

  'y': { name: 'y', axis: 'y', direction: -1, slice: 0, angle: 90 },     // y = same as U
  "y'": { name: "y'", axis: 'y', direction: 1, slice: 0, angle: 90 },    // y' = same as D
  'y2': { name: 'y2', axis: 'y', direction: -1, slice: 0, angle: 180 },

  'z': { name: 'z', axis: 'z', direction: -1, slice: 0, angle: 90 },     // z = same as F
  "z'": { name: "z'", axis: 'z', direction: 1, slice: 0, angle: 90 },    // z' = same as B
  'z2': { name: 'z2', axis: 'z', direction: -1, slice: 0, angle: 180 },
};

/**
 * Parse a move notation string into a CubeMove
 */
export function parseMove(notation: string): CubeMove | null {
  // Normalize notation (handle lowercase for face turns)
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
