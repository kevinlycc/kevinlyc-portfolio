import { projects } from "@/data/projects";
import { notFound } from "next/navigation";
import IntroCleanup from "./intro-cleanup";
import BackLink from "./back-link";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projectIndex = projects.findIndex((p) => p.slug === slug);
  if (projectIndex === -1) notFound();
  const project = projects[projectIndex];
  const projectNumber = String(projectIndex + 1).padStart(3, "0");

  return (
    <main className="proj-page">
      <IntroCleanup />
      <BackLink />

      <header className="proj-header">
        <div className="proj-header__top">
          <span className="proj-number">{projectNumber}</span>
          <h1 className="proj-title">{project.name}</h1>
          {(project.tagline || project.description) && (
            <p className="proj-tagline">{project.tagline ?? project.description}</p>
          )}
        </div>

        <dl className="proj-meta">
          <div className="proj-meta__cell">
            <dt className="proj-meta__label">Role</dt>
            <dd className="proj-meta__value">{project.role ?? "—"}</dd>
          </div>
          <div className="proj-meta__cell">
            <dt className="proj-meta__label">Duration</dt>
            <dd className="proj-meta__value">{project.duration ?? "—"}</dd>
          </div>
          <div className="proj-meta__cell">
            <dt className="proj-meta__label">Team</dt>
            <dd className="proj-meta__value">{project.team ?? "—"}</dd>
          </div>
          <div className="proj-meta__cell">
            <dt className="proj-meta__label">Status</dt>
            <dd className="proj-meta__value">{project.status ?? "—"}</dd>
          </div>
        </dl>

        {project.links.length > 0 && (
          <div className="proj-cta-row">
            {project.links.map((l) => (
              <a key={l.label} href={l.url} target="_blank" className="proj-cta">
                {l.label} ↗︎
              </a>
            ))}
          </div>
        )}
      </header>

      {project.overview && (
        <section className="proj-section">
          <p className="proj-section-label">Overview</p>
          <p className="proj-prose">{project.overview}</p>
        </section>
      )}

      {project.sections.includes("demo") && project.demoUrl && (
        <section className="proj-section">
          <p className="proj-section-label">Demo</p>
          <div className="proj-iframe-wrap">
            <iframe
              className="proj-iframe"
              src={project.demoUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {project.gallery && project.gallery.length > 0 && (
        <section className="proj-section">
          <p className="proj-section-label">Gallery</p>
          <div className="proj-gallery">
            {project.gallery.map((src) => (
              <img key={src} className="proj-gallery-img" src={src} alt="" loading="lazy" />
            ))}
          </div>
        </section>
      )}

      {project.highlights && project.highlights.length > 0 && (
        <section className="proj-section">
          <p className="proj-section-label">Highlights</p>
          <ul className="proj-highlights">
            {project.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </section>
      )}

      {project.stack.length > 0 && (
        <section className="proj-section">
          <p className="proj-section-label">Technology Stack</p>
          <ul className="proj-stack-grid">
            {project.stack.map((s) => (
              <li key={s} className="proj-stack-chip">{s}</li>
            ))}
          </ul>
        </section>
      )}

      {project.sections.includes("architecture") && project.architecture && (
        <section className="proj-section">
          <p className="proj-section-label">Architecture</p>
          <img className="proj-img" src={project.architecture} alt="Architecture diagram" />
          {project.architectureNotes && (
            <p className="proj-prose proj-prose--with-img">{project.architectureNotes}</p>
          )}
        </section>
      )}
    </main>
  );
}
