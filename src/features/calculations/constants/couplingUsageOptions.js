import { Link2, XCircle } from "lucide-react";

// Coupling usage options => used in ConditionForm (lighting-pole only)
export const couplingUsageOptions = [
  {
    id: "yes",
    title: "Use Coupling",
    desc: "Include coupling in this pole design.",
    icon: Link2,
  },
  {
    id: "no",
    title: "No Coupling",
    desc: "Skip coupling for this pole design.",
    icon: XCircle,
  },
];
