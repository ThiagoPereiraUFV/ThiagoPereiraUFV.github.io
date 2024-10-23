import { IFooterProps } from "@/interfaces/footer";
import Link from "next/link";
import Image from "next/image";

export default function Footer(props: IFooterProps) {
  return (
    <footer id="contact" className="tw-grid tw-grid-cols-1 tw-gap-4">
      <p className="tw-text-2xl tw-text-center">You can reach me via:</p>
      <div className="tw-flex tw-flex-wrap tw-justify-center tw-gap-4">
        {Object.entries(props).map(([key, contact]) => (
          <Link key={key} href={contact.url} target="_blank">
            <Image
              className="tw-text-white"
              src={contact.icon}
              alt={key}
              width={75}
              height={75}
            />
          </Link>
        ))}
      </div>
    </footer>
  );
}
