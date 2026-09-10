/**
 * preloadImages.js
 *
 * Warm the browser HTTP cache with a set of image URLs in the background so
 * that when a modal/diagram actually renders them, the <img> resolves from
 * cache with no skeleton flash.
 *
 * - Module-level `preloaded` Set: each URL is only ever fetched once per
 *   browser session, even if the calling component mounts/unmounts repeatedly.
 * - fetchPriority "low": this warm-up never competes for bandwidth with an
 *   image the user is currently waiting to see.
 */

const preloaded = new Set();

export function preloadImages(urls) {
  urls.forEach((src) => {
    if (!src || preloaded.has(src)) return;
    preloaded.add(src);
    const img = new Image();
    img.fetchPriority = "low";
    img.decoding = "async";
    img.src = src;
  });
}

/**
 * Runs `preloadImages(urls)` once the browser is idle, and returns a cleanup
 * function. Designed to be called straight from a `useEffect`:
 *
 *   useEffect(() => preloadImagesWhenIdle(URLS), []);
 */
export function preloadImagesWhenIdle(urls) {
  const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
  const cancelIdle = window.cancelIdleCallback || clearTimeout;
  const id = idle(() => preloadImages(urls));
  return () => cancelIdle(id);
}

// All coupling diagrams: the 10 grid thumbnails (CP-CaseN) shown in
// CouplingTypeModal + the 10 detail diagrams (CPdetail-CaseN) shown in
// CouplingCaseFormModal.
export const COUPLING_CASE_IMAGES = Array.from({ length: 10 }, (_, i) => i + 1).flatMap(
  (n) => [`/images/CP-Case${n}.svg`, `/images/CPdetail-Case${n}.svg`],
);
