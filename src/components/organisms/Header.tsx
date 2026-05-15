import { IHeaderProps } from "@/interfaces/header";
import Link from "next/link";

export default function Header(props: IHeaderProps) {
  return (
    <header
      className="tw:sticky tw:top-0 tw:z-50"
      style={{
        background: "var(--header-bg)",
        borderBottom: "1px solid var(--header-border)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="tw:flex tw:items-center tw:justify-between tw:gap-4 tw:px-6 tw:lg:px-12 tw:py-4">
        <h1 className="tw:text-xl tw:font-bold tw:tracking-tight">
          <span className="gradient-text">{props.title}</span>
        </h1>
        <nav>
          <ul className="tw:flex tw:flex-wrap tw:justify-end tw:gap-1">
            {props.sections.map((section, index) => (
              <li key={index}>
                <Link
                  href={`#${section.trim().toLowerCase().replace(/\s+/g, "-")}`}
                  className="tw:relative tw:inline-block tw:px-3 tw:py-1.5 tw:text-sm tw:font-medium tw:rounded-md tw:transition-all tw:duration-200"
                  style={{ color: "var(--muted)" }}
                >
                  <span
                    className="tw:relative tw:z-10 tw:transition-colors tw:duration-200"
                    style={{ color: "inherit" }}
                  >
                    {section}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
