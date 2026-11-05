import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
// eslint-disable-next-line no-unused-vars -- used as <motion.*> in JSX
import { motion } from "framer-motion";
import { Plus, Inbox, SearchX, Eye, Trash2 } from "lucide-react";
import RequestFilterBar from "../../calculations/components/requests/RequestFilterBar";
import RequestPagination from "../../calculations/components/requests/RequestPagination";
import RequestStatusChip from "../../calculations/components/requests/RequestStatusChip";
import RequestStatusGuide from "../../calculations/components/requests/RequestStatusGuide";
import ConfirmDeleteRequestModal from "../../calculations/components/modals/ConfirmDeleteRequestModal";
import { ToastModal } from "../../calculations/components/modals/ToastModal";
import {
  deleteRequest as deleteRequestApi,
  getRequests,
  getRequestById,
  getRequestAssignments,
} from "../../calculations/services/requestService";
import {
  deleteRequest as deleteRequestLocal,
  getAllRequests,
} from "../../calculations/data/requestStore";
import { getUser, isGuestUser } from "../../../utils/auth";
import { getUsers } from "../../admin/services/userService";
import api from "../../../config/api";
import {
  statusesForTab,
  DISCIPLINES,
  CLASSIFICATIONS,
  REQUEST_TYPES,
  SORT_OPTIONS,
  describeRequest,
  sortRequests,
  describeDue,
  formatDate,
  timeAgo,
} from "../../calculations/utils/requestStatus";
import {
  EMPTY_DATE_RANGE,
  matchesDateRange,
  isRangeActive,
} from "../../calculations/utils/requestDateFilters";
import {
  SEARCH_FIELDS,
  matchesField,
  matchesQuickSearch,
} from "../../calculations/utils/requestSearch";

// Coloured left edge (on the frozen No. cell) for urgent rows.
const ROW_ACCENT = {
  overdue: "shadow-[inset_3px_0_0_0_#ef4444]",
  soon: "shadow-[inset_3px_0_0_0_#f59e0b]",
};

const rowAccent = (r) =>
  ROW_ACCENT[describeDue(r, { closed: r.status === "cleared" || r.status === "cancelled" }).tone];

// No. + Project are frozen on the left while the table scrolls sideways.
const NO_COL = "w-[72px] min-w-[72px] max-w-[72px] py-4 pl-6 pr-3";
const STICKY_NO = "sticky left-0 z-10";
const STICKY_PROJECT =
  "sticky left-[72px] z-10 shadow-[inset_-1px_0_0_0_#e2e8f0]";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

const isUserAdminDept = (user) => {
  if (!user) return false;
  const role = String(user.role || "").toLowerCase();
  return (
    role === "admin_department" ||
    role === "superadmin" ||
    role === "admin"
  );
};

const isUserCreator = (r, user) => {
  if (!r || !user) return false;
  const uId = user.id ? String(user.id) : "";
  const uFullName = (user.fullName || "").toLowerCase().trim();
  const uName = (user.name || "").toLowerCase().trim();
  const uUsername = (user.username || "").toLowerCase().trim();

  const creatorId = String(
    r.created_by_user_id ||
      r.createdByUserId ||
      r.created_by ||
      r.creator?.id ||
      r.creatorId ||
      "",
  );
  if (uId && creatorId && uId === creatorId) return true;

  const creatorName = (
    r.createdByName ||
    r.createdBy ||
    r.creator?.fullName ||
    r.creator?.name ||
    ""
  ).toLowerCase().trim();

  if (uFullName && creatorName && uFullName === creatorName) return true;
  if (uName && creatorName && uName === creatorName) return true;
  if (uUsername && creatorName && uUsername === creatorName) return true;

  return false;
};

const canDeleteRequest = (r, user) => {
  if (!r) return false;
  const s = String(r.status || r.view?.statusKey || "").toLowerCase();
  if (
    ["diajukan", "submitted", "clear", "cleared", "cancel", "cancelled"].includes(
      s,
    )
  ) {
    return false;
  }
  if (isGuestUser()) return true;
  if (isUserAdminDept(user)) return true;
  return isUserCreator(r, user);
};

