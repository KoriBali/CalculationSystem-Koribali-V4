import { FileText, Settings2 } from "lucide-react";

// Pole input poleType options => used in ConditionForm (lighting-pole only)
export const poleTypeOptions = [
  {
    id: "standard",
    title: "Standard Pole",
    desc: "Use predefined pole specifications.",
    icon: FileText,
  },
  {
    id: "custom",
    title: "Custom Pole",
    desc: "Define your own pole specifications.",
    icon: Settings2,
  },
];
