import { site } from "@/lib/site";

/* The public pages only. The portal, the secretariat and the sign in screens
   are kept out of search on purpose (see app/robots.js). */
const routes = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "/join", priority: 0.9, changeFrequency: "monthly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about/adebayo", priority: 0.8, changeFrequency: "monthly" },
  { path: "/manifesto", priority: 0.8, changeFrequency: "monthly" },
  { path: "/structure", priority: 0.7, changeFrequency: "weekly" },
  { path: "/news", priority: 0.7, changeFrequency: "daily" },
  { path: "/media", priority: 0.6, changeFrequency: "weekly" },
  { path: "/connect", priority: 0.6, changeFrequency: "monthly" },
  { path: "/volunteer", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap() {
  const lastModified = new Date();
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${site.url}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
