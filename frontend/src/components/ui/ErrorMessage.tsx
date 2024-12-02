import React from "react";

export const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-red-500 mt-2">Error: {message}</div>
);
