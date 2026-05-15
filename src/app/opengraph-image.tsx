import { ImageResponse } from "next/og";
import { userData } from "@/helpers/userdata";
import SocialCard from "@/components/atoms/SocialCard";

export const dynamic = "force-static";
export const alt = `${userData.profileName} - Software Engineer Portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <SocialCard
      width={1200}
      height={630}
      padding="64px 72px"
      badge={{ size: 110, borderRadius: 24, fontSize: 52, marginBottom: 36 }}
      name={{ fontSize: 88, marginBottom: 20 }}
      role={{ fontSize: 40, marginBottom: 44 }}
      footer={{ dividerWidth: 44, fontSize: 28 }}
    />,
    { ...size },
  );
}
