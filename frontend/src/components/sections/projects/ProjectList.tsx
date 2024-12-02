// src/components/sections/projects/ProjectList.tsx
import React from "react";
import { Project } from "../../../types";
import { ProjectLink } from "../../ui/ProjectLink";
import { TechBadges } from "../../ui/TechBadges";

// Define the props interface for our ProjectList component
interface ProjectListProps {
  projects: Project[];
  category?: string;
  titleColor?: string;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  category = "FEATURED", // Default category if none provided
  titleColor = "text-blue-500", // Default color if none provided
}) => {
  return (
    <div className="whitespace-pre-wrap">
      {/* Section Header with customizable title color */}
      <div className={titleColor}>
        ━━━ {category.toUpperCase()} Projects ━━━━━━━━━━━━━━━━━━━━━━━
      </div>

      {/* Map through each project and create a card-like display */}
      {projects.map((project, index) => (
        <div className="mt-4" key={project.id}>
          {/* Project Title with Index */}
          <div className="text-yellow-400 font-bold">
            {index + 1}. {project.name}
          </div>

          {/* Project Description with Visual Separator */}
          <div className="text-gray-300 leading-relaxed pl-4 border-l-2 border-gray-700 my-2 ml-1">
            <span className="text-blue-400">❯</span> {project.description}
          </div>

          {/* Technologies Section */}
          <div className="text-green-400">• Technologies:</div>
          <div className="ml-2">
            <TechBadges technologies={project.technology} />
          </div>

          {/* GitHub Link Section */}
          <div className="text-cyan-400">• Code:</div>
          <div className="ml-2">
            <ProjectLink href={project.github} />
          </div>
        </div>
      ))}
    </div>
  );
};
