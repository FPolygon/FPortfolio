import React from 'react';

interface InfoItem {
  id: string;
  type: 'INFO' | 'STATUS';
  content: string;
  /** Optional icon to display before content */
  icon?: string;
}

interface InfoSectionProps {
  items?: InfoItem[]; // Optional items to override default items
  className?: string; // Optional className for additional styling
}

const DEFAULT_INFO_ITEMS: InfoItem[] = [
  {
    id: 'location',
    type: 'INFO',
    content: 'Location: Chicago, IL',
    icon: '📍',
  },
  {
    id: 'role',
    type: 'INFO',
    content: 'Role: Systems Automation Engineer',
    icon: '💼',
  },
  {
    id: 'status',
    type: 'STATUS',
    content: 'Currently: Building elegant infrastructure solutions',
    icon: '🚀',
  },
];

const TYPE_STYLES = {
  INFO: 'text-green-400 bg-green-900/30',
  STATUS: 'text-yellow-400 bg-yellow-900/30',
} as const;

/**
 * InfoSection component displays a list of information items with type badges
 * and optional icons.
 */
export const InfoSection: React.FC<InfoSectionProps> = ({
  items = DEFAULT_INFO_ITEMS,
  className = '',
}) => {
  return (
    <section
      className={`space-y-2 mb-6 ${className}`}
      aria-label="Personal Information"
    >
      {items.map(item => (
        <div key={item.id} className="flex items-center gap-2">
          <span
            className={`${
              TYPE_STYLES[item.type]
            } px-2 py-0.5 rounded text-sm font-medium`}
            aria-label={`Item type: ${item.type.toLowerCase()}`}
          >
            [{item.type}]
          </span>
          <span className="text-gray-300 flex items-center gap-2">
            {item.icon && (
              <span className="text-base" aria-hidden="true">
                {item.icon}
              </span>
            )}
            <span>{item.content}</span>
          </span>
        </div>
      ))}
    </section>
  );
};

export default InfoSection;
