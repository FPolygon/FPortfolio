import React from "react";

interface Education {
  id: string;
  period: string;
  degree: string;
  school: string;
  details: Array<{
    id: string;
    text: string;
  }>;
}

interface EducationSectionProps {
  /**
   * Array of education entries to display
   */
  educationData?: Education[];
  /**
   * Optional className for additional styling
   */
  className?: string;
}

const DEFAULT_EDUCATION_DATA: Education[] = [
  {
    id: "uic-cs",
    period: "2020 - 2022",
    degree: "B.S. Computer Science",
    school: "University of Illinois at Chicago",
    details: [
      {
        id: "focus",
        text: "Focus: Machine Learning & Distributed Systems",
      },
      {
        id: "project",
        text: "Senior Project: Led a team of 4 to develop and fine tune a suite of machine learning models to predict traffic accidents based on a variety of environmental factors",
      },
    ],
  },
];

/**
 * EducationSection component displays educational background information
 * with proper semantic structure and accessibility support.
 */
export const EducationSection: React.FC<EducationSectionProps> = ({
  educationData = DEFAULT_EDUCATION_DATA,
  className = "",
}) => {
  return (
    <section className={`mb-6 ${className}`} aria-labelledby="education-title">
      <h2
        id="education-title"
        className="text-indigo-400 font-bold mb-2 flex items-center"
        aria-label="Education Section"
      >
        <span className="mr-2">━━━ EDUCATION</span>
        <span className="h-px flex-grow bg-indigo-400/30" />
      </h2>

      {educationData.map((edu) => (
        <article key={edu.id} className="mb-4 group">
          <header className="flex flex-wrap items-center gap-2 sm:gap-x-2">
            <span className="text-indigo-400" aria-hidden="true">
              ❯
            </span>
            <span className="text-indigo-300 font-bold">{edu.period}</span>
            <span className="text-gray-400" aria-hidden="true">
              |
            </span>
            <span className="text-gray-200">{edu.degree}</span>
            <span className="text-gray-400" aria-hidden="true">
              @
            </span>
            <span className="text-blue-400">{edu.school}</span>
          </header>

          <ul className="ml-6 mt-2 space-y-1" role="list">
            {edu.details.map((detail) => (
              <li
                key={detail.id}
                className="flex items-start gap-2 group-hover:text-gray-200
                         text-gray-400 transition-colors"
              >
                <span className="text-indigo-500 shrink-0" aria-hidden="true">
                  ▪
                </span>
                <span className="break-words">{detail.text}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
};

export default EducationSection;
