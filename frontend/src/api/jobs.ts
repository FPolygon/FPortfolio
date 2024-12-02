import { Job } from '../types';
import { API_URL } from './config';
import { fetchWithRetry } from '../utils/api';
import { Cache } from '../utils/cache';
import { APIError } from '../utils/errors';
import { validateDate, validateId } from '../utils/validation';

// Initialize cache singleton
const cache = Cache.getInstance();

// Fetch all jobs with caching
export const fetchJobs = async (): Promise<Job[]> => {
  const cacheKey = 'jobs';
  const cached = cache.get<Job[]>(cacheKey);
  if (cached) return cached;

  const data = await fetchWithRetry<Job[]>(`${API_URL}/jobs/`);
  cache.set(cacheKey, data);
  return data;
};

// Fetch jobs filtered by technology
export const fetchJobsByTechnology = async (
  technologyId: number
): Promise<Job[]> => {
  if (!validateId(technologyId)) {
    throw new APIError('Invalid technology ID', 400);
  }

  return fetchWithRetry<Job[]>(`${API_URL}/jobs/?technology=${technologyId}`);
};

// Fetch jobs within date range
export const fetchJobsByDateRange = async (
  startDate: string,
  endDate: string
): Promise<Job[]> => {
  if (!validateDate(startDate) || !validateDate(endDate)) {
    throw new APIError('Invalid date format', 400);
  }
  if (new Date(startDate) > new Date(endDate)) {
    throw new APIError('Start date must be before end date', 400);
  }

  return fetchWithRetry<Job[]>(
    `${API_URL}/jobs/?start_date=${startDate}&end_date=${endDate}`
  );
};
