export interface IWebsiteProject {
	url: string;
	name: string;
}

export interface IWebsiteProjectsProps {
	websites: IWebsiteProject[];
}

export interface IWebsiteSlideProps {
	url: string;
	name: string;
	isActive: boolean;
	shouldLoad: boolean;
	index: number;
	total: number;
}
