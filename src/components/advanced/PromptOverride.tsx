import { useLightingStore } from "@/stores/lightingStore";
import { buildPrompt } from "@/services/promptEngine";
import { useState, useEffect } from "react";

export function PromptOverride() {
  const settings = useLightingStore((s) => s.settings);
  const customPrompt = useLightingStore((s) => s.customPrompt);
  const setCustomPrompt = useLightingStore((s) => s.setCustomPrompt);
  const productShotPrompts = useLightingStore((s) => s.productShotPrompts);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const autoPrompt = buildPrompt(settings, productShotPrompts);

  useEffect(() => {
    if (!editing) {
      setDraft(customPrompt || autoPrompt);
    }
  }, [autoPrompt, customPrompt, editing]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p
          className="text-[11px] font-medium uppercase tracking-wider"
          style={{ color: "var(--text-secondary)" }}
        >
          Prompt Preview
        </p>
        <button
          className="text-[10px] font-medium"
          style={{ color: "var(--accent)" }}
          onClick={() => {
            if (editing) {
              if (draft !== autoPrompt) {
                setCustomPrompt(draft);
              } else {
                setCustomPrompt(null);
              }
              setEditing(false);
            } else {
              setDraft(customPrompt || autoPrompt);
              setEditing(true);
            }
          }}
        >
          {editing ? "Save" : "Edit"}
        </button>
      </div>

      {editing ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={5}
          className="w-full px-4 py-3 rounded-xl text-[11px] leading-relaxed resize-none outline-none"
          style={{
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
            border: "1px solid var(--accent)",
          }}
        />
      ) : (
        <div
          className="px-4 py-3 rounded-xl text-[11px] leading-relaxed max-h-28 overflow-y-auto"
          style={{
            background: "var(--bg-secondary)",
            color: "var(--text-secondary)",
          }}
        >
          {customPrompt || autoPrompt}
        </div>
      )}

      {customPrompt && (
        <button
          className="text-[10px] self-start font-medium"
          style={{ color: "var(--accent)" }}
          onClick={() => setCustomPrompt(null)}
        >
          Reset to auto-generated
        </button>
      )}
    </div>
  );
}
