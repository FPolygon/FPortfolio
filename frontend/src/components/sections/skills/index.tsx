import React from 'react';
import { Category } from '@/types';
import { CATEGORY_COLORS } from './constants';
import CategoryHeader from '@/components/ui/CategoryHeader';

interface SkillsSectionProps {
  data: Category[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ data }) => {
  // Early return for empty data
  if (data.length === 0) {
    return <div className="text-gray-300">No skills data available.</div>;
  }

  // Helper function to get category colors with type safety
  const getCategoryColors = (categoryName: string) => {
    return (
      CATEGORY_COLORS[categoryName] || {
        header: 'text-gray-500',
        label: 'text-gray-400',
      }
    );
  };

  return (
    <div className="whitespace-pre-wrap">
      {data.map(category => {
        const colors = getCategoryColors(category.name);
        return (
          <div key={category.id} className="mb-6">
            {/* Category Header */}
            <CategoryHeader text={category.name} textColor={colors.header} />

            {/* Skills Grid */}
            <div className="grid grid-cols-1 gap-1">
              {category.subcategories.map(subcategory => (
                <div key={subcategory.id} className="flex">
                  {/* Subcategory Label */}
                  <span className={`${colors.label} w-48`}>
                    {subcategory.name}:
                  </span>
                  {/* Technologies List */}
                  <span className="text-gray-300">
                    {subcategory.technologies.map(tech => tech.name).join(', ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
