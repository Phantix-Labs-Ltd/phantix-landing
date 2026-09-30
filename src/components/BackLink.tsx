import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function BackLink({ to = "/", label = "Return to the home page" }: { to?: string; label?: string }) {
  return (
    <Link to={to} className="-ml-2 inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200">
      <ArrowLeft size={15} /> {label}
    </Link>
  );
}
