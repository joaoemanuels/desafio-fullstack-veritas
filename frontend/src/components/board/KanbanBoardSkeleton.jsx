import ColumnSkeleton from "./ColumnSkeleton";

export default function KanbanBoardSkeleton() {
  return (
    <main className="p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ColumnSkeleton cardCount={2} />
        <ColumnSkeleton cardCount={1} />
        <ColumnSkeleton cardCount={1} />
      </div>
    </main>
  );
}
