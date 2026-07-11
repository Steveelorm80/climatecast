// components/BestDayCard.jsx
export default function BestDayCard({ score, formattedDate }) {
  return (
    <div className="md:col-span-3 bg-navy-900 border border-navy-700 p-6 rounded-2xl">
      <h2 className="text-xl font-bold text-ink-100">
        <span className="text-amber-400">🌟</span> Best Day: {score?.bestDayName} ({formattedDate})
      </h2>
      <p className="text-ink-500 mt-1">Score: {Math.round(score?.score || 0)}</p>
    </div>
  );
}
