"use client";

// A "Download PDF" button. Uses the browser's native print dialog, where the
// user can pick "Save as PDF" or send it straight to a printer. No dependency,
// works offline, and prints crisp selectable text. Hidden in the printout via
// the `no-print` class + the @media print rules in globals.css.
export default function PrintButton({ label = "Download PDF" }: { label?: string }) {
  return (
    <button
      onClick={() => window.print()}
      title="Opens the print dialog — choose “Save as PDF” to download"
      className="no-print inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-bold text-white press flex-shrink-0"
      style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)", boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}
    >
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <path d="M8 1.5V9.5M8 9.5L5.2 6.7M8 9.5L10.8 6.7" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2.5 10.5V12.5C2.5 13.3 3.2 14 4 14H12C12.8 14 13.5 13.3 13.5 12.5V10.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {label}
    </button>
  );
}
