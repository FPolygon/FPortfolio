import React from 'react';

interface CompanyLinkProps {
  company: string;
  link?: string;
}

export const CompanyLink: React.FC<CompanyLinkProps> = ({ company, link }) => {
  if (!link) {
    return <span className="text-blue-400">{company}</span>;
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
    >
      {company}
    </a>
  );
};
