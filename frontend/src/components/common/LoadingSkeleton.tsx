interface LoadingSkeletonProps {
  type?: 'card' | 'chart' | 'gauge' | 'text' | 'parameter' | 'page';
  count?: number;
}

function SkeletonCard() {
  return (
    <div className="glass-panel p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 skeleton-pulse rounded" />
        <div className="h-2 w-2 skeleton-pulse rounded-full" />
      </div>
      <div className="h-8 w-20 skeleton-pulse rounded" />
      <div className="flex items-center justify-between">
        <div className="h-3 w-16 skeleton-pulse rounded" />
      </div>
      <div className="h-1.5 w-full skeleton-pulse rounded-full" />
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="glass-panel p-4 space-y-4">
      <div className="h-3 w-32 skeleton-pulse rounded" />
      <div className="h-64 flex items-end gap-2 px-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 skeleton-pulse rounded-t"
            style={{ height: `${20 + Math.random() * 60}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function SkeletonGauge() {
  return (
    <div className="glass-panel p-4 flex flex-col items-center space-y-3">
      <div className="h-3 w-16 skeleton-pulse rounded" />
      <div className="w-24 h-24 skeleton-pulse rounded-full" />
    </div>
  );
}

function SkeletonParameter() {
  return (
    <div className="glass-panel p-3 space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 skeleton-pulse rounded" />
        <div className="h-2.5 w-20 skeleton-pulse rounded" />
      </div>
      <div className="h-5 w-16 skeleton-pulse rounded" />
      <div className="h-2.5 w-12 skeleton-pulse rounded" />
    </div>
  );
}

function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 skeleton-pulse rounded"
          style={{ width: `${70 + Math.random() * 30}%` }}
        />
      ))}
    </div>
  );
}

export default function LoadingSkeleton({ type = 'card', count = 1 }: LoadingSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (type === 'page') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 skeleton-pulse rounded" />
          <div className="h-7 w-48 skeleton-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.slice(0, 4).map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <SkeletonChart />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {items.slice(0, 4).map((i) => (
              <SkeletonGauge key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${type === 'parameter' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6' : type === 'gauge' ? 'grid-cols-2 gap-4' : ''}`}>
      {items.map((i) => {
        switch (type) {
          case 'card':
            return <SkeletonCard key={i} />;
          case 'chart':
            return <SkeletonChart key={i} />;
          case 'gauge':
            return <SkeletonGauge key={i} />;
          case 'parameter':
            return <SkeletonParameter key={i} />;
          case 'text':
            return <SkeletonText key={i} />;
          default:
            return <SkeletonCard key={i} />;
        }
      })}
    </div>
  );
}
