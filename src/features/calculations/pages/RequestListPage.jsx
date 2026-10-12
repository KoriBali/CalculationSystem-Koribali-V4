import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Plus, Inbox, SearchX, Eye } from "lucide-react";
import RequestFilterBar from "../components/requests/RequestFilterBar";
import RequestPagination from "../components/requests/RequestPagination";
import RequestStatusChip from "../components/requests/RequestStatusChip";
import RequestStatusGuide from "../components/requests/RequestStatusGuide";
import { MOCK_REQUESTS, LINES, ISSUER_OFFICES } from "../data/mockRequests";
import {
  REQUEST_TABS,
  statusesForTab,
  DISCIPLINES,
  CLASSIFICATIONS,
  REQUEST_TYPES,
  SORT_OPTIONS,
  requestTab,
  describeRequest,
  sortRequests,
  describeDue,
  describeClosed,
  formatDate,
  timeAgo,
} from "../utils/requestStatus";
import {
  EMPTY_DATE_RANGE,
  matchesDateRange,
  isRangeActive,
} from "../utils/requestDateFilters";
import {
  SEARCH_FIELDS,
  matchesField,
  matchesQuickSearch,
} from "../utils/requestSearch";

// Coloured left edge (on the frozen No. cell) for urgent rows. Follows the
// Due column's tone so red/amber mean the same thing everywhere in the row,
// and stays visible while the table scrolls sideways. Rework statuses are
// already shown by the Status chip, so they don't get an edge of their own.
const ROW_ACCENT = {
  overdue: "shadow-[inset_3px_0_0_0_#ef4444]",
  soon: "shadow-[inset_3px_0_0_0_#f59e0b]",
};

// Edge class for a row, or undefined when it has none (not urgent, or done).
const rowAccent = (r) =>
  ROW_ACCENT[describeDue(r, { closed: r.tab === "done" }).tone];

// No. + Project are frozen on the left while the table scrolls sideways.
// No. has a fixed width so Project knows where to stick; a hairline on
// Project's right edge marks where the frozen part ends.
const NO_COL = "w-[72px] min-w-[72px] max-w-[72px] py-4 pl-6 pr-3";
const STICKY_NO = "sticky left-0 z-10";
const STICKY_PROJECT =
  "sticky left-[72px] z-10 shadow-[inset_-1px_0_0_0_#e2e8f0]";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

// Row hover tint (light navy). Solid hex rather than an opacity class so the
// frozen Project cell — which needs an opaque background — matches exactly.
const ROW_HOVER = "hover:bg-[#f2f7fd]";
const STICKY_ROW_HOVER = "group-hover:bg-[#f2f7fd]";

// Explains the row edge, so red/amber read as deadline urgency rather than
// the same-coloured Internal correction / Returned status chips.
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

const CLOSED_TONE = {
  on_time: "text-emerald-600",
  late: "text-red-600",
  cancelled: "text-slate-400",
  none: "text-slate-400",
};

const DUE_TONE = {
  overdue: "text-red-600",
  soon: "text-amber-600",
  normal: "text-slate-700",
  none: "text-slate-400",
};

// Every cell shares one horizontal rhythm; the outer columns line up with
// the filter bar's px-6.
const CELL = "px-4 py-4 first:pl-6 last:pr-6";

const lineLabel = (key) => LINES.find((l) => l.key === key)?.label ?? key;
const requestTypeLabel = (key) =>
  REQUEST_TYPES.find((t) => t.key === key)?.label ?? key;

const EMPTY_COPY = {
  mine: "Nothing to work on right now.",
  waiting: "No requests are waiting on anyone else.",
  done: "No finished requests yet.",
  all: "You don't have any requests yet.",
};

const EMPTY_FILTERS = {
  line: "all",
  work_type: "all",
  status: "all",
  classification: "all",
  requestType: "all",
  issuerOffice: "all",
  // One text input per field (Project no., Request no., Client, PIC …)
  ...Object.fromEntries(
    SEARCH_FIELDS.filter((f) => !f.mainOnly).map((f) => [f.key, ""]),
  ),
  requestDate: EMPTY_DATE_RANGE,
  dueDate: EMPTY_DATE_RANGE,
  // Done tab only; replaces Due there, like the Closed column does.
  completedDate: EMPTY_DATE_RANGE,
};

