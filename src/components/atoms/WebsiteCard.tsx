"use client";

import { useEffect, useId, useRef, useState } from "react";
import { IWebsiteProject } from "@/interfaces/website-projects";
import {
  buildKeyframes,
  QUADRANTS,
  shuffle,
} from "@/helpers/websiteCardAnimation";

const DESKTOP_WIDTH = 1920;
const DESKTOP_ASPECT_HEIGHT = Math.round(DESKTOP_WIDTH * (9 / 16)); // 1080px — perfect 1920×1080 render

export default function WebsiteCard({ url, name }: IWebsiteProject) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const rawId = useId().replace(/:/g, "");
  const animName = `wzp-${rawId}`;
  const duration = useRef(parseFloat((15 + Math.random() * 20).toFixed(1)));
  const quadrants = useRef(shuffle(QUADRANTS));

  const keyframes = buildKeyframes(animName, quadrants.current);

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
        <>
          <style>{keyframes}</style>
          <div
            style={{
              width: `${DESKTOP_WIDTH}px`,
              height: `${DESKTOP_ASPECT_HEIGHT}px`,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              overflow: "hidden",
            }}
          >
            {/* Iframe: 1920×1080 — no distortion; zoom+pan animation only */}
            <iframe
              src={url}
              title={name}
              className="tw:pointer-events-none"
              style={{
                width: `${DESKTOP_WIDTH}px`,
                height: `${DESKTOP_ASPECT_HEIGHT}px`,
                transformOrigin: "top left",
                animation: `${animName} ${duration.current}s linear infinite`,
              }}
              loading="lazy"
            />
          </div>
        </>
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
