import { IProjectsProps } from "@/interfaces/projects";
import Link from "next/link";

export default function Projects(props: IProjectsProps) {
  return (
    <section>
      <h2>Projects</h2>
      <ul>
        {props.repos.map((repo) => (
          <li key={repo.id}>
            <Link href={repo.html_url} target="_blank">
              {repo.name}
            </Link>
            <p>{repo.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
