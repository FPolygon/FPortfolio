import React from 'react';
import { Job } from '@/types';
import { JobEntry } from './JobEntry';
import CategoryHeader from '@/components/ui/CategoryHeader';

interface WorkHistorySectionProps {
  jobs: Job[];
}

export const WorkHistorySection: React.FC<WorkHistorySectionProps> = ({
  jobs,
}) => {
  if (!jobs.length) {
    return <div className="text-gray-400">Loading work history...</div>;
  }

  return (
    <div className="mb-6">
      <CategoryHeader text="WORK HISTORY" textColor="text-emerald-400" />
      {jobs.map((job, index) => (
        <JobEntry key={job.id || index} job={job} />
      ))}
    </div>
  );
};

export default WorkHistorySection;
