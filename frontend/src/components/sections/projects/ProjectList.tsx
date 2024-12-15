import React from 'react';
import { Code } from 'lucide-react';
import { Project } from '@/types';
import { ProjectLink } from '@/components/ui/ProjectLink';
import { TechBadges } from '@/components/ui/TechBadges';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface ProjectListProps {
  projects: Project[];
  category?: string;
  titleColor?: string;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  category = 'FEATURED',
  titleColor = 'text-blue-500',
}) => {
  return (
    <div className="whitespace-pre-wrap">
      <SectionHeader
        icon={Code}
        label={`${category.toUpperCase()} Projects`}
        color={titleColor}
      />

      {projects.map((project, index) => (
        <div className="mt-4" key={project.id}>
          <div className="text-yellow-400 font-bold">
            {index + 1}. {project.name}
          </div>
          <div className="text-gray-300 leading-relaxed pl-4 border-l-2 border-gray-700 my-2 ml-1">
            <span className="text-blue-400">❯</span> {project.description}
          </div>
          <div className="text-green-400">• Technologies:</div>
          <div className="ml-2">
            <TechBadges technologies={project.technology} />
          </div>
          <div className="text-cyan-400">• Code:</div>
          <div className="ml-2">
            <ProjectLink href={project.github} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
