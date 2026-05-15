import { ImageResponse } from "next/og";
import { userData } from "@/helpers/userdata";
import SocialCard from "@/components/atoms/SocialCard";

export const dynamic = "force-static";
export const alt = `${userData.profileName} - Software Engineer Portfolio`;
export const size = { width: 1200, height: 600 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    <SocialCard
      width={1200}
      height={600}
      padding="56px 72px"
      badge={{ size: 100, borderRadius: 22, fontSize: 48, marginBottom: 32 }}
      name={{ fontSize: 82, marginBottom: 18 }}
      role={{ fontSize: 36, marginBottom: 40 }}
      footer={{ dividerWidth: 40, fontSize: 26 }}
    />,
    { ...size },
  );
}
