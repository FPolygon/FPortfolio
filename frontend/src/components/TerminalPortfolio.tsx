import React, { useState, useEffect, useRef } from "react";
import AnimatedAsciiArt from "./AnimatedAsciiArt";
import { Project } from "../types/index"; // if using types/index.ts
import { fetchProjectsByCategory } from "../api";

// Define types for command output (can be string or JSX)
type CommandOutput = string | JSX.Element;

// Interface for the commands object structure
interface Commands {
  [key: string]: () => CommandOutput | Promise<CommandOutput>;
}

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

// Skills section component - displays formatted skill categories
const skillsSection = (): CommandOutput => (
  <div className="whitespace-pre-wrap">
    {/* Infrastructure & Cloud */}
    <div className="mb-6">
      <div className="text-blue-500 font-bold mb-2">
        ━━━ Infrastructure & Cloud ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      </div>
      <div className="grid grid-cols-1 gap-1">
        <div className="flex">
          <span className="text-purple-400 w-48">Containers & Orch:</span>
          <span className="text-gray-300">
            Kubernetes, Docker, Helm, EKS, GKE
          </span>
        </div>
        <div className="flex">
          <span className="text-purple-400 w-48">Infrastructure as Code:</span>
          <span className="text-gray-300">
            Terraform, AWS CDK, CloudFormation
          </span>
        </div>
        <div className="flex">
          <span className="text-purple-400 w-48">Cloud Platforms:</span>
          <span className="text-gray-300">AWS, GCP</span>
        </div>
        <div className="flex">
          <span className="text-purple-400 w-48">Service Mesh:</span>
          <span className="text-gray-300">Istio, Consul</span>
        </div>
        <div className="flex">
          <span className="text-purple-400 w-48">Monitoring:</span>
          <span className="text-gray-300">Prometheus, Grafana, ELK Stack</span>
        </div>
        <div className="flex">
          <span className="text-purple-400 w-48">Security:</span>
          <span className="text-gray-300">
            HashiCorp Vault, Cert-Manager, AWS IAM
          </span>
        </div>
      </div>
    </div>

    {/* MLOps & Model Deployment */}
    <div className="mb-6">
      <div className="text-green-500 font-bold mb-2">
        ━━━ MLOps & Model Deployment ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      </div>
      <div className="grid grid-cols-1 gap-1">
        <div className="flex">
          <span className="text-cyan-400 w-48">ML Platforms:</span>
          <span className="text-gray-300">Kubeflow, MLflow, Seldon Core</span>
        </div>
        <div className="flex">
          <span className="text-cyan-400 w-48">Feature Stores:</span>
          <span className="text-gray-300">Feast, Redis</span>
        </div>
        <div className="flex">
          <span className="text-cyan-400 w-48">Model Serving:</span>
          <span className="text-gray-300">TensorFlow Serving, TorchServe</span>
        </div>
        <div className="flex">
          <span className="text-cyan-400 w-48">Experiment Tracking:</span>
          <span className="text-gray-300">MLflow, Weights & Biases</span>
        </div>
        <div className="flex">
          <span className="text-cyan-400 w-48">Model Monitoring:</span>
          <span className="text-gray-300">Prometheus, Grafana</span>
        </div>
        <div className="flex">
          <span className="text-cyan-400 w-48">Data Version Control:</span>
          <span className="text-gray-300">DVC, Git LFS</span>
        </div>
      </div>
    </div>

    {/* Data Engineering */}
    <div className="mb-6">
      <div className="text-yellow-500 font-bold mb-2">
        ━━━ Data Engineering ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      </div>
      <div className="grid grid-cols-1 gap-1">
        <div className="flex">
          <span className="text-orange-400 w-48">Stream Processing:</span>
          <span className="text-gray-300">Apache Kafka, Spark Streaming</span>
        </div>
        <div className="flex">
          <span className="text-orange-400 w-48">Data Pipelines:</span>
          <span className="text-gray-300">Apache Airflow, dbt</span>
        </div>
        <div className="flex">
          <span className="text-orange-400 w-48">Data Storage:</span>
          <span className="text-gray-300">S3, Delta Lake, Apache Hudi</span>
        </div>
        <div className="flex">
          <span className="text-orange-400 w-48">Databases:</span>
          <span className="text-gray-300">PostgreSQL, MongoDB, Redis</span>
        </div>
        <div className="flex">
          <span className="text-orange-400 w-48">ETL/ELT Tools:</span>
          <span className="text-gray-300">Apache Spark, dbt</span>
        </div>
        <div className="flex">
          <span className="text-orange-400 w-48">Data Formats:</span>
          <span className="text-gray-300">Parquet, Avro, JSON</span>
        </div>
      </div>
    </div>

    {/* Machine Learning */}
    <div className="mb-6">
      <div className="text-red-500 font-bold mb-2">
        ━━━ Machine Learning ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      </div>
      <div className="grid grid-cols-1 gap-1">
        <div className="flex">
          <span className="text-pink-400 w-48">Frameworks:</span>
          <span className="text-gray-300">
            PyTorch, TensorFlow, scikit-learn
          </span>
        </div>
        <div className="flex">
          <span className="text-pink-400 w-48">NLP:</span>
          <span className="text-gray-300">Transformers, spaCy, NLTK</span>
        </div>
        <div className="flex">
          <span className="text-pink-400 w-48">Time Series:</span>
          <span className="text-gray-300">Prophet, statsmodels</span>
        </div>
        <div className="flex">
          <span className="text-pink-400 w-48">Deep Learning:</span>
          <span className="text-gray-300">CNN, RNN, Transformers</span>
        </div>
        <div className="flex">
          <span className="text-pink-400 w-48">ML Libraries:</span>
          <span className="text-gray-300">NumPy, Pandas, SciPy</span>
        </div>
        <div className="flex">
          <span className="text-pink-400 w-48">Visualization:</span>
          <span className="text-gray-300">Matplotlib, Seaborn</span>
        </div>
      </div>
    </div>

    {/* Programming & Tools */}
    <div className="mb-6">
      <div className="text-purple-500 font-bold mb-2">
        ━━━ Programming & Tools ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      </div>
      <div className="grid grid-cols-1 gap-1">
        <div className="flex">
          <span className="text-indigo-400 w-48">Languages:</span>
          <span className="text-gray-300">Python, Go, Bash, SQL</span>
        </div>
        <div className="flex">
          <span className="text-indigo-400 w-48">CI/CD:</span>
          <span className="text-gray-300">GitHub Actions, Jenkins, ArgoCD</span>
        </div>
        <div className="flex">
          <span className="text-indigo-400 w-48">Version Control:</span>
          <span className="text-gray-300">Git, GitHub</span>
        </div>
        <div className="flex">
          <span className="text-indigo-400 w-48">API Development:</span>
          <span className="text-gray-300">FastAPI, Flask</span>
        </div>
        <div className="flex">
          <span className="text-indigo-400 w-48">Testing:</span>
          <span className="text-gray-300">pytest, unittest</span>
        </div>
        <div className="flex">
          <span className="text-indigo-400 w-48">Documentation:</span>
          <span className="text-gray-300">Sphinx, MkDocs</span>
        </div>
      </div>
    </div>
  </div>
);

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

  // Refs for DOM manipulation
  const inputRef = useRef<HTMLInputElement>(null); // Reference to input element
  const terminalRef = useRef<HTMLDivElement>(null); // Reference to terminal container

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
  // Command definitions and their implementations
  const commands: Commands = {
    // Each command returns either a string or JSX element
    help: (): CommandOutput => `Available commands:
- about: Learn about me
- skills: View my technical skills
- projects: See project categories
- contact: Get my contact information
- clear: Clear the terminal`,
    about: (): CommandOutput => `Hi! I'm Francis Pagulayan
A passionate infrastrucure and automation engineer with a love for creating elegant solutions.
Currently based in Chicago IL.`,
    skills: skillsSection,
    projects: (): CommandOutput /* Projects component implementation */ => (
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
