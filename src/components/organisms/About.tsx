import { IAboutProps } from "@/interfaces/about";

export default function About(props: IAboutProps) {
  return (
    <section>
      <p dangerouslySetInnerHTML={{ __html: props.aboutUserData }}></p>
    </section>
  );
}
