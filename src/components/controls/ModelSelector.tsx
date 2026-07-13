import { useLightingStore } from "@/stores/lightingStore";
import { AVAILABLE_MODELS, type RelightModel } from "@/types";

export function ModelSelector() {
  const selectedModel = useLightingStore((s) => s.selectedModel);
  const setModel = useLightingStore((s) => s.setModel);

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "var(--bg-tertiary)",
        border: "1px solid var(--border)",
      }}
    >
      <label
        className="text-[10px] font-medium uppercase tracking-wider mb-2.5 block"
        style={{ color: "var(--text-secondary)" }}
      >
        Model
      </label>
      <select
        value={selectedModel}
        onChange={(e) => setModel(e.target.value as RelightModel)}
        className="w-full px-4 py-3 rounded-xl text-[12px] cursor-pointer outline-none"
        style={{
          background: "var(--bg-secondary)",
          color: "var(--text-primary)",
          border: "1px solid var(--border)",
        }}
      >
        {AVAILABLE_MODELS.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
    </div>
  );
}
