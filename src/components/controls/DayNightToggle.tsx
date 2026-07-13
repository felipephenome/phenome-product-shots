import { useLightingStore } from "@/stores/lightingStore";

export function DayNightToggle() {
  const timeOfDay = useLightingStore((s) => s.settings.timeOfDay);
  const setTimeOfDay = useLightingStore((s) => s.setTimeOfDay);

  return (
    <div
      className="grid grid-cols-2 gap-2 p-4 rounded-2xl"
      style={{
        background: "var(--bg-tertiary)",
        border: "1px solid var(--border)",
      }}
    >
      {(["day", "night"] as const).map((t) => (
        <button
          key={t}
          className="py-3.5 rounded-lg text-[11px] font-medium transition-all capitalize"
          style={{
            background:
              timeOfDay === t ? "var(--bg-secondary)" : "transparent",
            color:
              timeOfDay === t
                ? "var(--text-primary)"
                : "var(--text-secondary)",
            boxShadow: timeOfDay === t ? "var(--shadow-sm)" : "none",
          }}
          onClick={() => setTimeOfDay(t)}
        >
          {t === "day" ? "Day" : "Night"}
        </button>
      ))}
    </div>
  );
}
