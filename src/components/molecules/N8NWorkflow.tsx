"use client";

import { ILowCodeProject } from "@/interfaces/low-code-projects";

if (typeof window !== "undefined") {
  import("@n8n_io/n8n-demo-component/n8n-demo.bundled.js");
}

interface IN8NWorkflowProps {
  key: string;
  workflow: ILowCodeProject;
}

export default function N8NWorkflow({ key, workflow }: IN8NWorkflowProps) {
  return (
    <div>
      <h3 className="tw:text-sm">{workflow.name}</h3>
      <n8n-demo key={key} workflow={JSON.stringify(workflow)}></n8n-demo>
    </div>
  );
}
