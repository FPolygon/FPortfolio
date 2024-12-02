import React from "react";

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
   * Callback function when a command is selected
   */
  onCommandSelect?: (command: string) => void;
  /**
   * Optional className for additional styling
   */
  className?: string;
}

const DEFAULT_COMMANDS: Command[] = [
  { id: "skills", label: "skills" },
  { id: "projects", label: "projects" },
  { id: "contact", label: "contact" },
];

/**
 * CommandSuggestions component displays a list of interactive command suggestions
 * with keyboard navigation support and proper accessibility attributes.
 */
export const CommandSuggestions: React.FC<CommandSuggestionsProps> = ({
  commands = DEFAULT_COMMANDS,
  onCommandSelect = () => {},
  className = "",
}) => {
  const handleKeyDown = (e: React.KeyboardEvent, command: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onCommandSelect(command);
    }
  };

  return (
    <div className={`text-gray-500 mt-4 ${className}`}>
      <p className="mb-2">Would you like to know more? Try these commands:</p>
      <div className="mt-2 flex flex-wrap gap-4">
        {commands.map((cmd) => (
          <button
            key={cmd.id}
            onClick={() => onCommandSelect(cmd.label)}
            onKeyDown={(e) => handleKeyDown(e, cmd.label)}
            className="text-blue-400 hover:text-blue-300 focus:text-blue-300
                     cursor-pointer transition-colors outline-none
                     focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                     focus:ring-offset-gray-900 rounded px-2 py-1"
            type="button"
            aria-label={`Run ${cmd.label} command`}
          >
            <span className="font-mono">$ {cmd.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CommandSuggestions;
