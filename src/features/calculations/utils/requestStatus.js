// utils/requestStatus.js
//
// Derives everything the Request list shows (tab, status label, third
// column) from the state of *my items* inside a request — never from a
// status label stored on the request itself. One request lands in exactly
// one of the first three tabs; "all" holds every request.

// `requests.status` in the database — only four values. The eight labels
// the list shows are derived from these plus my items, never stored:
//   internal  → In progress · Internal correction · Ready for check · Ready to submit
//   diajukan  → Submitted · Returned by Japan   (diajukan = submitted to Japan)
//   clear     → Cleared
//   cancelled → Cancelled
export const REQUEST_DB_STATUS = {
  INTERNAL: "internal",
  DIAJUKAN: "diajukan",
  CLEAR: "cleared",
  CANCELLED: "cancel",
};

// Status of one item (case) from the current user's point of view.
export const ITEM_STATUS = {
  IN_PROGRESS: "in_progress",
  INTERNAL_CORRECTION: "internal_correction",
  RETURNED: "returned",
  READY_CHECK: "ready_check",
  READY_SUBMIT: "ready_submit",
  SUBMITTED: "submitted",
  CLEARED: "cleared",
  CANCELLED: "cancel",
};

// Items I still have to work on or fix.
const MINE = [
  ITEM_STATUS.IN_PROGRESS,
  ITEM_STATUS.INTERNAL_CORRECTION,
  ITEM_STATUS.RETURNED,
];

// Items sitting with someone else, in pipeline order.
const WAITING = [
  ITEM_STATUS.READY_CHECK,
  ITEM_STATUS.READY_SUBMIT,
  ITEM_STATUS.SUBMITTED,
];

const WAITING_ON = {
  [ITEM_STATUS.READY_CHECK]: "Checker",
  [ITEM_STATUS.READY_SUBMIT]: "Admin dept.",
  [ITEM_STATUS.SUBMITTED]: "Japan",
};

export const REQUEST_TABS = [
  { key: "mine", label: "My tasks" },
  { key: "waiting", label: "Waiting" },
  { key: "done", label: "Done" },
  { key: "all", label: "All" },
];

// Request-level status keys — also the options of the Status filter.
// `tabs`: where a status can show up, so each tab's Status filter offers
// only those. "Ready for check" is in both My tasks (some cases still in
// progress) and Waiting (all cases handed over).
// `hint`: one-line meaning, shown in the chip tooltip and the Status guide.
export const REQUEST_STATUSES = [
  {
    key: "internal_correction",
    label: "Internal correction",
    tabs: ["mine"],
    hint: "The checker found issues. Fix them and hand the case back.",
  },
  {
    key: "returned",
    label: "Returned by Japan",
    tabs: ["mine"],
    hint: "Japan sent it back with feedback. Revise it and resubmit.",
  },
  {
    key: "in_progress",
    label: "In progress",
    tabs: ["mine"],
    hint: "You're working on it. Nothing has been handed over yet.",
  },
  {
    key: "ready_check",
    label: "Ready for check",
    tabs: ["mine", "waiting"],
    hint: "Handed to the checker for review. In My tasks, some cases are still yours to finish.",
  },
  {
    key: "ready_submit",
    label: "Ready to submit",
    tabs: ["waiting"],
    hint: "Checked. Waiting for the admin to submit it to Japan.",
  },
  {
    key: "submitted",
    label: "Submitted",
    tabs: ["waiting"],
    hint: "Sent to Japan. Waiting for their answer.",
  },
  {
    key: "cleared",
    label: "Cleared",
    tabs: ["done"],
    hint: "Approved by Japan. Finished.",
  },
  {
    key: "cancel",
    label: "Cancelled",
    tabs: ["done"],
    hint: "The request was cancelled. No further action.",
  },
];

export const statusHint = (key) =>
  REQUEST_STATUSES.find((s) => s.key === key)?.hint ?? "";

// Status filter options for a tab ("all" gets every status).
export const statusesForTab = (tab) =>
  tab === "all"
    ? REQUEST_STATUSES
    : REQUEST_STATUSES.filter((s) => s.tabs.includes(tab));

export const DISCIPLINES = [
  { key: "calc", label: "Calculation", short: "Calc" },
  { key: "drawing", label: "Drawing", short: "Drawing" },
];

export const CLASSIFICATIONS = [
  { key: "new", label: "New" },
  { key: "change", label: "Change" },
  { key: "reuse_new", label: "Reuse" },
];

export const REQUEST_TYPES = [
  { key: "general", label: "General" },
  { key: "special", label: "Special" },
];

