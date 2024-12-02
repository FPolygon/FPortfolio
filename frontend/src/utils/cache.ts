/**
 * Cache singleton with configurable expiration duration
 */
export class Cache {
  private static instance: Cache;
  private cache = new Map<string, { data: unknown; timestamp: number }>();
  private readonly DEFAULT_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  // Get singleton instance
  static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  // Get cached data if not expired
  get<T>(key: string, duration = this.DEFAULT_DURATION): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > duration) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  // Set data in cache with timestamp
  set<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Clear all cached data
  clear(): void {
    this.cache.clear();
  }
}
