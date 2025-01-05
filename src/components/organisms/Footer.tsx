"use client";

import { IFooterProps } from "@/interfaces/footer";
import { capitalizeFirstLetter } from "@/helpers/strings";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer({ profileName, contact }: IFooterProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial preference
    setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);

    // Listen for changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <footer
      id="contact"
      className="tw-grid tw-grid-cols-1 tw-gap-8 tw-text-center"
    >
      <p className="tw-text-2xl">You can reach me via:</p>
      <div className="tw-flex tw-flex-wrap tw-justify-center tw-gap-4">
        {Object.entries(contact).map(([key, c]) => (
          <Link
            key={key}
            href={c.url}
            target="_blank"
            className="tw-transition tw-ease-in-out tw-duration-300 hover:tw--translate-y-0.5 hover:tw--translate-x-0.5"
          >
            <Image
              className="tw-text-white"
              src={isDarkMode ? c.iconDark : c.icon}
              alt={capitalizeFirstLetter(key)}
              title={capitalizeFirstLetter(key)}
              width={75}
              height={75}
            />
          </Link>
        ))}
      </div>
      <small>
        Built with ❤️ by <Link href={contact.github.url}>{profileName}</Link> |
        © {new Date().getFullYear()} all rights reserved
      </small>
    </footer>
  );
}
