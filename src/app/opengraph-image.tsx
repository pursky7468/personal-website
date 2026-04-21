import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Steve Lin"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0f172a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#f8fafc",
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          Steve Lin
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#94a3b8",
            maxWidth: 700,
          }}
        >
          I build things and write about what I learn.
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 80,
            fontSize: 20,
            color: "#3b82f6",
          }}
        >
          personal-website-pursky7468s-projects.vercel.app
        </div>
      </div>
    ),
    { ...size }
  )
}
