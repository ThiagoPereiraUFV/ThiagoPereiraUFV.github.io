import About from "@/components/organisms/About";
import Footer from "@/components/organisms/Footer";
import Header from "@/components/organisms/Header";
import Projects from "@/components/organisms/Projects";
import { getGithubData } from "@/lib/actions";

export default async function Home() {
  const githubData = await getGithubData("ThiagoPereiraUFV");

  if ("error" in githubData && githubData.error) {
    return <div>{githubData.error.message}</div>;
  }

  const data = {
    header: {
      title: "Thiago Pereira",
      sections: ["About", "Projects", "Contact"],
    },
    projects: {
      repos: githubData.repos,
    },
  };

  return (
    <main>
      <Header {...data.header} />
      <About />
      <Projects {...data.projects} />
      <Footer />
    </main>
  );
}
