import { PageContainer } from '@/app/src/components/layout/PageShell';
import { Skeleton, SkeletonStatTiles } from '@/app/src/components/ui/Skeleton';

export default function DashboardLoading() {
  return (
    <PageContainer>
      <div className="space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-3 w-full max-w-xl" />
      </div>

      <SkeletonStatTiles count={4} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {[0, 1].map((index) => (
          <div key={index} className="surface-card p-5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="mt-4 h-56 w-full" />
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
