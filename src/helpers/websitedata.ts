import { IWebsiteProject } from "@/interfaces/website-projects";

export async function filterIframeAllowed(
	websites: IWebsiteProject[]
): Promise<IWebsiteProject[]> {
	const results = await Promise.allSettled(
		websites.map(async (site) => {
			const res = await fetch(site.url, {
				method: "HEAD",
				signal: AbortSignal.timeout(5000),
			});

			const xfo = res.headers.get("X-Frame-Options")?.toUpperCase();
			if (xfo === "DENY" || xfo === "SAMEORIGIN") {
				return null;
			}

			const csp = res.headers.get("Content-Security-Policy");
			if (csp) {
				const match = csp.match(/frame-ancestors\s+([^;]+)/i);
				if (match) {
					const tokens = match[1].trim().split(/\s+/);
					const isBlocked = tokens.every(
						(t) => t === "'none'" || t === "'self'"
					);
					if (isBlocked) return null;
				}
			}

			return site;
		})
	);

	return results
		.filter(
			(r): r is PromiseFulfilledResult<IWebsiteProject> =>
				r.status === "fulfilled" && r.value !== null
		)
		.map((r) => r.value);
}

export const websiteProjects: IWebsiteProject[] = [
	{
		url: "https://tishmanspeyergestora.com.br",
		name: "Tishman Speyer Gestora",
	},
	{ url: "https://tishmanspeyer.com.br", name: "Tishman Speyer Brasil" },
	{ url: "https://buscaileiloes.com.br", name: "BuscAI Leilões" },
	{ url: "https://atena.chat", name: "Atena Chat" },
	{ url: "https://easyvaluation.com.br", name: "Easy Valuation" },
	{
		url: "https://camargomaquinasfood.com.br",
		name: "Camargo Máquinas Food",
	},
	{ url: "https://protocolomapa.com.br", name: "Protocolo MAPA" },
	{ url: "https://meunorden.com.br", name: "Norden" },
	{ url: "https://milkroad.com.br", name: "Milk Road" },
	{ url: "https://benson.com.br", name: "Benson" },
	{ url: "https://mosincorporadora.com", name: "MOS Incorporadora" },
	{ url: "https://summitvisa.com", name: "Summit Visa" },
	{ url: "https://shortaway.com", name: "ShortAway" },
	{ url: "https://secret-santa.nl", name: "Secret Santa" },
	{
		url: "https://thiagopereiraufv.github.io/concepcao-arquitetura-vicosa",
		name: "Concepção Arquitetura",
	},
	{
		url: "https://thiagopereiraufv.github.io/premium-vicosa",
		name: "Premium Viçosa",
	},
	{
		url: "https://thiagopereiraufv.github.io/medcenter-vicosa",
		name: "Medcenter Viçosa",
	},
	{
		url: "https://thiagopereiraufv.github.io/dra-kiara-aguilar",
		name: "Dra. Kiara Aguilar",
	},
	{
		url: "https://thiagopereiraufv.github.io/extractify",
		name: "Extractify",
	},
];
