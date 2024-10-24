import { IHeaderProps } from "@/interfaces/header";
import Link from "next/link";

export default function Header(props: IHeaderProps) {
  return (
    <header className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-justify-between tw-gap-y-4 lg:tw-gap-4 tw-px-12 tw-py-5 tw-text-center lg:tw-text-justify">
      <h1 className="tw-col-span-2 tw-text-4xl">{props.title}</h1>
      <nav>
        <ul className="tw-flex tw-flex-wrap tw-justify-center lg:tw-justify-end tw-gap-4">
          {props.sections.map((section, index) => (
            <li
              className="tw-transition tw-ease-in-out tw-duration-300 hover:tw--translate-y-0.5 hover:tw--translate-x-0.5"
              key={index}
            >
              <Link href={`#${section.trim().toLowerCase()}`}>{section}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
