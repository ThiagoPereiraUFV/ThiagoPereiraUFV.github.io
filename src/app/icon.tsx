import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #2563eb 100%)",
        borderRadius: 7,
      }}
    >
      <span
        style={{
          color: "#ffffff",
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: -0.5,
          lineHeight: 1,
        }}
      >
        TP
      </span>
    </div>,
    { ...size },
  );
}
