const CATEGORIES = [
  {
    command: "projects-infra",
    color: "text-cyan-400",
    description: "Infrastructure & Cloud Architecture Projects",
  },
  {
    command: "projects-mlops",
    color: "text-purple-400",
    description: "MLOps & Model Deployment Projects",
  },
  {
    command: "projects-data",
    color: "text-green-400",
    description: "Data Engineering & Pipeline Projects",
  },
  {
    command: "projects-ml",
    color: "text-yellow-400",
    description: "Machine Learning & AI Projects",
  },
];

const ProjectCategories = () => {
  return (
    <div className="font-mono">
      <div className="text-blue-500 font-bold">
        ━━━ Project Categories ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      </div>
      <div className="text-gray-200">
        Type the following commands to explore each category:
      </div>
      {CATEGORIES.map(({ command, color, description }) => (
        <div key={command} className="flex items-center">
          <span className={`${color} font-bold w-36`}>{command}</span>
          <span className="text-gray-400">│</span>
          <span className="text-gray-300 ml-2">{description}</span>
        </div>
      ))}
    </div>
  );
};

export default ProjectCategories;
