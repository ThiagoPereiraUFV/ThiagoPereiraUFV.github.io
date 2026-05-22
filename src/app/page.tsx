import About from "@/components/organisms/About";
import Footer from "@/components/organisms/Footer";
import Header from "@/components/organisms/Header";
import LowCodeProjects from "@/components/organisms/LowCodeProjects";
import Projects from "@/components/organisms/Projects";
import WebsiteProjects from "@/components/organisms/WebsiteProjects";
import { buildPageData } from "@/helpers/pageData";
import { userData } from "@/helpers/userdata";

export default async function Home() {
  const { username, profileName } = userData;
  const data = await buildPageData(username, profileName);

  return (
    <main>
      <Header {...data.header} />
      <div className="tw:grid tw:grid-cols-1 tw:gap-24 tw:px-0 tw:p-0">
        {data.about.aboutUserData && <About {...data.about} />}
        {data.projects.websiteProjects.length > 0 && (
          <WebsiteProjects websites={data.projects.websiteProjects} />
        )}
        {data.projects.repos.length > 0 && <Projects {...data.projects} />}
        {data.projects.lowCodeProjects.length > 0 && (
          <LowCodeProjects projects={data.projects.lowCodeProjects} />
        )}
        <Footer {...userData} />
      </div>
    </main>
  );
}
