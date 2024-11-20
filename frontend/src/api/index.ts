import { Project, Category, Technology } from "../types";

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
    infrastructure: "Infrastructure & Cloud Architecture",
    mlops: "MLOps & Model Deployment",
    data: "Data Engineering & Pipeline",
    ml: "Machine Learning & AI",
  };

  const response = await fetch(`${API_URL}/projects/`);
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  const projects = await response.json();
  return projects.filter((project: Project) =>
    project.category.some((cat) => cat.name === categoryMap[categoryName]),
  );
};
