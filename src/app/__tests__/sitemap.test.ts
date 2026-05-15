import sitemap from "../sitemap";
import { userData } from "@/helpers/userdata";

describe("sitemap", () => {
	it("should return an array with one entry", () => {
		const result = sitemap();
		expect(Array.isArray(result)).toBe(true);
		expect(result).toHaveLength(1);
	});

	it("should include the site URL", () => {
		const result = sitemap();
		expect(result[0].url).toBe(userData.siteUrl);
	});

	it("should set changeFrequency to monthly", () => {
		const result = sitemap();
		expect(result[0].changeFrequency).toBe("monthly");
	});

	it("should set priority to 1", () => {
		const result = sitemap();
		expect(result[0].priority).toBe(1);
	});

	it("should include a lastModified date", () => {
		const result = sitemap();
		expect(result[0].lastModified).toBeInstanceOf(Date);
	});
});
