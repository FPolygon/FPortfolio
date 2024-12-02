import { APIError } from './errors';

/**
 * Fetch with automatic retries, timeout and error handling
 * @param url Request URL
 * @param options Fetch options
 * @param retries Number of retry attempts
 * @param timeout Timeout in milliseconds
 */
export async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  retries = 3,
  timeout = 5000
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new APIError(
            `API request failed: ${response.statusText}`,
            response.status
          );
        }

        const data = await response.json();
        return data as T;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          throw new APIError('Request timeout', 408);
        }
        if (attempt === retries - 1) throw error;

        // Exponential backoff between retries
        await new Promise(resolve =>
          setTimeout(resolve, Math.pow(2, attempt) * 100)
        );
      }
    }
    throw new APIError('Maximum retries reached');
  } finally {
    clearTimeout(timeoutId);
  }
}
