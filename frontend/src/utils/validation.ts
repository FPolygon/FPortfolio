/**
 * Input validation utilities
 */

// Validate date string can be parsed to valid Date
export function validateDate(date: string): boolean {
  const parsed = new Date(date);
  return parsed.toString() !== 'Invalid Date';
}

// Validate ID is positive integer
export function validateId(id: number): boolean {
  return Number.isInteger(id) && id > 0;
}
