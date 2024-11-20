export interface Category {
  id: number;
  name: string;
}

export interface Technology {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  category: Category[];
  technology: Technology[];
  github: string;
}
