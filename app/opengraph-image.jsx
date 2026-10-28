import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/* The card shown when a link to the site is shared on WhatsApp, X or
   Facebook. Inner pages inherit it unless they set their own. */
export const alt = "Power In The Streets (PITS): organising ward by ward behind Prince Adewole Adebayo, SDP";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const mark = await readFile(join(process.cwd(), "assets/amvora-mark-light.png"));
  const markSrc = `data:image/png;base64,${mark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(circle at 100% 0%, #8f1a0f 0%, #1c1512 60%)",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <img src={markSrc} alt="" height={96} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 34, fontWeight: 700 }}>Power In The Streets</span>
            <span style={{ fontSize: 24, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>
              PITS for Prince Adebayo, SDP
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
            Hope, in action.
          </span>
          <span style={{ fontSize: 32, color: "rgba(255,255,255,0.75)", marginTop: 20 }}>
            36 states and the FCT. 774 LGAs. Over 8,000 wards. Join free.
          </span>
        </div>

        <div style={{ display: "flex", height: 8, width: 240, borderRadius: 8, background: "linear-gradient(90deg, #ce2515, #f8a840)" }} />
      </div>
    ),
    size
  );
}
