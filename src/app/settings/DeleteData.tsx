"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { unlinkDemoAccount } from "@/app/connect/actions";

/**
 * Delete-my-data flow. A button opens an inline confirm panel (no external deps);
 * confirming submits a form whose action is the `unlinkDemoAccount` server action,
 * which clears the demo cookie and redirects to `/`.
 */
export default function DeleteData() {
  const t = useTranslations("settings.data");
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex items-center gap-2 rounded-md border border-loss/40 bg-loss/5 px-3.5 py-2 text-sm font-medium text-loss transition-colors hover:border-loss/70 hover:bg-loss/10"
      >
        <span aria-hidden>⌫</span>
        {t("delete")}
      </button>
    );
  }

  return (
    <div
      role="alertdialog"
      aria-label={t("confirmTitle")}
      className="rounded-md border border-loss/40 bg-loss/5 p-4"
    >
      <p className="font-display text-sm font-semibold text-fg">
        {t("confirmTitle")}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">
        {t("confirmBody")}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <form action={unlinkDemoAccount}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-loss px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-loss/90"
          >
            {t("confirm")}
          </button>
        </form>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-md border border-border px-3.5 py-2 text-sm text-muted transition-colors hover:border-border hover:text-fg"
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}
