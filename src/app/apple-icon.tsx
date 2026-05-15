import { ImageResponse } from "next/og";
import TPBadge from "@/components/atoms/TPBadge";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <TPBadge size={180} borderRadius={40} fontSize={76} letterSpacing={-3} />,
    { ...size },
  );
}
