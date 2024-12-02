import { Technology } from "./common";

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
