export type InsightType = "summary" | "risk" | "action" | "deadline";

export interface Insight {
  type: InsightType;
  title: string;
  description: string;
  priority?: "low" | "medium" | "high";
}

export interface Invoice {
  id: string;
  date: string;
  supplier: string;

  gstin?: string;

  gstAmount: string;
  totalAmount: string;

  status: "Processed" | "Pending" | "Error";

  // ✅ FIXED
  tdsAmount?: string;   // or number
  tcsAmount?: string;   // or number

  insights: Insight[];
}
