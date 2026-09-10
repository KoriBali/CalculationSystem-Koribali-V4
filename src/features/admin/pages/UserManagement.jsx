import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
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
  ChevronLeft,
  ChevronRight,
  Check,
  UserCog,
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

// Stable colour per user — deterministic hash so the same user always gets the
// same tone, regardless of whether `id` is a number or a UUID string.
const avatarTone = (id) => {
  const str = String(id ?? "");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return AVATAR_TONES[Math.abs(hash) % AVATAR_TONES.length];
};

const emptyForm = { fullName: "", username: "", email: "", role: "drafter", departmentId: "" };

// ─── Form modal (create + edit) ────────────────────────────────────────────

function FormSelect({ value, onChange, options, placeholder, hasError }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  // Calculate position of the portal dropdown relative to the trigger button
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const menuHeight = 220;
    const openBelow = spaceBelow >= menuHeight || spaceBelow >= spaceAbove;
    setDropdownStyle({
      position: "fixed",
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
      ...(openBelow
        ? { top: rect.bottom + 4 }
        : { bottom: window.innerHeight - rect.top + 4 }),
    });
  }, []);

  const handleOpen = () => {
    updatePosition();
    setIsOpen((v) => !v);
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on scroll/resize
  useEffect(() => {
    if (!isOpen) return;
    const close = () => setIsOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  return (
    <div className="relative w-full">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-md md:rounded-lg outline-none transition-all text-xs md:text-sm border text-left flex justify-between items-center ${
          hasError
            ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
            : isOpen
              ? "border-[#3399cc] bg-white ring-1 ring-[#3399cc]"
              : "border-gray-300 bg-white hover:border-[#3399cc]"
        } ${!selectedOption ? "text-slate-400" : "text-slate-900"}`}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""} text-gray-400`} />
      </button>

      <AnimatePresence>
        {isOpen && createPortal(
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            style={dropdownStyle}
            className="bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden"
          >
            <div className="max-h-[200px] overflow-y-auto py-1">
              {options.map((opt) => {
                const isActive = String(value) === String(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                  >
                    <span className={`text-xs md:text-sm ${isActive ? "text-[#0d3b66] font-bold" : "text-slate-700 font-medium group-hover:text-slate-900"}`}>
                      {opt.label}
                    </span>
                    {isActive && <Check className="w-4 h-4 text-[#0d3b66]" />}
                  </button>
                );
              })}
            </div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>
    </div>
  );
}

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
    `w-full px-3 md:px-4 py-2 md:py-2.5 rounded-md md:rounded-lg outline-none transition-all text-xs md:text-sm border ${
      hasError
        ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
        : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
    }`;

  const labelClass = "block text-gray-700 mb-1 md:mb-2 text-xs md:text-sm font-medium";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4 transition-opacity">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 320 }}
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-6 py-5 flex items-center justify-between shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-2 text-white">
            {user ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            <h2 className="text-base font-bold">{user ? "Edit User Details" : "Add New User"}</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <p className="text-slate-600 mb-6 text-sm">
            Please fill in the user details below. Make sure the email and username are unique across the system.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 md:gap-y-8">
            <div className="relative md:col-span-2">
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                placeholder="e.g. Sora Yamamoto"
                className={inputClass(errors.fullName)}
              />
              {errors.fullName && (
                <div className="absolute left-0 -bottom-4 md:-bottom-5 flex items-center gap-1 text-[9px] md:text-[11px] text-red-500">
                  <span>*{errors.fullName}</span>
                </div>
              )}
            </div>

            <div className="relative">
              <label className={labelClass}>Username</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                placeholder="sora.y"
                className={inputClass(errors.username)}
              />
              {errors.username && (
                <div className="absolute left-0 -bottom-4 md:-bottom-5 flex items-center gap-1 text-[9px] md:text-[11px] text-red-500">
                  <span>*{errors.username}</span>
                </div>
              )}
            </div>

            <div className="relative">
              <label className={labelClass}>Role</label>
              <FormSelect
                value={form.role}
                onChange={(val) => setForm((f) => ({ ...f, role: val }))}
                options={[
                  { value: "drafter", label: "Drafter" },
                  { value: "admin", label: "Admin" },
                ]}
                placeholder="Select role"
                hasError={false}
              />
            </div>

            <div className="relative md:col-span-2">
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="sora.yamamoto@koribali.com"
                className={inputClass(errors.email)}
              />
              {errors.email && (
                <div className="absolute left-0 -bottom-4 md:-bottom-5 flex items-center gap-1 text-[9px] md:text-[11px] text-red-500">
                  <span>*{errors.email}</span>
                </div>
              )}
            </div>

            <div className="relative md:col-span-2">
              <label className={labelClass}>Department</label>
              <FormSelect
                value={form.departmentId}
                onChange={(val) => setForm((f) => ({ ...f, departmentId: val }))}
                options={DEPARTMENTS.map((dept) => ({ value: dept.id, label: dept.name }))}
                placeholder="Select department"
                hasError={errors.departmentId}
              />
              {errors.departmentId && (
                <div className="absolute left-0 -bottom-4 md:-bottom-5 flex items-center gap-1 text-[9px] md:text-[11px] text-red-500">
                  <span>*{errors.departmentId}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-4 sm:px-6 py-4 sm:py-5 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-end gap-3 rounded-b-2xl shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-sm bg-[#eef2f6] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:bg-[#e2e8f0] hover:ring-[#b8c2d1] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110 shadow-sm transition-all"
          >
            {user ? "Save Changes" : "Add User"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Department filter dropdown ────────────────────────────────────────────

function CountBadge({ count, isActive }) {
  if (count === 0) {
    return (
      <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-[11px] font-semibold tabular-nums bg-slate-100 text-slate-400">
        0
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-[11px] font-bold tabular-nums transition-colors ${
      isActive
        ? "bg-[#0d3b66] text-white"
        : "bg-slate-100 text-slate-500"
    }`}>
      {count}
    </span>
  );
}

function CustomFilterDropdown({ icon: Icon, options, selected, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    <div className="relative shrink-0 w-full sm:w-[210px]" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={`w-full h-10 flex items-center gap-2 pl-3.5 pr-3 rounded-xl border text-sm bg-white transition-all outline-none ${
          isOpen ? "border-[#3399cc] ring-1 ring-[#3399cc]" : "border-slate-200 hover:border-slate-300 focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
        }`}
      >
        <Icon className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="flex-1 text-left text-slate-700 font-medium truncate">{selectedOption.label}</span>
        <CountBadge count={selectedOption.count} isActive={true} />
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 mt-2 w-full sm:w-auto sm:min-w-[220px] left-0 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden whitespace-nowrap"
          >
            {/* "All" option — visually separated */}
            {options.slice(0, 1).map((opt) => {
              const isActive = opt.key === selected;
              return (
                <button
                  key={opt.key}
                  onClick={() => { onChange(opt.key); setIsOpen(false); }}
                  className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm transition-colors border-b border-slate-100 ${
                    isActive ? "bg-[#0d3b66]/5 text-[#0d3b66] font-semibold" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    {isActive
                      ? <Check className="w-4 h-4 text-[#3399cc] shrink-0" />
                      : <span className="w-4 shrink-0" />
                    }
                    <span className="truncate">{opt.label}</span>
                  </span>
                  <CountBadge count={opt.count} isActive={isActive} />
                </button>
              );
            })}

            {/* Options */}
            <div className="py-1">
              {options.slice(1).map((opt) => {
                const isActive = opt.key === selected;
                return (
                  <button
                    key={opt.key}
                    onClick={() => { onChange(opt.key); setIsOpen(false); }}
                    className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm transition-colors ${
                      isActive ? "bg-[#0d3b66]/5 text-[#0d3b66] font-semibold" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      {isActive
                        ? <Check className="w-4 h-4 text-[#3399cc] shrink-0" />
                        : <span className="w-4 shrink-0" />
                      }
                      <span className="truncate">{opt.label}</span>
                    </span>
                    <CountBadge count={opt.count} isActive={isActive} />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Delete confirm ─────────────────────────────────────────────────────────

function DeleteUserModal({ user, onClose, onConfirm }) {
  return (
    <AnimatePresence>
      {!!user && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-xl w-full max-w-xs sm:max-w-md border border-gray-200"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mx-auto mb-3 flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-red-100">
                <Trash2 className="w-5 h-5 sm:w-8 sm:h-8 text-red-500" />
              </div>
              
              <h2 id="modal-title" className="text-center font-bold text-sm sm:text-base text-gray-900 mb-1 sm:mb-2">
                Remove User?
              </h2>
              
              <p className="text-center text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">
                <strong className="font-semibold">{user.fullName}</strong> will lose access immediately. This action cannot be undone.
              </p>
              
              <div className="flex gap-2 sm:gap-3 w-full">
                <button
                  onClick={onClose}
                  className="flex-1 py-2 sm:py-3 font-bold text-xs sm:text-sm bg-slate-100 text-slate-600 rounded-md sm:rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onConfirm(user.id)}
                  className="flex-1 py-2 sm:py-3 font-bold text-xs sm:text-sm bg-red-500 text-white rounded-md sm:rounded-lg hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function PaginationDropdown({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={`h-8 flex items-center justify-between gap-1.5 pl-3 pr-2 rounded-lg border text-[13px] bg-white transition-all outline-none font-medium text-slate-700 min-w-[64px] ${
          isOpen ? "border-[#3399cc] ring-1 ring-[#3399cc]" : "border-slate-200 hover:border-slate-300 focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
        }`}
      >
        <span>{value}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-1.5 z-20 w-auto min-w-[90px] left-0 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden py-1"
          >
            {options.map((opt) => {
              const isActive = opt === value;
              return (
                <button
                  key={opt}
                  onClick={() => { onChange(opt); setIsOpen(false); }}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-[13px] transition-colors ${
                    isActive ? "bg-[#0d3b66]/5 text-[#0d3b66] font-semibold" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    {isActive
                      ? <Check className="w-3.5 h-3.5 text-[#3399cc] shrink-0" />
                      : <span className="w-3.5 shrink-0" />
                    }
                    <span>{opt}</span>
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

// ─── Page ───────────────────────────────────────────────────────────────────

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formState, setFormState] = useState({ open: false, user: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const PAGE_SIZE_OPTIONS = [10, 25, 50];

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

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
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesDept && matchesRole;
  });

  // Reset to page 1 whenever the filter/search changes
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pagedUsers = filteredUsers.slice((safePage - 1) * pageSize, safePage * pageSize);
  const rangeStart = filteredUsers.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(safePage * pageSize, filteredUsers.length);

  const handleFilterChange = (dept) => {
    setSelectedDept(dept);
    setCurrentPage(1);
  };
  const handleRoleFilterChange = (role) => {
    setSelectedRole(role);
    setCurrentPage(1);
  };
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Live per-department counts for the filter pills, so they track edits
  // (add/remove/reassign) instead of a number baked in at load time.
  const filterOptions = useMemo(() => {
    // Only apply non-department filters (search & role) to get accurate counts for the department dropdown
    const preFilteredForDept = users.filter((user) => {
      const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()) || user.username.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === "all" || user.role === selectedRole;
      return matchesSearch && matchesRole;
    });

    const deptCounts = {};
    preFilteredForDept.forEach((u) => {
      deptCounts[u.departmentId] = (deptCounts[u.departmentId] || 0) + 1;
    });
    return [
      { key: "all", label: "All Departments", count: preFilteredForDept.length },
      ...DEPARTMENTS.map((dept) => ({
        key: String(dept.id),
        label: dept.name,
        count: deptCounts[dept.id] || 0,
      })),
    ];
  }, [users, searchTerm, selectedRole]);

  // Live per-role counts
  const roleFilterOptions = useMemo(() => {
    // Only apply non-role filters (search & dept) to get accurate counts for the role dropdown
    const preFilteredForRole = users.filter((user) => {
      const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()) || user.username.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = selectedDept === "all" || user.departmentId.toString() === selectedDept;
      return matchesSearch && matchesDept;
    });

    const roleCounts = {};
    preFilteredForRole.forEach((u) => {
      roleCounts[u.role] = (roleCounts[u.role] || 0) + 1;
    });
    return [
      { key: "all", label: "All Roles", count: preFilteredForRole.length },
      { key: "admin", label: "Admin", count: roleCounts["admin"] || 0 },
      { key: "drafter", label: "Drafter", count: roleCounts["drafter"] || 0 },
    ];
  }, [users, searchTerm, selectedDept]);

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

      <div className="mx-auto w-full max-w-7xl px-6 hp:px-3 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
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

        {/* Search + Filter */}
        <div className="bg-white p-4 rounded-t-2xl border border-b-0 border-slate-200 flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap items-stretch md:items-center gap-3">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or username..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc] transition-all"
            />
          </div>

          <CustomFilterDropdown
            icon={Building2}
            options={filterOptions}
            selected={selectedDept}
            onChange={handleFilterChange}
          />
          <CustomFilterDropdown
            icon={UserCog}
            options={roleFilterOptions}
            selected={selectedRole}
            onChange={handleRoleFilterChange}
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-b-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm table-fixed min-w-[720px]">
              <colgroup>
                <col className="w-[32%]" />
                <col className="w-[18%]" />
                <col className="w-[24%]" />
                <col className="w-[14%]" />
                <col className="w-[112px]" />
              </colgroup>
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Username</th>
                  <th className="px-6 py-4 font-semibold">Department</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-14 text-center text-slate-400 text-sm">
                      Loading users…
                    </td>
                  </tr>
                ) : pagedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-14">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Users className="w-8 h-8" />
                        <p className="text-sm">No users found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pagedUsers.map((user) => (
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
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-slate-900 truncate">{user.fullName}</span>
                            <span className="text-xs text-slate-500 truncate">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700 truncate">{user.username}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center max-w-full truncate px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
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

          {/* Pagination footer — only shown when there's something to page */}
          {!isLoading && filteredUsers.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-t border-slate-200 bg-slate-50/60">
              {/* Left: rows-per-page selector + range info */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-[13px] text-slate-500 whitespace-nowrap">
                  Rows per page:
                  <PaginationDropdown
                    options={PAGE_SIZE_OPTIONS}
                    value={pageSize}
                    onChange={handlePageSizeChange}
                  />
                </label>
                <span className="text-[13px] text-slate-500 tabular-nums">
                  {rangeStart}–{rangeEnd} of {filteredUsers.length}
                </span>
              </div>

              {/* Right: page navigation */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`flex items-center justify-center w-8 h-8 rounded-lg text-[13px] font-semibold transition-all ${
                      page === safePage
                        ? "bg-[#0d3b66] text-white shadow-sm"
                        : "border border-slate-200 text-slate-500 hover:bg-white hover:border-slate-300"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
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
