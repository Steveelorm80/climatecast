// components/BestDayCard.jsx
export default function BestDayCard({ score, formattedDate }) {
  return (
    <div className="md:col-span-3 bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-bold">
        🌟 Best Day: {score?.bestDayName} ({formattedDate})
      </h2>
      <p>Score: {Math.round(score?.score || 0)}</p>
    </div>
  );
}