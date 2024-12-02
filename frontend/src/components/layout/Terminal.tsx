import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import AnimatedAsciiArt from '@/components/animations/AnimatedAsciiArt';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { AboutSection } from '@/components/sections/about';
import { SkillsSection } from '@/components/sections/skills';
import { ContactSection } from '@/components/sections/contact';
import { Project, Category, Job } from '@/types';
import { fetchProjectsByCategory, fetchAllSkills, fetchJobs } from '@/api';
import { ProjectsSection } from '@/components/sections/projects';
import { getProjectCategoryColor } from '@/components/sections/projects/utils';

// Types for command outputs and responses
type CommandOutput = string | JSX.Element;

// Max history to avoid memory issues
const MAX_HISTORY_SIZE = 1000;

// Define available terminal commands as a const array for type safety and autocompletion
const AVAILABLE_COMMANDS = [
  'help',
  'about',
  'skills',
  'projects',
  'contact',
  'clear',
  'projects-infra',
  'projects-mlops',
  'projects-data',
  'projects-ml',
] as const;

// Create a union type of all available commands for type checking
type AvailableCommand = (typeof AVAILABLE_COMMANDS)[number];

// Interface defining the terminal's state structure
interface TerminalState {
  input: string; // Current input value
  history: (string | JSX.Element)[]; // Command history including outputs
  commandHistory: string[]; // History of entered commands
  historyIndex: number; // Current position in command history
  projectsData: Record<string, Project[]>; // Cached project data by category
  loading: boolean; // Loading state indicator
  error: string | null; // Error state
  skillsData: Category[]; // Cached skills data
  jobs: Job[]; // Cached jobs data
}

/**
 * Terminal Component
 * A command-line interface styled terminal that allows users to interact with
 * portfolio content through text commands
 */
