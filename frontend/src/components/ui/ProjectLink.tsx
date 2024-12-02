import React from 'react';

interface ProjectLinkProps {
  href: string;
  children?: React.ReactNode; // Making children optional allows for more flexible usage
}

export const ProjectLink: React.FC<ProjectLinkProps> = ({ href, children }) => (
  // The <a> tag is the root element that contains all other elements
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-150 flex items-center"
  >
    {/* Display either the provided children or fall back to the href as link text */}
    {children || href}

    {/* External link icon - simplified and corrected path data */}
    <svg
      className="w-4 h-4 ml-1 inline-block"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  </a>
);

export default ProjectLink;
