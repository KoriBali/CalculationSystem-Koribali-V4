/**
 * schematicValidator.js
 * Validates and sanitizes SVG markup from external/editor sources before embedding into the DOM or report.
 * Whitelists safe vector graphics elements and attributes, and strips executable scripts or unsafe links.
 */

const SVG_NS = "http://www.w3.org/2000/svg";

const ALLOWED_ELEMENTS = new Set([
  "svg",
  "g",
  "defs",
  "title",
  "desc",
  "metadata",
  "path",
  "line",
  "polyline",
  "polygon",
  "rect",
  "circle",
  "ellipse",
  "text",
  "tspan",
  "clipPath",
  "linearGradient",
  "radialGradient",
  "stop",
  "marker",
]);

/**
 * Validates and sanitizes an SVG string.
 * @param {string} svg - Raw SVG XML string
 * @returns {string} Sanitized SVG XML string
 * @throws {Error} if SVG is invalid or contains prohibited content
 */
export function validateSvg(svg) {
  if (typeof svg !== "string" || !svg.trim()) {
    throw new Error("SVG content must be a non-empty string.");
  }

  if (svg.length > 8_000_000) {
    throw new Error("SVG size exceeds 8MB limit.");
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, "image/svg+xml");
  const root = doc.documentElement;

  if (
    doc.querySelector("parsererror") ||
    root.localName !== "svg" ||
    root.namespaceURI !== SVG_NS
  ) {
    throw new Error("Format SVG tidak valid.");
  }

  if (doc.doctype) {
    throw new Error("DOCTYPE tidak didukung dalam SVG.");
  }

  const allNodes = [...root.querySelectorAll("*"), root];
  for (const node of allNodes) {
    if (node.closest("metadata")) {
      if (node.localName === "metadata") node.remove();
      continue;
    }

    if (node.namespaceURI !== SVG_NS || !ALLOWED_ELEMENTS.has(node.localName)) {
      throw new Error(`Elemen SVG tidak didukung: ${node.localName}`);
    }

    for (const attr of [...node.attributes]) {
      const name = attr.localName.toLowerCase();
      if (
        name.startsWith("on") ||
        name === "href" ||
        name === "src" ||
        name === "base" ||
        /(?:javascript:|@import|expression\s*\()/i.test(attr.value) ||
        (/url\s*\(/i.test(attr.value) && !/^url\(\s*#[\w.-]+\s*\)$/i.test(attr.value))
      ) {
        throw new Error(`Atribut SVG tidak didukung: ${attr.name}`);
      }
    }
  }

  // Ensure valid viewBox (standard A4 portrait: 0 0 210 297)
  if (!root.hasAttribute("viewBox")) {
    const width = root.getAttribute("width");
    const height = root.getAttribute("height");
    if (!/^[\d.]+$/.test(width || "") || !/^[\d.]+$/.test(height || "")) {
      root.setAttribute("viewBox", "0 0 210 297");
    } else {
      root.setAttribute("viewBox", `0 0 ${width} ${height}`);
    }
  }

  return new XMLSerializer().serializeToString(root);
}
