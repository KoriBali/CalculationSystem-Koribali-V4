import { FileText, Settings } from "lucide-react";

// Pole input poleType options => used in ConditionForm (lighting-pole only)
export const poleTypeOptions = [
  {
    id: "standard",
    title: "Lighting Pole Standard",
    desc: "Predefined configurations for common pole types",
    icon: FileText,
  },
  {
    id: "custom",
    title: "Custom Pole",
    desc: "Advanced configuration with detailed specifications",
    icon: Settings,
  },
];
