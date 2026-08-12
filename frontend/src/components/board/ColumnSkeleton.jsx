import TaskCardSkeleton from "../task/TaskCardSkeleton";

export default function ColumnSkeleton({ cardCount = 2 }) {
  return (
    <section className="min-w-0">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-zinc-300" />
          <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
        </div>
        <div className="h-5 w-5 animate-pulse rounded-full bg-zinc-200" />
      </div>

      <div className="min-h-50 rounded-lg bg-slate-100 p-2 md:min-h-125">
        <div className="flex flex-col gap-2">
          {Array.from({ length: cardCount }).map((_, i) => (
            <TaskCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
