import { Insight } from "../types/invoice";

interface Props {
  insights: Insight[];
}

export default function InsightsPanel({ insights }: Props) {
  // 1. Empty State
  if (!insights || insights.length === 0) {
    return (
      <div className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
        <p className="text-slate-500 text-sm">
          🚀 Upload an invoice to generate AI-powered tax insights here.
        </p>
      </div>
    );
  }

  // 2. Styles
  const getStyle = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("risk")) return "bg-red-50 border-red-100 text-red-900";
    if (t.includes("deadline")) return "bg-yellow-50 border-yellow-100 text-yellow-900"; // Added yellow for deadline
    if (t.includes("action")) return "bg-blue-50 border-blue-100 text-blue-900";
    return "bg-green-50 border-green-100 text-green-900";
  };

  const getIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("risk")) return "⚠️";
    if (t.includes("deadline")) return "⏰";
    if (t.includes("action")) return "⚡";
    return "💡";
  };

  return (
    <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="text-xl">✨</span> Proactive Insights (Live)
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((item, index) => (
          <div 
            key={index} 
            className={`p-5 rounded-xl border shadow-sm transition-all hover:shadow-md ${getStyle(item.type)}`}
          >
            {/* Header: Icon + Type */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{getIcon(item.type)}</span>
              <h3 className="font-bold uppercase text-xs tracking-wider opacity-80">
                {item.type}
              </h3>
            </div>

            {/* 👇 FIX: Use 'title' and 'description' instead of 'message' */}
            <h4 className="font-bold text-md mb-1">
              {item.title}
            </h4>
            <p className="text-sm leading-relaxed opacity-90">
              {item.description}
            </p>

          </div>
        ))}
      </div>
    </div>
  );
}