export const SORT_OPTIONS = [
  { key: "updated", label: "Last updated" },
  { key: "due", label: "Earliest due date" },
];

const workTypeShort = (key) =>
  DISCIPLINES.find((d) => d.key === key)?.short ?? key;

// "001" → "case 001"; ["002","003"] → "case 002 and 003"
function caseList(items = []) {
  const nos = (items || []).map((i) => i.caseNo);
  if (nos.length <= 1) return `case ${nos[0] ?? ""}`.trim();
  return `case ${nos.slice(0, -1).join(", ")} and ${nos[nos.length - 1]}`;
}

// Prefix "Calc: " / "Drawing: " when every relevant item shares one work_type.
function withWorkType(items = [], text) {
  const types = new Set((items || []).map((i) => i.work_type));
  if (types.size !== 1) return text;
  return `${workTypeShort([...types][0])}: ${text}`;
}

const lowerFirst = (s) => (s ? s[0].toLowerCase() + s.slice(1) : s);

function byStatus(items = [], status) {
  return (items || []).filter((i) => i.status === status);
}

const isClosed = (request) =>
  request?.status === REQUEST_DB_STATUS.CLEAR ||
  request?.status === REQUEST_DB_STATUS.CANCELLED;

// Extracts or maps items from request.items or request.cases with safe fallbacks
export function getRequestItems(request) {
  if (!request) return [];
  if (Array.isArray(request.items) && request.items.length > 0) {
    return request.items;
  }
  if (Array.isArray(request.cases) && request.cases.length > 0) {
    return request.cases.map((c, idx) => {
      const st = String(c.status || "").toLowerCase();
      let itemStatus = ITEM_STATUS.IN_PROGRESS;
      if (st.includes("internal") || st.includes("correction")) {
        itemStatus = ITEM_STATUS.INTERNAL_CORRECTION;
      } else if (st.includes("return")) {
        itemStatus = ITEM_STATUS.RETURNED;
      } else if (st.includes("check")) {
        itemStatus = ITEM_STATUS.READY_CHECK;
      } else if (st.includes("ready") && st.includes("submit")) {
        itemStatus = ITEM_STATUS.READY_SUBMIT;
      } else if (st.includes("submit")) {
        itemStatus = ITEM_STATUS.SUBMITTED;
      } else if (st.includes("clear")) {
        itemStatus = ITEM_STATUS.CLEARED;
      } else if (st.includes("cancel")) {
        itemStatus = ITEM_STATUS.CANCELLED;
      } else {
        itemStatus = ITEM_STATUS.IN_PROGRESS;
      }
      return {
        caseNo: c.no || String(idx + 1).padStart(3, "0"),
        work_type: c.workType || "calc",
        status: itemStatus,
        checkedBy: c.checkedBy,
        note: c.note || "",
      };
    });
  }
  if (Array.isArray(request.items)) {
    return request.items;
  }
  return [
    {
      caseNo: "001",
      work_type: request.workTypes?.drawing ? "drawing" : "calc",
      status: ITEM_STATUS.IN_PROGRESS,
    },
  ];
}

// Placement rule, checked in order:
//   1. anything I still have to do or fix → "mine"
//   2. otherwise anything waiting on someone else → "waiting"
//   3. otherwise (everything cleared/cancelled) → "done"
// A request closed in the database is "done" whatever its items say.
export function requestTab(request) {
  if (!request) return "done";
  if (isClosed(request)) return "done";
  const items = getRequestItems(request);
  if (!Array.isArray(items) || items.length === 0) return "mine";
  if (items.some((i) => MINE.includes(i?.status))) return "mine";
  if (items.some((i) => WAITING.includes(i?.status))) return "waiting";
  return "done";
}

