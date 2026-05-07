"use client";

import Link from "next/link";

export default function BackLink() {
  return (
    <Link
      href="/?return=projects"
      className="proj-back"
      onClick={() => {
        // Drop the textured overlay over the page so the homepage's
        // giant "Kevin" never paints during the navigation back.
        document.body.classList.remove("nav-revealing");
        document.body.classList.add("nav-transitioning");
      }}
    >
      ← Back to Work
    </Link>
  );
}