// Select-type filters: how a row matches a chosen value.
const SELECT_FILTERS = {
  // A5: Request uses `brandLine` (BE: brand_line), Project uses `requestForm`
  // (BE: request_form). Both show "Line" in the UI but are separate fields.
  line: (r, v) => r.brandLine === v,
  // Work type of *my* assignments, not the request's design_type — a
  // drawing_calculation request I only work on for drawing is "Drawing" here.
  work_type: (r, v) => {
    if (v === "both") {
      return (
        r.items.some((i) => i.work_type === "calc") &&
        r.items.some((i) => i.work_type === "drawing")
      );
    }
    return r.items.some((i) => i.work_type === v);
  },
  status: (r, v) => r.view.key === v,
  classification: (r, v) => r.requestClassification === v,
  requestType: (r, v) => r.requestType === v,
  issuerOffice: (r, v) => r.issuerOfficeCode === v,
};

// Does `r` pass every active filter, ignoring the one named `skip`?
function matchesFilters(r, filters, skip = null) {
  for (const [key, match] of Object.entries(SELECT_FILTERS)) {
    if (key !== skip && filters[key] !== "all" && !match(r, filters[key])) {
      return false;
    }
  }
  return (
    // Every filled field input has to match (AND), DataBank style.
    SEARCH_FIELDS.every(
      (f) => f.mainOnly || matchesField(r, f.key, filters[f.key]),
    ) &&
    matchesDateRange(r.requestDate, filters.requestDate) &&
    matchesDateRange(r.dueDate, filters.dueDate) &&
    matchesDateRange(r.closedAt, filters.completedDate)
  );
}