const ROW_HOVER = "hover:bg-[#f2f7fd]";
const STICKY_ROW_HOVER = "group-hover:bg-[#f2f7fd]";

const DUE_LEGEND = [
  { label: "Overdue", color: "bg-[#ef4444]" },
  { label: "Due within 3 days", color: "bg-[#f59e0b]" },
];

const DueLegend = () => (
  <div className="flex items-center gap-4 text-xs text-slate-500">
    <span className="hp:hidden">Row edge:</span>
    {DUE_LEGEND.map((item) => (
      <span key={item.label} className="inline-flex items-center gap-1.5">
        <span className={`w-[3px] h-3.5 rounded-full ${item.color}`} />
        {item.label}
      </span>
    ))}
  </div>
);

const DUE_TONE = {
  overdue: "text-red-600",
  soon: "text-amber-600",
  normal: "text-slate-700",
  none: "text-slate-400",
};

const CELL = "px-4 py-4 first:pl-6 last:pr-6";

const requestTypeLabel = (key) =>
  REQUEST_TYPES.find((t) => t.key === key)?.label ?? key;
const classificationLabel = (key) =>
  CLASSIFICATIONS.find((c) => c.key === key)?.label ?? key;

const WORK_TYPE_LABELS = {
  both: "Calculation and drawing",
  drawing: "Drawing",
  calc: "Calculation",
};

const getRequestWorkType = (r) => {
  if (!r) return "calc";
  const dt = r.designType || r.design_type;
  if (
    dt === "drawing_calculation" ||
    dt === "both" ||
    (r.workTypes?.calc && r.workTypes?.drawing)
  ) {
    return "both";
  }
  const isCalc =
    dt === "calculation" ||
    Boolean(r.workTypes?.calc) ||
    r.items?.some((i) => i.work_type === "calc") ||
    r.cases?.some((c) => c.workType === "calc");
  const isDrawing =
    dt === "drawing" ||
    Boolean(r.workTypes?.drawing) ||
    r.items?.some((i) => i.work_type === "drawing") ||
    r.cases?.some((c) => c.workType === "drawing");

  if (isCalc && isDrawing) return "both";
  if (isDrawing) return "drawing";
  return "calc";
};

const EMPTY_FILTERS = {
  line: "all",
  work_type: "all",
  status: "all",
  classification: "all",
  requestType: "all",
  ...Object.fromEntries(
    SEARCH_FIELDS.filter((f) => !f.mainOnly).map((f) => [f.key, ""]),
  ),
  requestDate: EMPTY_DATE_RANGE,
  dueDate: EMPTY_DATE_RANGE,
  completedDate: EMPTY_DATE_RANGE,
};

const SELECT_FILTERS = {
  line: (r, v) => r.brandLine === v,
  work_type: (r, v) => getRequestWorkType(r) === v,
  status: (r, v) => r.view?.key === v,
  classification: (r, v) => r.requestClassification === v,
  requestType: (r, v) => r.requestType === v,
};

function matchesFilters(r, filters, skip = null) {
  for (const [key, match] of Object.entries(SELECT_FILTERS)) {
    if (key !== skip && filters[key] !== "all" && !match(r, filters[key])) {
      return false;
    }
  }
  return (
    SEARCH_FIELDS.every(
      (f) => f.mainOnly || matchesField(r, f.key, filters[f.key]),
    ) &&
    matchesDateRange(r.requestDate, filters.requestDate) &&
    matchesDateRange(r.dueDate, filters.dueDate) &&
    matchesDateRange(r.closedAt, filters.completedDate)
  );
}

