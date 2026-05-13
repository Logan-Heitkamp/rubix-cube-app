import { describe, it, expect } from 'vitest';
import { formatTime, parseNotation, isValidMove, parseMove, invertMove, reverseNotation } from '../shared/utils/notation';

describe('formatTime', () => {
  it('formats milliseconds under 1 minute', () => {
    expect(formatTime(1234)).toBe('1.234');
    expect(formatTime(5000)).toBe('5.000');
    expect(formatTime(999)).toBe('0.999');
  });

  it('formats milliseconds over 1 minute', () => {
    expect(formatTime(65432)).toBe('1:05.432');
    expect(formatTime(123456)).toBe('2:03.456');
  });
});

describe('parseNotation', () => {
  it('parses a single move', () => {
    expect(parseNotation('R')).toEqual(['R']);
  });

  it('parses multiple moves', () => {
    expect(parseNotation('R U R\' U\'')).toEqual(['R', 'U', 'R\'', 'U\'']);
  });

  it('handles extra whitespace', () => {
    expect(parseNotation('R  U   R\'')).toEqual(['R', 'U', 'R\'']);
  });

  it('filters empty strings', () => {
    expect(parseNotation('R U R\' U\' ')).toEqual(['R', 'U', 'R\'', 'U\'']);
  });
});

describe('isValidMove', () => {
  it('validates correct moves', () => {
    expect(isValidMove('R')).toBe(true);
    expect(isValidMove('U\'')).toBe(true);
    expect(isValidMove('F2')).toBe(true);
    expect(isValidMove('B\'2')).toBe(false); // Invalid modifier
  });

  it('rejects invalid moves', () => {
    expect(isValidMove('X')).toBe(false);
    expect(isValidMove('R\'2')).toBe(false);
    expect(isValidMove('')).toBe(false);
    expect(isValidMove('RU')).toBe(false);
  });
});

describe('parseMove', () => {
  it('parses face and modifier', () => {
    expect(parseMove('R')).toEqual({ face: 'R', modifier: '' });
    expect(parseMove('U\'')).toEqual({ face: 'U', modifier: '\'' });
    expect(parseMove('F2')).toEqual({ face: 'F', modifier: '2' });
  });
});

describe('invertMove', () => {
  it('inverts prime moves', () => {
    expect(invertMove('R\'')).toBe('R');
    expect(invertMove('U\'')).toBe('U');
  });

  it('keeps 2 moves unchanged', () => {
    expect(invertMove('R2')).toBe('R2');
    expect(invertMove('U2')).toBe('U2');
  });

  it('adds prime to non-prime moves', () => {
    expect(invertMove('R')).toBe('R\'');
    expect(invertMove('U')).toBe('U\'');
  });
});

describe('reverseNotation', () => {
  it('reverses a simple sequence', () => {
    expect(reverseNotation('R U')).toBe("U' R'");
  });

  it('reverses a complex sequence', () => {
    expect(reverseNotation("R U R' U'")).toBe("U R U' R'");
  });
});
