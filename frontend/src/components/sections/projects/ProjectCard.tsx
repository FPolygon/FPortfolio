import React from 'react';
import { Project } from '../../../types';
import { ProjectLink } from '../../ui/ProjectLink';
import { TechBadges } from '../../ui/TechBadges';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  return (
    <div className="mt-4">
      {/* Project Title */}
      <div className="text-yellow-400 font-bold">
        {index + 1}. {project.name}
      </div>

      {/* Project Description */}
      <div className="text-gray-300 leading-relaxed pl-4 border-l-2 border-gray-700 my-2 ml-1">
        <span className="text-blue-400">❯</span> {project.description}
      </div>

      {/* Technologies Section */}
      <div className="text-green-400">• Technologies:</div>
      <div className="ml-2">
        <TechBadges technologies={project.technology} />
      </div>

      {/* GitHub Link */}
      <div className="text-cyan-400">• Code:</div>
      <div className="ml-2">
        <ProjectLink href={project.github} />
      </div>
    </div>
  );
};
