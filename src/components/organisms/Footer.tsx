import { IFooterProps } from "@/interfaces/footer";
import emailIcon from "@/assets/icons/email.svg";
import linkedinIcon from "@/assets/icons/linkedin.svg";
import githubIcon from "@/assets/icons/github.svg";
import Link from "next/link";
import Image from "next/image";

export default function Footer(props: IFooterProps) {
  return (
    <footer id="contact" className="tw-grid tw-grid-cols-1 tw-gap-4">
      <p className="tw-text-2xl tw-text-center">You can reach me via:</p>
      <div className="tw-flex tw-flex-wrap tw-justify-center tw-gap-4">
        <Link href={props.email} target="_blank">
          <Image
            className="tw-text-white"
            src={emailIcon.src}
            alt="Email"
            width={75}
            height={75}
          />
        </Link>
        <Link href={props.linkedin} target="_blank">
          <Image
            className="tw-text-white"
            src={linkedinIcon.src}
            alt="Linkedin"
            width={75}
            height={75}
          />
        </Link>
        <Link href={props.github} target="_blank">
          <Image
            className="tw-text-white"
            src={githubIcon.src}
            alt="Github"
            width={75}
            height={75}
          />
        </Link>
      </div>
    </footer>
  );
}
