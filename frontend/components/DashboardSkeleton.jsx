// components/DashboardSkeleton.jsx
export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-navy-950 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-navy-900 border-b border-navy-700 p-4">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-navy-700 rounded"></div>
          <div className="flex gap-2">
            <div className="h-10 w-64 bg-navy-700 rounded"></div>
            <div className="h-10 w-20 bg-navy-700 rounded"></div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Skeleton */}
        <div className="hidden md:block w-80 bg-navy-900 border-r border-navy-700 p-6">
          <div className="h-8 w-32 bg-navy-700 rounded mb-4"></div>
          <div className="h-4 w-24 bg-navy-700 rounded mb-2"></div>
          <div className="h-10 w-20 bg-navy-700 rounded mt-4"></div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 p-6">
          <div className="bg-navy-900 border border-navy-700 rounded-2xl p-6 mb-6">
            <div className="h-8 w-64 bg-navy-700 rounded mb-4"></div>
            <div className="flex gap-4">
              <div className="flex-1 h-12 bg-navy-700 rounded"></div>
              <div className="h-12 w-32 bg-navy-700 rounded"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3 bg-navy-900 border border-navy-700 rounded-2xl p-6">
              <div className="h-6 w-48 bg-navy-700 rounded"></div>
            </div>
            <div className="md:col-span-3 bg-navy-900 border border-navy-700 rounded-xl p-4">
              <div className="h-6 w-32 bg-navy-700 rounded"></div>
            </div>
            <div className="md:col-span-2 bg-navy-900 border border-navy-700 rounded-2xl p-4">
              <div className="h-64 bg-navy-700 rounded"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-navy-900 border border-navy-700 rounded-xl p-4">
                  <div className="h-6 w-20 bg-navy-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
