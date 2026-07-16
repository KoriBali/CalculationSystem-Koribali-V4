import React from "react";
import { Database } from "lucide-react";

export default function ProjectDatabasePage() {
  return (
    <div className="p-6 md:p-8 w-full max-w-5xl mx-auto h-[calc(100vh-100px)] flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <Database className="w-8 h-8 text-slate-400" />
      </div>
      <h1 className="text-2xl font-bold text-slate-700 mb-2">
        Project Database
      </h1>
      <p className="text-slate-500 max-w-md">
        Halaman ini disiapkan untuk fitur manajemen database proyek di masa mendatang (List, Buka Referensi, Save As, dll).
      </p>
    </div>
  );
}
