import type { MetadataRoute } from "next";
import { userData } from "@/helpers/userdata";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: userData.siteUrl,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 1,
		},
	];
}
