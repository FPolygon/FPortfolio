import { Project } from '../types';
import { API_URL } from './config';
import { fetchWithRetry } from '../utils/api';
import { Cache } from '../utils/cache';
import { APIError } from '../utils/errors';

// Initialize cache singleton
const cache = Cache.getInstance();

// Map API category names to display names
const CATEGORY_MAP: { [key: string]: string } = {
  infrastructure: 'Infrastructure & Cloud',
  mlops: 'MLOps & Model Deployment',
  data: 'Data Engineering',
  ml: 'Machine Learning',
  tools: 'Programming & Tools',
};

// Fetch all projects with caching
export const fetchProjects = async (): Promise<Project[]> => {
  const cacheKey = 'projects';
  const cached = cache.get<Project[]>(cacheKey);
  if (cached) return cached;

  const data = await fetchWithRetry<Project[]>(`${API_URL}/projects/`);
  cache.set(cacheKey, data);
  return data;
};

// Fetch projects filtered by category
export const fetchProjectsByCategory = async (
  categoryName: string
): Promise<Project[]> => {
  if (!categoryName || !CATEGORY_MAP[categoryName]) {
    throw new APIError('Invalid category name', 400);
  }

  const mappedCategory = CATEGORY_MAP[categoryName];
  return fetchWithRetry<Project[]>(
    `${API_URL}/projects/?category=${encodeURIComponent(mappedCategory)}`
  );
};
