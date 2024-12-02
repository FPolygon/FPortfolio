import React from "react";

interface BackgroundSectionProps {
  /**
   * The main content text to display
   */
  content?: string;
  /**
   * Optional className for additional styling
   */
  className?: string;
}

/**
 * BackgroundSection component displays a labeled section with a decorative border
 * and formatted text content, typically used for professional background information.
 */
export const BackgroundSection: React.FC<BackgroundSectionProps> = ({
  content = "A passionate infrastructure and automation engineer with expertise in creating scalable, efficient systems. Specialized in transforming complex technical challenges into elegant solutions.",
  className = "",
}) => {
  return (
    <section className={`mb-6 ${className}`} aria-labelledby="background-title">
      <h2 id="background-title" className="text-purple-400 mb-2 font-medium">
        BACKGROUND
      </h2>
      <div className="text-gray-300 pl-4 border-l-2 border-purple-500 text-base sm:text-lg">
        {content}
      </div>
    </section>
  );
};

export default BackgroundSection;
