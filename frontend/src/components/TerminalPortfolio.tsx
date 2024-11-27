import React, { useState, useEffect, useRef } from "react";
import AnimatedAsciiArt from "./AnimatedAsciiArt";
import { Project, Category, Job } from "../types";
import { fetchProjectsByCategory, fetchAllSkills, fetchJobs } from "../api";

type CommandOutput = string | JSX.Element;

// Interface for the commands object structure
interface Commands {
  [key: string]: () => CommandOutput | Promise<CommandOutput>;
}

const WorkHistorySection: React.FC<{ jobs: Job[] }> = ({ jobs }) => {
  if (!jobs.length) {
    return <div className="text-gray-400">Loading work history...</div>;
  }

  return (
    <div className="mb-6">
      <div className="text-emerald-400 font-bold mb-2">
        ━━━ WORK HISTORY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      </div>
      {jobs.map((job, index) => (
        <div key={index} className="mb-4 group">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-400">❯</span>
            <span className="text-emerald-300 font-bold">
              {new Date(job.start_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
              })}{" "}
              -
              {job.is_current
                ? "Present"
                : job.end_date
                ? new Date(job.end_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })
                : ""}
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-200">{job.title}</span>
            <span className="text-gray-400">@</span>
            {job.link ? (
              <a
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              >
                {job.company}
              </a>
            ) : (
              <span className="text-blue-400">{job.company}</span>
            )}
          </div>
          <div className="ml-6 mt-2 space-y-1">
            {job.achievements.map((achievement, i) => (
              <div
                key={i}
                className="flex items-start space-x-2 group-hover:text-gray-300 text-gray-400 transition-colors"
              >
                <span className="text-emerald-500 mt-1">$</span>
                <span>{achievement.description}</span>
              </div>
            ))}
          </div>
          <div className="ml-6 mt-2">
            <span className="text-emerald-500">Technologies: </span>
            <span className="text-gray-300">
              {job.technologies.map((tech) => tech.name).join(", ")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

// ProjectLink component for rendering external links with an icon
const ProjectLink: React.FC<{ href: string }> = ({ href }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-150 flex items-center"
    >
      {href}
      {/* External link icon */}
      <svg
        className="w-4 h-4 ml-1 inline-block"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </a>
  );
};

// Contact section component
const contactSection = (): CommandOutput => (
  <div className="whitespace-pre-wrap">
    <div className="text-purple-500 font-bold mb-4">
      ━━━ Contact Information ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </div>

    <div className="grid grid-cols-1 gap-3">
      <div className="flex items-center">
        <span className="text-green-400 w-32">Email:</span>
        <a
          href="mailto:francis.pagulayan@example.com"
          className="text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-150"
        >
          example@google.com
        </a>
      </div>

      <div className="flex items-center">
        <span className="text-green-400 w-32">LinkedIn:</span>
        <ProjectLink href="www.linkedin.com/in/francis-pagulayan-924796222" />
      </div>

      <div className="flex items-center">
        <span className="text-green-400 w-32">GitHub:</span>
        <ProjectLink href="https://github.com/FPolygon" />
      </div>

      <div className="flex items-center">
        <span className="text-green-400 w-32">Location:</span>
        <span className="text-gray-300">Chicago, IL</span>
      </div>

      <div className="mt-4 text-gray-300">
        Feel free to reach out for collaborations, opportunities, or just to
        chat about technology and infrastructure!
      </div>
    </div>
  </div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-red-500 mt-2">Error: {message}</div>
);

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center space-x-2 mt-2">
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
    <div>Loading projects...</div>
  </div>
);

// Main Terminal Portfolio Component
const TerminalPortfolio: React.FC = () => {
  // State management for terminal functionality
  const [input, setInput] = useState<string>(""); // Current input value
  const [history, setHistory] = useState<(string | JSX.Element)[]>([]); // Command history with output
  const [commandHistory, setCommandHistory] = useState<string[]>([]); // Previous commands for up/down navigation
  const [historyIndex, setHistoryIndex] = useState<number>(-1); // Index for navigating command history
  const [projectsData, setProjectsData] = useState<{
    [key: string]: Project[];
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skillsData, setSkillsData] = useState<Category[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  // Refs for DOM manipulation
  const inputRef = useRef<HTMLInputElement>(null); // Reference to input element
  const terminalRef = useRef<HTMLDivElement>(null); // Reference to terminal container

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [skillsResponse, jobsResponse] = await Promise.all([
          fetchAllSkills(),
          fetchJobs(),
        ]);
        setSkillsData(skillsResponse);
        setJobs(jobsResponse);
      } catch (error) {
        setError("Failed to load data");
      }
    };

    fetchInitialData();
  }, []);

  // Available commands for auto-completion
  const availableCommands = [
    "help",
    "about",
    "skills",
    "projects",
    "contact",
    "clear",
    "projects-infra",
    "projects-mlops",
    "projects-data",
    "projects-ml",
  ];

  // Initial terminal header with ASCII art
  const headerMessage = (
    <>
      <AnimatedAsciiArt />
      <div className="mt-5 mb-3">Type "help" to see available commands.</div>
    </>
  );

  const TechBadges: React.FC<{ technologies: { name: string }[] }> = ({
    technologies,
  }) => {
    return (
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech, index) => (
          <div
            key={index}
            className="inline-flex items-center px-3 py-1 rounded border border-purple-500 bg-opacity-20 bg-purple-900 text-purple-300 hover:bg-purple-800 hover:bg-opacity-30 transition-colors cursor-pointer group"
          >
            <span className="mr-2 text-emerald-400">$</span>
            {tech.name}
            <span className="ml-2 opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity">
              _
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Function to fetch projects for a category
  const fetchProjects = async (category: string) => {
    setLoading(true);
    try {
      const projects = await fetchProjectsByCategory(category);
      setProjectsData((prev) => ({ ...prev, [category]: projects }));
      setError(null);
      return projects;
    } catch (error: unknown) {
      let errorMessage = "Failed to load projects";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object" && "message" in error) {
        errorMessage = String(error.message);
      }

      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const renderProjects = (
    projects: Project[],
    category: string,
    titleColor: string,
  ): JSX.Element => {
    if (error) return <ErrorMessage message={error} />;
    if (!projects.length) {
      return <div className="text-gray-300">No projects found.</div>;
    }
    return (
      <div className="whitespace-pre-wrap">
        <div className={`${titleColor}`}>
          ━━━ {category.toUpperCase()} Projects ━━━━━━━━━━━━━━━━━━━━━━━
        </div>
        {projects.map((project, index) => (
          <div className="mt-4" key={project.id}>
            <div className="text-yellow-400 font-bold">
              {index + 1}. {project.name}
            </div>
            <div className="text-gray-300 leading-relaxed pl-4 border-l-2 border-gray-700 my-2 ml-1">
              <span className="text-blue-400">❯</span> {project.description}
            </div>
            <div className="text-green-400">• Technologies:</div>
            <div className="ml-2">
              <TechBadges technologies={project.technology} />
            </div>
            <div className="text-cyan-400">• Code:</div>
            <div className="ml-2">
              <ProjectLink href={project.github} />
            </div>
          </div>
        ))}
      </div>
    );
  };
  const SkillsSection: React.FC<{ data: Category[] }> = ({ data }) => {
    if (data.length === 0) {
      return <div>No skills data available.</div>;
    }

    const categoryColors: { [key: string]: { header: string; label: string } } =
      {
        "Infrastructure & Cloud": {
          header: "text-blue-500",
          label: "text-purple-400",
        },
        "MLOps & Model Deployment": {
          header: "text-green-500",
          label: "text-cyan-400",
        },
        "Data Engineering & Pipeline": {
          header: "text-yellow-500",
          label: "text-orange-400",
        },
        "Machine Learning & AI": {
          header: "text-red-500",
          label: "text-pink-400",
        },
        "Programming & Tools": {
          header: "text-purple-500",
          label: "text-indigo-400",
        },
      };

    return (
      <div className="whitespace-pre-wrap">
        {data.map((category) => (
          <div key={category.id} className="mb-6">
            <div
              className={`${
                categoryColors[category.name]?.header || "text-gray-500"
              } font-bold mb-2`}
            >
              ━━━ {category.name} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            </div>
            <div className="grid grid-cols-1 gap-1">
              {category.subcategories.map((subcategory) => (
                <div key={subcategory.id} className="flex">
                  <span
                    className={`${
                      categoryColors[category.name]?.label || "text-gray-400"
                    } w-48`}
                  >
                    {subcategory.name}:
                  </span>
                  <span className="text-gray-300">
                    {subcategory.technologies
                      .map((tech) => tech.name)
                      .join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Command definitions and their implementations
  const commands: Commands = {
    // Each command returns either a string or JSX element
    help: (): CommandOutput => `Available commands:
- about: Learn about me
- skills: View my technical skills
- projects: See project categories
- contact: Get my contact information
- clear: Clear the terminal`,
    about: (): CommandOutput => (
      <div className="whitespace-pre-wrap">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-blue-400 text-2xl font-bold mb-2 animate-pulse">
            Hi! I'm Francis Pagulayan
          </h1>
          <div className="border-b-2 border-blue-500 w-48"></div>
        </div>

        {/* Info Section */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-green-400 bg-green-900/30 px-2 rounded">
              [INFO]
            </span>
            <span className="text-gray-300">Location: Chicago, IL</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-400 bg-green-900/30 px-2 rounded">
              [INFO]
            </span>
            <span className="text-gray-300">
              Role: Systems Automation Engineer
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-yellow-400 bg-yellow-900/30 px-2 rounded">
              [STATUS]
            </span>
            <span className="text-gray-300">
              Currently: Building elegant infrastructure solutions
            </span>
          </div>
        </div>
        {/* Background Section */}
        <div className="mb-6">
          <div className="text-purple-400 mb-2">BACKGROUND</div>
          <div className="text-gray-300 pl-4 border-l-2 border-purple-500">
            A passionate infrastructure and automation engineer with expertise
            in creating scalable, efficient systems. Specialized in transforming
            complex technical challenges into elegant solutions.
          </div>
        </div>

        {/* Core Values Section */}
        <div className="mb-6">
          <div className="text-cyan-400 mb-2">CORE VALUES</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              "Infrastructure as Code",
              "Automation First Mindset",
              "Continuous Learning",
              "Clean, Maintainable Solutions",
            ].map((value, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 text-gray-300 hover:text-cyan-300 transition-colors"
              >
                <span className="text-cyan-500">▪</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interests Section */}
        <div className="mb-6">
          <div className="text-orange-400 mb-2">INTERESTS</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              "Cloud Architecture",
              "DevOps Practices",
              "System Optimization",
              "Automation Frameworks",
            ].map((interest, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 text-gray-300 hover:text-orange-300 transition-colors"
              >
                <span className="text-orange-500">⚡</span>
                <span>{interest}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="mb-6">
          <div className="text-indigo-400 font-bold mb-2">
            ━━━ EDUCATION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          </div>
          {[
            {
              period: "2020 - 2022",
              degree: "B.S. Computer Science",
              school: "University of Illinois at Chicago",
              details: [
                "Focus: Machine Learning & Distributed Systems",
                "Senior Project: Led a team of 4 to develop and fine tune a suite of machine learning models to predict traffic accidents based on a variety of environmental factors",
              ],
            },
          ].map((edu, index) => (
            <div key={index} className="mb-4 group">
              <div className="flex items-center space-x-2">
                <span className="text-indigo-400">❯</span>
                <span className="text-indigo-300 font-bold">{edu.period}</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-200">{edu.degree}</span>
                <span className="text-gray-400">@</span>
                <span className="text-blue-400">{edu.school}</span>
              </div>
              <div className="ml-6 mt-2 space-y-1">
                {edu.details.map((detail, i) => (
                  <div
                    key={i}
                    className="flex items-start space-x-2 group-hover:text-gray-200 text-gray-400 transition-colors"
                  >
                    <span className="text-indigo-500">▪</span>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Work History Section */}
        <WorkHistorySection jobs={jobs} />

        {/* Command Suggestions */}
        <div className="text-gray-500 mt-4">
          Would you like to know more? Try these commands:
          <div className="mt-2 space-x-4">
            {["skills", "projects", "contact"].map((cmd, index) => (
              <span
                key={index}
                className="text-blue-400 hover:text-blue-300 cursor-pointer transition-colors"
              >
                $ {cmd}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),

    skills: async () => {
      const data = await fetchAllSkills();
      setSkillsData(data); // Update state for future use
      return <SkillsSection data={data} />; // Use the fetched data directly
    },

    projects: (): CommandOutput => (
      <div className="whitespace-pre-wrap">
        <div className="text-blue-500">
          ━━━ Project Categories
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        </div>
        <div className="mb-2">
          Type the following commands to explore each category:
        </div>

        <div className="flex">
          <span className="text-cyan-400 font-bold">projects-infra</span>
          <span className="text-gray-400 mx-2">│</span>
          <span className="text-gray-300">
            Infrastructure & Cloud Architecture Projects
          </span>
        </div>

        <div className="flex">
          <span className="text-purple-400 font-bold">projects-mlops</span>
          <span className="text-gray-400 mx-2">│</span>
          <span className="text-gray-300">
            MLOps & Model Deployment Projects
          </span>
        </div>

        <div className="flex">
          <span className="text-green-400 font-bold">projects-data</span>
          <span className="text-gray-400 mx-2">│</span>
          <span className="text-gray-300">
            Data Engineering & Pipeline Projects
          </span>
        </div>

        <div className="flex">
          <span className="text-yellow-400 font-bold">projects-ml</span>
          <span className="text-gray-400 mx-2">│</span>
          <span className="text-gray-300">Machine Learning & AI Projects</span>
        </div>
      </div>
    ),

    "projects-infra": async (): Promise<CommandOutput> => {
      const category = "infrastructure";
      const projects = await fetchProjects(category);
      return renderProjects(projects, category, "text-cyan-400");
    },
    "projects-mlops": async (): Promise<CommandOutput> => {
      const category = "mlops";
      const projects = await fetchProjects(category);
      return renderProjects(projects, category, "text-purple-400");
    },
    "projects-data": async (): Promise<CommandOutput> => {
      const category = "data";
      const projects = await fetchProjects(category);
      return renderProjects(projects, category, "text-green-400");
    },
    "projects-ml": async (): Promise<CommandOutput> => {
      const category = "ml";
      const projects = await fetchProjects(category);
      return renderProjects(projects, category, "text-yellow-400");
    },
    contact: contactSection,
    clear: (): CommandOutput => {
      setHistory([headerMessage]);
      return "";
    },
  };

  // Handles command execution
  const handleCommand = async (cmd: string): Promise<void> => {
    const trimmedCmd = cmd.trim().toLowerCase();
    if (trimmedCmd === "") return;

    // Add command to history
    if (trimmedCmd !== "") {
      setCommandHistory((prev) => [...prev, trimmedCmd]);
      setHistoryIndex(-1);
    }

    // Show command input first
    setHistory((prev) => [
      ...prev,
      <div className="flex">
        <span className="text-green-500 mr2">$ </span>
        <span>{cmd}</span>
      </div>,
    ]);

    // Show loading indicator
    if (trimmedCmd.startsWith("projects-")) {
      setHistory((prev) => [...prev, <LoadingSpinner />]);
    }

    try {
      // Execute command and get output
      const command = commands[trimmedCmd];
      if (!command) {
        setHistory((prev) => [
          ...prev.slice(0, -1),
          `Command not found: ${trimmedCmd}. Type "help" for available commands.`,
        ]);
        return;
      }

      const output = await command();

      // Update terminal history (unless clear command)
      if (trimmedCmd !== "clear") {
        setHistory((prev) => {
          // Remove loading spinner if it exists
          const newHistory = trimmedCmd.startsWith("projects-")
            ? prev.slice(0, -1)
            : prev;
          return [...newHistory, output];
        });
      }
    } catch (error: unknown) {
      let errorMessage = "An unknown error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object" && "message" in error) {
        errorMessage = String(error.message);
      }

      setHistory((prev) => [
        ...prev.slice(0, -1),
        `Error executing command: ${errorMessage}`,
      ]);
    }
  };

  // Handles tab completion functionality
  const handleTabCompletion = (): void => {
    const matchingCommands = availableCommands.filter((cmd) =>
      cmd.startsWith(input.toLowerCase()),
    );

    // Single match - complete the command
    if (matchingCommands.length === 1) {
      setInput(matchingCommands[0]);
    } else if (matchingCommands.length > 1) {
      // Multiple matches - show all possibilities
      setHistory((prev) => [
        ...prev,
        `$ ${input}`,
        matchingCommands.join("  "),
      ]);
    }
  };

  // Keyboard event handler for terminal interaction
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      // Execute command
      handleCommand(input);
      setInput("");
    } else if (e.key === "Tab") {
      // Handle tab completion
      e.preventDefault();
      handleTabCompletion();
    } else if (e.key === "ArrowUp") {
      // Navigate command history backwards
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex < commandHistory.length - 1
            ? historyIndex + 1
            : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      // Navigate command history forwards
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  // Focus handler for terminal input
  const focusInput = (): void => {
    const selection = window.getSelection();
    // Only focus input if no text is selected
    if (selection?.toString().length === 0) {
      inputRef.current?.focus();
    }
  };

  // Effect to auto-scroll terminal to bottom when history updates
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Initial setup effect
  useEffect(() => {
    setHistory([headerMessage]);
    inputRef.current?.focus();
  }, []);

  // Terminal UI render
  return (
    <div
      className="min-h-screen h-screen w-screen bg-gray-900 p-4 font-mono text-gray-200 overflow-y-auto cursor-text select-text"
      onClick={focusInput}
      ref={terminalRef}
    >
      <div className="p-4">
        {/* Render command history and outputs */}
        {history.map((line, i) => (
          <div key={i} className="mb-1 whitespace-pre-wrap">
            {line}
          </div>
        ))}
        {/* Command input line */}
        <div className="flex items-center">
          <span className="mr-2 text-green-500">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInput(e.target.value)
            }
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none border-none text-gray-200 caret-gray-200"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default TerminalPortfolio;