export default function ProjectDatabasePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS });
  const [sortBy, setSortBy] = useState("updated");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  const [currentUser, setCurrentUser] = useState(() => getUser());

  useEffect(() => {
    sessionStorage.removeItem("projectType");
    setCurrentUser(getUser());
  }, []);

  const [rawRequests, setRawRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingRequest, setDeletingRequest] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  // Fetch all requests across department (using same endpoint as tab All)
  useEffect(() => {
    let isMounted = true;
    async function fetchRequests() {
      setIsLoading(true);

      // Guest User: read from local store
      if (isGuestUser()) {
        const guestItems = getAllRequests();
        if (isMounted) {
          setRawRequests(guestItems);
          setIsLoading(false);
        }
        return;
      }

      // Registered User: read live from API Gateway
      try {
        const [usersRes, assignableRes, reqsRes] = await Promise.all([
          getUsers().catch(() => []),
          api
            .get("/api/assignable-users")
            .then((r) => r?.data?.data || r?.data || [])
            .catch(() => []),
          getRequests(),
        ]);

        const items = Array.isArray(reqsRes)
          ? reqsRes
          : reqsRes?.items || reqsRes?.data || [];

        // Parallel resolution of details and assignments for PIC and accurate metadata
        const detailsList = await Promise.all(
          items.map(async (s) => {
            if (!s?.id) return null;
            const [detail, assignments] = await Promise.all([
              getRequestById(s.id).catch(() => null),
              getRequestAssignments(s.id).catch(() => []),
            ]);
            return {
              ...(detail || {}),
              serverAssignments: Array.isArray(assignments)
                ? assignments
                : assignments?.items || assignments?.data || [],
            };
          }),
        );

        const curr = getUser();
        const userMap = new Map();
        if (curr?.id) {
          userMap.set(String(curr.id), curr.fullName || curr.name);
        }
        const allUsers = [
          ...(Array.isArray(usersRes) ? usersRes : usersRes?.items || []),
          ...(Array.isArray(assignableRes)
            ? assignableRes
            : assignableRes?.items || []),
        ];
        allUsers.forEach((u) => {
          if (u?.id) {
            userMap.set(String(u.id), u.fullName || u.name || u.email);
          }
        });

        const normalized = items.map((s, idx) => {
          const detail = detailsList[idx] || {};
          const full = { ...s, ...detail };

          const createdByUserId =
            full.created_by_user_id || full.createdByUserId || full.created_by;

          const resolvedCreatedByName =
            full.createdByName ||
            full.creator?.fullName ||
            full.creator?.name ||
            (createdByUserId && userMap.get(String(createdByUserId))) ||
            (createdByUserId &&
            String(createdByUserId) === String(curr?.id)
              ? curr?.fullName || curr?.name
              : null) ||
            null;

          const companyName =
            full.requestingDepartmentName ||
            full.requesting_department_name ||
            full.companyName ||
            "";

          const pic =
            full.sharedDetails?.requesterPicName ||
            full.shared_details?.requester_pic_name ||
            full.requesterPicName ||
            full.picName ||
            "";

          const receiptNo =
            full.ysDetails?.receiptNo ||
            full.ys_details?.receipt_no ||
            full.receiptNo ||
            full.receipt_no ||
            full.receptionNo ||
            full.fields?.receptionNo ||
            full.fields?.receiptNo ||
            "";

          const dt = full.designType || full.design_type || "calculation";
          const workTypes = {
            calc: dt === "drawing_calculation" || dt === "calculation",
            drawing: dt === "drawing_calculation" || dt === "drawing",
          };

          const rawAssignments = [
            ...(Array.isArray(full.serverAssignments) ? full.serverAssignments : []),
            ...(Array.isArray(full.assignments) ? full.assignments : []),
            ...(Array.isArray(full.assignments?.items) ? full.assignments.items : []),
          ];

          return {
            ...full,
            pjNo: full.pjNo || full.pj_no || "",
            requestNo: full.requestNo || full.request_no || "",
            subject: full.subject || "",
            companyName,
            receiptNo,
            requesterPicName: pic,
            picName: pic,
            createdByName: resolvedCreatedByName,
            createdByUserId,
            created_by_user_id: createdByUserId,
            serverAssignments: full.serverAssignments || [],
            assignments: rawAssignments,
            members: Array.isArray(full.members) ? full.members : [],
            requestType: full.requestType || full.request_type || "general",
            requestClassification:
              full.requestClassification || full.request_classification || "new",
            requestDate: full.requestDate || full.request_date || "",
            dueDate: full.dueDate || full.due_date || "",
            status: full.status || "in_progress",
            designType: dt,
            workTypes,
            cases: Array.isArray(full.cases) ? full.cases : [],
          };
        });

        if (isMounted) {
          setRawRequests(normalized);
        }
      } catch (err) {
        console.warn("[ProjectDatabasePage] Fetch failed:", err?.message);
        if (isMounted) {
          setRawRequests([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    fetchRequests();
    return () => {
      isMounted = false;
    };
  }, []);

  const requests = useMemo(
    () =>
      rawRequests
        .filter(Boolean)
        .map((r) => ({
          ...r,
          view: describeRequest(r),
        })),
    [rawRequests],
  );

  const handleConfirmDelete = async (reqToDelete) => {
    if (!reqToDelete) return;

    if (!canDeleteRequest(reqToDelete, currentUser)) {
      setToast({
        message:
          "You do not have permission to delete this project. Only the project creator or an admin can delete it.",
        type: "danger",
      });
      setDeletingRequest(null);
      return;
    }

    setIsDeleting(true);
    const reqLabel =
      reqToDelete.requestNo ||
      reqToDelete.fields?.requestNo ||
      reqToDelete.pjNo ||
      "Request";

    if (!isGuestUser()) {
      try {
        await deleteRequestApi(reqToDelete.id);
      } catch (err) {
        console.warn("[ProjectDatabasePage] Delete failed:", err?.message);
      }
    }

    deleteRequestLocal(reqToDelete.id);
    setRawRequests((prev) => prev.filter((r) => r.id !== reqToDelete.id));
    setIsDeleting(false);
    setDeletingRequest(null);
    setToast({
      message: `${reqLabel} has been permanently deleted.`,
      type: "success",
    });
  };

  const setFilter = (key) => (value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setPage(1);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setPage(1);
  };

  const term = searchTerm.trim();
  const matchesSearch = (r) => matchesQuickSearch(r, term);

  const visibleRows = sortRequests(
    requests.filter(
      (r) => matchesSearch(r) && matchesFilters(r, filters),
    ),
    "all",
    sortBy,
  );

  const totalPages = Math.max(1, Math.ceil(visibleRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const firstIndex = (safePage - 1) * pageSize;
  const pagedRows = visibleRows.slice(firstIndex, firstIndex + pageSize);

  const optionsFor = (options) => [{ key: "all", label: "All" }, ...options];

  const quickFilters = [
    {
      key: "work_type",
      prefix: "Work Type",
      options: optionsFor([
        ...DISCIPLINES,
        { key: "both", label: "Calculation & Drawing" },
      ]),
    },
    {
      key: "status",
      prefix: "Status",
      options: optionsFor(statusesForTab("all")),
    },
  ].map((f) => ({ ...f, value: filters[f.key], onChange: setFilter(f.key) }));

  const advancedFilters = [
    ...SEARCH_FIELDS.filter((f) => !f.mainOnly).map((f) => ({
      key: f.key,
      type: "text",
      label: f.label,
      placeholder: f.placeholder,
      colSpan: f.colSpan,
    })),
    {
      key: "classification",
      type: "select",
      label: "Classification",
      options: optionsFor(CLASSIFICATIONS),
    },
    {
      key: "requestType",
      type: "select",
      label: "Request type",
      options: optionsFor(REQUEST_TYPES),
    },
    {
      key: "requestDate",
      type: "date",
      label: "Request date",
    },
    {
      key: "dueDate",
      type: "date",
      label: "Request Due date",
    },
  ].map((f) => ({ ...f, value: filters[f.key], onChange: setFilter(f.key) }));

  const isAdvancedActive = (f) =>
    !f.hidden &&
    (f.type === "date"
      ? isRangeActive(f.value)
      : f.type === "text"
        ? f.value.trim() !== ""
        : f.value !== "all");

  const activeAdvanced = advancedFilters.filter(isAdvancedActive);
  const isFiltered =
    !!term || JSON.stringify(filters) !== JSON.stringify(EMPTY_FILTERS);

  const handleReset = () => {
    setSearchTerm("");
    setFilters({ ...EMPTY_FILTERS });
    setPage(1);
  };

  const handleOpenRequest = (r) => {
    navigate(`/projects/detail/${r.id}`);
  };

  const columns = [
    {
      key: "no",
      label: "No.",
      base: NO_COL,
      th: `${STICKY_NO} bg-slate-50`,
      td: (r) =>
        `${STICKY_NO} bg-white ${STICKY_ROW_HOVER} transition-colors text-slate-500 tabular-nums ${rowAccent(r) ?? ""}`,
      render: (r, position) => position,
    },
    {
      key: "project",
      label: "Project no.",
      th: `${STICKY_PROJECT} bg-slate-50 w-[1%] whitespace-nowrap`,
      td: () =>
        `${STICKY_PROJECT} bg-white ${STICKY_ROW_HOVER} transition-colors whitespace-nowrap`,
      render: (r) => (
        <span className="font-semibold text-slate-900 tabular-nums">
          {r.pjNo || r.fields?.projectNo || "—"}
        </span>
      ),
    },
    {
      key: "subject",
      label: "Project name",
      th: "min-w-[220px]",
      td: () => "text-slate-700 break-words",
      render: (r) => r.subject || r.fields?.projectName || "—",
    },
    {
      key: "requestNo",
      label: "Request no.",
      th: "w-[1%] whitespace-nowrap",
      td: () => "whitespace-nowrap text-slate-700 tabular-nums",
      render: (r) => r.requestNo || r.fields?.requestNo || "—",
    },
    {
      key: "client",
      label: "Company name",
      th: "min-w-[160px]",
      td: () => "text-slate-600 break-words",
      render: (r) => r.companyName || "—",
    },
    {
      key: "classification",
      label: "Classification",
      th: "w-[1%]",
      td: () => "whitespace-nowrap text-slate-700",
      render: (r) => classificationLabel(r.requestClassification || "new"),
    },
    {
      key: "receiptNo",
      label: "Receipt no.",
      th: "w-[1%] whitespace-nowrap",
      td: () => "whitespace-nowrap text-slate-700 tabular-nums",
      render: (r) => r.receiptNo || "—",
    },
    {
      key: "japanPic",
      label: "PIC",
      th: "whitespace-nowrap",
      td: () => "text-slate-600 whitespace-nowrap",
      render: (r) => r.requesterPicName || "—",
    },
    {
      key: "workType",
      label: "Work Type",
      th: "w-[1%]",
      td: () => "whitespace-nowrap text-slate-700",
      render: (r) => {
        const wt = getRequestWorkType(r);
        return WORK_TYPE_LABELS[wt] || "Calculation";
      },
    },
    {
      key: "requestType",
      label: "Request type",
      th: "w-[1%]",
      td: () => "whitespace-nowrap text-slate-700",
      render: (r) => requestTypeLabel(r.requestType || r.fields?.requestType || "general"),
    },
    {
      key: "status",
      label: "Status",
      th: "w-[1%]",
      td: () => "",
      render: (r) => (
        <RequestStatusChip
          statusKey={r.view?.key}
          label={r.view?.label}
          withHint
        />
      ),
    },
    {
      key: "progress",
      label: "Progress",
      th: "min-w-[220px]",
      td: () => "text-slate-700 break-words",
      render: (r) => r.view?.detail || "—",
    },
    {
      key: "requestDate",
      label: "Request date",
      th: "w-[1%]",
      td: () => "whitespace-nowrap text-slate-700",
      render: (r) => formatDate(r.requestDate) || "—",
    },
    {
      key: "due",
      label: "Request due date",
      th: "w-[1%]",
      td: () => "whitespace-nowrap",
      render: (r) => {
        const due = describeDue(r, { closed: r.status === "cleared" || r.status === "cancelled" });
        const text = due?.text && due.text !== "—" ? due.text : formatDate(r.dueDate);
        return (
          <>
            <span className={`block ${DUE_TONE[due?.tone || "normal"]}`}>
              {text || "—"}
            </span>
            {due?.hint && text && (
              <span
                className={`block mt-0.5 text-xs font-medium ${DUE_TONE[due.tone]}`}
              >
                {due.hint}
              </span>
            )}
          </>
        );
      },
    },
    {
      key: "submittedBy",
      label: "Submitted by",
      th: "w-[1%]",
      td: () => "whitespace-nowrap text-slate-700",
      render: (r) => r.submittedByName || "—",
    },
    {
      key: "createdBy",
      label: "Created by",
      th: "w-[1%]",
      td: () => "whitespace-nowrap text-slate-700",
      render: (r) => r.createdByName || "—",
    },
    {
      key: "updated",
      label: "Updated",
      th: "w-[1%]",
      td: () => "whitespace-nowrap text-slate-500",
      render: (r) => timeAgo(r.updatedAt) || "—",
    },
    {
      key: "action",
      label: "Action",
      th: "w-[1%] text-right",
      td: () => "text-right",
      render: (r) => {
        const isDeletable = canDeleteRequest(r, currentUser);
        return (
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => handleOpenRequest(r)}
              aria-label={`Open ${r.pjNo || ""} ${r.requestNo || r.subject || ""}`.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hp:rounded-md text-xs font-semibold whitespace-nowrap bg-blue-50 text-[#0d3b66] ring-1 ring-inset ring-blue-200 group-hover:bg-[#0d3b66] group-hover:text-white group-hover:ring-[#0d3b66] hover:bg-[#0a2c4c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3399cc]/50 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              Open
            </button>
            {isDeletable && (
              <>
                <span className="text-slate-300 select-none px-0.5">|</span>
                <button
                  type="button"
                  onClick={() => setDeletingRequest(r)}
                  title="Delete request"
                  aria-label={`Delete ${r.requestNo || r.pjNo || ""}`.trim()}
                  className="inline-flex items-center justify-center p-1.5 rounded-lg hp:rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 ring-1 ring-inset ring-transparent hover:ring-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-full flex flex-col">
      <Helmet>
        <title>Project Database - KORI BALI</title>
      </Helmet>

      <div className="mx-auto w-full max-w-[2800px] px-6 hp:px-3 lg:px-4 2xl:px-8 pt-0 pb-4 sm:pb-6 lg:pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Project Database
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm">
              Search and view all calculation and drawing projects across your department.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <RequestStatusGuide />
            <button
              onClick={() => navigate("/projects/new")}
              className="flex shrink-0 items-center justify-center gap-2 whitespace-nowrap px-5 py-2.5 bg-[#0d3b66] text-white rounded-lg hp:rounded-md font-medium text-sm hover:bg-[#0a2c4c] active:scale-[0.98] transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4.5 h-4.5" />
              New Project
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <RequestFilterBar
          search={{
            value: searchTerm,
            onChange: handleSearchChange,
            placeholder: "Search projects…",
            hint: `Searches ${SEARCH_FIELDS.map((f) => f.label).join(", ")}`,
          }}
          quick={quickFilters}
          advanced={advancedFilters}
          advancedCount={activeAdvanced.length}
          isFiltered={isFiltered}
          onReset={handleReset}
          legend={visibleRows.some(rowAccent) && <DueLegend />}
          resultCount={visibleRows.length}
          sort={{
            options: SORT_OPTIONS,
            value: sortBy,
            onChange: handleSortChange,
          }}
        />

        {/* Table */}
        <div className="bg-white rounded-b-2xl hp:rounded-b-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto scrollbar-soft">
            <table className="w-full min-w-[1960px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr className="[&>th]:font-semibold [&>th]:whitespace-nowrap">
                  {columns.map((c) => (
                    <th key={c.key} className={`${c.base ?? CELL} ${c.th}`}>
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading
                  ? Array.from({ length: 6 }).map((_, idx) => (
                      <tr
                        key={`skeleton-${idx}`}
                        className="animate-pulse transition-colors"
                      >
                        <td className={`${NO_COL} ${STICKY_NO} bg-white px-3 py-3.5`}>
                          <div className="w-4 h-3.5 bg-slate-200/80 rounded" />
                        </td>
                        <td className={`${STICKY_PROJECT} bg-white px-3 py-3.5 whitespace-nowrap`}>
                          <div className="w-14 h-4 bg-slate-200/90 rounded" />
                        </td>
                        <td className="px-3 py-3.5 min-w-[220px]">
                          <div
                            className="h-4 bg-slate-200/70 rounded"
                            style={{ width: `${140 + (idx % 3) * 35}px` }}
                          />
                        </td>
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <div className="w-24 h-4 bg-slate-200/60 rounded" />
                        </td>
                        <td className="px-3 py-3.5 min-w-[160px]">
                          <div
                            className="h-4 bg-slate-200/60 rounded"
                            style={{ width: `${110 + (idx % 2) * 30}px` }}
                          />
                        </td>
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <div className="w-12 h-3.5 bg-slate-200/60 rounded" />
                        </td>
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <div className="w-20 h-3.5 bg-slate-200/60 rounded" />
                        </td>
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <div className="w-20 h-3.5 bg-slate-200/60 rounded" />
                        </td>
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <div className="w-16 h-3.5 bg-slate-200/60 rounded" />
                        </td>
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <div className="w-14 h-3.5 bg-slate-200/60 rounded" />
                        </td>
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <div className="w-24 h-6 bg-slate-200/70 rounded-full" />
                        </td>
                        <td className="px-3 py-3.5 min-w-[220px]">
                          <div
                            className="h-3.5 bg-slate-200/60 rounded"
                            style={{ width: `${130 + (idx % 2) * 40}px` }}
                          />
                        </td>
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <div className="w-20 h-3.5 bg-slate-200/60 rounded" />
                        </td>
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <div className="w-24 h-3.5 bg-slate-200/60 rounded" />
                        </td>
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <div className="w-20 h-3.5 bg-slate-200/60 rounded" />
                        </td>
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <div className="w-20 h-3.5 bg-slate-200/60 rounded" />
                        </td>
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <div className="w-16 h-3.5 bg-slate-200/60 rounded" />
                        </td>
                        <td className="px-3 py-3.5 text-right">
                          <div className="w-12 h-6 bg-slate-200/60 rounded ml-auto" />
                        </td>
                      </tr>
                    ))
                  : pagedRows.map((r, i) => (
                      <motion.tr
                        key={r.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => handleOpenRequest(r)}
                        className={`group ${ROW_HOVER} transition-colors cursor-pointer`}
                      >
                        {columns.map((c) => (
                          <td
                            key={c.key}
                            className={`${c.base ?? CELL} ${c.td ? c.td(r) : ""}`}
                          >
                            {c.render(r, firstIndex + i + 1)}
                          </td>
                        ))}
                      </motion.tr>
                    ))}
              </tbody>
            </table>
          </div>

          {!isLoading && visibleRows.length === 0 && (
            <div className="flex flex-col items-center gap-2 px-6 py-14 text-slate-400">
              {isFiltered ? (
                <SearchX className="w-8 h-8" />
              ) : (
                <Inbox className="w-8 h-8" />
              )}
              <p className="text-sm">
                {isFiltered
                  ? "No projects match your search or filters."
                  : "No projects in the database yet."}
              </p>
            </div>
          )}

          {!isLoading && visibleRows.length > 0 && (
            <RequestPagination
              page={safePage}
              pageSize={pageSize}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              total={visibleRows.length}
              onPageChange={setPage}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </div>
      </div>

      <ConfirmDeleteRequestModal
        isOpen={Boolean(deletingRequest)}
        request={deletingRequest}
        onClose={() => !isDeleting && setDeletingRequest(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      <ToastModal toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
