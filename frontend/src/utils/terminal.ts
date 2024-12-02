export const generateId = (): string => {
  try {
    return crypto.randomUUID();
  } catch {
    // Fallback for browsers not supporting crypto.randomUUID()
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
};
