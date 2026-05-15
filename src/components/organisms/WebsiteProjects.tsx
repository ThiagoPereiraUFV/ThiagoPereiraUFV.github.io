"use client";

import WebsiteCard from "@/components/atoms/WebsiteCard";
import { IWebsiteProjectsProps } from "@/interfaces/website-projects";

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
