// src/components/ui/LoadingSpinner.tsx
import React from "react";

export const LoadingSpinner: React.FC = () => (
  <div className="flex items-center space-x-2 mt-2">
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
    <div>Loading projects...</div>
  </div>
);
