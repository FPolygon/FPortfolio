import React from 'react';

interface CategoryHeaderProps {
  text: string;
  textColor?: string;
  totalLength?: number;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  text,
  textColor = 'text-gray-500',
  totalLength = 60, // Total length of text + dashes
}) => {
  // Calculate remaining space for dashes after text
  const textDisplayLength = text.length;
  const leadingDashes = '━━━ '; // 4 dashes before text
  const remainingSpace = Math.max(
    0,
    totalLength - textDisplayLength - leadingDashes.length
  );
  const trailingDashes = ' ' + '━'.repeat(remainingSpace);

  return (
    <div className={`${textColor} font-bold mb-2 whitespace-pre font-mono`}>
      {leadingDashes}
      {text}
      {trailingDashes}
    </div>
  );
};

export default CategoryHeader;
