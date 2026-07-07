// components/DashboardSkeleton.jsx
export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white p-4 shadow">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-300 rounded"></div>
          <div className="flex gap-2">
            <div className="h-10 w-64 bg-gray-300 rounded"></div>
            <div className="h-10 w-20 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Skeleton */}
        <div className="hidden md:block w-64 bg-blue-500 p-6">
          <div className="h-8 w-32 bg-white/20 rounded mb-4"></div>
          <div className="h-4 w-24 bg-white/20 rounded mb-2"></div>
          <div className="h-10 w-20 bg-white/20 rounded mt-4"></div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <div className="h-8 w-64 bg-gray-300 rounded mb-4"></div>
            <div className="flex gap-4">
              <div className="flex-1 h-12 bg-gray-300 rounded"></div>
              <div className="h-12 w-32 bg-gray-300 rounded"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3 bg-white rounded-2xl shadow p-6">
              <div className="h-6 w-48 bg-gray-300 rounded"></div>
            </div>
            <div className="md:col-span-3 bg-green-100 rounded-xl p-4">
              <div className="h-6 w-32 bg-green-300 rounded"></div>
            </div>
            <div className="md:col-span-2 bg-white rounded-2xl shadow p-4">
              <div className="h-64 bg-gray-300 rounded"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow p-4">
                  <div className="h-6 w-20 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}