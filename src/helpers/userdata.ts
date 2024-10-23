import emailIcon from "@/assets/icons/email.svg";
import linkedinIcon from "@/assets/icons/linkedin.svg";
import githubIcon from "@/assets/icons/github.svg";

export const userData = {
	username: "ThiagoPereiraUFV",
	profileName: "Thiago Pereira",
	contact: {
		email: {
			url: 'mailto:thiago.marinho.pereira.98@gmail.com',
			icon: emailIcon
		},
		linkedin: {
			url: 'https://www.linkedin.com/in/thiagopereira98',
			icon: linkedinIcon
		},
		github: {
			url: 'https://github.com/ThiagoPereiraUFV',
			icon: githubIcon
		},
	}
} as const;