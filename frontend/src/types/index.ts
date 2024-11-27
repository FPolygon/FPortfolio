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

export interface Achievement {
  id: number;
  description: string;
  job: number;
}

export interface Job {
  id: number;
  company: string;
  link: string;
  title: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  technologies: Technology[];
  achievements: Achievement[];
}
