interface ImageLabelsProps {
  showComparison: boolean;
}

export function ImageLabels({ showComparison }: ImageLabelsProps) {
  if (!showComparison) return null;

  return (
    <>
      <div className="absolute top-4 left-4 z-10">
        <span
          className="badge"
          style={{
            background: "var(--accent-soft)",
            color: "var(--accent)",
            border: "1px solid rgba(32, 58, 133, 0.25)",
          }}
        >
          Original
        </span>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <span
          className="badge"
          style={{
            background: "var(--accent-soft)",
            color: "var(--accent)",
            border: "1px solid rgba(32, 58, 133, 0.25)",
          }}
        >
          Relight
        </span>
      </div>
    </>
  );
}
