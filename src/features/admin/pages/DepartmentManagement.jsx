import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Users,
  Lock,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from "../services/departmentService";

// Mock data for initial UI — matches the shape the real
// /api/departments resource returns ({ id, code, name }), with a
// userCount joined in for display until the summary endpoint exists.
const INITIAL_DEPARTMENTS = [
  { id: 1, code: "YS", name: "Head Office", userCount: 14, createdAt: "2026-01-15T08:00:00Z" },
  { id: 2, code: "YSC", name: "Tokyo Sales Office", userCount: 9, createdAt: "2026-02-20T09:30:00Z" },
  { id: 3, code: "YSF", name: "Nagano Sales Office", userCount: 6, createdAt: "2026-03-10T14:15:00Z" },
  { id: 4, code: "YSG", name: "North Kanto Sales Office", userCount: 5, createdAt: "2026-04-02T11:00:00Z" },
  { id: 5, code: "YSJ", name: "Kyushu Branch", userCount: 4, createdAt: "2026-05-18T10:20:00Z" },
];

const emptyForm = { code: "", name: "" };

// ─── Form modal (create + edit) ────────────────────────────────────────────

function DepartmentFormModal({ open, department, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(department ? { code: department.code, name: department.name } : emptyForm);
      setErrors({});
    }
  }, [open, department]);

  if (!open) return null;

  const handleSave = () => {
    const nextErrors = {};
    if (!form.code.trim()) nextErrors.code = "Department code is required";
    if (!form.name.trim()) nextErrors.name = "Department name is required";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    onSave({ code: form.code.trim().toUpperCase(), name: form.name.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 320 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">
            {department ? "Edit Department" : "Add Department"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Department Code</label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              placeholder="e.g. YSK"
              className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-all uppercase placeholder:normal-case ${
                errors.code
                  ? "border-red-400 bg-red-50/50 focus:ring-2 focus:ring-red-100"
                  : "border-slate-200 focus:border-[#3399cc] focus:ring-2 focus:ring-[#3399cc]/15"
              }`}
            />
            {errors.code && <p className="mt-1 text-[11px] text-red-500">*{errors.code}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Department Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Kansai Sales Office"
              className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-all ${
                errors.name
                  ? "border-red-400 bg-red-50/50 focus:ring-2 focus:ring-red-100"
                  : "border-slate-200 focus:border-[#3399cc] focus:ring-2 focus:ring-[#3399cc]/15"
              }`}
            />
            {errors.name && <p className="mt-1 text-[11px] text-red-500">*{errors.name}</p>}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-slate-50 border-t border-slate-100">
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
            {department ? "Save Changes" : "Add Department"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Delete confirm ─────────────────────────────────────────────────────────

function DeleteDepartmentModal({ department, onClose, onConfirm }) {
  if (!department) return null;
  const blocked = department.userCount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 320 }}
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 p-6"
      >
        <div
          className={`mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-full ${
            blocked ? "bg-amber-100" : "bg-red-100"
          }`}
        >
          {blocked ? (
            <Lock className="w-6 h-6 text-amber-600" />
          ) : (
            <AlertCircle className="w-6 h-6 text-red-500" />
          )}
        </div>

        {blocked ? (
          <>
            <h2 className="text-center font-bold text-sm text-slate-900 mb-2">Can't Delete Department</h2>
            <p className="text-center text-slate-500 text-xs leading-relaxed mb-5">
              <span className="font-semibold text-slate-700">{department.name}</span> still has{" "}
              <span className="font-semibold text-slate-700">{department.userCount} user{department.userCount === 1 ? "" : "s"}</span>{" "}
              assigned to it. Reassign or remove them first to prevent orphaned accounts.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 font-semibold text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Got it
            </button>
          </>
        ) : (
          <>
            <h2 className="text-center font-bold text-sm text-slate-900 mb-2">Delete Department?</h2>
            <p className="text-center text-slate-500 text-xs leading-relaxed mb-5">
              This will permanently remove{" "}
              <span className="font-semibold text-slate-700">{department.name}</span>. This action
              cannot be undone.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 font-semibold text-xs sm:text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirm(department.id)}
                className="flex-1 py-2.5 font-semibold text-xs sm:text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [formState, setFormState] = useState({ open: false, department: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsLoading(true);
        // Uncomment when the summary (with userCount) is available:
        // const data = await getDepartments();
        // setDepartments(data);
        await new Promise((r) => setTimeout(r, 300));
        setDepartments(INITIAL_DEPARTMENTS);
      } catch (error) {
        console.error("Failed to fetch departments", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = useMemo(() => departments.reduce((sum, d) => sum + d.userCount, 0), [departments]);

  const handleSave = (payload) => {
    if (formState.department) {
      setDepartments((prev) =>
        prev.map((d) => (d.id === formState.department.id ? { ...d, ...payload } : d))
      );
    } else {
      setDepartments((prev) => [
        ...prev,
        { id: Date.now(), userCount: 0, createdAt: new Date().toISOString(), ...payload },
      ]);
    }
    setFormState({ open: false, department: null });
  };

  const handleDelete = (id) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-full flex flex-col">
      <Helmet>
        <title>Departments - KORI BALI</title>
      </Helmet>

      <div className="mx-6 2040:mx-[250px] hp:mx-2 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0d3b66] to-[#3399cc] flex items-center justify-center text-white shadow-sm">
                <Building2 className="w-5 h-5" />
              </span>
              Departments
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm">
              Manage company departments and organizational structure.
            </p>
          </div>

          <button
            onClick={() => setFormState({ open: true, department: null })}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0d3b66] text-white rounded-lg font-medium text-sm hover:bg-[#0a2c4c] transition-all shadow-sm"
          >
            <Plus className="w-4.5 h-4.5" />
            Add Department
          </button>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-3.5">
            <p className="text-[11px] font-medium text-slate-500 mb-0.5">Total Departments</p>
            <p className="text-xl font-bold text-slate-900 tabular-nums">{departments.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-3.5">
            <p className="text-[11px] font-medium text-slate-500 mb-0.5">Total Users</p>
            <p className="text-xl font-bold text-slate-900 tabular-nums">{totalUsers}</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-t-2xl border border-b-0 border-slate-200 flex items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d3b66]/20 focus:border-[#0d3b66] transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-b-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Department</th>
                  <th className="px-6 py-4 font-semibold w-28">Code</th>
                  <th className="px-6 py-4 font-semibold w-32">Users</th>
                  <th className="px-6 py-4 font-semibold w-40">Date Created</th>
                  <th className="px-6 py-4 font-semibold w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-14 text-center text-slate-400 text-sm">
                      Loading departments…
                    </td>
                  </tr>
                ) : filteredDepartments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-14">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Building2 className="w-8 h-8" />
                        <p className="text-sm">No departments found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDepartments.map((dept) => (
                    <motion.tr
                      key={dept.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">{dept.name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600 tracking-wide">
                          {dept.code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-slate-600">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {dept.userCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(dept.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setFormState({ open: true, department: dept })}
                            className="p-1.5 text-slate-400 hover:text-[#0d3b66] hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(dept)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
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
          <DepartmentFormModal
            open={formState.open}
            department={formState.department}
            onClose={() => setFormState({ open: false, department: null })}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <DeleteDepartmentModal
            department={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
