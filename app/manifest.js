import { site } from "@/lib/site";

/* Lets a member add the site to their home screen and open their membership
   card like an app. The icons are the ones Next already serves from
   app/icon.png and app/apple-icon.png. */
export default function manifest() {
  return {
    name: site.movement,
    short_name: site.shortName,
    description: "Join Power In The Streets and find your place in the structure, ward by ward.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f5",
    theme_color: "#ce2515",
    icons: [
      { src: "/icon.png", sizes: "any", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
