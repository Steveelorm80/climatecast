// utils/riskUtils.js
export const getRiskColor = (risk) => {
  switch (risk) {
    case "HIGH":
      return "bg-red-500/15 text-red-300 border border-red-500/40";
    case "MEDIUM":
      return "bg-amber-500/15 text-amber-300 border border-amber-500/40";
    case "LOW":
      return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40";
    default:
      return "bg-navy-800 text-ink-300 border border-navy-700";
  }
};

export const estimateWindFromCondition = (condition) => {
  if (!condition) return "N/A";
  const conditionLower = condition.toLowerCase();
  if (conditionLower.includes("clear") || conditionLower.includes("sunny")) return "3-5 m/s";
  if (conditionLower.includes("clouds")) return "6-8 m/s";
  if (conditionLower.includes("rain")) return "10-12 m/s";
  if (conditionLower.includes("storm")) return "15-20 m/s";
  return "5-7 m/s";
};
