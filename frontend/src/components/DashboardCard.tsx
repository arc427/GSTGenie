type Props = {
    title: string;
    value: string;
    subtitle?: string;
    accent?: "green" | "red" | "blue";
  };
  
  export function DashboardCard({ title, value, subtitle, accent = "green" }: Props) {
    const accentClass =
      accent === "green"
        ? "text-emerald-600"
        : accent === "red"
        ? "text-rose-600"
        : "text-sky-600";
  
    return (
      <div className="rounded-2xl bg-white px-5 py-4 shadow-sm border border-slate-100 flex flex-col gap-1">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
          {title}
        </div>
        <div className={`text-2xl font-semibold ${accentClass}`}>{value}</div>
        {subtitle && (
          <div className="text-xs text-slate-500 font-medium">{subtitle}</div>
        )}
      </div>
    );
  }
  