import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export function ReportLoadingModal({
  open,
  title = "Generating Report...",
  subtitle = "Please wait while your calculation report is being prepared.",
}) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Clean subtle backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        {/* Minimalist modal card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-sm rounded-2xl bg-white p-7 shadow-xl border border-slate-100 flex flex-col items-center text-center"
        >
          {/* Elegant Spinner */}
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
    </AnimatePresence>
  );
}

export default ReportLoadingModal;
