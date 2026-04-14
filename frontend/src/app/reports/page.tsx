"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { Invoice } from "../../types/invoice";

const BASELINE_DATA = [
  { name: 'Jan', liability: 4000, itc: 2400 },
  { name: 'Feb', liability: 3000, itc: 1398 },
  { name: 'Mar', liability: 9800, itc: 9000 },
  { name: 'Apr', liability: 3908, itc: 2800 },
  { name: 'May', liability: 4800, itc: 3800 },
  { name: 'Jun', liability: 3800, itc: 4300 },
  { name: 'Jul', liability: 4300, itc: 2300 },
  { name: 'Aug', liability: 5300, itc: 4100 },
  { name: 'Sep', liability: 4500, itc: 3200 },
  { name: 'Oct', liability: 6000, itc: 4500 },
  { name: 'Nov', liability: 0, itc: 0 }, 
  { name: 'Dec', liability: 0, itc: 0 }, 
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function ReportsPage() {
  const [chartData, setChartData] = useState(BASELINE_DATA);
  const [totalITC, setTotalITC] = useState(0);
  const [pieData, setPieData] = useState<any[]>([]);
  
  const [monthlySales, setMonthlySales] = useState(200000); 

  // ✅ NEW: Save Sales to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("userSalesInput", monthlySales.toString());
  }, [monthlySales]);

  // ✅ NEW: Load saved Sales when page opens
  useEffect(() => {
    // Only run on mount
    const saved = localStorage.getItem("userSalesInput");
    if (saved) setMonthlySales(parseFloat(saved));
    
    // We re-run the calculateLiveMetrics explicitly in the dependency array
  }, []);

  useEffect(() => {
    async function calculateLiveMetrics() {
      try {
        const res = await fetch('/api/invoices');
        const data = await res.json();
        
        if (data.invoices) {
          let currentITC = 0;
          const categories: Record<string, number> = { "Services": 0, "General": 0 };
          const liveChartData = JSON.parse(JSON.stringify(BASELINE_DATA));

          data.invoices.forEach((inv: Invoice) => {
            const gstVal = parseFloat(inv.gstAmount?.replace(/[₹,]/g, '') || "0");
            const totalVal = parseFloat(inv.totalAmount?.replace(/[₹,]/g, '') || "0");
            currentITC += gstVal;

            const sup = (inv.supplier || "").toLowerCase();
            if (sup.includes('tech') || sup.includes('dell')) categories["Electronics"] = (categories["Electronics"] || 0) + totalVal;
            else if (sup.includes('uber')) categories["Travel"] = (categories["Travel"] || 0) + totalVal;
            else if (sup.includes('starbucks') || sup.includes('lays')) categories["Food"] = (categories["Food"] || 0) + totalVal;
            else categories["Services"] += totalVal;

            const monthIndex = new Date(inv.date).getMonth();
            if (liveChartData[monthIndex]) liveChartData[monthIndex].itc += gstVal;
            else if (liveChartData[10]) liveChartData[10].itc += gstVal;
          });

          // Liability Logic
          const liabilityAmount = monthlySales * 0.18;
          if (liveChartData[10]) liveChartData[10].liability = liabilityAmount;

          // ✅ FIX: Removed the static '+ 32000' offset.
          setTotalITC(currentITC); 
          
          setChartData(liveChartData);
          
          const newPie = Object.keys(categories)
            .filter(k => categories[k] > 0)
            .map(k => ({ name: k, value: categories[k] }));
          setPieData(newPie);
        }
      } catch (e) { console.error(e); }
    }
    calculateLiveMetrics();
  }, [monthlySales]);

  const currentLiability = monthlySales * 0.18;
  const netPayable = Math.max(0, currentLiability - totalITC);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Tax Liability Report</h1>
            <p className="text-slate-500 text-sm">Input Tax Credit vs. Output Liability</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="text-right">
                <p className="text-xs font-bold text-slate-500 uppercase">November Sales</p>
                <p className="text-[10px] text-slate-400">Enter Total Sales Amount</p>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
              <input 
                type="number" 
                value={monthlySales}
                onChange={(e) => setMonthlySales(Number(e.target.value))}
                className="pl-6 pr-4 py-2 w-40 border border-slate-300 rounded-lg text-right font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tax Liability (Output)</p>
            <h3 className="text-3xl font-bold text-red-600 mt-2">₹{currentLiability.toLocaleString()}</h3>
            <p className="text-xs text-slate-400 mt-1">18% of Sales</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">ITC Available (Input)</p>
            <h3 className="text-3xl font-bold text-green-600 mt-2">₹{totalITC.toLocaleString()}</h3>
            <p className="text-xs text-slate-400 mt-1">From Uploaded Bills</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Tax Payable</p>
            <h3 className="text-3xl font-bold text-blue-700 mt-2">₹{netPayable.toLocaleString()}</h3>
            <p className="text-xs text-slate-400 mt-1">Cash to be paid</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px]">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Tax Trend (Yearly)</h3>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false}/>
                <YAxis fontSize={12} axisLine={false} tickLine={false}/>
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Legend />
                <Bar dataKey="liability" name="Liability" fill="#ef4444" radius={[4,4,0,0]} />
                <Bar dataKey="itc" name="ITC Claimed" fill="#22c55e" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm h-[400px]">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Expense Breakdown</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom"/>
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="flex h-full items-center justify-center text-slate-400">No Expenses Yet</div>}
          </div>
        </div>
      </main>
    </div>
  );
}