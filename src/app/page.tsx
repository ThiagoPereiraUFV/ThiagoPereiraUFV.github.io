import About from "@/components/organisms/About";
import Footer from "@/components/organisms/Footer";
import Header from "@/components/organisms/Header";
import Projects from "@/components/organisms/Projects";
// import LowCodeProjects from "@/components/organisms/LowCodeProjects";
import WebsiteProjects from "@/components/organisms/WebsiteProjects";
import { userData } from "@/helpers/userdata";
import { websiteProjects } from "@/helpers/websitedata";
import {
  getGithubData,
  getGithubRawFile,
  // getLowCodeProjects,
} from "@/lib/actions";

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
      sections: ["About", "Website Projects", "Projects", "Contact"],
    },
    about: {
      aboutUserData,
    },
    projects: {
      repos: githubData.repos || [],
    },
  };

  // const lowCodeProjectsData = await getLowCodeProjects();

  // if ("error" in lowCodeProjectsData) {
  //   return <div>{lowCodeProjectsData.error.message}</div>;
  // }

  return (
    <main>
      <Header {...data.header} />
      <div className="tw:grid tw:grid-cols-1 tw:gap-24 tw:px-0 tw:p-0">
        <About {...data.about} />
        <WebsiteProjects websites={websiteProjects} />
        <Projects {...data.projects} />
        {/* <LowCodeProjects projects={lowCodeProjectsData} /> */}
        <Footer {...userData} />
      </div>
    </main>
  );
}
