export interface ILowCodeProjectsProps {
	projects: ILowCodeProject[];
}

export interface ILowCodeProject {
	createdAt: string;
	updatedAt: string;
	id: string;
	name: string;
	active: boolean;
	nodes: unknown[];
	connections: unknown;
	settings: unknown;
	staticData: unknown;
	meta: unknown;
	pinData: unknown;
	versionId: string;
	triggerCount: number;
	shared: unknown[];
	tags: unknown[];
}