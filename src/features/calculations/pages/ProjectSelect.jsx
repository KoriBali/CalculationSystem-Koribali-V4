import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lightbulb, Monitor, Shield, Layers, ChevronRight } from "lucide-react";
import { PROJECT_TYPES } from "../constants/projectTypes";

// === CONSTANTS ===
const HEADER_ANIMATION = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const cardAnimation = (index) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay: index * 0.05 },
});

// Professional descriptions and icons mapping
const PROJECT_DETAILS = {
  "lighting-project": {
    icon: Lightbulb,
    description:
      "Calculate structural integrity and wind load for street and area lighting pole installations.",
  },
  "signboard-project": {
    icon: Monitor,
    description:
      "Analyze structural requirements for standalone and wall-mounted advertisement signboards.",
  },
  "disaster-prevention-project": {
    icon: Shield,
    description:
      "Evaluate safety factors and load capacities for emergency alert and disaster warning systems.",
  },
  "multi-purpose-project": {
    icon: Layers,
    description:
      "Comprehensive analysis for structures supporting various multi-purpose load attachments.",
  },
};

// === COMPONENT ===
export default function ProjectSelectPage() {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.removeItem("projectType");
  }, []);

  const handleSelectProject = (projectId) => {
    const isValid = PROJECT_TYPES.some((p) => p.id === projectId);
    if (!isValid) {
      navigate("/404");
      return;
    }
    sessionStorage.setItem("projectType", projectId);
    navigate(`/calculation/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="mx-auto w-full max-w-[1600px] px-6 hp:px-3 py-4 sm:py-6 lg:py-8">
        {/* ── Page header ── */}
        <motion.div
          {...HEADER_ANIMATION}
          className="w-full max-w-[1400px] mx-auto text-left mb-10"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">
            Select Project Type
          </h1>
          <p className="text-slate-500 mt-1.5 text-sm">
            Choose the specific project module to begin the structural and load
            analysis configuration.
          </p>
        </motion.div>

        {/* ── Project type cards ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 w-full max-w-[1400px] mx-auto">
          {PROJECT_TYPES.map((project, index) => {
            const details = PROJECT_DETAILS[project.id] || {
              icon: Layers,
              description: "Standard structural calculation module.",
            };
            const Icon = details.icon;

            return (
              <motion.div
                key={project.id}
                {...cardAnimation(index)}
                className="h-full"
              >
                <button
                  onClick={() => handleSelectProject(project.id)}
                  className="h-full group relative w-full text-left bg-white border border-slate-200 p-5 md:p-6 rounded-xl transition-all duration-200 hover:border-slate-300 hover:shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-5"
                >
                  {/* Icon Container */}
                  <div className="flex-shrink-0 p-3.5 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors duration-300">
                    <Icon className="w-6 h-6 stroke-[1.5]" />
                  </div>

                  {/* Text Content */}
                  <div className="flex-grow">
                    <h3 className="text-base font-semibold text-slate-800 mb-1.5 group-hover:text-blue-700 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed pr-4">
                      {details.description}
                    </p>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="flex-shrink-0 self-center hidden sm:flex items-center justify-center w-8 h-8 rounded-full group-hover:bg-blue-50 transition-colors duration-300">
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all duration-300" />
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
