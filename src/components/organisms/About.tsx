import { IAboutProps } from "@/interfaces/about";

export default function About(props: IAboutProps) {
  return (
    <section
      id="about"
      className="tw-px-10 lg:tw-px-20"
      dangerouslySetInnerHTML={{ __html: props.aboutUserData }}
    ></section>
  );
}
