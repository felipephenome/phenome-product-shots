import { useMemo, useState, useEffect } from "react";
import { useLightingStore } from "@/stores/lightingStore";
import { PRODUCT_SHOT_PRESETS, type ProductShotId } from "@/types";
import { getDefaultProductShotClause } from "@/services/promptEngine";

export function ProductPlacementPanel() {
  const productShot = useLightingStore((s) => s.settings.productShot ?? "none");
  const setProductShot = useLightingStore((s) => s.setProductShot);
  const productShotPrompts = useLightingStore((s) => s.productShotPrompts);
  const setProductShotPromptOverride = useLightingStore(
    (s) => s.setProductShotPromptOverride
  );
  const resetProductShotPrompt = useLightingStore((s) => s.resetProductShotPrompt);

  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const active = PRODUCT_SHOT_PRESETS.find((p) => p.id === productShot);
  const defaultClause = getDefaultProductShotClause(productShot);
  const overrideClause = productShotPrompts[productShot];
  const effectiveClause = overrideClause ?? defaultClause;
  const isOverridden = overrideClause !== undefined && overrideClause !== defaultClause;

  useEffect(() => {
    setEditing(false);
    setDraft(effectiveClause);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productShot]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCT_SHOT_PRESETS;
    return PRODUCT_SHOT_PRESETS.filter(
      (p) =>
        p.label.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.14em]"
          style={{ color: "var(--text-secondary)" }}
        >
          Product placement
        </p>
        <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
          {PRODUCT_SHOT_PRESETS.length - 1} shot templates for bottles, capsules, and packaging — not people.
        </p>
      </div>

      <div className="relative">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--text-tertiary)" }}
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search shot templates…"
          className="w-full rounded-full text-[11px] outline-none"
          style={{
            background: "var(--bg-tertiary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
            padding: "7px 12px 7px 30px",
          }}
        />
        {query && (
          <button
            type="button"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full"
            style={{ color: "var(--text-tertiary)" }}
            onClick={() => setQuery("")}
            aria-label="Clear search"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      <div
        className="rounded-2xl p-3"
        style={{
          background: "var(--bg-tertiary)",
          border: "1px solid var(--border)",
        }}
      >
        {filtered.length === 0 ? (
          <p className="text-[11px] text-center py-4" style={{ color: "var(--text-tertiary)" }}>
            No templates match &ldquo;{query}&rdquo;
          </p>
        ) : (
          <div
            className="grid grid-cols-2 gap-2 overflow-y-auto"
            style={{ maxHeight: 320 }}
          >
            {filtered.map((preset) => {
              const isActive = productShot === preset.id;
              const hasOverride =
                productShotPrompts[preset.id] !== undefined &&
                productShotPrompts[preset.id] !== preset.promptClause;
              return (
                <button
                  key={preset.id}
                  type="button"
                  className="text-left rounded-xl transition-all relative"
                  style={{
                    padding: "10px 12px",
                    background: isActive
                      ? "var(--text-primary)"
                      : "var(--bg-secondary)",
                    color: isActive
                      ? "var(--bg-primary)"
                      : "var(--text-primary)",
                    border: isActive
                      ? "1px solid transparent"
                      : "1px solid var(--border)",
                    boxShadow: isActive ? "var(--shadow-sm)" : "none",
                  }}
                  onClick={() => setProductShot(preset.id as ProductShotId)}
                  title={preset.description}
                >
                  {hasOverride && (
                    <span
                      className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
                      style={{ background: isActive ? "var(--bg-primary)" : "var(--accent)" }}
                      title="Prompt edited"
                    />
                  )}
                  <span className="block text-[11px] font-semibold leading-tight pr-3">
                    {preset.label}
                  </span>
                  <span
                    className="block text-[10px] mt-1 leading-snug"
                    style={{
                      color: isActive
                        ? "color-mix(in srgb, var(--bg-primary) 72%, transparent)"
                        : "var(--text-tertiary)",
                    }}
                  >
                    {preset.description}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {active && active.id !== "none" && (
        <div
          className="rounded-xl flex flex-col gap-2.5"
          style={{
            background: "var(--accent-soft)",
            padding: "12px",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold" style={{ color: "var(--accent)" }}>
              Starting prompt — {active.label}
            </p>
            <div className="flex items-center gap-2 shrink-0">
              {isOverridden && !editing && (
                <button
                  type="button"
                  className="text-[10px] font-medium"
                  style={{ color: "var(--text-secondary)" }}
                  onClick={() => {
                    resetProductShotPrompt(active.id);
                    setDraft(active.promptClause);
                  }}
                >
                  Revert
                </button>
              )}
              <button
                type="button"
                className="text-[10px] font-medium"
                style={{ color: "var(--accent)" }}
                onClick={() => {
                  if (editing) {
                    if (draft.trim() !== defaultClause.trim()) {
                      setProductShotPromptOverride(active.id, draft);
                    } else {
                      resetProductShotPrompt(active.id);
                    }
                    setEditing(false);
                  } else {
                    setDraft(effectiveClause);
                    setEditing(true);
                  }
                }}
              >
                {editing ? "Save" : "Edit"}
              </button>
            </div>
          </div>

          {editing ? (
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={5}
              className="w-full rounded-lg text-[11px] leading-relaxed resize-none outline-none"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--accent)",
                padding: "10px 12px",
              }}
            />
          ) : (
            <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {effectiveClause}
            </p>
          )}

          <p className="text-[10px] leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
            {isOverridden
              ? "Edited from the default starting prompt for this template."
              : "Default starting prompt. Edit to customize, then generate."}{" "}
            Composition changes are combined with your lighting setup. Best with Nano Banana Pro or IC-Light.
          </p>
        </div>
      )}
    </div>
  );
}
