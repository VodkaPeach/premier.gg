"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Opt-in gate. A required consent checkbox unlocks the "Continue" CTA to the
 * simulated Riot Sign-On. Until the box is checked the CTA is rendered as a
 * visibly inert (non-link) button so the user can't advance.
 */
export default function ConsentGate() {
  const t = useTranslations("connect");
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="mt-6 border-t border-border pt-5">
      <label className="group flex cursor-pointer items-start gap-3 rounded-md border border-border bg-surface-2/60 p-3.5 transition-colors hover:border-accent/40">
        <span className="relative mt-0.5 inline-flex h-[1.125rem] w-[1.125rem] shrink-0">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="peer h-[1.125rem] w-[1.125rem] cursor-pointer appearance-none rounded border border-border bg-bg transition-colors checked:border-accent checked:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 grid place-items-center text-[0.7rem] font-bold text-white opacity-0 peer-checked:opacity-100"
          >
            ✓
          </span>
        </span>
        <span className="text-sm leading-relaxed text-fg">{t("consent")}</span>
      </label>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {agreed ? (
          <Link
            href="/connect/riot"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(124,92,255,0.4),0_12px_36px_-16px_rgba(124,92,255,0.9)] transition-colors hover:bg-accent/90"
          >
            {t("continue")}
            <span aria-hidden>→</span>
          </Link>
        ) : (
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-md border border-border bg-surface-2 px-5 py-2.5 text-sm font-semibold text-muted/60"
          >
            {t("continue")}
            <span aria-hidden>→</span>
          </button>
        )}
        {!agreed ? (
          <span className="text-xs text-muted">{t("consentHint")}</span>
        ) : null}
      </div>
    </div>
  );
}
