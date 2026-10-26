import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
// eslint-disable-next-line no-unused-vars -- used as <motion.*> in JSX
import { motion } from "framer-motion";
import { Inbox, SearchX, Eye, Lock } from "lucide-react";

// Components
import RequestFilterBar from "../components/requests/RequestFilterBar";
import RequestPagination from "../components/requests/RequestPagination";
import RequestStatusChip from "../components/requests/RequestStatusChip";
import CheckingQueueGuide from "../components/requests/CheckingQueueGuide";

// Data & Utilities
import { getAllRequests } from "../data/requestStore";
import { getCheckQueue } from "../services/requestService";
import { describeDue, formatDate } from "../utils/requestStatus";
import {
  EMPTY_DATE_RANGE,
  matchesDateRange,
  isRangeActive,
} from "../utils/requestDateFilters";
import { getUser } from "../../../utils/auth";

// =============================================================================
// 1. UI CONFIGURATION & STYLING CONSTANTS
// =============================================================================

/** Sticky frozen column classes for horizontal scrolling table */
const NO_COL = "w-[72px] min-w-[72px] max-w-[72px] py-4 pl-6 pr-3";
const STICKY_NO = "sticky left-0 z-10";
const STICKY_PROJECT = "sticky left-[72px] z-10 shadow-[inset_-1px_0_0_0_#e2e8f0]";
const CELL = "px-4 py-4 first:pl-6 last:pr-6";

/** Table row hover styling (soft navy matching frozen cell backgrounds) */
const ROW_HOVER = "hover:bg-[#f2f7fd]";
const STICKY_ROW_HOVER = "group-hover:bg-[#f2f7fd]";

/** Pagination size options */
const PAGE_SIZE_OPTIONS = [10, 25, 50];

/** Left-edge accent strip for deadline urgency */
const ROW_ACCENT = {
  overdue: "shadow-[inset_3px_0_0_0_#ef4444]",
  soon: "shadow-[inset_3px_0_0_0_#f59e0b]",
};
const getRowAccent = (r) => ROW_ACCENT[describeDue(r).tone] || "";

/** Color mappings for due date text */
const DUE_TONE = {
  overdue: "text-red-600",
  soon: "text-amber-600",
  normal: "text-slate-700",
  none: "text-slate-400",
};

/** Legend explaining the red/amber left row edge strip */
const DUE_LEGEND = [
  { label: "Overdue", color: "bg-[#ef4444]" },
  { label: "Due within 3 days", color: "bg-[#f59e0b]" },
];

// =============================================================================
// 2. DOMAIN METADATA & LOOKUP MAPS
// =============================================================================

/**
 * 4 Core Tabs of the Checking Queue:
 * - ready     : Open pool — projects with cases awaiting initial checker claim.
 * - mine      : Personal tasks — projects with cases actively under review by current user.
 * - correction: Team revisions — projects with cases returned to drafter for correction.
 * - all       : Department overview — all active checking tasks.
 */
const CHECKING_TABS = [
  { key: "ready", label: "Ready to Check" },
  { key: "mine", label: "My Checks" },
  { key: "correction", label: "Needs Correction" },
  { key: "all", label: "All Queue" },
];

/** Empty state copy for each tab */
const EMPTY_COPY = {
  ready: "No projects in the checking queue right now. Great job!",
  mine: "You haven't claimed any review tasks yet. Pick one from 'Ready to Check'!",
  correction: "No projects currently require internal correction.",
  all: "All caught up! No active review tasks in the queue.",
};

/** Default filter state */
const EMPTY_FILTERS = {
  work_type: "all",
  status: "all",
  dueDate: EMPTY_DATE_RANGE,
  companyName: "",
  drafter: "",
};

/** Work type display labels */
const WORK_TYPE_LABELS = {
  both: "Calculation & Drawing",
  drawing: "Drawing",
  calc: "Calculation",
};

/** Queue status chip metadata */
const QUEUE_STATUS_META = {
  ready_check: { key: "ready_check", label: "Ready for check" },
  internal_correction: { key: "internal_correction", label: "Internal correction" },
  in_progress: { key: "in_progress", label: "Under check" },
  ready_submit: { key: "ready_submit", label: "Ready to submit" },
};

/**
 * Declarative filtering predicates for tabs.
 * Evaluates whether a normalized project belongs in the selected tab.
 */
