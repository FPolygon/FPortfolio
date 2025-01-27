import React from 'react';
import CategoryHeader from '@/components/ui/CategoryHeader';

interface Category {
  command: string;
  color: string;
  description: string;
}

interface ProjectCategoriesProps {
  onCategorySelect?: (command: string) => void;
}

const CATEGORIES: Category[] = [
  {
    command: 'projects-infra',
    color: 'text-cyan-400',
    description: 'Infrastructure & Cloud Architecture Projects',
  },
  {
    command: 'projects-mlops',
    color: 'text-purple-400',
    description: 'MLOps & Model Deployment Projects',
  },
  {
    command: 'projects-data',
    color: 'text-green-400',
    description: 'Data Engineering & Pipeline Projects',
  },
  {
    command: 'projects-ml',
    color: 'text-yellow-400',
    description: 'Machine Learning & AI Projects',
  },
];

const ProjectCategories: React.FC<ProjectCategoriesProps> = ({
  onCategorySelect = () => {},
}) => {
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    command: string
  ): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onCategorySelect(command);
    }
  };

  return (
    <div className="font-mono">
      <CategoryHeader text="Project Categories" textColor="text-blue-500" />

      <div className="text-gray-200 mb-2">
        Type the following commands to explore each category:
      </div>

      <div className="flex flex-col space-y-1">
        {CATEGORIES.map(({ command, color, description }) => (
          <div key={command} className="flex items-center whitespace-nowrap">
            <button
              onClick={() => onCategorySelect(command)}
              onKeyDown={e => handleKeyDown(e, command)}
              className={`
                font-bold w-[144px] text-left
                ${color}
                hover:brightness-125
                transition-all
                outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 focus:ring-offset-gray-900
                rounded px-1
              `}
              type="button"
              aria-label={`Type ${command} command`}
            >
              {command}
            </button>
            <span className="text-gray-400 px-2">│</span>
            <span className="text-gray-300">{description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectCategories;
