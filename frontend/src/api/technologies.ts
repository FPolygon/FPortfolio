import { Technology } from '../types';
import { API_URL } from './config';
import { fetchWithRetry } from '../utils/api';
import { Cache } from '../utils/cache';
import { APIError } from '../utils/errors';

// Initialize cache singleton
const cache = Cache.getInstance();

// Fetch all technologies with caching
export const fetchTechnologies = async (): Promise<Technology[]> => {
  const cacheKey = 'technologies';
  const cached = cache.get<Technology[]>(cacheKey);
  if (cached) return cached;

  const data = await fetchWithRetry<Technology[]>(`${API_URL}/technologies/`);
  cache.set(cacheKey, data);
  return data;
};

// Get technologies filtered by category with caching
export const getTechnologiesByCategory = async (
  categoryName: string
): Promise<Technology[]> => {
  if (!categoryName.trim()) {
    throw new APIError('Category name is required', 400);
  }

  const cacheKey = `category-technologies-${categoryName}`;
  const cached = cache.get<Technology[]>(cacheKey);
  if (cached) return cached;

  const data = await fetchWithRetry<Technology[]>(
    `${API_URL}/technologies/?category=${encodeURIComponent(categoryName)}`
  );
  cache.set(cacheKey, data);
  return data;
};
