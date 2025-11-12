// src/components/ui/SkeletonLoader.jsx

export default function SkeletonLoader({ cardCount = 6 }) {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-neutral-700 rounded w-1/2 mx-auto" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: cardCount }).map((_, i) => (
          <div key={i} className="bg-surface-primary p-5 rounded-lg border border-[color:var(--border-default)] shadow">
            <div className="h-6 bg-neutral-700 rounded mb-4" />
            <div className="h-8 bg-neutral-600 rounded mb-2" />
            <div className="h-3 bg-neutral-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}