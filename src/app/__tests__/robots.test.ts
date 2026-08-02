import robots, { dynamic } from "../robots";
import { userData } from "@/helpers/userdata";

describe("robots", () => {
	it("should export force-static dynamic config", () => {
		expect(dynamic).toBe("force-static");
	});

	it("should return a robots configuration object", () => {
		const result = robots();
		expect(result).toBeDefined();
		expect(typeof result).toBe("object");
	});

	it("should allow all user agents", () => {
		const result = robots();
		const rules = result.rules as { userAgent: string; allow: string };
		expect(rules.userAgent).toBe("*");
	});

	it("should allow all paths", () => {
		const result = robots();
		const rules = result.rules as { userAgent: string; allow: string };
		expect(rules.allow).toBe("/");
	});

	it("should include the sitemap URL", () => {
		const result = robots();
		expect(result.sitemap).toBe(`${userData.siteUrl}/sitemap.xml`);
	});
});
