import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ContactItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  isLink?: boolean;
}

// Reusable component for displaying contact information
// Renders either a clickable link or plain text based on isLink prop
export const ContactItem: React.FC<ContactItemProps> = ({
  icon: Icon,
  label,
  value,
  href,
  isLink = false,
}) => (
  <div className="flex items-center">
    <span className="text-green-400 w-32 flex items-center gap-2">
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span>{label}:</span>
    </span>
    {isLink ? (
      <a
        href={href}
        className="text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-150"
        aria-label={`Visit ${label}`}
        // Only add target and rel attributes for external links (not mailto)
        target={href?.startsWith('mailto') ? undefined : '_blank'}
        rel={href?.startsWith('mailto') ? undefined : 'noopener noreferrer'}
      >
        {value}
      </a>
    ) : (
      <span className="text-gray-300">{value}</span>
    )}
  </div>
);
