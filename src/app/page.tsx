import About from "@/components/organisms/About";
import Footer from "@/components/organisms/Footer";
import Header from "@/components/organisms/Header";
import Projects from "@/components/organisms/Projects";
import { userData } from "@/helpers/userdata";
import { getGithubData, getGithubRawFile } from "@/lib/actions";

export default async function Home() {
  const { username, profileName } = userData;
  const githubData = await getGithubData(username);

  if ("error" in githubData && githubData.error) {
    return <div>{githubData.error.message}</div>;
  }

  const aboutUserData = await getGithubRawFile({
    owner: username,
    repo: username,
    branch: "main",
    filepath: "README.md",
  });

  if (typeof aboutUserData !== "string") {
    return <div>{aboutUserData.error.message}</div>;
  }

  const data = {
    header: {
      title: profileName,
      sections: ["About", "Projects", "Contact"],
    },
    about: {
      aboutUserData,
    },
    projects: {
      repos: githubData.repos,
    },
  };

  return (
    <main>
      <Header {...data.header} />
      <About {...data.about} />
      <Projects {...data.projects} />
      <Footer />
    </main>
  );
}
