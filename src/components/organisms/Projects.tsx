import { IProjectsProps } from "@/interfaces/projects";
import Link from "next/link";

export default function Projects(props: IProjectsProps) {
  return (
    <section
      id="projects"
      className="tw:grid tw:grid-cols-1 tw:px-10 tw:lg:px-20 tw:gap-4"
    >
      <h2 className="tw:text-3xl">Projects</h2>
      <div className="tw:grid tw:grid-cols-1 tw:lg:grid-cols-2 tw:gap-4">
        {props.repos.map((repo) => (
          <div
            key={repo.id}
            className="tw:flex tw:flex-col tw:gap-2 tw:border tw:rounded-lg tw:px-6 tw:py-4"
          >
            <Link
              href={repo.html_url}
              className="tw:text-2xl tw:transition tw:ease-in-out tw:duration-300 tw:hover:-translate-y-0.5 tw:hover:-translate-x-0.5"
              target="_blank"
            >
              {repo.name}
            </Link>
            <p>{repo.description}</p>
            <small>{repo.language}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
