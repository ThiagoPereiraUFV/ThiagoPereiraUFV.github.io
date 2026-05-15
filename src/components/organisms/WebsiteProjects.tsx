"use client";

import dynamic from "next/dynamic";
import { IWebsiteProjectsProps } from "@/interfaces/website-projects";

const WebsiteCard = dynamic(() => import("@/components/atoms/WebsiteCard"), {
  ssr: false,
  loading: () => (
    <div className="tw:aspect-video tw:rounded-lg tw:border tw:bg-gray-100 tw:animate-pulse" />
  ),
});

export default function WebsiteProjects({ websites }: IWebsiteProjectsProps) {
  return (
    <section
      id="website-projects"
      className="tw:grid tw:grid-cols-1 tw:px-10 tw:lg:px-20 tw:gap-4"
    >
      <h2 className="tw:text-3xl">Website Projects</h2>
      <div className="tw:grid tw:grid-cols-1 tw:lg:grid-cols-2 tw:gap-4">
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
