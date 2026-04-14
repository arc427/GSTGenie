export function FilingActions() {
    const handleReview = () => {
      alert("Here you could open a detailed draft view (demo).");
    };
  
    const handleApprove = () => {
      alert("Filing approved! (Simulated RPA submission)");
    };
  
    return (
      <section className="mb-6">
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-800 mb-1">
              Agentic Actions
            </div>
            <p className="text-xs text-slate-600">
              GSTR-1 draft for August is ready. Please review and approve before{" "}
              <span className="font-semibold">11 Sep</span>.
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleReview}
              className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Review &amp; Edit
            </button>
            <button
              onClick={handleApprove}
              className="px-4 py-2 rounded-lg bg-blue-600 text-xs font-medium text-white hover:bg-blue-700 shadow-sm shadow-blue-500/40"
            >
              Approve for Filing
            </button>
          </div>
        </div>
      </section>
    );
  }
  