import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  weight: ["400", "700"],
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "600"],
})

export const metadata: Metadata = {
  title: "SEO Report Generator - Professional SEO Analysis",
  description:
    "Generate comprehensive SEO reports with one-click analysis including technical SEO, content audit, backlinks, and competitor insights.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${sourceSans.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  )
}
