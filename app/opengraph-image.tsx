import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#09090b",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        fontFamily: "sans-serif",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: 28,
          background: "#09090b",
          color: "#71717a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Zap SVG */}
        <svg width="64" height="64" viewBox="0 0 24 24" fill="white">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      </div>

      {/* Title */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "white",
            letterSpacing: -2,
          }}
        >
          Pulse
        </span>
        <span style={{ fontSize: 32, color: "#71717a" }}>
          Track your productivity, health, and goals
        </span>
      </div>
    </div>,
    size,
  );
}
