import { Category } from '@/types';
import { API_URL } from './config';

// Fetch all available categories
export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_URL}/projects/categories/`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

// Fetch skills for a specific category by name
export const fetchSkillsByCategory = async (
  categoryName: string
): Promise<Category> => {
  const response = await fetch(`${API_URL}/projects/categories/`);
  if (!response.ok) {
    throw new Error('Failed to fetch skills');
  }
  const categories = await response.json();

  // Find matching category
  const category = categories.find(
    (cat: Category) => cat.name === categoryName
  );
  if (!category) {
    throw new Error(`Category ${categoryName} not found`);
  }
  return category;
};

// Fetch all categories with their skills
export const fetchAllSkills = async (): Promise<Category[]> => {
  const response = await fetch(`${API_URL}/projects/categories/`);
  if (!response.ok) {
    throw new Error('Failed to fetch skills');
  }
  return response.json();
};
