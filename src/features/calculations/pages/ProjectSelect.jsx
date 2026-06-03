import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PROJECT_TYPES } from "../constants/projectTypes";

// === CONSTANTS ===
// Animation config for the header section
const HEADER_ANIMATION = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

// Animation config for each project card — staggered by index
const cardAnimation = (index) => ({
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4, delay: index * 0.1 },
});

// === COMPONENT ===
export default function ProjectSelectPage() {
  const navigate = useNavigate();

  // Validates selected project type, saves to session, then navigates to setup
  const handleSelectProject = (projectId) => {
    const isValid = PROJECT_TYPES.some((p) => p.id === projectId);

    // Guard — redirect to 404 if somehow an invalid id is passed
    if (!isValid) {
      navigate("/404");
      return;
    }

    // Persist selected project type — used by SessionGuard and condition form
    sessionStorage.setItem("projectType", projectId);
    navigate(`/calculation/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 px-2 py-6 xl:p-12">
      {/* ── Page header ── */}
      <motion.div
        {...HEADER_ANIMATION}
        className="max-w-4xl mx-auto text-center mb-16"
      >
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-4">
          Select Project Type
        </h1>
        <p className="text-base text-slate-500 mx-auto">
          Select the type of pole structure you want to analyze to begin the
          structural calculation process.
        </p>
      </motion.div>

      {/* ── Project type cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-0 sm:mx-6 xl:mx-12">
        {PROJECT_TYPES.map((project, index) => (
          <motion.div key={project.id} {...cardAnimation(index)}>
            <button
              onClick={() => handleSelectProject(project.id)}
              className="group relative w-full text-left bg-white border border-slate-200 px-6 py-4 rounded-xl shadow-sm transition-all duration-300 hover:shadow-xl hover:border-blue-300 overflow-hidden"
            >
              {/* Decorative background circle — expands and tints on hover */}
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-slate-50 rounded-full transition-transform group-hover:scale-150 group-hover:bg-blue-50 duration-500" />

              <div className="relative flex items-start gap-5">
                {/* Project type title */}
                <div className="flex-grow">
                  <h3 className="text-sm sm:text-base font-medium text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">
                    {project.title}
                  </h3>
                </div>

                {/* Arrow icon — slides right on hover */}
                <div className="self-center">
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-2 transition-all duration-300" />
                </div>
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
