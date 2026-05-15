import { userData } from "@/helpers/userdata";
import TPBadge from "@/components/atoms/TPBadge";

interface ISocialCardProps {
  width: number;
  height: number;
  padding: string;
  badge: {
    size: number;
    borderRadius: number;
    fontSize: number;
    marginBottom: number;
  };
  name: { fontSize: number; marginBottom: number };
  role: { fontSize: number; marginBottom: number };
  footer: { dividerWidth: number; fontSize: number };
}

export default function SocialCard({
  width,
  height,
  padding,
  badge,
  name,
  role,
  footer,
}: ISocialCardProps) {
  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        padding,
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e3a5f 55%, #2563eb 100%)",
        fontFamily: "sans-serif",
      }}
    >
      {/* Avatar / initials badge */}
      <div style={{ display: "flex", marginBottom: badge.marginBottom }}>
        <TPBadge
          size={badge.size}
          borderRadius={badge.borderRadius}
          fontSize={badge.fontSize}
          variant="glass"
        />
      </div>

      {/* Name */}
      <div
        style={{
          display: "flex",
          color: "#ffffff",
          fontSize: name.fontSize,
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: -2,
          marginBottom: name.marginBottom,
        }}
      >
        {userData.profileName}
      </div>

      {/* Role */}
      <div
        style={{
          display: "flex",
          color: "rgba(255,255,255,0.7)",
          fontSize: role.fontSize,
          fontWeight: 400,
          lineHeight: 1.4,
          marginBottom: role.marginBottom,
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
            width: footer.dividerWidth,
            height: 3,
            background: "#60a5fa",
            borderRadius: 2,
          }}
        />
        <span
          style={{
            color: "#60a5fa",
            fontSize: footer.fontSize,
            fontWeight: 500,
            letterSpacing: 0.5,
          }}
        >
          {userData.siteUrl.replace("https://", "")}
        </span>
      </div>
    </div>
  );
}
