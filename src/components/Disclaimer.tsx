import { useTranslations } from "next-intl";

/** Riot non-endorsement notice in small muted text. Required on every screen. */
export default function Disclaimer({ className = "" }: { className?: string }) {
  const t = useTranslations();
  return (
    <p className={`text-sm leading-relaxed text-muted/80 ${className}`}>
      {t("disclaimer")}
    </p>
  );
}
