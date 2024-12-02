import { Technology } from './common';

export interface Project {
  id: number;
  name: string;
  description: string;
  technology: Technology[];
  github: string;
}
