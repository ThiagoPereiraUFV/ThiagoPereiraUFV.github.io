import { ILowCodeProjectsProps } from "@/interfaces/low-code-projects";
import N8NWorkflow from "@/components/molecules/N8NWorkflow";

export default function LowCodeProjects({ projects }: ILowCodeProjectsProps) {
  return (
    <section
      id="no-code-projects"
      className="tw-grid tw-grid-cols-1 tw-px-10 lg:tw-px-20 tw-gap-4"
    >
      <h2 className="tw-text-3xl">No-code/Low-code Projects</h2>
      <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-4"></div>
      {projects.map((project) => (
        <N8NWorkflow key={project.id} workflow={project} />
      ))}
    </section>
  );
}
