import { FilePlus } from "lucide-react";

export default function EmptyState({ message = "Nenhum item encontrado" }) {
  return (
    <div className="flex min-h-45 flex-col items-center justify-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100">
        <FilePlus size={40} className="text-zinc-400" />
      </div>

      <p className="text-sm text-zinc-400">{message}</p>
    </div>
  );
}
