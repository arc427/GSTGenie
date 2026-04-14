"use client";

type ToastProps = {
  message: string;
  show: boolean;
  onClose: () => void;
};

export default function Toast({ message, show, onClose }: ToastProps) {
  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex items-center gap-3 rounded-xl bg-slate-900 text-slate-50 px-4 py-3 shadow-xl shadow-slate-900/50 text-sm">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold">
          ✓
        </span>
        <span>{message}</span>
        <button
          className="ml-2 text-slate-400 hover:text-slate-200 text-lg leading-none"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  );
}
