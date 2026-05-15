import type { MetadataRoute } from "next";
import { userData } from "@/helpers/userdata";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap: `${userData.siteUrl}/sitemap.xml`,
	};
}
