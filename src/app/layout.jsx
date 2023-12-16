"use client"

import { SessionProvider } from "next-auth/react"
import Sidebar from "@/components/sidebar"
import { StoreProvider } from "@/lib/store"
import "./globals.css"

// export const metadata = {
//   title: "Briefkasten",
//   icons: {
//     icon: [
//       { sizes: "32x32", url: "/favicon/favicon-32x32.png" },
//       { sizes: "16x16", url: "/favicon/favicon-16x16.png" },
//     ],
//     shortcut: "/favicon/favicon.ico",
//     apple: [{ sizes: "180x180", url: "/favicon/apple-touch-icon.png" }],
//   },
//   manifest: "/favicon/site.webmanifest",
//   other: {
//     "application-name": "Briefkasten",
//     "darkreader-lock": "",
//   },
//   openGraph: {
//     title: "Briefkasten",
//     description: "Bookmarks",
//     url: "https://briefkastenhq.com",
//     locale: "en_US",
//     type: "website",
//   },
//   appleWebApp: {
//     title: "Briefkasten",
//   },
// }

// export const viewport = {
//   themeColor: "#1E293B",
// }

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <section className="mx-auto flex h-full max-w-full items-stretch overflow-hidden selection:bg-slate-800 selection:text-white">
          <SessionProvider>
            <StoreProvider>
              <Sidebar />
              <main className="flex-grow basis-0">{children}</main>
            </StoreProvider>
          </SessionProvider>
        </section>
        <div className="pattern fixed left-0 top-0 -z-[1] h-full w-full" />
      </body>
    </html>
  )
}
