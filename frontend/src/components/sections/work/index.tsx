import React from 'react';
import { Job } from '@/types';
import { JobEntry } from './JobEntry';

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
      <div className="text-emerald-400 font-bold mb-2">
        ━━━ WORK HISTORY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      </div>
      {jobs.map((job, index) => (
        <JobEntry key={job.id || index} job={job} />
      ))}
    </div>
  );
};