const TAB_PREDICATES = {
  ready: (r) => r.groups.ready.length > 0,
  mine: (r) => r.groups.myChecks.length > 0,
  correction: (r) => r.groups.correction.length > 0,
  all: (r) =>
    r.groups.ready.length > 0 ||
    r.groups.myChecks.length > 0 ||
    r.groups.underCheck.length > 0 ||
    r.groups.correction.length > 0,
};

/**
 * Modular sorting strategies:
 * - 'due'    : Earliest due date first.
 * - 'updated': Most recently updated first.
 * - 'default': Available to review first, then by number of ready cases.
 */
const SORT_STRATEGIES = {
  due: (a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  },
  updated: (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0),
  default: (a, b) => {
    if (a.isSelfCheckProhibited !== b.isSelfCheckProhibited) {
      return a.isSelfCheckProhibited ? 1 : -1;
    }
    return b.groups.ready.length - a.groups.ready.length;
  },
};

// Case status normalization sets
const READY_STATUSES = new Set(["ready for check", "ready_check"]);
const CORRECTION_STATUSES = new Set(["internal correction", "internal_correction"]);
const UNDER_CHECK_STATUSES = new Set(["under check", "under_check", "in_progress"]);
const COMPLETED_STATUSES = new Set([
  "checked",
  "ready to submit",
  "ready_submit",
  "submitted",
  "cleared",
]);

// =============================================================================
// 3. DATA TRANSFORMATION & BUSINESS RULES (PURE FUNCTIONS)
// =============================================================================

/**
 * Normalizes request data and classifies cases into workflow groups in a single pass O(n).
 *
 * Implements business rules:
 * 1. Multi-case lifecycle: Project exits queue when ALL cases are completed.
 * 2. Anti-Self-Check Rule (BAB 2.7): Drafter cannot review their own work.
 * 3. Personal workspace: My Checks only holds cases actively checked by currentUser.
 *
 * @param {Object} request - Raw request object from store
 * @param {string} currentUserName - Logged-in user name
 * @returns {Object|null} Normalized queue project or null if completed
 */
function parseRequestForQueue(request, currentUserName) {
  const cases = request.cases || [];

  const groups = {
    ready: [],
    correction: [],
    underCheck: [],
    inProgressDraft: [],
    myChecks: [],
    completed: [],
  };

  let hasCalc = request.workTypes?.calc || request.designType === "calculation";
  let hasDrawing = request.workTypes?.drawing || request.designType === "drawing";

  const draftersSet = new Set();
  const checkersSet = new Set();

  for (const c of cases) {
    if (c.workType === "calc") hasCalc = true;
    if (c.workType === "drawing") hasDrawing = true;

    const drafterName = c.owner || c.createdBy;
    if (drafterName) draftersSet.add(drafterName);

    if (c.checkedBy) checkersSet.add(c.checkedBy);

    const normalizedStatus = String(c.status || "").toLowerCase().trim();
    const isReady = READY_STATUSES.has(normalizedStatus);
    const isCorrection = CORRECTION_STATUSES.has(normalizedStatus);
    const isUnderCheck = UNDER_CHECK_STATUSES.has(normalizedStatus);
    const isCompleted = COMPLETED_STATUSES.has(normalizedStatus);
    const isInProgressDraft = !isReady && !isCorrection && !isUnderCheck && !isCompleted;

    // Only cases actively being checked by this user appear in My Checks
    const isMine = isUnderCheck && c.checkedBy === currentUserName;

    if (isReady) groups.ready.push(c);
    if (isCorrection) groups.correction.push(c);
    if (isUnderCheck) groups.underCheck.push(c);
    if (isInProgressDraft) groups.inProgressDraft.push(c);
    if (isMine) groups.myChecks.push(c);
    if (isCompleted) groups.completed.push(c);
  }

  // Fallback to request creator if no individual case drafters specified
  if (draftersSet.size === 0) {
    draftersSet.add(request.createdBy || request.createdByName || "Bintarjo Agus Priyadi");
  }

  const drafters = Array.from(draftersSet);
  const checkers = Array.from(checkersSet);

  // Unassigned active cases awaiting a checker
  const unassignedCount = cases.filter(
    (c) => !c.checkedBy && !groups.completed.includes(c)
  ).length;

  // Anti-Self-Check Rule (BAB 2.7): Drafter cannot verify their own calculations/drawings
  const isCreator =
    request.createdBy === currentUserName ||
    request.createdByName === currentUserName;
  const ownsReadyCase = groups.ready.some(
    (c) => c.owner === currentUserName || c.createdBy === currentUserName
  );
  const isSelfCheckProhibited = isCreator || ownsReadyCase;

  // Determine work type label
  const workType = hasCalc && hasDrawing ? "both" : hasDrawing ? "drawing" : "calc";

  // Derive top-level queue status
  const queueStatus =
    groups.ready.length > 0
      ? "ready_check"
      : groups.underCheck.length > 0
        ? "in_progress"
        : groups.correction.length > 0
          ? "internal_correction"
          : "ready_submit";

  // Lifecycle rule: If all cases are completed, the project has left the checking queue
  const isQueueCompleted =
    cases.length > 0 &&
    groups.ready.length === 0 &&
    groups.underCheck.length === 0 &&
    groups.correction.length === 0;

  if (isQueueCompleted) {
    return null;
  }

  return {
    ...request,
    projectNo: request.fields?.projectNo || request.pjNo || "12345",
    requestNo: request.fields?.requestNo || request.requestNo || "REQ-0001",
    subject:
      request.fields?.projectName ||
      request.fields?.subject ||
      request.subject ||
      "Route 16 Lighting",
    companyName:
      request.fields?.companyName ||
      request.companyName ||
      "Tokyo Electric Co., Ltd.",
    dueDate:
      request.fields?.requestedDate ||
      request.fields?.dueDate ||
      request.dueDate ||
      "2026-10-25",
    requestDate:
      request.fields?.requestDate ||
      request.requestDate ||
      "2026-10-01",
    cases,
    groups,
    drafters,
    checkers,
    unassignedCount,
    isSelfCheckProhibited,
    workType,
    queueStatus,
  };
}

