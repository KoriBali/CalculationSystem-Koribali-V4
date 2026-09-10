export const MENU_ITEMS = [
  // Super Admin specific routes
  { name: "Dashboard", icon: "LayoutDashboard", path: "/superadmin/dashboard", roles: ["superadmin"] },
  { name: "Departments", icon: "Building2", path: "/superadmin/departments", roles: ["superadmin"] },
  { name: "Users", icon: "Users", path: "/superadmin/users", roles: ["superadmin"] },

  // Shared routes
  { name: "Design Calculation", icon: "Calculator", path: "/calculation", roles: ["superadmin", "admin", "drafter"] },
  { name: "Report Preview", icon: "FileText", path: "/report", roles: ["superadmin", "admin", "drafter"] },
  { name: "Project Database", icon: "Database", path: "/database", roles: ["superadmin", "admin", "drafter"] },
];

// Shared spring animation config — used across sidebar and nav animations
export const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 1,
};
