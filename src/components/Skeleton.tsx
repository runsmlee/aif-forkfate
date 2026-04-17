interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps): JSX.Element {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
      aria-hidden="true"
    />
  );
}

export function AnalysisSkeleton(): JSX.Element {
  return (
    <section className="py-12 px-4 sm:px-6" aria-label="Loading analysis results" aria-busy="true">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <Skeleton className="h-4 w-32 mx-auto mb-4" />
          <Skeleton className="h-20 w-20 mx-auto mb-3 rounded-full" />
          <Skeleton className="h-10 w-24 mx-auto" />
        </div>
        <div className="grid grid-cols-3 gap-3 mb-8">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-24 mb-8" />
        <div className="text-center">
          <Skeleton className="h-10 w-48 mx-auto" />
        </div>
      </div>
    </section>
  );
}
