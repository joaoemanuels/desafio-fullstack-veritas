export default function Loading({ message = "Carregando..." }) {
  return (
    <div className="flex min-h-50 flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-800" />

      <p className="text-sm font-medium text-zinc-500">{message}</p>
    </div>
  );
}
