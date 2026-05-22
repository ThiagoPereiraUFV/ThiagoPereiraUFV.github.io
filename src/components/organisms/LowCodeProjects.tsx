"use client";

import { useEffect, useRef, useState } from "react";
import { ILowCodeProjectsProps } from "@/interfaces/low-code-projects";
import { ILowCodeProject } from "@/interfaces/low-code-projects";
import N8NWorkflow from "@/components/molecules/N8NWorkflow";

function LazyWorkflow({ project }: { project: ILowCodeProject }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {isVisible && <N8NWorkflow workflowKey={project.id} workflow={project} />}
    </div>
  );
}

export default function LowCodeProjects({ projects }: ILowCodeProjectsProps) {
  return (
    <section
      id="low-code-projects"
      className="tw:grid tw:grid-cols-1 tw:px-10 tw:lg:px-20 tw:gap-4"
    >
      <h2 className="tw:text-3xl">Low-code/No-code Projects</h2>
      <div className="tw:grid tw:grid-cols-1 tw:lg:grid-cols-2 tw:gap-4">
        {projects.map((project) => (
          <LazyWorkflow key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
