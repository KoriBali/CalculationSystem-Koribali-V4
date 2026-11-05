import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export function ActionLoadingModal({
  open,
  title = "Saving...",
  subtitle = "Please wait while your request is being processed.",
}) {
  if (!open) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        {/* Clean subtle backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        {/* Minimalist modal card matching design in screenshot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-sm rounded-2xl bg-white p-7 shadow-xl border border-slate-100 flex flex-col items-center text-center"
        >
          {/* Elegant Circular Spinner in light-blue circle */}
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#0d3b66]">
            <Loader2 className="h-6 w-6 animate-spin text-[#0d3b66]" />
          </div>

          {/* Title & Subtitle */}
          <h3 className="text-base font-semibold text-slate-800 tracking-tight">
            {title}
          </h3>
          <p className="mt-1.5 text-sm text-slate-500 leading-relaxed max-w-[260px]">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}

export default ActionLoadingModal;

