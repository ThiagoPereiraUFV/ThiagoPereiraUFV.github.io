import { IAboutProps } from "@/interfaces/about";

export default function About(props: IAboutProps) {
  return (
    <section
      id="about"
      className="tw:px-6 tw:lg:px-16 tw:scroll-mt-20 tw:min-h-screen tw:flex tw:flex-col tw:justify-start tw:pt-16"
    >
      <div
        className="about-content"
        dangerouslySetInnerHTML={{ __html: props.aboutUserData }}
      />
    </section>
  );
}
