import React, { useState, useEffect } from 'react';

interface Command {
  id: string;
  label: string;
}

interface CommandSuggestionsProps {
  /**
   * Array of command objects to display
   */
  commands?: Command[];
  /**
   * Callback function when a command is selected to fill input
   */
  onCommandSelect?: (command: string) => void;
  /**
   * Optional className for additional styling
   */
  className?: string;
}

const DEFAULT_COMMANDS: Command[] = [
  { id: 'skills', label: 'skills' },
  { id: 'projects', label: 'projects' },
  { id: 'contact', label: 'contact' },
];

export const CommandSuggestions: React.FC<CommandSuggestionsProps> = ({
  commands = DEFAULT_COMMANDS,
  onCommandSelect = () => {},
  className = '',
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    command: string
  ): void => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        onCommandSelect(command);
        break;
      case 'ArrowRight':
        e.preventDefault();
        setSelectedIndex((selectedIndex + 1) % commands.length);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setSelectedIndex(
          selectedIndex <= 0 ? commands.length - 1 : selectedIndex - 1
        );
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setSelectedIndex(-1);
  }, [commands]);

  return (
    <div className={`mt-4 ${className}`}>
      <p className="text-gray-400 mb-2">
        Would you like to know more? Try these commands:
      </p>
      <div
        className="mt-2 flex flex-wrap gap-4"
        role="toolbar"
        aria-label="Command suggestions"
      >
        {commands.map((cmd, index) => (
          <button
            key={cmd.id}
            onClick={() => onCommandSelect(cmd.label)}
            onKeyDown={e => handleKeyDown(e, cmd.label)}
            onFocus={() => setSelectedIndex(index)}
            className={`
              font-mono text-sm
              ${selectedIndex === index ? 'text-blue-300' : 'text-blue-400'}
              hover:text-blue-300
              focus:text-blue-300
              cursor-pointer
              transition-colors
              outline-none
              focus:ring-2
              focus:ring-blue-400
              focus:ring-offset-2
              focus:ring-offset-gray-900
              rounded
              px-2
              py-1
            `}
            type="button"
            aria-label={`Type ${cmd.label} command`}
            tabIndex={0}
          >
            <span className="flex items-center gap-2">
              <span className="text-green-500">$</span>
              {cmd.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CommandSuggestions;
