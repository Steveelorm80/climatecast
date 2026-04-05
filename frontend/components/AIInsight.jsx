// components/AIInsight.jsx
export default function AIInsight({ score }) {
  if (!score) return null;
  
  return (
    <div className="md:col-span-3 bg-green-100 p-4 rounded-xl">
      <h2 className="font-bold">🧠 AI Insight</h2>
      <p>
        {score.score > 700
          ? "Perfect weather for outdoor events."
          : score.score > 500
          ? "Moderate conditions, plan carefully."
          : "High risk, consider rescheduling."}
      </p>
    </div>
  );
}