export function SkeletonText3Lines() {
  return (
    <div className="animate-pulse space-y-2 w-full">
      <div className="h-2 bg-gray-300 rounded w-1/5" />
      <div className="flex items-center justify-between flex-1 mt-5">
        <div className="h-4 bg-gray-300 rounded w-2/6" />
        <div className="flex items-center space-x-2 w-2/6 justify-end">
          <div className="h-6 bg-gray-300 rounded w-1/10" />
          <div className="h-6 bg-gray-300 rounded w-1/10" />
          <div className="h-6 bg-gray-300 rounded w-1/10" />
        </div>
      </div>
      <div className="h-4 bg-gray-300 rounded w-full mt-5" />
    </div>
  );
}
