import React from 'react';

interface ProfileHeaderProps {
  name?: string; // Name to display in the header
  className?: string; // Optional className for additional styling
}

/**
 * ProfileHeader component displays a welcoming header with an animated name
 * and decorative underline.
 */
export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name = 'Francis Pagulayan',
  className = '',
}) => {
  return (
    <header className={`mb-6 ${className}`} role="banner">
      <h1 className="text-blue-400 text-2xl sm:text-3xl font-bold mb-2">
        <span className="sr-only">Welcome to my profile - </span>
        <span className="animate-pulse inline-block">Hi! I'm {name}</span>
      </h1>
      <div className="border-b-2 border-blue-500 w-48" aria-hidden="true" />
    </header>
  );
};

export default ProfileHeader;
