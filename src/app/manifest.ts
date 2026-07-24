import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Gym Track - Workout Tracker",
    short_name: "Gym Track",
    description: "Track workouts, body metrics, and progress over time.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#f5f9f9",
    theme_color: "#178454",
    categories: ["fitness", "health", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/maskable-icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Add workout",
        short_name: "Add workout",
        url: "/workouts/new",
        icons: [{ src: "/icons/icon-192.svg", sizes: "192x192" }],
      },
      {
        name: "View progress",
        short_name: "Progress",
        url: "/progress",
        icons: [{ src: "/icons/icon-192.svg", sizes: "192x192" }],
      },
    ],
  }
}