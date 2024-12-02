import { Subcategory, Technology } from '@/types';
import { API_URL } from './config';
import { fetchWithRetry } from '@/utils/api';
import { Cache } from '@/utils/cache';
import { APIError } from '@/utils/errors';
import { validateId } from '@/utils/validation';

// Initialize cache singleton
const cache = Cache.getInstance();

// Fetch all subcategories with caching
export const fetchSubcategories = async (): Promise<Subcategory[]> => {
  const cacheKey = 'subcategories';
  const cached = cache.get<Subcategory[]>(cacheKey);
  if (cached) return cached;

  const data = await fetchWithRetry<Subcategory[]>(`${API_URL}/subcategories/`);
  cache.set(cacheKey, data);
  return data;
};

// Get technologies for a specific subcategory with caching
export const getTechnologiesBySubcategory = async (
  subcategoryId: number
): Promise<Technology[]> => {
  if (!validateId(subcategoryId)) {
    throw new APIError('Invalid subcategory ID', 400);
  }

  const cacheKey = `subcategory-technologies-${subcategoryId}`;
  const cached = cache.get<Technology[]>(cacheKey);
  if (cached) return cached;

  const data = await fetchWithRetry<Technology[]>(
    `${API_URL}/subcategories/${subcategoryId}/technologies/`
  );
  cache.set(cacheKey, data);
  return data;
};
