import type { ReactNode } from "react";
import MarketingHeader from "@/components/MarketingHeader";
import Footer from "@/components/Footer";

/**
 * Shared chrome for the in-app legal documents (Privacy, Terms).
 *
 * Renders a centered, comfortably-measured reading column on the dark theme:
 * a prominent DRAFT banner, an eyebrow + title, then the document body.
 * Sections are composed with <LegalSection> so the numbering and rhythm stay
 * consistent across documents.
 */
export default function LegalPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="relative flex-1 overflow-hidden">
        {/* Faint atmosphere so the reading column doesn't float on flat black. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(50rem 26rem at 50% -8%, rgba(124,92,255,0.12), transparent 60%)",
          }}
        />

        <article className="mx-auto w-full max-w-3xl px-6 py-14 sm:py-20">
          {/* DRAFT banner — must read before launch. */}
          <div
            role="note"
            className="flex items-start gap-3 rounded-lg border border-accent/40 bg-accent-soft/60 px-4 py-3.5 text-sm shadow-[0_0_0_1px_rgba(124,92,255,0.2),0_18px_44px_-28px_rgba(124,92,255,0.9)]"
          >
            <span
              aria-hidden
              className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-accent/20 text-[0.7rem] font-bold text-accent"
            >
              !
            </span>
            <p className="leading-relaxed text-fg">
              <span className="font-display font-semibold uppercase tracking-wide text-accent">
                Draft
              </span>{" "}
              <span className="text-muted">— requires legal review before launch.</span>{" "}
              <span className="text-muted">
                This is placeholder copy for the mock demo and is not a binding
                agreement.
              </span>
            </p>
          </div>

          <header className="mt-10">
            <p className="font-display text-xs font-medium uppercase tracking-[0.18em] text-muted">
              {eyebrow}
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 text-sm text-muted">Last updated: {updated}</p>
          </header>

          <div className="mt-10 space-y-9">{children}</div>
        </article>
      </main>

      <Footer />
    </div>
  );
}

/** A numbered legal section: display-face heading + comfortably-set body. */
export function LegalSection({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="scroll-mt-24">
      <h2 className="flex items-baseline gap-3 font-display text-lg font-semibold tracking-tight text-fg">
        <span className="text-sm font-medium text-accent">{n}.</span>
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[0.95rem] leading-relaxed text-muted [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-medium [&_strong]:text-fg">
        {children}
      </div>
    </section>
  );
}

/** Tidy, comfortably-spaced bullet list for legal sub-points. */
export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5">
          <span aria-hidden className="mt-2 h-1 w-1 flex-none rounded-full bg-accent/70" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
