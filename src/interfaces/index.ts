import { IGithubUserRepo } from "./github";
import { ILowCodeProject } from "./low-code-projects";
import { IWebsiteProject } from "./website-projects";

export interface IData {
	header: {
		title: "Thiago Pereira";
		sections: string[];
	};
	about: {
		aboutUserData: string;
	};
	projects: {
		repos: IGithubUserRepo[];
		lowCodeProjects: ILowCodeProject[];
		websiteProjects: IWebsiteProject[];
	};
}