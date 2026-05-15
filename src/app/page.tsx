import About from "@/components/organisms/About";
import Footer from "@/components/organisms/Footer";
import Header from "@/components/organisms/Header";
import Projects from "@/components/organisms/Projects";
import WebsiteProjects from "@/components/organisms/WebsiteProjects";
import { buildPageData } from "@/helpers/pageData";
import { userData } from "@/helpers/userdata";
import { websiteProjects } from "@/helpers/websitedata";

export default async function Home() {
  const { username, profileName } = userData;
  const data = await buildPageData(username, profileName);

  return (
    <main>
      <Header {...data.header} />
      <div className="tw:grid tw:grid-cols-1 tw:gap-24 tw:px-0 tw:p-0">
        {data.about.aboutUserData && <About {...data.about} />}
        <WebsiteProjects websites={websiteProjects} />
        {data.projects.repos.length > 0 && <Projects {...data.projects} />}
        <Footer {...userData} />
      </div>
    </main>
  );
}