export default function RequestListPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("mine");
  const [searchTerm, setSearchTerm] = useState("");
  const [tabFilters, setTabFilters] = useState({
    mine: { ...EMPTY_FILTERS },
    waiting: { ...EMPTY_FILTERS },
    done: { ...EMPTY_FILTERS },
    all: { ...EMPTY_FILTERS },
  });
  const filters = tabFilters[activeTab];
  const [sortBy, setSortBy] = useState("default");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  // Leaving a project's drafts for the request list drops the project
  // context, same as the project type picker used to.
  useEffect(() => {
    sessionStorage.removeItem("projectType");
  }, []);

  const requests = useMemo(
    () =>
      MOCK_REQUESTS.map((r) => ({
        ...r,
        tab: requestTab(r),
        view: describeRequest(r),
      })),
    [],
  );

  // Anything that changes which rows are listed sends you back to page 1.
  const setFilter = (key) => (value) => {
    setTabFilters((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [key]: value,
        // Issuer office only exists on YS covers: switching to YP hides the
        // field, so clear it too rather than filter on something invisible.
        ...(key === "line" && value === "yp" ? { issuerOffice: "all" } : {}),
      },
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
  const inTab = (r) => activeTab === "all" || r.tab === activeTab;

  // Tabs are themselves status groups, so status never narrows the counts.
  const tabCounts = REQUEST_TABS.reduce((acc, t) => {
    const tFilters = tabFilters[t.key];
    const count = requests.filter(
      (r) =>
        matchesSearch(r) &&
        (t.key === "all" || r.tab === t.key) &&
        matchesFilters(r, tFilters, "status"),
    ).length;
    return { ...acc, [t.key]: count };
  }, {});

  const visibleRows = sortRequests(
    requests.filter(
      (r) => matchesSearch(r) && inTab(r) && matchesFilters(r, filters),
    ),
    activeTab,
    sortBy,
  );

  const totalPages = Math.max(1, Math.ceil(visibleRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const firstIndex = (safePage - 1) * pageSize;
  const pagedRows = visibleRows.slice(firstIndex, firstIndex + pageSize);

  const optionsFor = (options) => [{ key: "all", label: "All" }, ...options];

  // Prefix inside the trigger ("Line: All") — no separate label needed.
  const quickFilters = [
    { key: "line", prefix: "Line", options: optionsFor(LINES) },
    {
      key: "work_type",
      prefix: "Discipline",
      options: optionsFor([
        ...DISCIPLINES,
        { key: "both", label: "Calculation & Drawing" },
      ]),
    },
    // Every tab, but only the statuses that can appear in it.
    {
      key: "status",
      prefix: "Status",
      options: optionsFor(statusesForTab(activeTab)),
    },
  ].map((f) => ({ ...f, value: filters[f.key], onChange: setFilter(f.key) }));

  // Reading order = panel order: numbers, people, request kind, dates.
  const advancedFilters = [
    ...SEARCH_FIELDS.filter((f) => !f.mainOnly).map((f) => ({
      key: f.key,
      type: "text",
      label: f.label,
      placeholder: f.placeholder,
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
      key: "issuerOffice",
      type: "select",
      label: "Issuer office",
      options: optionsFor(ISSUER_OFFICES),
      hidden: filters.line === "yp",
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
      hidden: activeTab === "done",
    },
    {
      key: "completedDate",
      type: "date",
      label: "Closed date",
      hidden: activeTab !== "done",
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

  const handleTabChange = (key) => {
    setActiveTab(key);
    setPage(1);
  };

  const handleReset = () => {
    setSearchTerm("");
    setTabFilters((prev) => ({
      ...prev,
      [activeTab]: { ...EMPTY_FILTERS },
    }));
    setPage(1);
  };

  // One "Progress" column on every tab, so each value has to read on its own:
  // a waiting row says who it waits on in full, not just "Checker".
  const detailFor = (r) =>
    r.tab === "waiting" ? `Waiting on ${r.view.detail}` : r.view.detail;

  // Open request detail
  const handleOpenRequest = (r) => {
    navigate(`/requests/detail/${r.id}`);
  };

  // One value per column. `th`/`td` add classes on top of the shared CELL
  // (or replace it, via `base`). `render` gets the row's position in the
  // whole filtered list, for the No. column.
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
          {r.pjNo}
        </span>
      ),
    },
    {
      key: "requestNo",
      label: "Request no.",
      th: "w-[1%] whitespace-nowrap",
      td: () => "whitespace-nowrap text-slate-700 tabular-nums",
      render: (r) => r.requestNo,
    },
    {
      key: "subject",
      label: "Subject",
      th: "min-w-[220px]",
      td: () => "text-slate-700 break-words",
      render: (r) => r.subject,
    },
    {
      key: "client",
      label: "Client",
      th: "min-w-[160px]",
      td: () => "text-slate-600 break-words",
      render: (r) => r.companyName,
    },
    {
      key: "japanPic",
      label: "Japan PIC",
      th: "whitespace-nowrap",
      td: () => "text-slate-600 whitespace-nowrap",
      render: (r) => r.requesterPicName,
    },
    {
      key: "line",
      label: "Line",
      th: "w-[1%]",
      td: () => "whitespace-nowrap text-slate-700",
      render: (r) => lineLabel(r.brandLine),
    },
    {
      key: "requestType",
      label: "Request type",
      th: "w-[1%]",
      td: () => "whitespace-nowrap text-slate-700",
      render: (r) => requestTypeLabel(r.requestType),
    },
    {
      key: "status",
      label: "Status",
      th: "w-[1%]",
      td: () => "",
      // Hover / focus the chip for a one-line explanation.
      render: (r) => (
        <RequestStatusChip
          statusKey={r.view.key}
          label={r.view.label}
          withHint
        />
      ),
    },
    {
      key: "progress",
      label: "Progress",
      th: "min-w-[220px]",
      td: () => "text-slate-700 break-words",
      render: detailFor,
    },
    {
      key: "requestDate",
      label: "Requested",
      th: "w-[1%]",
      td: () => "whitespace-nowrap text-slate-700",
      render: (r) => formatDate(r.requestDate),
    },
    activeTab === "done"
      ? {
          // "Closed", not "Completed": Done also holds cancelled requests.
          key: "closed",
          label: "Closed",
          th: "w-[1%]",
          td: () => "whitespace-nowrap text-slate-700",
          render: (r) => {
            const closed = describeClosed(r);
            return (
              <>
                <span className="block">{closed.text}</span>
                {closed.hint && (
                  <span
                    className={`block mt-0.5 text-xs font-medium ${CLOSED_TONE[closed.tone]}`}
                  >
                    {closed.hint}
                  </span>
                )}
              </>
            );
          },
        }
      : {
          key: "due",
          label: "Due",
          th: "w-[1%]",
          td: () => "whitespace-nowrap",
          render: (r) => {
            const due = describeDue(r, { closed: r.tab === "done" });
            return (
              <>
                <span className={`block ${DUE_TONE[due.tone]}`}>
                  {due.text}
                </span>
                {due.hint && (
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
    // Who submitted it to Japan — only meaningful once a request can have
    // been submitted, so not on My tasks.
    ...(activeTab === "mine"
      ? []
      : [
          {
            key: "submittedBy",
            label: "Submitted by",
            th: "w-[1%]",
            td: () => "whitespace-nowrap text-slate-700",
            render: (r) => r.submittedByName,
          },
        ]),
    {
      key: "createdBy",
      label: "Created by",
      th: "w-[1%]",
      td: () => "whitespace-nowrap text-slate-700",
      render: (r) => r.createdByName,
    },
    {
      key: "updated",
      label: "Updated",
      th: "w-[1%]",
      td: () => "whitespace-nowrap text-slate-500",
      render: (r) => timeAgo(r.updatedAt),
    },
    {
      key: "action",
      label: "Action",
      th: "w-[1%] text-right",
      td: () => "text-right",
      render: (r) => (
        <button
          type="button"
          onClick={() => handleOpenRequest(r)}
          title="Request Detail is coming soon"
          aria-label={`Open ${r.pjNo || ""} ${r.requestNo || r.subject || ""}`.trim()}
          // Light blue at rest so a column of buttons doesn't outweigh the
          // data; fills to primary navy when its row is hovered.
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hp:rounded-md text-xs font-semibold whitespace-nowrap bg-blue-50 text-[#0d3b66] ring-1 ring-inset ring-blue-200 group-hover:bg-[#0d3b66] group-hover:text-white group-hover:ring-[#0d3b66] hover:bg-[#0a2c4c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3399cc]/50 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          Open
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-full flex flex-col">
      <Helmet>
        <title>Requests - KORI BALI</title>
      </Helmet>

      {/* A wide data table, so the page uses the full content width instead
          of the 1600px cap other pages use. Side gutter (on top of main's
          32px): 16px on laptops, 32px from 2xl. Capped at 2800px so a 4K
          screen at 100% scaling doesn't stretch rows across ~3600px.
          No top padding: main already pads 16/32px below the header, and
          stacking another 32px on top left the title floating too low. */}
      <div className="mx-auto w-full max-w-[2800px] px-6 hp:px-3 lg:px-4 2xl:px-8 pt-0 pb-4 sm:pb-6 lg:pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Requests
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm">
              Manage your calculation and drawing requests, from action required
              to completion.
            </p>
          </div>

          <button
            onClick={() => navigate("/requests/new")}
            className="flex shrink-0 items-center justify-center gap-2 whitespace-nowrap px-5 py-2.5 bg-[#0d3b66] text-white rounded-lg hp:rounded-md font-medium text-sm hover:bg-[#0a2c4c] active:scale-[0.98] transition-all shadow-sm"
          >
            <Plus className="w-4.5 h-4.5" />
            New Request
          </button>
        </div>

        {/* Tabs + Status guide. The guide sits outside the tab strip's
            horizontal scroll container so its popover isn't clipped. */}
        <div className="flex items-end justify-between gap-4 border-b border-slate-200 mb-5">
          <div
            role="tablist"
            className="flex items-center gap-6 min-w-0 overflow-x-auto scrollbar-hide"
          >
            {REQUEST_TABS.map((tab) => {
              const isActive = tab.key === activeTab;
              const count = tabCounts[tab.key] || 0;
              // Active tab: solid navy, like its label and underline. "My tasks"
              // keeps a soft navy tint when inactive so pending work still
              // draws the eye; other counts stay muted.
              const badgeTone = isActive
                ? "bg-[#0d3b66] text-white"
                : tab.key === "mine" && count > 0
                  ? "bg-[#0d3b66]/10 text-[#0d3b66]"
                  : "bg-slate-100 text-slate-500";
              return (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleTabChange(tab.key)}
                  className={`relative flex items-center gap-2 pb-3 pt-1 text-sm font-semibold whitespace-nowrap transition-colors ${
                    isActive
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
                      layoutId="request-tab-underline"
                      className="absolute left-0 right-0 -bottom-px h-0.5 rounded-full bg-[#0d3b66]"
                    />
                  )}
                </button>
              );
            })}
          </div>
          <RequestStatusGuide />
        </div>

        {/* Search, filters, result count and sort; all controls live here
            so the column headers stay plain labels. */}
        <RequestFilterBar
          search={{
            value: searchTerm,
            onChange: handleSearchChange,
            // The box searches every field in SEARCH_FIELDS; listing them all
            // in the placeholder gets cut off, so it stays generic and the
            // tooltip spells them out.
            placeholder: "Search requests…",
            hint: `Searches ${SEARCH_FIELDS.map((f) => f.label).join(", ")}`,
          }}
          quick={quickFilters}
          advanced={advancedFilters}
          advancedCount={activeAdvanced.length}
          isFiltered={isFiltered}
          onReset={handleReset}
          // Only when the filtered list (any page) has an edged row; otherwise
          // the legend explains nothing. Never shows in Done.
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
            <table className="w-full min-w-[1840px] text-left text-sm">
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
                    className={`group ${ROW_HOVER} transition-colors`}
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

          {/* Empty state lives outside the scrolling table so it stays
              centred in the card even when the table is scrolled sideways. */}
          {visibleRows.length === 0 && (
            <div className="flex flex-col items-center gap-2 px-6 py-14 text-slate-400">
              {isFiltered ? (
                <SearchX className="w-8 h-8" />
              ) : (
                <Inbox className="w-8 h-8" />
              )}
              <p className="text-sm">
                {isFiltered
                  ? "No requests match your search or filters."
                  : EMPTY_COPY[activeTab]}
              </p>
            </div>
          )}

          {visibleRows.length > 0 && (
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
    </div>
  );
}
