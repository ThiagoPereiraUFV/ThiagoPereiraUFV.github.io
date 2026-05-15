import { ImageResponse } from "next/og";
import TPBadge from "@/components/atoms/TPBadge";

export const dynamic = "force-static";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <TPBadge size={32} borderRadius={7} fontSize={20} letterSpacing={-0.5} />,
    { ...size },
  );
}
