import emailIcon from "@/assets/icons/email.svg";
import linkedinIcon from "@/assets/icons/linkedin.svg";
import githubIcon from "@/assets/icons/github.svg";
import emailIconDark from "@/assets/icons/emailDark.svg";
import linkedinIconDark from "@/assets/icons/linkedinDark.svg";
import githubIconDark from "@/assets/icons/githubDark.svg";

export const userData = {
	username: "ThiagoPereiraUFV",
	profileName: "Thiago Pereira",
	contact: {
		email: {
			url: 'mailto:thiago.marinho.pereira.98@gmail.com',
			icon: emailIcon,
			iconDark: emailIconDark
		},
		linkedin: {
			url: 'https://www.linkedin.com/in/thiagopereira98',
			icon: linkedinIcon,
			iconDark: linkedinIconDark
		},
		github: {
			url: 'https://github.com/ThiagoPereiraUFV',
			icon: githubIcon,
			iconDark: githubIconDark
		},
	}
} as const;