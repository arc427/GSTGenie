"use client"; // Required to allow dynamic import with ssr: false

import dynamic from 'next/dynamic';
import Sidebar from "../../components/Sidebar";

// 1. Dynamically import the component, disabling SSR to avoid jsPDF conflict
const FilingsContent = dynamic(() => import('./FilingsContent'), { ssr: false });

export default function FilingsPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />

            <main className="flex-1 p-8">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">GST Filings</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage and submit your monthly GSTR-1 and GSTR-3B returns.</p>
                </header>

                {/* Filing History (Static Table) */}
                <section className="mb-10">
                    <h2 className="text-lg font-bold text-slate-700 mb-4">Recent Filing History</h2>
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-semibold">
                                <tr>
                                    <th className="px-6 py-3">Return Type</th><th className="px-6 py-3">Period</th><th className="px-6 py-3">Date Filed</th><th className="px-6 py-3">ARN (Ack No.)</th><th className="px-6 py-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr><td className="px-6 py-4 font-medium text-slate-900">GSTR-3B</td><td className="px-6 py-4 text-slate-600">Oct 2025</td><td className="px-6 py-4 text-slate-600">20 Nov 2025</td><td className="px-6 py-4 font-mono text-xs text-slate-500">AA2910230001234</td><td className="px-6 py-4 text-right"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Filed</span></td></tr>
                                <tr><td className="px-6 py-4 font-medium text-slate-900">GSTR-1</td><td className="px-6 py-4 text-slate-600">Oct 2025</td><td className="px-6 py-4 text-slate-600">11 Nov 2025</td><td className="px-6 py-4 text-right"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Filed</span></td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>
                
                {/* 2. RENDER THE DYNAMIC, CLIENT-SIDE COMPONENT */}
                <FilingsContent /> 
                
            </main>
        </div>
    );
}