"use client";

import dynamic from "next/dynamic";
import { IWebsiteProjectsProps } from "@/interfaces/website-projects";

const WebsiteCard = dynamic(() => import("@/components/atoms/WebsiteCard"), {
  ssr: false,
  loading: () => (
    <div
      className="tw:aspect-video tw:rounded-xl tw:animate-pulse"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
      }}
    />
  ),
});

export default function WebsiteProjects({ websites }: IWebsiteProjectsProps) {
  return (
    <section
      id="website-projects"
      className="tw:grid tw:grid-cols-1 tw:px-6 tw:lg:px-16 tw:gap-10 tw:scroll-mt-20"
    >
      <h2 className="section-heading">Website Projects</h2>
      <div className="tw:grid tw:grid-cols-1 tw:lg:grid-cols-2 tw:gap-5">
        {websites.map((website) => (
          <WebsiteCard
            key={website.url}
            url={website.url}
            name={website.name}
          />
        ))}
      </div>
    </section>
  );
}
