import { useState, useEffect, useMemo, useRef } from "react";
import { Helmet } from "react-helmet";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Building2,
  ChevronDown,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// import { getUsers, getDepartments, createUser, updateUser, deleteUser } from "../services/userService";

const DEPARTMENTS = [
  { id: 1, code: "YS", name: "Head Office" },
  { id: 2, code: "YSC", name: "Tokyo Sales Office" },
  { id: 3, code: "YSF", name: "Nagano Sales Office" },
  { id: 4, code: "YSG", name: "North Kanto Sales Office" },
  { id: 5, code: "YSJ", name: "Kyushu Branch" },
];

// Mock data for initial UI — matches the /api/identity/users shape
// (fullName, username, email, role, departmentId) plus a joined
// departmentName for display.
const INITIAL_USERS = [
  { id: 1, fullName: "Aiko Tanaka", username: "aiko.tanaka", email: "aiko.tanaka@koribali.com", role: "admin", departmentId: 1 },
  { id: 2, fullName: "Kenji Watanabe", username: "kenji.w", email: "kenji.watanabe@koribali.com", role: "drafter", departmentId: 1 },
  { id: 3, fullName: "Yui Sato", username: "yui.sato", email: "yui.sato@koribali.com", role: "drafter", departmentId: 2 },
  { id: 4, fullName: "Hiro Nakamura", username: "hiro.n", email: "hiro.nakamura@koribali.com", role: "admin", departmentId: 2 },
  { id: 5, fullName: "Rina Kobayashi", username: "rina.k", email: "rina.kobayashi@koribali.com", role: "drafter", departmentId: 4 },
];

const ROLE_STYLE = {
  superadmin: "bg-purple-100 text-purple-700",
  admin: "bg-blue-100 text-blue-700",
  drafter: "bg-emerald-100 text-emerald-700",
};

const AVATAR_TONES = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

const initials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const avatarTone = (id) => AVATAR_TONES[id % AVATAR_TONES.length];

const emptyForm = { fullName: "", username: "", email: "", role: "drafter", departmentId: "" };

// ─── Form modal (create + edit) ────────────────────────────────────────────

