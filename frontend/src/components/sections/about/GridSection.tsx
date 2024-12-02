import React from 'react';

interface GridSectionProps {
  title: string; // Section title
  items: string[]; // Array of items to display in grid
  icon: string; // Icon to display before each item
  variant?: 'cyan' | 'orange'; // Visual style variant
  className?: string; // Optional className for additional styling
}

/**
 * GridSection component displays items in a responsive grid layout with icons
 */
export const GridSection: React.FC<GridSectionProps> = ({
  title,
  items,
  icon,
  variant = 'cyan',
  className = '',
}) => {
  const styles = {
    cyan: {
      title: 'text-cyan-400',
      icon: 'text-cyan-500',
      item: 'text-gray-300 hover:text-cyan-300',
    },
    orange: {
      title: 'text-orange-400',
      icon: 'text-orange-500',
      item: 'text-gray-300 hover:text-orange-300',
    },
  };

  const currentStyle = styles[variant];

  return (
    <section
      className={`mb-6 ${className}`}
      aria-labelledby={`${title.toLowerCase()}-section`}
    >
      <h2
        id={`${title.toLowerCase()}-section`}
        className={`${currentStyle.title} mb-2 font-medium`}
      >
        {title}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className={`flex items-center gap-2 p-1 rounded-sm
                     transition-colors duration-200 ease-in-out ${currentStyle.item}`}
          >
            <span
              className={`${currentStyle.icon} shrink-0`}
              aria-hidden="true"
            >
              {icon}
            </span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GridSection;
