import { PROJECT_CATEGORY_COLORS } from './constants';

export const getProjectCategoryColor = (category: string): string => {
  return PROJECT_CATEGORY_COLORS[category] || 'text-blue-500';
};
