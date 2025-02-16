"use client";

import { ILowCodeProject } from "@/interfaces/low-code-projects";
import "@n8n_io/n8n-demo-component/n8n-demo.bundled.js";

interface IN8NWorkflowProps {
  key: string;
  workflow: ILowCodeProject;
}

export default function N8NWorkflow({ key, workflow }: IN8NWorkflowProps) {
  return (
    <>
      <h3>{workflow.name}</h3>
      <n8n-demo key={key} workflow={JSON.stringify(workflow)}></n8n-demo>
    </>
  );
}
