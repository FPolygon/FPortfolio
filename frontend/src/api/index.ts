import { Project, Category, Technology, Subcategory, Job } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const fetchJobs = async (): Promise<Job[]> => {
  const response = await fetch(`${API_URL}/jobs/`);
  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }
  return response.json();
};

export const fetchJobsByTechnology = async (
  technologyId: number,
): Promise<Job[]> => {
  const jobs = await fetchJobs();
  return jobs.filter((job) =>
    job.technologies.some((tech) => tech.id === technologyId),
  );
};

export const fetchJobsByDateRange = async (
  startDate: string,
  endDate: string,
): Promise<Job[]> => {
  const jobs = await fetchJobs();
  return jobs.filter(
    (job) =>
      new Date(job.start_date) >= new Date(startDate) &&
      (!job.end_date || new Date(job.end_date) <= new Date(endDate)),
  );
};

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

  const [projects, categories] = await Promise.all([
    fetchProjects(),
    fetchCategories(),
  ]);

  const category = categories.find(
    (cat) => cat.name === categoryMap[categoryName],
  );

  if (!category) {
    return [];
  }

  const categoryTechnologyIds = new Set(
    category.subcategories.flatMap((subcategory) =>
      subcategory.technologies.map((tech) => tech.id),
    ),
  );

  return projects.filter((project) =>
    project.technology.some((tech) => categoryTechnologyIds.has(tech.id)),
  );
};

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
