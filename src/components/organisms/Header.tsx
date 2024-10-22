import { IHeaderProps } from "@/interfaces/header";

export default function Header(props: IHeaderProps) {
	return (
		<header className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-justify-between tw-p-4">
			<h1 className="tw-col-span-2 tw-text-4xl">{props.title}</h1>
			<nav>
				<ul className="tw-flex tw-flex-wrap tw-justify-center tw-gap-4">
					{props.sections.map((section, index) => (
						<li key={index}>
							<a href={`#${section.trim().toLowerCase()}`}>{section}</a>
						</li>
					))}
				</ul>
			</nav>
		</header>
	);
}