// → { key, label, detail } where `detail` is the Progress-column text for the
// request's own tab.
export function describeRequest(request) {
  if (!request) {
    return {
      key: "in_progress",
      label: "In progress",
      detail: "",
    };
  }
  const items = getRequestItems(request);
  const tab = requestTab(request);

  if (tab === "mine") {
    const corrections = byStatus(items, ITEM_STATUS.INTERNAL_CORRECTION);
    if (corrections.length) {
      return {
        key: "internal_correction",
        label: "Internal correction",
        detail: withWorkType(
          corrections,
          corrections.length === 1 && corrections[0].note
            ? lowerFirst(corrections[0].note)
            : `findings on ${caseList(corrections)}`,
        ),
      };
    }

    const returned = byStatus(items, ITEM_STATUS.RETURNED);
    if (returned.length) {
      return {
        key: "returned",
        label: "Returned by Japan",
        detail: withWorkType(
          returned,
          returned.length === 1 && returned[0].note
            ? lowerFirst(returned[0].note)
            : `feedback on ${caseList(returned)}`,
        ),
      };
    }

    const inProgress = byStatus(items, ITEM_STATUS.IN_PROGRESS);
    const ready = items.filter((i) => i.status !== ITEM_STATUS.CANCELLED);
    const readyCount = ready.length - inProgress.length;
    // Any ready case makes the request "Ready for check", even while other
    // cases are still in progress (it then stays in My tasks); the Progress
    // text says how far along it is.
    if (readyCount > 0) {
      return {
        key: "ready_check",
        label: "Ready for check",
        detail: withWorkType(
          ready,
          `ready ${readyCount}/${ready.length} · complete ${caseList(inProgress)}`,
        ),
      };
    }

    return {
      key: "in_progress",
      label: "In progress",
      detail: withWorkType(inProgress, `work on ${caseList(inProgress)}`),
    };
  }

  if (tab === "waiting") {
    const stages = WAITING.filter((s) => items.some((i) => i?.status === s));
    // The request's status is its earliest pending stage.
    const first = stages[0] || ITEM_STATUS.READY_CHECK;
    return {
      key: first,
      label: REQUEST_STATUSES.find((s) => s.key === first)?.label || "Waiting",
      detail: stages.map((s) => WAITING_ON[s]).filter(Boolean).join(", ") || "Waiting",
    };
  }

  if (request.status === REQUEST_DB_STATUS.CANCELLED) {
    return {
      key: "cancel",
      label: "Cancelled",
      detail: "No further action",
    };
  }

  const cleared = byStatus(items, ITEM_STATUS.CLEARED);
  const cancelled = byStatus(items, ITEM_STATUS.CANCELLED);
  return {
    key: "cleared",
    label: "Cleared",
    detail: cancelled.length
      ? `${cleared.length} cleared · ${cancelled.length} cancelled`
      : cleared.length === 1
        ? "Case cleared"
        : `All ${cleared.length} cases cleared`,
  };
}

// Corrections and returns float to the top of "My tasks"; everything else
// is newest-changed first.
const URGENT = new Set(["internal_correction", "returned"]);

// `rows` carry the derived status as `view` (see describeRequest).
// sortBy: "due" (earliest first, undated last) | "updated" (newest change first).
export function sortRequests(rows, tab, sortBy = "updated") {
  return [...rows].sort((a, b) => {
    if (sortBy === "due") {
      const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      if (da !== db) return da - db;
    }
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
}

// "2026-10-02" or an ISO timestamp → "02 Oct 2026"; empty → "".
export function formatDate(value) {
  if (!value) return "";
  const d = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Due-date cell: the date plus how urgent it is.
//   tone: "overdue" | "soon" (≤ 3 days) | "normal" | "none" (no date)
export function describeDue(request, { closed = false } = {}) {
  if (!request.dueDate) return { text: "", hint: null, tone: "none" };
  const due = new Date(`${request.dueDate}T00:00:00`);
  const text = formatDate(request.dueDate);
  if (closed) return { text, hint: null, tone: "normal" };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((due - today) / 86400000);
  if (days < 0) {
    const late = -days;
    return {
      text,
      hint: `${late} ${late === 1 ? "day" : "days"} overdue`,
      tone: "overdue",
    };
  }
  if (days <= 3) {
    return {
      text,
      hint:
        days === 0
          ? "Due today"
          : `Due in ${days} ${days === 1 ? "day" : "days"}`,
      tone: "soon",
    };
  }
  return { text, hint: null, tone: "normal" };
}

// Closed-date cell (Done tab): when the request was closed plus how that
// went against its due date.
//   tone: "on_time" | "late" | "cancelled" | "none" (no due date to compare)
export function describeClosed(request) {
  const text = formatDate(request.closedAt);
  if (request.status === REQUEST_DB_STATUS.CANCELLED) {
    return { text, hint: "Cancelled", tone: "cancelled" };
  }
  if (!request.closedAt || !request.dueDate) {
    return { text, hint: null, tone: "none" };
  }

  const closed = new Date(request.closedAt);
  closed.setHours(0, 0, 0, 0);
  const due = new Date(`${request.dueDate}T00:00:00`);
  const late = Math.round((closed - due) / 86400000);
  if (late > 0) {
    return {
      text,
      hint: `${late} ${late === 1 ? "day" : "days"} late`,
      tone: "late",
    };
  }
  return { text, hint: "On time", tone: "on_time" };
}

// "2 hours ago", "3 days ago", falling back to a date after a week.
export function timeAgo(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  const minutes = Math.floor((Date.now() - d.getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ${days === 1 ? "day" : "days"} ago`;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
