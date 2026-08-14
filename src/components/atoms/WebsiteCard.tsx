"use client";

import { useEffect, useId, useRef, useState } from "react";
import { IWebsiteProject } from "@/interfaces/website-projects";
import {
  ANIMATION_START_DELAY,
  buildKeyframes,
  DURATION_MAX,
  DURATION_MIN,
  QUADRANTS,
  shuffle,
} from "@/helpers/websiteCardAnimation";

const DESKTOP_WIDTH = 1920;
const DESKTOP_ASPECT_HEIGHT = Math.round(DESKTOP_WIDTH * (9 / 16)); // 1080px — perfect 1920×1080 render

export default function WebsiteCard({ url, name }: IWebsiteProject) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [visible, setVisible] = useState(false);
  const rawId = useId().replace(/:/g, "");
  const animName = `wzp-${rawId}`;
  const duration = useRef(
    parseFloat(
      (DURATION_MIN + Math.random() * (DURATION_MAX - DURATION_MIN)).toFixed(1),
    ),
  );
  const quadrants = useRef(shuffle(QUADRANTS));

  const keyframes = buildKeyframes(animName, quadrants.current);

  useEffect(() => {
    const el = containerRef.current;
    /* istanbul ignore next -- ref is always attached to the root div on mount */
    if (!el) return;

    // Only measure width for scaling
    const updateScale = () => setScale(el.offsetWidth / DESKTOP_WIDTH);
    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(el);

    // Load iframe only when card enters the viewport
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          intersectionObserver.disconnect();
        }
      },
      { rootMargin: "200px" }, // start loading slightly before visible
    );
    intersectionObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="tw:relative tw:rounded-xl tw:overflow-hidden tw:aspect-video"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        boxShadow: "var(--card-shadow)",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "var(--card-shadow-hover)";
        (e.currentTarget as HTMLDivElement).style.transform =
          "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "var(--card-shadow)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {scale > 0 && visible && (
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
                animation: `${animName} ${duration.current}s ${ANIMATION_START_DELAY}s linear infinite`,
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
        <span
          className="tw:w-full tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:truncate tw:tracking-tight"
          style={{
            background: "rgba(0,0,0,0.7)",
            color: "#fff",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        >
          {name}
        </span>
      </div>
    </div>
  );
}
