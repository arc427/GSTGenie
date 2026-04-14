import Sidebar from "../../components/Sidebar";
import InsightsPanel from "../../components/InsightsPanel";

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar />
      <main className="flex-1 py-6 px-8">
        <h1 className="text-xl font-semibold text-slate-800 mb-4">Insights</h1>
        <InsightsPanel insights={[]} />
      </main>
    </div>
  );
}
