export interface IFooterProps {
	username: string;
	profileName: string;
	contact: {
		[key: string]: {
			url: string;
			icon: string;
		};
	}
}