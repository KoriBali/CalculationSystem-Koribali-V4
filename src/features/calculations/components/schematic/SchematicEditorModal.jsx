import React, { useState, useEffect } from "react";
import { X, Loader2, RotateCcw } from "lucide-react";
import { DEFAULT_SCHEMATIC_URL } from "../../hooks/useSchematicBridge";

/**
 * SchematicEditorModal
 * Popup modal that displays Amir's embedded SVG-Edit editor to manually modify lines and texts.
 */
export function SchematicEditorModal({
  isOpen,
  onClose,
  iframeRef,
  schematicUrl = DEFAULT_SCHEMATIC_URL,
  onOpenEditor,
  onReset,
  isEdited = false,
}) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const srcWithOrigin = (() => {
    try {
      const u = new URL(schematicUrl, window.location.href);
      u.searchParams.set("parentOrigin", window.location.origin);
      return u.toString();
    } catch {
      return schematicUrl;
    }
  })();

  // Whenever modal opens, auto-trigger openEditor in iframe
  useEffect(() => {
    if (!isOpen || !onOpenEditor) return;
    const timer1 = setTimeout(() => onOpenEditor(), 100);
    const timer2 = setTimeout(() => onOpenEditor(), 600);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen, onOpenEditor]);

  // Listen for cancel / close messages from iframe editor
  useEffect(() => {
    if (!isOpen) return;

    const handleWindowMessage = (event) => {
      if (iframeRef?.current && event.source !== iframeRef.current.contentWindow) {
        return;
      }
      const rawData = event.data;
      const rawType = typeof rawData === "string" ? rawData : rawData?.type;
      const rawAction = rawData?.action || rawData?.payload?.action;

      const isCancel =
        rawType === "SCHEMATIC_EDITOR_CANCELLED" ||
        rawType === "SCHEMATIC_CANCEL" ||
        rawType === "SCHEMATIC_CANCELLED" ||
        rawType === "SCHEMATIC_CANCELED" ||
        rawType === "SCHEMATIC_CLOSE" ||
        rawType === "CLOSE_EDITOR" ||
        rawType === "CANCEL_EDITOR" ||
        rawType === "EDITOR_CANCEL" ||
        rawType === "EDITOR_CANCELLED" ||
        rawType === "EDITOR_CLOSED" ||
        rawType === "CANCEL" ||
        rawType === "CLOSE" ||
        rawAction === "cancel" ||
        rawAction === "close" ||
        (typeof rawType === "string" &&
          (rawType.toLowerCase().includes("cancel") || rawType.toLowerCase().includes("close")));

      if (isCancel && onClose) {
        onClose();
      }
    };

    window.addEventListener("message", handleWindowMessage);
    return () => {
      window.removeEventListener("message", handleWindowMessage);
    };
  }, [isOpen, onClose, iframeRef]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6 print:hidden transition-all duration-200 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none -z-50 invisible"
      }`}
    >
      <div className="relative w-full max-w-6xl h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 px-5 sm:px-6 py-3.5 border-b border-gray-200 bg-white shrink-0">
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-semibold text-slate-900">
              Edit Schematic
            </h2>
            <p className="mt-0.5 text-xs text-gray-500 truncate">
              Click &quot;Apply to Schematic&quot; in the editor toolbar to save
              changes to the report.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isEdited && onReset && (
              <>
                <button
                  type="button"
                  onClick={onReset}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Discard manual edits and reset to default schematic"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
                <div className="w-px h-5 bg-gray-200 mx-1" aria-hidden="true" />
              </>
            )}

            <button
              onClick={onClose}
              type="button"
              className="inline-flex items-center justify-center w-8 h-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Close"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body / Iframe */}
        <div className="relative flex-1 bg-slate-100 p-2 overflow-hidden">
          {!iframeLoaded && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-100/80 backdrop-blur-sm">
              <Loader2 className="w-8 h-8 text-[#0d3b66] animate-spin mb-2" />
              <p className="text-xs font-medium text-slate-600">Loading Drawing Engine & SVG Editor...</p>
            </div>
          )}

          <iframe
            ref={iframeRef}
            src={srcWithOrigin}
            title="Schematic SVG Editor"
            onLoad={() => {
              setIframeLoaded(true);
              if (isOpen && onOpenEditor) {
                setTimeout(() => onOpenEditor(), 200);
              }
              try {
                const doc = iframeRef.current?.contentDocument;
                if (doc) {
                  const cancelBtn = doc.getElementById("cancel-schematic");
                  if (cancelBtn) {
                    cancelBtn.addEventListener("click", () => {
                      onClose?.();
                    });
                  }
                }
              } catch (e) {
                void e;
              }
            }}
            className="w-full h-full border-0 rounded-xl bg-white shadow-inner"
            allow="clipboard-write"
          />
        </div>
      </div>
    </div>
  );
}

export default SchematicEditorModal;