/** Quick text search across all primary project attributes */
function matchesSearchQuery(r, term) {
  if (!term) return true;
  const target = [
    r.projectNo,
    r.requestNo,
    r.subject,
    r.companyName,
    r.createdBy,
    r.createdByName,
    ...(r.drafters || []),
    ...(r.checkers || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return target.includes(term.toLowerCase());
}

/** Validates active filter criteria against a project row */
function matchesFilters(r, filters) {
  if (filters.work_type !== "all" && r.workType !== filters.work_type) return false;
  if (filters.status !== "all" && r.queueStatus !== filters.status) return false;
  if (!matchesDateRange(r.dueDate, filters.dueDate)) return false;
  if (filters.companyName?.trim()) {
    if (!r.companyName.toLowerCase().includes(filters.companyName.toLowerCase().trim())) {
      return false;
    }
  }
  if (filters.drafter?.trim()) {
    const query = filters.drafter.toLowerCase().trim();
    const hasDrafter = (r.drafters || []).some((d) => d.toLowerCase().includes(query));
    if (!hasDrafter) return false;
  }
  return true;
}

// =============================================================================
// 4. TABLE CELL & ACCENT SUB-COMPONENTS
// =============================================================================

/** Row edge color legend */
function DueLegend() {
  return (
    <div className="flex items-center gap-4 text-xs text-slate-500">
      <span className="hp:hidden">Row edge:</span>
      {DUE_LEGEND.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5 font-medium">
          <span className={`w-[3px] h-3.5 rounded-full ${item.color}`} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

/** Cases breakdown with clean status dot indicators and 500 font-weight */
function CasesSummaryCell({ cases, groups }) {
  const total = cases.length;
  const readyCount = groups.ready.length;
  const underCheckCount = groups.underCheck?.length || 0;
  const correctionCount = groups.correction.length;
  const inProgressCount = groups.inProgressDraft?.length || 0;
  const completedCount = groups.completed.length;

  const parts = [];
  if (readyCount > 0) {
    parts.push({
      label: `${readyCount} ready`,
      dot: "bg-amber-500",
      text: "text-amber-800 font-medium",
    });
  }
  if (underCheckCount > 0) {
    parts.push({
      label: `${underCheckCount} checking`,
      dot: "bg-sky-500",
      text: "text-sky-700 font-medium",
    });
  }
  if (correctionCount > 0) {
    parts.push({
      label: `${correctionCount} correction`,
      dot: "bg-rose-500",
      text: "text-rose-700 font-medium",
    });
  }
  if (inProgressCount > 0) {
    parts.push({
      label: `${inProgressCount} in progress`,
      dot: "bg-slate-400",
      text: "text-slate-500 font-medium",
    });
  }
  if (completedCount > 0 && parts.length === 0) {
    parts.push({
      label: "All checked",
      dot: "bg-emerald-500",
      text: "text-emerald-700 font-medium",
    });
  }

  return (
    <div className="flex flex-col gap-0.5 whitespace-nowrap">
      <span className="font-medium text-slate-800 text-xs tabular-nums">
        {total} {total === 1 ? "case" : "cases"}
      </span>
      <div className="flex items-center gap-2.5 text-[11px] text-slate-500">
        {parts.length > 0 ? (
          parts.map((p, idx) => (
            <span key={idx} className={`inline-flex items-center gap-1.5 ${p.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
              {p.label}
            </span>
          ))
        ) : (
          <span className="text-slate-400 font-medium">None active</span>
        )}
      </div>
    </div>
  );
}

/** Drafter cell showing clean name without avatar initials */
function DrafterCell({ drafters }) {
  if (!drafters || drafters.length === 0) {
    return <span className="text-slate-400 text-xs font-medium">Unassigned</span>;
  }

  const first = drafters[0];
  const moreCount = drafters.length - 1;

  return (
    <div className="flex items-center gap-1.5" title={drafters.join(", ")}>
      <span className="text-xs font-medium text-slate-800 whitespace-nowrap">
        {first}
      </span>
      {moreCount > 0 && (
        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
          +{moreCount}
        </span>
      )}
    </div>
  );
}

/** Helper to extract 2-letter uppercase initials */
const getCheckerInitials = (name = "") => {
  const parts = name.replace(/\./g, "").trim().split(/\s+/);
  if (!parts.length || !parts[0]) return "CH";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const first = parts[0][0] ?? "";
  const last = parts[parts.length - 1][0] ?? "";
  return (first + last).toUpperCase();
};

/** Checker cell showing avatar initials + name, with lock for own project and expandable popover for multiple checkers */
function CheckerCell({ checkers, isSelfCheckProhibited }) {
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    if (!showPopover) return;
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowPopover(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPopover]);

  if (isSelfCheckProhibited) {
    return (
      <span
        title="Drafter Checker cannot review their own work."
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200 whitespace-nowrap shadow-2xs"
      >
        <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>Your project</span>
      </span>
    );
  }

  if (!checkers || checkers.length === 0) {
    return <span className="text-slate-400 text-xs font-medium">Unassigned</span>;
  }

  const first = checkers[0];
  const moreCount = checkers.length - 1;
  const initials = getCheckerInitials(first);

  return (
    <div className="relative inline-flex items-center gap-2 whitespace-nowrap" ref={popoverRef}>
      {/* 2-letter Avatar circle */}
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-br from-[#0d3b66] to-[#1a5a92] shadow-2xs shrink-0 select-none ring-1 ring-[#0d3b66]/20"
        title={first}
      >
        {initials}
      </div>

      {/* Checker Name */}
      <span className="text-xs font-medium text-slate-800 whitespace-nowrap" title={first}>
        {first}
      </span>

      {/* +N badge if multiple checkers */}
      {moreCount > 0 && (
        <div className="relative inline-block">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowPopover((v) => !v);
            }}
            title={`Checkers: ${checkers.join(", ")} (Click to view all)`}
            className="inline-flex items-center text-[11px] font-semibold text-[#0d3b66] bg-blue-50 hover:bg-blue-100/80 px-1.5 py-0.5 rounded border border-blue-200/80 cursor-pointer transition-all active:scale-95"
          >
            +{moreCount}
          </button>

          {/* Popover showing all checkers */}
          {showPopover && (
            <div
              className="absolute left-0 top-full mt-1.5 z-50 w-56 p-2.5 bg-white rounded-xl shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Checkers ({checkers.length})
                </span>
                <button
                  type="button"
                  onClick={() => setShowPopover(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs px-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto scrollbar-soft">
                {checkers.map((name, i) => (
                  <div key={i} className="flex items-center gap-2 py-0.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white bg-[#0d3b66] shrink-0">
                      {getCheckerInitials(name)}
                    </div>
                    <span className="text-xs text-slate-800 font-medium truncate">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-400">
                View assigned cases inside Review Cases
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Row review action button with disabled styling on self-drafted projects */
function QueueActionCell({ isSelfCheckProhibited, onReview }) {
  const label = isSelfCheckProhibited ? "View Only" : "Review Cases";

  return (
    <button
      type="button"
      onClick={onReview}
      aria-label={label}
      title={
        isSelfCheckProhibited
          ? "Your own project (Self-check prohibited). View only mode."
          : "Open project details to verify calculations and drawings."
      }
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hp:rounded-md text-xs font-semibold whitespace-nowrap bg-blue-50 text-[#0d3b66] ring-1 ring-inset ring-blue-200 group-hover:bg-[#0d3b66] group-hover:text-white group-hover:ring-[#0d3b66] hover:bg-[#0a2c4c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3399cc]/50 transition-colors"
    >
      <Eye className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

// =============================================================================
// 5. MAIN CHECKING QUEUE PAGE COMPONENT
// =============================================================================

export default function CheckingQueuePage() {
  const navigate = useNavigate();
  const currentUser = getUser() || { name: "Rina", role: "drafter_checker" };
  const currentUserName = currentUser.name || currentUser.username || "Rina";

  // Navigation & filter state
  const [activeTab, setActiveTab] = useState("ready");
  const [searchTerm, setSearchTerm] = useState("");
  const [tabFilters, setTabFilters] = useState({
    ready: { ...EMPTY_FILTERS },
    mine: { ...EMPTY_FILTERS },
    correction: { ...EMPTY_FILTERS },
    all: { ...EMPTY_FILTERS },
  });
  const filters = tabFilters[activeTab];
  const [sortBy, setSortBy] = useState("updated");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  const [serverRequests, setServerRequests] = useState(null);

  // Attempt to fetch live checking queue from API Gateway when authenticated
  useEffect(() => {
    let isMounted = true;
    async function loadQueue() {
      try {
        const res = await getCheckQueue();
        const items = Array.isArray(res) ? res : res?.items || res?.data;
        if (isMounted && Array.isArray(items) && items.length > 0) {
          setServerRequests(items);
        }
      } catch (err) {
        // Fallback silently if offline or unauthenticated
        console.debug("[CheckingQueue] Live queue fetch skipped:", err?.message);
      }
    }
    loadQueue();
    return () => {
      isMounted = false;
    };
  }, []);

  // Load and normalize requests via single-pass parser
  const allRequests = useMemo(() => {
    const sourceData = serverRequests || getAllRequests();
    return sourceData
      .map((r) => parseRequestForQueue(r, currentUserName))
      .filter(Boolean);
  }, [serverRequests, currentUserName]);

  // Tab badge count calculation
  const tabCounts = useMemo(() => {
    const counts = {};
    for (const tab of CHECKING_TABS) {
      const predicate = TAB_PREDICATES[tab.key] || (() => true);
      counts[tab.key] = allRequests.filter(
        (r) => predicate(r) && matchesSearchQuery(r, searchTerm.trim())
      ).length;
    }
    return counts;
  }, [allRequests, searchTerm]);

  // Filtered & sorted visible rows
  const visibleRows = useMemo(() => {
    const tabPredicate = TAB_PREDICATES[activeTab] || (() => true);
    const cleanedSearch = searchTerm.trim();

    const filtered = allRequests.filter(
      (r) =>
        tabPredicate(r) &&
        matchesSearchQuery(r, cleanedSearch) &&
        matchesFilters(r, filters)
    );

    const sortFn = SORT_STRATEGIES[sortBy] || SORT_STRATEGIES.default;
    return [...filtered].sort(sortFn);
  }, [allRequests, activeTab, searchTerm, filters, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(visibleRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const firstIndex = (safePage - 1) * pageSize;
  const pagedRows = visibleRows.slice(firstIndex, firstIndex + pageSize);

  // Filter handlers
  const setFilter = useCallback(
    (key) => (value) => {
      setTabFilters((prev) => ({
        ...prev,
        [activeTab]: { ...prev[activeTab], [key]: value },
      }));
      setPage(1);
    },
    [activeTab]
  );

  const handleResetFilters = useCallback(() => {
    setSearchTerm("");
    setTabFilters((prev) => ({
      ...prev,
      [activeTab]: { ...EMPTY_FILTERS },
    }));
    setPage(1);
  }, [activeTab]);

  const isFiltered =
    !!searchTerm.trim() ||
    filters.work_type !== "all" ||
    filters.status !== "all" ||
    isRangeActive(filters.dueDate) ||
    !!filters.companyName.trim() ||
    !!filters.drafter.trim();

  // Quick filters toolbar definition
  const optionsWithAll = (opts) => [{ key: "all", label: "All" }, ...opts];

  const quickFilters = useMemo(
    () =>
      [
        {
          key: "work_type",
          prefix: "Work Type",
          options: optionsWithAll([
            { key: "calc", label: "Calculation" },
            { key: "drawing", label: "Drawing" },
            { key: "both", label: "Calculation & Drawing" },
          ]),
        },
        {
          key: "status",
          prefix: "Queue Status",
          options: optionsWithAll([
            { key: "ready_check", label: "Ready for check" },
            { key: "in_progress", label: "Under check" },
            { key: "internal_correction", label: "Internal correction" },
          ]),
        },
      ].map((f) => ({ ...f, value: filters[f.key], onChange: setFilter(f.key) })),
    [filters, setFilter]
  );

  // Advanced filters definition
  const advancedFilters = useMemo(
    () =>
      [
        { key: "dueDate", type: "date", label: "Request Due date" },
        {
          key: "companyName",
          type: "text",
          label: "Company name",
          placeholder: "Filter by company name...",
        },
        {
          key: "drafter",
          type: "text",
          label: "Drafter",
          placeholder: "Filter by drafter name...",
        },
      ].map((f) => ({ ...f, value: filters[f.key], onChange: setFilter(f.key) })),
    [filters, setFilter]
  );

  const advancedCount =
    (isRangeActive(filters.dueDate) ? 1 : 0) +
    (filters.companyName.trim() ? 1 : 0) +
    (filters.drafter.trim() ? 1 : 0);

  // Declarative table columns (12 logical columns, Project name before Request no.)
  const columns = useMemo(
    () => [
      {
        key: "no",
        label: "No.",
        base: NO_COL,
        th: `${STICKY_NO} bg-slate-50`,
        td: (r) =>
          `${STICKY_NO} bg-white ${STICKY_ROW_HOVER} transition-colors text-slate-500 tabular-nums ${getRowAccent(r)}`,
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
            {r.projectNo || r.fields?.projectNo || r.pjNo || "12345"}
          </span>
        ),
      },
      {
        key: "subject",
        label: "Project name",
        th: "min-w-[200px]",
        td: () => "text-slate-700 break-words",
        render: (r) => r.subject || r.fields?.projectName || "Route 16 Lighting",
      },
      {
        key: "requestNo",
        label: "Request no.",
        th: "w-[1%] whitespace-nowrap",
        td: () => "whitespace-nowrap text-slate-700 tabular-nums",
        render: (r) => r.requestNo || r.fields?.requestNo || "REQ-0001",
      },
      {
        key: "companyName",
        label: "Company name",
        th: "min-w-[160px]",
        td: () => "text-slate-600 break-words",
        render: (r) => r.companyName || r.fields?.companyName || "Tokyo Electric Co., Ltd.",
      },
      {
        key: "workType",
        label: "Work Type",
        th: "w-[1%]",
        td: () => "whitespace-nowrap text-slate-700",
        render: (r) => WORK_TYPE_LABELS[r.workType] || "Calculation",
      },
      {
        key: "due",
        label: "Request due date",
        th: "w-[1%] whitespace-nowrap",
        td: () => "whitespace-nowrap",
        render: (r) => {
          const due = describeDue(r);
          const text =
            due?.text || formatDate(r.dueDate || r.fields?.dueDate || "2026-10-25");
          return (
            <>
              <span className={`block font-medium ${DUE_TONE[due?.tone || "normal"]}`}>
                {text}
              </span>
              {due?.hint && (
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
        key: "cases",
        label: "Cases",
        th: "min-w-[150px] whitespace-nowrap",
        td: () => "whitespace-nowrap",
        render: (r) => <CasesSummaryCell cases={r.cases} groups={r.groups} />,
      },
      {
        key: "drafter",
        label: "Drafter",
        th: "min-w-[150px] whitespace-nowrap",
        td: () => "whitespace-nowrap text-slate-700",
        render: (r) => <DrafterCell drafters={r.drafters} />,
      },
      {
        key: "checker",
        label: "Checker",
        th: "min-w-[170px] whitespace-nowrap",
        td: () => "whitespace-nowrap",
        render: (r) => (
          <CheckerCell
            checkers={r.checkers}
            isSelfCheckProhibited={r.isSelfCheckProhibited}
          />
        ),
      },
      {
        key: "status",
        label: "Queue Status",
        th: "w-[1%]",
        td: () => "",
        render: (r) => {
          const meta =
            QUEUE_STATUS_META[r.queueStatus] || QUEUE_STATUS_META.ready_check;
          return (
            <RequestStatusChip statusKey={meta.key} label={meta.label} withHint />
          );
        },
      },
      {
        key: "action",
        label: "Action",
        th: "w-[1%] text-right pr-6",
        td: () => "text-right pr-6",
        render: (r) => (
          <QueueActionCell
            isSelfCheckProhibited={r.isSelfCheckProhibited}
            onReview={() => navigate(`/projects/detail/${r.id}`)}
          />
        ),
      },
    ],
    [currentUserName, navigate]
  );

  return (
    <div className="min-h-full flex flex-col">
      <Helmet>
        <title>Checking Queue - KORI BALI</title>
      </Helmet>

      <div className="mx-auto w-full max-w-[2800px] px-6 hp:px-3 lg:px-4 2xl:px-8 pt-0 pb-4 sm:pb-6 lg:pb-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Checking Queue
          </h1>
          <p className="text-slate-500 mt-1.5 text-sm">
            Review and verify structural calculations and drawings submitted by
            drafters before final Japan submission.
          </p>
        </div>

        {/* Tab Strip */}
        <div className="flex items-end justify-between gap-4 border-b border-slate-200 mb-5">
          <div
            role="tablist"
            className="flex items-center gap-6 min-w-0 overflow-x-auto scrollbar-hide"
          >
            {CHECKING_TABS.map((tab) => {
              const isActive = tab.key === activeTab;
              const count = tabCounts[tab.key] || 0;
              const badgeTone = isActive
                ? "bg-[#0d3b66] text-white"
                : tab.key === "ready" && count > 0
                  ? "bg-amber-100 text-amber-800"
                  : "bg-slate-100 text-slate-500";

              return (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setPage(1);
                  }}
                  className={`relative flex items-center gap-2 pb-3 pt-1 text-sm font-semibold whitespace-nowrap transition-colors ${isActive
                    ? "text-[#0d3b66]"
                    : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                  {tab.label}
                  <span
                    className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold tabular-nums transition-colors ${badgeTone}`}
                  >
                    {count}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="checking-tab-underline"
                      className="absolute left-0 right-0 -bottom-px h-0.5 rounded-full bg-[#0d3b66]"
                    />
                  )}
                </button>
              );
            })}
          </div>
          <CheckingQueueGuide />
        </div>

        {/* Filter & Search Bar */}
        <RequestFilterBar
          search={{
            value: searchTerm,
            onChange: (val) => {
              setSearchTerm(val);
              setPage(1);
            },
            placeholder: "Search queue…",
            hint: "Searches Project no., Request no., Project name, Company name, Drafter, and Checker",
          }}
          quick={quickFilters}
          advanced={advancedFilters}
          advancedCount={advancedCount}
          isFiltered={isFiltered}
          onReset={handleResetFilters}
          legend={<DueLegend />}
          resultCount={visibleRows.length}
          sort={{
            options: [
              { key: "updated", label: "Last updated" },
              { key: "due", label: "Earliest due date" },
            ],
            value: sortBy,
            onChange: (val) => {
              setSortBy(val);
              setPage(1);
            },
          }}
        />

        {/* Table Container */}
        <div className="bg-white rounded-b-2xl hp:rounded-b-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto scrollbar-soft">
            <table className="w-full min-w-[1600px] text-left text-sm">
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
                {pagedRows.map((r, i) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`group ${ROW_HOVER} transition-colors ${r.isSelfCheckProhibited ? "bg-amber-50/20" : ""
                      }`}
                  >
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        className={`${c.base ?? CELL} ${c.td(r)}`}
                      >
                        {c.render(r, firstIndex + i + 1)}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {visibleRows.length === 0 && (
            <div className="flex flex-col items-center gap-2 px-6 py-14 text-slate-400">
              {isFiltered ? (
                <SearchX className="w-8 h-8" />
              ) : (
                <Inbox className="w-8 h-8" />
              )}
              <p className="text-sm font-medium">
                {isFiltered
                  ? "No projects match your search or checking filters."
                  : EMPTY_COPY[activeTab]}
              </p>
            </div>
          )}

          {/* Pagination */}
          {visibleRows.length > 0 && (
            <RequestPagination
              page={safePage}
              pageSize={pageSize}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              total={visibleRows.length}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
