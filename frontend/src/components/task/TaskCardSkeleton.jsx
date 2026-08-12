export default function TaskCardSkeleton() {
  return (
    <article className="relative overflow-hidden rounded-xl bg-white p-4 shadow-sm sm:p-5">
      <div className="absolute left-0 top-0 h-full w-1 bg-zinc-200" />

      <div className="pr-8">
        <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-200 sm:h-6" />
        <div className="mt-3 h-4 w-full animate-pulse rounded bg-zinc-100 sm:mt-4" />
      </div>

      <div className="my-3 h-px bg-zinc-100 sm:my-5" />

      <div className="flex items-center justify-between gap-2">
        <div className="h-6 w-20 animate-pulse rounded-md bg-zinc-200" />
        <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-zinc-200 sm:h-9 sm:w-9" />
      </div>
    </article>
  );
}
