import { mmToPx } from "../utils/unitConventer";

// ─── SHARED HELPER ───────────────────────────────────────────────────────────

/**
 * Core A4 pagination engine — distributes blocks across pages based on zHeight.
 * Each project type passes different ptValue and pageHeader to account for
 * their unique layout measurements.
 *
 * @param {object[]} blocks     - Array of block objects with id and node
 * @param {object}   measureRef - Ref to the measurement container DOM element
 * @param {number}   ptValue    - Top padding discount applied to the first block per page
 * @param {number}   pageHeader - Height of the page header in px
 */
function paginateA4({ blocks, measureRef, ptValue, pageHeader }) {
  // Bail early if the measurement container isn't mounted yet
  if (!measureRef.current) return [];

  const children = Array.from(measureRef.current.children);

  // Build a lookup map for fast block access by id
  const blockMap = new Map(blocks.map((b) => [b.id, b]));

  // Measure the container to get the available page zHeight
  const measureRect = measureRef.current.getBoundingClientRect();
  const pageHeight = measureRect.zHeight;

  // Convert mm margins to px
  const paddingBottomPx = mmToPx(15);
  const paddingTopMargin = mmToPx(15);

  // Effective content area per page after subtracting margins and header
  const pageLimit =
    pageHeight - paddingTopMargin - paddingBottomPx - pageHeader;

  const pages = [];
  let currentPage = [];
  let currentHeight = 0;
  let pageNum = 1;

  console.log(
    `%c START PAGINATION | Limit: ${pageLimit.toFixed(2)}px `,
    "background: #222; color: #bada55; font-weight: bold;",
  );

  // Pre-measure all children heights in one pass to avoid layout thrashing
  const heights = children.map(
    (child) => child.getBoundingClientRect().zHeight,
  );

  children.forEach((child, index) => {
    const h = heights[index];
    const block = blockMap.get(child.dataset.id);

    // Skip orphan DOM nodes that don't map to a known block
    if (!block) return;

    // First block on a page gets a top padding discount (ptValue)
    const isFirstBlockInPage = currentPage.length === 0;
    let effectiveHeight = isFirstBlockInPage ? h - ptValue : h;

    // If block doesn't fit, flush current page and start a new one
    if (currentHeight + effectiveHeight > pageLimit + 0.5) {
      console.log(
        `%c ---- PAGE ${pageNum} FULL (Break) ---- `,
        "color: #ff4500; font-weight: bold;",
      );

      pages.push(currentPage);
      currentPage = [];
      currentHeight = 0;
      pageNum++;

      // Recalculate discount since this block is now first on the new page
      effectiveHeight = h - ptValue;
    }

    currentPage.push(block.node);
    currentHeight += effectiveHeight;

    // Log block placement details for debugging pagination
    console.log(
      `[P${pageNum}] ID: %c${child.dataset.id.padEnd(8)}%c | ` +
        `H-Asli: ${h.toFixed(2)}px | ` +
        `H-Efektif: %c${effectiveHeight.toFixed(2)}px%c | ` +
        `Total: %c${currentHeight.toFixed(2)}px%c / ${pageLimit.toFixed(2)}px`,
      "color: #2196F3; font-weight: bold;",
      "color: inherit;",
      "color: #4CAF50; font-weight: bold;",
      "color: inherit;",
      "color: #E91E63; font-weight: bold;",
      "color: inherit;",
    );
  });

  // Push the last page if it has any remaining blocks
  if (currentPage.length) {
    pages.push(currentPage);
    console.log(
      `%c END PAGINATION | Total Pages: ${pageNum} `,
      "background: #222; color: #bada55; font-weight: bold;",
    );
  }

  return pages;
}

// ─── PUBLIC API ───────────────────────────────────────────────────────────────

// Paginate blocks for lighting pole report layout
// ptValue and pageHeader are tuned specifically for lighting pole page dimensions
export function paginateA4LightingPole({ blocks, measureRef }) {
  return paginateA4({
    blocks,
    measureRef,
    ptValue: 20, // top padding discount for lighting pole layout
    pageHeader: 22.53, // header height for lighting pole page
  });
}

// Paginate blocks for signboard report layout
// ptValue and pageHeader are tuned specifically for signboard page dimensions
export function paginateA4Signboard({ blocks, measureRef }) {
  return paginateA4({
    blocks,
    measureRef,
    ptValue: 15, // top padding discount for signboard layout
    pageHeader: 21.53, // header height for signboard page
  });
}