function UserFormModal({ open, user, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(
        user
          ? {
              fullName: user.fullName,
              username: user.username,
              email: user.email,
              role: user.role,
              departmentId: String(user.departmentId),
            }
          : emptyForm
      );
      setErrors({});
    }
  }, [open, user]);

  if (!open) return null;

  const handleSave = () => {
    const nextErrors = {};
    if (!form.fullName.trim()) nextErrors.fullName = "Full name is required";
    if (!form.username.trim()) nextErrors.username = "Username is required";
    if (!form.email.trim()) nextErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Enter a valid email";
    if (!form.departmentId) nextErrors.departmentId = "Select a department";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    onSave({
      fullName: form.fullName.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      role: form.role,
      departmentId: Number(form.departmentId),
    });
  };

  const inputClass = (hasError) =>
    `w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-all ${
      hasError
        ? "border-red-400 bg-red-50/50 focus:ring-2 focus:ring-red-100"
        : "border-slate-200 focus:border-[#3399cc] focus:ring-2 focus:ring-[#3399cc]/15"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 320 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
          <h2 className="text-base font-bold text-slate-900">{user ? "Edit User" : "Add User"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Full Name</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              placeholder="e.g. Sora Yamamoto"
              className={inputClass(errors.fullName)}
            />
            {errors.fullName && <p className="mt-1 text-[11px] text-red-500">*{errors.fullName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                placeholder="sora.y"
                className={inputClass(errors.username)}
              />
              {errors.username && <p className="mt-1 text-[11px] text-red-500">*{errors.username}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className={`${inputClass(false)} appearance-none cursor-pointer`}
              >
                <option value="drafter">Drafter</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="sora.yamamoto@koribali.com"
              className={inputClass(errors.email)}
            />
            {errors.email && <p className="mt-1 text-[11px] text-red-500">*{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Department</label>
            <select
              value={form.departmentId}
              onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value }))}
              className={`${inputClass(errors.departmentId)} appearance-none cursor-pointer`}
            >
              <option value="" disabled>Select department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            {errors.departmentId && <p className="mt-1 text-[11px] text-red-500">*{errors.departmentId}</p>}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-slate-50 border-t border-slate-100 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-[#0d3b66] hover:bg-[#0a2c4c] transition-colors shadow-sm"
          >
            {user ? "Save Changes" : "Add User"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Department filter dropdown ────────────────────────────────────────────

function DepartmentFilterDropdown({ options, selected, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click — same idiom as ProfileDropdown in the header.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.key === selected) || options[0];

  return (
    <div className="relative shrink-0 w-full lg:w-auto" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={`w-full lg:w-64 h-10 flex items-center gap-2 pl-3.5 pr-3 rounded-xl border text-sm bg-white transition-all ${
          isOpen ? "border-[#3399cc] ring-4 ring-[#0d3b66]/10" : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="flex-1 text-left text-slate-700 font-medium truncate">{selectedOption.label}</span>
        <span className="text-[11px] font-bold text-[#3399cc] tabular-nums shrink-0">{selectedOption.count}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 mt-2 w-full lg:w-72 left-0 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden py-1.5"
          >
            {options.map((opt) => {
              const isActive = opt.key === selected;
              return (
                <button
                  key={opt.key}
                  onClick={() => {
                    onChange(opt.key);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm transition-colors ${
                    isActive ? "bg-[#0d3b66]/5 text-[#0d3b66] font-semibold" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    {isActive ? (
                      <Check className="w-4 h-4 text-[#3399cc] shrink-0" />
                    ) : (
                      <span className="w-4 shrink-0" />
                    )}
                    <span className="truncate">{opt.label}</span>
                  </span>
                  <span className={`text-xs font-semibold tabular-nums shrink-0 ${isActive ? "text-[#3399cc]" : "text-slate-400"}`}>
                    {opt.count}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Delete confirm ─────────────────────────────────────────────────────────

function DeleteUserModal({ user, onClose, onConfirm }) {
  if (!user) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 320 }}
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 p-6"
      >
        <div className="mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-red-100">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
        <h2 className="text-center font-bold text-sm text-slate-900 mb-2">Remove User?</h2>
        <p className="text-center text-slate-500 text-xs leading-relaxed mb-5">
          <span className="font-semibold text-slate-700">{user.fullName}</span> will lose access
          immediately. This action cannot be undone.
        </p>
        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 font-semibold text-xs sm:text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(user.id)}
            className="flex-1 py-2.5 font-semibold text-xs sm:text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Remove
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [formState, setFormState] = useState({ open: false, user: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // const [deptsData, usersData] = await Promise.all([getDepartments(), getUsers()]);
        await new Promise((r) => setTimeout(r, 300));
        setUsers(INITIAL_USERS);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const departmentById = useMemo(
    () => Object.fromEntries(DEPARTMENTS.map((d) => [d.id, d])),
    []
  );

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === "all" || user.departmentId.toString() === selectedDept;
    return matchesSearch && matchesDept;
  });

  const roleCounts = useMemo(() => {
    return users.reduce(
      (acc, u) => ({ ...acc, [u.role]: (acc[u.role] || 0) + 1 }),
      { admin: 0, drafter: 0 }
    );
  }, [users]);

  // Live per-department counts for the filter pills, so they track edits
  // (add/remove/reassign) instead of a number baked in at load time.
  const filterOptions = useMemo(() => {
    const deptCounts = {};
    users.forEach((u) => {
      deptCounts[u.departmentId] = (deptCounts[u.departmentId] || 0) + 1;
    });
    return [
      { key: "all", label: "All Departments", count: users.length },
      ...DEPARTMENTS.map((dept) => ({
        key: String(dept.id),
        label: dept.name,
        count: deptCounts[dept.id] || 0,
      })),
    ];
  }, [users]);

  const handleSave = (payload) => {
    if (formState.user) {
      setUsers((prev) => prev.map((u) => (u.id === formState.user.id ? { ...u, ...payload } : u)));
    } else {
      setUsers((prev) => [...prev, { id: Date.now(), ...payload }]);
    }
    setFormState({ open: false, user: null });
  };

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-full flex flex-col">
      <Helmet>
        <title>Users - KORI BALI</title>
      </Helmet>

      <div className="mx-6 2040:mx-[250px] hp:mx-2 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0d3b66] to-[#3399cc] flex items-center justify-center text-white shadow-sm">
                <Users className="w-5 h-5" />
              </span>
              User Management
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm">
              Manage system access, roles, and departmental assignments.
            </p>
          </div>

          <button
            onClick={() => setFormState({ open: true, user: null })}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0d3b66] text-white rounded-lg font-medium text-sm hover:bg-[#0a2c4c] transition-all shadow-sm"
          >
            <Plus className="w-4.5 h-4.5" />
            Add User
          </button>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-3.5">
            <p className="text-[11px] font-medium text-slate-500 mb-0.5">Total Users</p>
            <p className="text-xl font-bold text-slate-900 tabular-nums">{users.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-3.5">
            <p className="text-[11px] font-medium text-slate-500 mb-0.5">Admins</p>
            <p className="text-xl font-bold text-slate-900 tabular-nums">{roleCounts.admin}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-3.5">
            <p className="text-[11px] font-medium text-slate-500 mb-0.5">Drafters</p>
            <p className="text-xl font-bold text-slate-900 tabular-nums">{roleCounts.drafter}</p>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="bg-white p-4 rounded-t-2xl border border-b-0 border-slate-200 flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative w-full lg:w-96 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-[#0d3b66]/10 focus:border-[#3399cc] transition-all"
            />
          </div>

          <DepartmentFilterDropdown
            options={filterOptions}
            selected={selectedDept}
            onChange={setSelectedDept}
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-b-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Username</th>
                  <th className="px-6 py-4 font-semibold">Department</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-14 text-center text-slate-400 text-sm">
                      Loading users…
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-14">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Users className="w-8 h-8" />
                        <p className="text-sm">No users found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold ${avatarTone(user.id)}`}
                          >
                            {initials(user.fullName)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900">{user.fullName}</span>
                            <span className="text-xs text-slate-500">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">@{user.username}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {departmentById[user.departmentId]?.name || "No dept."}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${ROLE_STYLE[user.role]}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setFormState({ open: true, user })}
                            className="p-1.5 text-slate-400 hover:text-[#0d3b66] hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(user)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {formState.open && (
          <UserFormModal
            open={formState.open}
            user={formState.user}
            onClose={() => setFormState({ open: false, user: null })}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <DeleteUserModal
            user={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
