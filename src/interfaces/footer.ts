import { userData } from "@/helpers/userdata";

export interface IFooterProps {
	username: string;
	profileName: string;
	contact: typeof userData.contact;
}