"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { IWebsiteProjectsProps } from "@/interfaces/website-projects";

const WebsiteSlide = dynamic(() => import("@/components/atoms/WebsiteSlide"), {
  ssr: false,
  loading: () => null,
});

export default function WebsiteProjects({ websites }: IWebsiteProjectsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const totalScrollable = section.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      const index = Math.min(
        Math.floor(progress * websites.length),
        websites.length - 1,
      );

      setActiveIndex(index);
      setLoadedIndices((prev) => {
        const next = new Set(prev);
        next.add(index);
        if (index + 1 < websites.length) next.add(index + 1);
        return next;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [websites.length]);

  const scrollToSlide = useCallback((index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: sectionTop + index * (window.innerHeight * 0.5),
      behavior: "smooth",
    });
  }, []);

  return (
    <section
      id="website-projects"
      ref={sectionRef}
      className="tw:scroll-mt-20"
      style={{ height: `calc(64px + ${Math.max(websites.length, 1) * 50}vh)` }}
    >
      <div
        className="tw:sticky tw:top-16 tw:overflow-hidden"
        style={{ height: "calc(100vh - 64px)" }}
      >
        {/* Accessible heading — visually hidden */}
        <h2 className="tw:sr-only">Website Projects</h2>

        {/* Slides */}
        <div style={{ position: "absolute", inset: 0 }}>
          {websites.map((website, index) => (
            <WebsiteSlide
              key={website.url}
              url={website.url}
              name={website.name}
              isActive={index === activeIndex}
              shouldLoad={loadedIndices.has(index)}
              index={index}
              total={websites.length}
            />
          ))}
        </div>

        {/* Side nav dots */}
        {websites.length > 1 && (
          <nav
            aria-label="Website Projects navigation"
            style={{
              position: "absolute",
              right: "clamp(20px, 2.5vw, 40px)",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              alignItems: "center",
            }}
          >
            {websites.map((website, index) => (
              <button
                key={website.url}
                onClick={() => scrollToSlide(index)}
                aria-label={`Go to ${website.name}`}
                style={{
                  width: index === activeIndex ? "8px" : "6px",
                  height: index === activeIndex ? "24px" : "6px",
                  borderRadius: "999px",
                  background:
                    index === activeIndex
                      ? "linear-gradient(to bottom, #6366f1, #06b6d4)"
                      : "rgba(255,255,255,0.35)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
            ))}
          </nav>
        )}

        {/* Scroll hint */}
        {websites.length > 1 && activeIndex === 0 && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "clamp(20px, 3vh, 40px)",
              right: "clamp(48px, 6vw, 96px)",
              zIndex: 20,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "rgba(255,255,255,0.38)",
              fontSize: "10px",
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            Scroll
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        )}
      </div>
    </section>
  );
}
