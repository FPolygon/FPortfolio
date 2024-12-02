import React from "react";
import { WorkHistorySection } from "../work";
import { ProfileHeader } from "./ProfileHeader";
import { InfoSection } from "./InfoSection";
import { BackgroundSection } from "./BackgroundSection";
import { GridSection } from "./GridSection";
import { EducationSection } from "./EducationSection";
import { CommandSuggestions } from "./CommandSuggestions";
import { Job } from "../../../types";

interface AboutSectionProps {
  jobs: Job[]; // Array of job experiences
  className?: string; // Optional className for additional styling
}

// Define constants without readonly modifier
const CORE_VALUES = [
  "Infrastructure as Code",
  "Automation First Mindset",
  "Continuous Learning",
  "Clean, Maintainable Solutions",
];

const INTERESTS = [
  "Cloud Architecture",
  "DevOps Practices",
  "System Optimization",
  "Automation Frameworks",
];

/**
 * AboutSection component that displays a comprehensive profile including
 * work history, education, skills, and interests.
 */
export const AboutSection: React.FC<AboutSectionProps> = ({
  jobs,
  className = "",
}) => {
  return (
    <main className={`whitespace-pre-wrap ${className}`} role="main">
      <ProfileHeader />
      <InfoSection />
      <BackgroundSection />

      <div className="space-y-8">
        <GridSection
          title="CORE VALUES"
          items={CORE_VALUES}
          icon="▪"
          variant="cyan"
        />

        <GridSection
          title="INTERESTS"
          items={INTERESTS}
          icon="⚡"
          variant="orange"
        />

        <EducationSection />
        <WorkHistorySection jobs={jobs} />
        <CommandSuggestions />
      </div>
    </main>
  );
};

export default AboutSection;
