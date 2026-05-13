import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import ElasticCursor from "@/components/animations/elasticCursor";
import CanvasBackground from "@/components/animations/CanvasBackground";
import ClickSound from "@/components/ClickSound";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Kevin Chhim",
  description:
    "Kevin Chhim's Portfolio",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }" +
              "if (location.search.indexOf('return=projects') !== -1) {" +
              "  var apply = function(){ if (document.body) document.body.classList.add('nav-transitioning'); };" +
              "  apply();" +
              "  document.addEventListener('DOMContentLoaded', apply);" +
              "}",
          }}
        />
      </head>
      <body className="intro-active" suppressHydrationWarning>
        <CanvasBackground />
        {children}
        <ElasticCursor />
        <ClickSound />
        <Analytics />
        <div id="nav-transition-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