const Terminal: React.FC = () => {
  // Initialize terminal state
  const [state, setState] = useState<TerminalState>({
    input: '',
    history: [],
    commandHistory: [],
    historyIndex: -1,
    projectsData: {},
    loading: false,
    error: null,
    skillsData: [],
    jobs: [],
  });

  // Refs for DOM elements
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Memoized header message to prevent unnecessary rerenders
  const headerMessage = useMemo(
    () => (
      <>
        <AnimatedAsciiArt />
        <div className="mt-5 mb-3">Type "help" to see available commands.</div>
      </>
    ),
    []
  );

  /**
   * Fetches projects for a given category and updates state
   * @param category - The category of projects to fetch
   */
  const fetchProjects = useCallback(async (category: string) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const projects = await fetchProjectsByCategory(category);
      setState(prev => ({
        ...prev,
        projectsData: { ...prev.projectsData, [category]: projects },
        error: null,
      }));
      return projects;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load projects';
      setState(prev => ({ ...prev, error: errorMessage }));
      return [];
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Memoized commands object to prevent unnecessary rerenders
  const commands = useMemo<
    Record<AvailableCommand, () => CommandOutput | Promise<CommandOutput>>
  >(
    () => ({
      help: () => `Available commands:
- about: Learn about me
- skills: View my technical skills
- projects: See all projects and categories
- contact: Get my contact information
- clear: Clear the terminal`,
      about: () => <AboutSection jobs={state.jobs} />,
      skills: async () => {
        try {
          const data = await fetchAllSkills();
          setState(prev => ({ ...prev, skillsData: data }));
          return <SkillsSection data={data} />;
        } catch {
          return <ErrorMessage message="Failed to load skills data" />;
        }
      },
      projects: () => <ProjectsSection showCategories={true} />,
      'projects-infra': async () => {
        const category = 'infrastructure';
        const projects = await fetchProjects(category);
        return (
          <ProjectsSection
            projects={projects}
            category={category}
            titleColor={getProjectCategoryColor(category)}
            error={state.error}
          />
        );
      },
      'projects-mlops': async () => {
        const category = 'mlops';
        const projects = await fetchProjects(category);
        return (
          <ProjectsSection
            projects={projects}
            category={category}
            titleColor="text-purple-400"
            error={state.error}
          />
        );
      },
      'projects-data': async () => {
        const category = 'data';
        const projects = await fetchProjects(category);
        return (
          <ProjectsSection
            projects={projects}
            category={category}
            titleColor="text-green-400"
            error={state.error}
          />
        );
      },
      'projects-ml': async () => {
        const category = 'ml';
        const projects = await fetchProjects(category);
        return (
          <ProjectsSection
            projects={projects}
            category={category}
            titleColor="text-yellow-400"
            error={state.error}
          />
        );
      },
      contact: () => <ContactSection />,
      clear: () => {
        setState(prev => ({ ...prev, history: [headerMessage] }));
        return '';
      },
    }),
    [state.jobs, state.error, fetchProjects, headerMessage]
  );

  /**
   * Handles execution of terminal commands
   * @param cmd - The command string to execute
   */
  const handleCommand = useCallback(
    async (cmd: string) => {
      const trimmedInput = cmd.trim().toLowerCase();
      if (trimmedInput === '') return;

      const trimmedCmd = trimmedInput as AvailableCommand;

      setState(prev => ({
        ...prev,
        commandHistory: [
          ...prev.commandHistory.slice(-MAX_HISTORY_SIZE),
          trimmedCmd,
        ],
        historyIndex: -1,
        history: [
          ...prev.history.slice(-MAX_HISTORY_SIZE),
          <div className="flex" key={prev.history.length}>
            <span className="text-green-500 mr-2">$</span>
            <span>{cmd}</span>
          </div>,
        ],
      }));

      // Show loading spinner for project commands
      if (trimmedCmd.startsWith('projects-')) {
        setState(prev => ({
          ...prev,
          history: [
            ...prev.history.slice(-MAX_HISTORY_SIZE),
            <LoadingSpinner key={`loading-${prev.history.length}`} />,
          ],
        }));
      }

      try {
        const command = commands[trimmedCmd];
        if (!command) {
          setState(prev => ({
            ...prev,
            history: [
              ...prev.history.slice(-MAX_HISTORY_SIZE),
              `Command not found: ${trimmedCmd}. Type "help" for available commands.`,
            ],
          }));
          return;
        }

        const output = await command();

        if (trimmedCmd !== 'clear') {
          setState(prev => ({
            ...prev,
            history: [
              ...(trimmedCmd.startsWith('projects-')
                ? prev.history.slice(0, -1)
                : prev.history
              ).slice(-MAX_HISTORY_SIZE),
              output,
            ],
          }));
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'An unknown error occurred';
        setState(prev => ({
          ...prev,
          history: [
            ...prev.history.slice(-MAX_HISTORY_SIZE),
            `Error executing command: ${errorMessage}`,
          ],
        }));
      }
    },
    [commands]
  );

  // Update the handleKeyDown function to handle arrow keys
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'Enter':
          handleCommand(state.input);
          setState(prev => ({ ...prev, input: '', historyIndex: -1 }));
          break;

        case 'ArrowUp':
          e.preventDefault();
          setState(prev => {
            if (prev.commandHistory.length === 0) return prev;

            const newIndex =
              prev.historyIndex === -1
                ? prev.commandHistory.length - 1
                : Math.max(0, prev.historyIndex - 1);

            return {
              ...prev,
              historyIndex: newIndex,
              input: prev.commandHistory[newIndex],
            };
          });
          break;

        case 'ArrowDown':
          e.preventDefault();
          setState(prev => {
            if (prev.historyIndex === -1) return prev;

            const newIndex =
              prev.historyIndex === prev.commandHistory.length - 1
                ? -1
                : prev.historyIndex + 1;

            return {
              ...prev,
              historyIndex: newIndex,
              input: newIndex === -1 ? '' : prev.commandHistory[newIndex],
            };
          });
          break;

        case 'Tab': {
          e.preventDefault();
          const matchingCommands = AVAILABLE_COMMANDS.filter(cmd =>
            cmd.startsWith(state.input.toLowerCase())
          );
          if (matchingCommands.length === 1) {
            setState(prev => ({ ...prev, input: matchingCommands[0] }));
          } else if (matchingCommands.length > 1) {
            setState(prev => ({
              ...prev,
              history: [
                ...prev.history.slice(-MAX_HISTORY_SIZE),
                `$ ${state.input}`,
                matchingCommands.join('  '),
              ],
            }));
          }
          break;
        }
      }
    },
    [state.input, handleCommand]
  );

  // Initialize terminal data on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [skillsResponse, jobsResponse] = await Promise.all([
          fetchAllSkills(),
          fetchJobs(),
        ]);
        setState(prev => ({
          ...prev,
          skillsData: skillsResponse,
          jobs: jobsResponse,
          history: [headerMessage],
        }));
      } catch (error) {
        console.error(error);
        setState(prev => ({ ...prev, error: 'Failed to load data' }));
      }
    };

    fetchInitialData();
    inputRef.current?.focus();
  }, [headerMessage]);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [state.history]);

  return (
    <div
      className="min-h-screen h-screen w-screen bg-gray-900 p-4 font-mono text-gray-200 overflow-y-auto cursor-text select-text"
      onClick={useCallback(() => {
        if (window.getSelection()?.toString().length === 0) {
          inputRef.current?.focus();
        }
      }, [])}
      ref={terminalRef}
    >
      <div className="p-4">
        {state.history.map((line, i) => (
          <div key={i} className="mb-1 whitespace-pre-wrap">
            {line}
          </div>
        ))}
        <div className="flex items-center">
          <span className="mr-2 text-green-500">$</span>
          <input
            ref={inputRef}
            type="text"
            value={state.input}
            onChange={useCallback(
              (e: React.ChangeEvent<HTMLInputElement>) =>
                setState(prev => ({ ...prev, input: e.target.value })),
              []
            )}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none border-none text-gray-200 caret-gray-200"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
