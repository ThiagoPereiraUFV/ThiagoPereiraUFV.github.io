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
      className="tw:scroll-mt-20"
      style={{ borderTop: "1px solid var(--card-border)" }}
    >
      <div className="tw:grid tw:grid-cols-1 tw:gap-10 tw:px-6 tw:lg:px-16 tw:py-16 tw:text-center">
        <div>
          <p
            className="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-widest tw:mb-3"
            style={{ color: "var(--muted)" }}
          >
            Get in touch
          </p>
          <h2 className="tw:text-3xl tw:font-bold tw:tracking-tight">
            Let&apos;s work together
          </h2>
        </div>
        <div className="tw:flex tw:flex-wrap tw:justify-center tw:gap-5">
          {Object.entries(contact).map(([key, c]) => (
            <Link
              key={key}
              href={c.url}
              target="_blank"
              className="tw:flex tw:flex-col tw:items-center tw:gap-2 tw:group"
            >
              <div
                className="tw:rounded-xl tw:p-3 tw:transition-all tw:duration-300 tw:group-hover:scale-110"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                  boxShadow: "var(--card-shadow)",
                }}
              >
                <Image
                  src={isDarkMode ? c.iconDark : c.icon}
                  alt={capitalizeFirstLetter(key)}
                  title={capitalizeFirstLetter(key)}
                  width={36}
                  height={36}
                />
              </div>
              <span
                className="tw:text-xs tw:font-medium"
                style={{ color: "var(--muted)" }}
              >
                {capitalizeFirstLetter(key)}
              </span>
            </Link>
          ))}
        </div>
        <small style={{ color: "var(--muted)" }}>
          Built with ❤️ by{" "}
          <Link
            href={contact.github.url}
            className="tw:transition-opacity tw:hover:opacity-70"
          >
            {profileName}
          </Link>{" "}
          | © {new Date().getFullYear()} all rights reserved
        </small>
      </div>
    </footer>
  );
}
