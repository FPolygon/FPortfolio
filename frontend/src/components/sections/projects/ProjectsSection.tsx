import React from 'react';
import ProjectCategories from './ProjectCategories';
import { Project } from '@/types';
import { ProjectList } from './ProjectList';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

interface ProjectsSectionProps {
  projects?: Project[];
  category?: string;
  titleColor?: string;
  error?: string | null;
  showCategories?: boolean;
  onCategorySelect?: (command: string) => void; // Add this prop
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  category,
  titleColor = 'text-blue-500',
  error,
  showCategories = false,
  onCategorySelect, // Add this prop
}) => {
  if (showCategories) {
    return <ProjectCategories onCategorySelect={onCategorySelect} />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!projects || projects.length === 0) {
    return <div className="text-gray-300">No projects found.</div>;
  }

  return (
    <ProjectList
      projects={projects}
      category={category || ''}
      titleColor={titleColor}
    />
  );
};
