import { IProjectsProps } from "@/interfaces/projects";
import Link from "next/link";

export default function Projects(props: IProjectsProps) {
  return (
    <section
      id="projects"
      className="tw:grid tw:grid-cols-1 tw:px-6 tw:lg:px-16 tw:gap-10 tw:scroll-mt-20"
    >
      <h2 className="section-heading">Projects</h2>
      <div className="tw:grid tw:grid-cols-1 tw:lg:grid-cols-2 tw:gap-5">
        {props.repos.map((repo) => (
          <div
            key={repo.id}
            className="portfolio-card tw:flex tw:flex-col tw:gap-3 tw:px-6 tw:py-5"
          >
            <div className="tw:flex tw:items-start tw:justify-between tw:gap-3">
              <Link
                href={repo.html_url}
                className="tw:text-lg tw:font-semibold tw:leading-snug tw:transition-opacity tw:duration-200 tw:hover:opacity-70"
                target="_blank"
              >
                {repo.name}
              </Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="tw:shrink-0 tw:mt-1"
                style={{ color: "var(--muted)" }}
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </div>
            {repo.description && (
              <p
                className="tw:text-sm tw:leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                {repo.description}
              </p>
            )}
            {repo.language && (
              <div className="tw:mt-auto tw:pt-2">
                <span className="lang-badge">{repo.language}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
