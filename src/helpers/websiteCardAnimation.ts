/** Percentage of the total animation duration spent showing the full viewport
 *  at the start (and mirrored at the end before looping). Range: 0–20. */
export const FULL_VIEW_PAUSE = 20; // %

// Derived stops — 4 quadrants share the remaining time equally
const _quadrantSpan = (100 - FULL_VIEW_PAUSE * 2) / 4;
const _p = (i: number) => Math.round(FULL_VIEW_PAUSE + i * _quadrantSpan);

export const Q_IN = [_p(0), _p(1), _p(2), _p(3)];
export const Q_HOLD = [_p(0.5), _p(1.5), _p(2.5), _p(3.5)];
export const ZOOM_OUT_START = 100 - FULL_VIEW_PAUSE;

export const QUADRANTS = [
	"scale(2) translate(0, 0)",        // Q1 top-left
	"scale(2) translate(-50%, 0)",     // Q2 top-right
	"scale(2) translate(0, -50%)",     // Q3 bottom-left
	"scale(2) translate(-50%, -50%)",  // Q4 bottom-right
];

export function shuffle<T>(arr: T[]): T[] {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

export function buildKeyframes(animName: string, quadrants: string[]): string {
	const [q0, q1, q2, q3] = quadrants;
	return `
    @keyframes ${animName} {
      0%, ${FULL_VIEW_PAUSE}%      { transform: scale(1) translate(0, 0); }
      ${Q_IN[0]}%                  { transform: ${q0}; }
      ${Q_HOLD[0]}%                { transform: ${q0}; }
      ${Q_IN[1]}%                  { transform: ${q1}; }
      ${Q_HOLD[1]}%                { transform: ${q1}; }
      ${Q_IN[2]}%                  { transform: ${q2}; }
      ${Q_HOLD[2]}%                { transform: ${q2}; }
      ${Q_IN[3]}%                  { transform: ${q3}; }
      ${Q_HOLD[3]}%                { transform: ${q3}; }
      ${ZOOM_OUT_START}%, 100%     { transform: scale(1) translate(0, 0); }
    }
  `;
}
