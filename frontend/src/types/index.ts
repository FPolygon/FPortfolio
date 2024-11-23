export interface Technology {
  id: number;
  name: string;
  subcategory: number;
}

export interface Subcategory {
  id: number;
  name: string;
  category: number;
  technologies: Technology[];
}

export interface Category {
  id: number;
  name: string;
  subcategories: Subcategory[];
}

export interface Project {
  id: number;
  name: string;
  description: string;
  technology: Technology[];
  github: string;
}

export interface Skill {
  id: number;
  name: string;
  subcategory: number;
}
