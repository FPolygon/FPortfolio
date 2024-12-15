import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  /**
   * The icon to display from lucide-react
   */
  icon: LucideIcon;
  /**
   * The text label for the section (visible to screen readers)
   */
  label: string;
  /**
   * The color class for the header (e.g., 'text-purple-500')
   */
  color?: string;
  /**
   * Optional ID for the heading element
   */
  headingId?: string;
  /**
   * Optional className for additional styling
   */
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon: Icon,
  label,
  color = 'text-blue-500',
  headingId,
  className = '',
}) => {
  // Generate a consistent ID if none provided
  const id = headingId || `${label.toLowerCase().replace(/\s+/g, '-')}-heading`;

  return (
    <div
      className={`flex items-center gap-2 ${color} font-bold mb-4 ${className}`}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      <h2 id={id} className="sr-only">
        {label}
      </h2>
      <div aria-hidden="true">
        ━━━ {label}{' '}
        {
          // Add dashes to fill the rest of the line
          '━'.repeat(Math.max(0, 75 - label.length))
        }
      </div>
    </div>
  );
};

export default SectionHeader;
