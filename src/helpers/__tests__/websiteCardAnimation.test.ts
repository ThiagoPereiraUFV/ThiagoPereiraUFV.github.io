import {
	FULL_VIEW_PAUSE,
	ANIMATION_START_DELAY,
	DURATION_MIN,
	DURATION_MAX,
	Q_IN,
	Q_HOLD,
	ZOOM_OUT_START,
	QUADRANTS,
	shuffle,
	buildKeyframes,
} from "../websiteCardAnimation";

describe("websiteCardAnimation constants", () => {
	it("should expose the full-view pause percentage and derived delay", () => {
		expect(FULL_VIEW_PAUSE).toBe(12);
		expect(ANIMATION_START_DELAY).toBe(FULL_VIEW_PAUSE / 2);
	});

	it("should expose a valid duration range", () => {
		expect(DURATION_MIN).toBeLessThan(DURATION_MAX);
	});

	it("should expose four quadrant in/hold stops within the animation range", () => {
		expect(Q_IN).toHaveLength(4);
		expect(Q_HOLD).toHaveLength(4);
		[...Q_IN, ...Q_HOLD].forEach((stop) => {
			expect(stop).toBeGreaterThanOrEqual(0);
			expect(stop).toBeLessThanOrEqual(100);
		});
	});

	it("should expose a zoom-out start before 100%", () => {
		expect(ZOOM_OUT_START).toBe(100 - FULL_VIEW_PAUSE);
	});

	it("should expose four quadrant transform strings", () => {
		expect(QUADRANTS).toHaveLength(4);
		QUADRANTS.forEach((q) => expect(q).toContain("scale(2)"));
	});
});

describe("shuffle", () => {
	it("should return an array with the same elements", () => {
		const input = [1, 2, 3, 4, 5];
		const result = shuffle(input);
		expect(result).toHaveLength(input.length);
		expect(result.slice().sort()).toEqual(input.slice().sort());
	});

	it("should not mutate the original array", () => {
		const input = [1, 2, 3];
		const copy = [...input];
		shuffle(input);
		expect(input).toEqual(copy);
	});

	it("should handle an empty array", () => {
		expect(shuffle([])).toEqual([]);
	});

	it("should handle a single-element array", () => {
		expect(shuffle([1])).toEqual([1]);
	});
});

describe("buildKeyframes", () => {
	it("should embed the animation name and all quadrant transforms", () => {
		const quadrants = ["q0", "q1", "q2", "q3"];
		const css = buildKeyframes("wzp-test", quadrants);

		expect(css).toContain("@keyframes wzp-test");
		quadrants.forEach((q) => expect(css).toContain(`transform: ${q};`));
		expect(css).toContain(`${ZOOM_OUT_START}%, 100%`);
	});
});
