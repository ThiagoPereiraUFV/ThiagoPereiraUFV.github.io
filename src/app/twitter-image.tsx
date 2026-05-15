import { ImageResponse } from "next/og";
import { userData } from "@/helpers/userdata";

export const dynamic = "force-static";
export const alt = `${userData.profileName} - Software Engineer Portfolio`;
export const size = { width: 1200, height: 600 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 600,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        padding: "56px 72px",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e3a5f 55%, #2563eb 100%)",
        fontFamily: "sans-serif",
      }}
    >
      {/* Avatar / initials badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 90,
          height: 90,
          borderRadius: 20,
          background: "rgba(255,255,255,0.12)",
          border: "2px solid rgba(255,255,255,0.25)",
          marginBottom: 28,
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: 38,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1,
          }}
        >
          TP
        </span>
      </div>

      {/* Name */}
      <div
        style={{
          color: "#ffffff",
          fontSize: 58,
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: -2,
          marginBottom: 14,
        }}
      >
        {userData.profileName}
      </div>

      {/* Role */}
      <div
        style={{
          color: "rgba(255,255,255,0.7)",
          fontSize: 28,
          fontWeight: 400,
          lineHeight: 1.4,
          marginBottom: 36,
        }}
      >
        Full Stack Software Engineer
      </div>

      {/* Divider + URL */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 3,
            background: "#60a5fa",
            borderRadius: 2,
          }}
        />
        <span
          style={{
            color: "#60a5fa",
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: 0.5,
          }}
        >
          {userData.siteUrl.replace("https://", "")}
        </span>
      </div>
    </div>,
    { ...size },
  );
}
