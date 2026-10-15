import { useState, useEffect, useRef, useCallback } from "react";
import { validateSvg } from "../utils/schematicValidator";

export const DEFAULT_SCHEMATIC_URL =
  import.meta.env.VITE_SCHEMATIC_URL || "http://127.0.0.1:8080";

/**
 * useSchematicBridge
 * React hook to manage postMessage communication with Amir's vanilla JS Schematic application.
 */
export function useSchematicBridge({
  iframeRef,
  schematicUrl = DEFAULT_SCHEMATIC_URL,
  projectType,
  onApplied,
  onCancel,
  onError,
}) {
  const [isReady, setIsReady] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  // Schematic state loaded from sessionStorage or initialized
  const [schematicData, setSchematicData] = useState(() => {
    if (!projectType) return { generatedSvg: "", editedSvg: null, isStale: false, standardId: null };
    try {
      const saved = sessionStorage.getItem(`${projectType}_schematic_data`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      void e;
    }
    return { generatedSvg: "", editedSvg: null, isStale: false, standardId: null };
  });

  const lastRequestIdRef = useRef("");
  const targetOrigin = (() => {
    try {
      return new URL(schematicUrl, window.location.href).origin;
    } catch {
      return "*";
    }
  })();

  // Synchronize state changes to sessionStorage
  const updateData = useCallback(
    (updater) => {
      setSchematicData((prev) => {
        const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
        if (projectType) {
          sessionStorage.setItem(`${projectType}_schematic_data`, JSON.stringify(next));
        }
        return next;
      });
    },
    [projectType]
  );

  // Send message safely to the schematic iframe
  const postToSchematic = useCallback(
    (message) => {
      if (!iframeRef?.current?.contentWindow) {
        return false;
      }
      try {
        iframeRef.current.contentWindow.postMessage(message, targetOrigin);
        return true;
      } catch (err) {
        console.error("[SchematicBridge] postMessage error:", err);
        return false;
      }
    },
    [iframeRef, targetOrigin]
  );

  // Command: SET_PARAMETERS
  const sendParameters = useCallback(
    (payload, { standardId = null, replaceManualEdit = false } = {}) => {
      const reqId = `gen-${Date.now()}`;
      lastRequestIdRef.current = reqId;
      setIsGenerating(true);
      setError(null);

      postToSchematic({
        version: 1,
        type: "SET_PARAMETERS",
        requestId: reqId,
        payload: {
          ...payload,
          replaceManualEdit,
        },
      });

      updateData((prev) => ({
        ...prev,
        ...(standardId ? { standardId } : {}),
        ...(replaceManualEdit || (standardId && prev.standardId && prev.standardId !== standardId)
          ? { editedSvg: null }
          : {}),
      }));
      return reqId;
    },
    [postToSchematic, updateData]
  );

  // Command: OPEN_EDITOR
  const openEditor = useCallback(() => {
    const reqId = `edit-${Date.now()}`;
    postToSchematic({
      version: 1,
      type: "OPEN_EDITOR",
      requestId: reqId,
      payload: {},
    });
  }, [postToSchematic]);

  // Command: OPEN_PROJECT
  const openProject = useCallback(
    (project) => {
      const reqId = `proj-${Date.now()}`;
      lastRequestIdRef.current = reqId;
      setIsGenerating(true);
      setError(null);

      postToSchematic({
        version: 1,
        type: "OPEN_PROJECT",
        requestId: reqId,
        payload: { project },
      });
    },
    [postToSchematic]
  );

  // Listen for incoming messages from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (targetOrigin !== "*" && event.origin !== targetOrigin) return;

      if (iframeRef?.current && event.source !== iframeRef.current.contentWindow) {
        return;
      }

      // Check for cancel / close signals from iframe
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

      if (isCancel) {
        if (onCancel) onCancel();
        return;
      }

      const { version, type, requestId, payload } = event.data || {};
      if (version !== 1) return;

      switch (type) {
        case "SCHEMATIC_EDITOR_CANCELLED":
        case "SCHEMATIC_CANCEL":
        case "SCHEMATIC_CANCELLED":
        case "SCHEMATIC_CANCELED":
        case "SCHEMATIC_CLOSE":
        case "CLOSE_EDITOR":
        case "CANCEL_EDITOR":
        case "EDITOR_CANCEL":
        case "EDITOR_CANCELLED":
        case "EDITOR_CLOSED": {
          if (onCancel) onCancel();
          break;
        }
        case "SCHEMATIC_READY": {
          setIsReady(true);
          break;
        }

        case "SCHEMATIC_GENERATED": {
          setIsGenerating(false);
          if (requestId && lastRequestIdRef.current && requestId !== lastRequestIdRef.current) {
            return;
          }

          try {
            const rawSvg = payload?.svg || "";
            const cleanSvg = rawSvg ? validateSvg(rawSvg) : "";

            updateData((prev) => ({
              ...prev,
              generatedSvg: cleanSvg || prev.generatedSvg,
              isStale: Boolean(payload?.isStale),
              ...(cleanSvg && !payload?.blocked ? { editedSvg: null } : {}),
            }));
          } catch (err) {
            console.error("[SchematicBridge] Generated SVG validation error:", err);
            setError(err.message);
            if (onError) onError(err.message);
          }
          break;
        }

        case "SCHEMATIC_APPLIED": {
          try {
            const rawSvg = payload?.svg || "";
            const cleanSvg = validateSvg(rawSvg);

            updateData((prev) => ({
              ...prev,
              editedSvg: cleanSvg,
              isStale: false,
            }));

            if (onApplied) onApplied(cleanSvg);
          } catch (err) {
            console.error("[SchematicBridge] Applied SVG validation error:", err);
            setError(err.message);
            if (onError) onError(err.message);
          }
          break;
        }

        case "SCHEMATIC_ERROR": {
          setIsGenerating(false);
          const msg = payload?.message || "Terjadi kesalahan pada schematic.";
          setError(msg);
          if (onError) onError(msg);
          break;
        }

        default:
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [iframeRef, targetOrigin, updateData, onApplied, onCancel, onError]);

  // Command: REGENERATE / RESET TO ORIGINAL
  const resetToDefault = useCallback(
    (payload, { standardId = null } = {}) => {
      updateData((prev) => ({
        ...prev,
        editedSvg: null,
      }));
      if (payload) {
        // Pass 1: immediate reset and regenerate
        sendParameters(payload, {
          standardId,
          replaceManualEdit: true,
        });

        // Pass 2: automatic second cycle behind the scenes to guarantee layout stabilization
        setTimeout(() => {
          sendParameters(payload, {
            standardId,
            replaceManualEdit: true,
          });
        }, 120);
      }
    },
    [sendParameters, updateData]
  );

  const finalSvg = schematicData.editedSvg ?? schematicData.generatedSvg;

  return {
    isReady,
    setIsReady,
    isGenerating,
    error,
    schematicData,
    finalSvg,
    sendParameters,
    resetToDefault,
    openEditor,
    openProject,
    updateData,
  };
}
