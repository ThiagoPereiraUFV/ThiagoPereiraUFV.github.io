import { IGithubUserRepo } from "./github";

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
	};
}