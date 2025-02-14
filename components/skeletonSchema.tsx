import { Skeleton } from "@/components/ui/skeleton";

type SkeletonSchemaProps = {
  grid: number;
};

export default function SkeletonSchema({ grid }: SkeletonSchemaProps) {
  return (
    <div className="flex gap-4 flex-wrap">
      {Array.from({ length: grid }).map((_, i) => (
        <div key={i} className="w-full sm:w-1/2 lg:w-1/3 flex flex-col gap-2">
          <Skeleton className="w-full h-[200px] rounded-md" />
          <Skeleton className="w-3/4 h-4" />
          <Skeleton className="w-1/2 h-4" />
          <Skeleton className="w-1/3 h-4" />
        </div>
      ))}
    </div>
  );
}
