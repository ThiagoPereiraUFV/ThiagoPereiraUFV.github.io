interface ITPBadgeProps {
  size: number;
  borderRadius: number;
  fontSize: number;
  /** "solid" = full gradient fill (icon/apple-icon); "glass" = translucent overlay (SocialCard) */
  variant?: "solid" | "glass";
  /** Override letterSpacing. Defaults to -2 */
  letterSpacing?: number;
}

export default function TPBadge({
  size,
  borderRadius,
  fontSize,
  variant = "solid",
  letterSpacing = -2,
}: ITPBadgeProps) {
  const background =
    variant === "solid"
      ? "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #2563eb 100%)"
      : "rgba(255,255,255,0.12)";

  const border =
    variant === "glass" ? "2px solid rgba(255,255,255,0.25)" : undefined;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius,
        background,
        ...(border ? { border } : {}),
      }}
    >
      <span
        style={{
          color: "#ffffff",
          fontSize,
          fontWeight: 800,
          letterSpacing,
          lineHeight: 1,
        }}
      >
        TP
      </span>
    </div>
  );
}
