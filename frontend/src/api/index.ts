import { Project, Category, Technology, Subcategory } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const fetchProjects = async (): Promise<Project[]> => {
  const response = await fetch(`${API_URL}/projects/`);
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  return response.json();
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_URL}/categories/`);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
};

export const fetchSubcategories = async (): Promise<Subcategory[]> => {
  const response = await fetch(`${API_URL}/subcategories/`);
  if (!response.ok) {
    throw new Error("Failed to fetch subcategories");
  }
  return response.json();
};

export const fetchTechnologies = async (): Promise<Technology[]> => {
  const response = await fetch(`${API_URL}/technologies/`);
  if (!response.ok) {
    throw new Error("Failed to fetch technologies");
  }
  return response.json();
};

export const fetchProjectsByCategory = async (
  categoryName: string,
): Promise<Project[]> => {
  const categoryMap: { [key: string]: string } = {
    infrastructure: "Infrastructure & Cloud",
    mlops: "MLOps & Model Deployment",
    data: "Data Engineering",
    ml: "Machine Learning",
    tools: "Programming & Tools",
  };

  // Fetch all the necessary data
  const [projects, categories] = await Promise.all([
    fetchProjects(),
    fetchCategories(),
  ]);

  // Find the category by name
  const category = categories.find(
    (cat) => cat.name === categoryMap[categoryName],
  );

  if (!category) {
    return [];
  }

  // Get all technology IDs that belong to this category through its subcategories
  const categoryTechnologyIds = new Set(
    category.subcategories.flatMap((subcategory) =>
      subcategory.technologies.map((tech) => tech.id),
    ),
  );

  // Filter projects that have technologies belonging to this category
  return projects.filter((project) =>
    project.technology.some((tech) => categoryTechnologyIds.has(tech.id)),
  );
};

// Optional: Helper function to get technologies by category
export const getTechnologiesByCategory = async (
  categoryName: string,
): Promise<Technology[]> => {
  const categories = await fetchCategories();
  const category = categories.find((cat) => cat.name === categoryName);

  if (!category) {
    return [];
  }

  return category.subcategories.flatMap(
    (subcategory) => subcategory.technologies,
  );
};

// Optional: Helper function to get technologies by subcategory
export const getTechnologiesBySubcategory = async (
  subcategoryId: number,
): Promise<Technology[]> => {
  const response = await fetch(`${API_URL}/subcategories/${subcategoryId}/`);
  if (!response.ok) {
    throw new Error("Failed to fetch subcategory");
  }
  const subcategory = await response.json();
  return subcategory.technologies;
};

export const fetchSkillsByCategory = async (
  categoryName: string,
): Promise<Category> => {
  const response = await fetch(`${API_URL}/categories/`);
  if (!response.ok) {
    throw new Error("Failed to fetch skills");
  }
  const categories = await response.json();
  const category = categories.find(
    (cat: Category) => cat.name === categoryName,
  );
  if (!category) {
    throw new Error(`Category ${categoryName} not found`);
  }
  return category;
};

export const fetchAllSkills = async (): Promise<Category[]> => {
  const response = await fetch(`${API_URL}/categories/`);
  if (!response.ok) {
    throw new Error("Failed to fetch skills");
  }
  return response.json();
};
