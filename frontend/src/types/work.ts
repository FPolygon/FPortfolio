import { Technology } from './common';

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
