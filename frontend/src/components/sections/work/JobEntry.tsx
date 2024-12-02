import React from "react";
import { Job } from "../../../types";
import { CompanyLink } from "./CompanyLink";
import { formatDate } from "./utils";

interface JobEntryProps {
  job: Job;
}

export const JobEntry: React.FC<JobEntryProps> = ({ job }) => {
  // Format the end date string based on job status
  const endDateString = job.is_current
    ? "Present"
    : job.end_date
    ? formatDate(job.end_date)
    : "";

  return (
    <div className="mb-4 group">
      {/* Job Header */}
      <div className="flex items-center space-x-2">
        <span className="text-emerald-400">❯</span>
        <span className="text-emerald-300 font-bold">
          {formatDate(job.start_date)} - {endDateString}
        </span>
        <span className="text-gray-400">|</span>
        <span className="text-gray-200">{job.title}</span>
        <span className="text-gray-400">@</span>
        <CompanyLink company={job.company} link={job.link} />
      </div>

      {/* Achievements */}
      <div className="ml-6 mt-2 space-y-1">
        {job.achievements.map((achievement, index) => (
          <div
            key={index}
            className="flex items-start space-x-2 group-hover:text-gray-300 text-gray-400 transition-colors"
          >
            <span className="text-emerald-500 mt-1">$</span>
            <span>{achievement.description}</span>
          </div>
        ))}
      </div>

      {/* Technologies */}
      <div className="ml-6 mt-2">
        <span className="text-emerald-500">Technologies: </span>
        <span className="text-gray-300">
          {job.technologies.map((tech) => tech.name).join(", ")}
        </span>
      </div>
    </div>
  );
};
