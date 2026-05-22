declare module "*.svg" {
	const content: string;
	export default content;
}

declare namespace React {
	namespace JSX {
		interface IntrinsicElements {
			"n8n-demo": React.HTMLAttributes<HTMLElement> & {
				workflow?: string;
				frame?: string;
				src?: string;
				collapseformobile?: string;
				clicktointeract?: string;
				hidecanvaserrors?: string;
				disableinteractivity?: string;
				theme?: string;
				mode?: string;
				workflowbefore?: string;
				tidyup?: string;
			};
		}
	}
}
