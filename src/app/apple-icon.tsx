import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #2563eb 100%)",
        borderRadius: 40,
      }}
    >
      <span
        style={{
          color: "#ffffff",
          fontSize: 76,
          fontWeight: 800,
          letterSpacing: -3,
          lineHeight: 1,
        }}
      >
        TP
      </span>
    </div>,
    { ...size },
  );
}
