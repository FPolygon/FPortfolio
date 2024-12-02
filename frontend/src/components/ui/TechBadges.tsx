// src/components/ui/TechBadges.tsx
import React from 'react';

interface Technology {
  name: string;
}

interface TechBadgesProps {
  technologies: Technology[];
}

export const TechBadges: React.FC<TechBadgesProps> = ({ technologies }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {technologies.map((tech, index) => (
        <div
          key={index}
          className="inline-flex items-center px-3 py-1 rounded border border-purple-500 bg-opacity-20 bg-purple-900 text-purple-300 hover:bg-purple-800 hover:bg-opacity-30 transition-colors cursor-pointer group"
        >
          <span className="mr-2 text-emerald-400">$</span>
          {tech.name}
          <span className="ml-2 opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity">
            _
          </span>
        </div>
      ))}
    </div>
  );
};
