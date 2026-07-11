// components/AIInsight.jsx
export default function AIInsight({ score }) {
  if (!score) return null;

  const insight =
    score.score > 700
      ? { text: "Perfect weather for outdoor events.", cls: "bg-emerald-500/10 border-emerald-500/40 text-emerald-300" }
      : score.score > 500
      ? { text: "Moderate conditions, plan carefully.", cls: "bg-amber-500/10 border-amber-500/40 text-amber-300" }
      : { text: "High risk, consider rescheduling.", cls: "bg-red-500/10 border-red-500/40 text-red-300" };

  return (
    <div className={`md:col-span-3 border p-4 rounded-xl ${insight.cls}`}>
      <h2 className="font-bold">🧠 AI Insight</h2>
      <p className="opacity-90">{insight.text}</p>
    </div>
  );
}
