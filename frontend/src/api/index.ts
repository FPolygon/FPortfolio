// Job-related API functions
export { fetchJobs, fetchJobsByTechnology, fetchJobsByDateRange } from './jobs';

// Project-related API functions
export { fetchProjects, fetchProjectsByCategory } from './projects';

// Category and skills API functions
export {
  fetchCategories,
  fetchSkillsByCategory,
  fetchAllSkills,
} from './categories';

// Subcategory-related API functions
export {
  fetchSubcategories,
  getTechnologiesBySubcategory,
} from './subcategories';

// Technology-related API functions
export { fetchTechnologies, getTechnologiesByCategory } from './technologies';

// Core data types
export type { Job, Project, Category, Subcategory, Technology } from '@/types';

// Utility classes
export { APIError } from '@/utils/errors';
export { Cache } from '@/utils/cache';
