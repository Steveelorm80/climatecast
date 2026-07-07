// utils/riskUtils.js
export const getRiskColor = (risk) => {
  switch(risk) {
    case 'HIGH': return 'bg-red-500 text-white';
    case 'MEDIUM': return 'bg-yellow-500 text-black';
    case 'LOW': return 'bg-green-500 text-white';
    default: return 'bg-gray-500 text-white';
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