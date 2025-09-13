import { userData } from "@/helpers/userdata";

interface ImageProps {
  src: string;
  width: number;
  height: number;
  alt?: string;
}

export interface IContactItem {
  url: string;
  icon: ImageProps | { default: string };
  iconDark: ImageProps | { default: string };
}

export interface IContact {
  email: IContactItem;
  linkedin: IContactItem;
  github: IContactItem;
}

export interface IFooterProps {
	username: string;
	profileName: string;
	contact: IContact | typeof userData.contact;
}

// Type for actual userData
export type UserDataContact = typeof userData.contact;