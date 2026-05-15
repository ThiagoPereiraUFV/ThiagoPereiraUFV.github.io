"use client";

import { useEffect, useRef, useState } from "react";
import { IWebsiteProject } from "@/interfaces/website-projects";

const DESKTOP_WIDTH = 1920;
const DESKTOP_ASPECT_HEIGHT = Math.round(DESKTOP_WIDTH * (9 / 16)); // 16:9, matches aspect-video
const DESKTOP_HEIGHT = DESKTOP_ASPECT_HEIGHT; // 1080px — standard 1920×1080 viewport

export default function WebsiteCard({ url, name }: IWebsiteProject) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const duration = useRef(
    parseFloat((15 + Math.random() * 20).toFixed(1)), // 15–35s, unique per card
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => setScale(el.offsetWidth / DESKTOP_WIDTH);
    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="tw:relative tw:rounded-lg tw:overflow-hidden tw:border tw:aspect-video tw:bg-gray-100"
    >
      {scale > 0 && (
        // Scale wrapper: shrinks 1920×1080 to fit the card, no animation here
        <div
          style={{
            width: `${DESKTOP_WIDTH}px`,
            height: `${DESKTOP_ASPECT_HEIGHT}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            overflow: "hidden",
          }}
        >
          {/* Iframe: rendered at full desktop size, scrolls via animation */}
          <iframe
            src={url}
            title={name}
            className="tw:pointer-events-none"
            style={{
              width: `${DESKTOP_WIDTH}px`,
              height: `${DESKTOP_HEIGHT}px`,
              animation: `website-scroll ${duration.current}s ease-in-out infinite`,
            }}
            loading="lazy"
          />
        </div>
      )}
      <div
        className="tw:absolute tw:inset-0 tw:cursor-pointer tw:flex tw:items-end tw:z-10"
        onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
        role="link"
        tabIndex={0}
        aria-label={`Visit ${name}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            window.open(url, "_blank", "noopener,noreferrer");
          }
        }}
      >
        <span className="tw:w-full tw:px-3 tw:py-1.5 tw:text-sm tw:font-medium tw:bg-black/60 tw:text-white tw:truncate">
          {name}
        </span>
      </div>
    </div>
  );
}
