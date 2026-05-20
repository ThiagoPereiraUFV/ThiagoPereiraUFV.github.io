"use client";

import { useEffect, useRef, useState } from "react";
import { IWebsiteSlideProps } from "@/interfaces/website-projects";

export default function WebsiteSlide({
  url,
  name,
  isActive,
  shouldLoad,
  index,
  total,
}: IWebsiteSlideProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [loadKey, setLoadKey] = useState(0);
  const wasActive = useRef(false);

  useEffect(() => {
    if (isActive && !wasActive.current) {
      setLoadKey((k) => k + 1);
    }
    wasActive.current = isActive;
  }, [isActive]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setReady(el.offsetWidth > 0));
    ro.observe(el);
    setReady(el.offsetWidth > 0);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        opacity: isActive ? 1 : 0,
        transform: `translateY(${isActive ? 0 : 24}px)`,
        transition:
          "opacity 0.65s cubic-bezier(0.4,0,0.2,1), transform 0.65s cubic-bezier(0.4,0,0.2,1)",
        pointerEvents: isActive ? "auto" : "none",
        background: "var(--background)",
      }}
    >
      {/* iframe layer — renders at native device width, scrollbar clipped by overflow:hidden */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {shouldLoad && ready && (
          <iframe
            key={loadKey}
            src={url}
            title={name}
            className="tw:pointer-events-none"
            style={{
              border: "none",
              display: "block",
              width: "100%",
              height: "100%",
            }}
            loading="lazy"
            scrolling="no"
          />
        )}
      </div>

      {/* Slim bottom strip — only covers the content label area */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 18%, transparent 38%)",
          pointerEvents: "none",
        }}
      />

      {/* Top micro-vignette for label readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, transparent 12%)",
          pointerEvents: "none",
        }}
      />

      {/* Left accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "3px",
          background: "linear-gradient(to bottom, #6366f1, #06b6d4)",
          opacity: isActive ? 1 : 0,
          transition: "opacity 0.65s ease",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(24px, 5vh, 96px)",
          left: "clamp(20px, 6vw, 96px)",
          right: "clamp(52px, 12vw, 160px)",
          zIndex: 10,
        }}
      >
        {/* Counter */}
        <p
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: "11px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginBottom: "16px",
            fontFamily: "monospace",
          }}
        >
          {String(index + 1).padStart(2, "0")} &mdash;{" "}
          {String(total).padStart(2, "0")}
        </p>

        {/* Site name */}
        <h3
          style={{
            color: "#fff",
            fontSize: "clamp(2rem, 5vw, 4rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            marginBottom: "28px",
            textShadow: "0 2px 32px rgba(0,0,0,0.6)",
          }}
        >
          {name}
        </h3>

        {/* Visit button */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${name}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 32px",
            background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
            color: "#fff",
            borderRadius: "999px",
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "none",
            letterSpacing: "0.03em",
            transition: "filter 0.2s ease, transform 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.filter =
              "brightness(1.15)";
            (e.currentTarget as HTMLAnchorElement).style.transform =
              "scale(1.04)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.filter =
              "brightness(1)";
            (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
          }}
        >
          Visit Site
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15,3 21,3 21,9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>
    </div>
  );
}
