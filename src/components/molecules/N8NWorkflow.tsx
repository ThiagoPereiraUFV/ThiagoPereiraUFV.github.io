"use client";

import { ILowCodeProject } from "@/interfaces/low-code-projects";

interface IN8NWorkflowProps {
  workflowKey: string;
  workflow: ILowCodeProject;
}

export default function N8NWorkflow({
  workflowKey,
  workflow,
}: IN8NWorkflowProps) {
  return (
    <div>
      <h3 className="tw:text-sm">{workflow.name}</h3>
      <n8n-demo
        data-key={workflowKey}
        workflow={JSON.stringify(workflow)}
        // frame="true"
        clicktointeract="true"
        collapseformobile="true"
      />
    </div>
  );
}
