import { getTranslations } from "next-intl/server";
import LegalPage, { LegalSection, LegalList } from "@/components/legal/LegalPage";

export const metadata = {
  title: "Terms of Service — premier.gg",
  description:
    "The terms governing your use of premier.gg. Draft for legal review.",
};

const CONTACT = "[your contact email]";

export default async function TermsPage() {
  const t = await getTranslations();
  const disclaimer = t("disclaimer");

  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      updated="Draft — pre-launch"
    >
      <LegalSection n={1} title="Acceptance of terms">
        <p>
          By accessing or using premier.gg (the &ldquo;Service&rdquo;), you agree to these
          Terms of Service. If you do not agree, do not use the Service. If you use the
          Service on behalf of a team, you confirm you are authorized to accept these
          terms for that team.
        </p>
      </LegalSection>

      <LegalSection n={2} title="The service">
        <p>
          premier.gg is an independent web app for reviewing your own VALORANT Premier
          match history — team and player analytics, per-map and economy breakdowns, and
          positional kill/plant views. <strong>Today the Service is a mock-data
          demonstration</strong>: it shows fictional fixture data and does not read live
          Riot data. Live data access via Riot Sign-On will be enabled only after Riot
          approves our production API access.
        </p>
      </LegalSection>

      <LegalSection n={3} title="Not endorsed by Riot Games">
        <p>{disclaimer}</p>
        <p>
          &ldquo;VALORANT&rdquo; and &ldquo;Premier&rdquo; are used descriptively to refer
          to Riot&rsquo;s game and game mode. Your use of Riot Sign-On and Riot data is
          additionally subject to Riot Games&rsquo; own terms and policies.
        </p>
      </LegalSection>

      <LegalSection n={4} title="Acceptable use">
        <p>You agree not to:</p>
        <LegalList
          items={[
            <>
              attempt to access data for any account other than your own, or circumvent
              the own-history-only, no-search design of the Service;
            </>,
            <>
              use the Service for pre-match scouting, harassment, or any purpose that
              violates Riot&rsquo;s policies or applicable law;
            </>,
            <>
              scrape, reverse-engineer, overload, or otherwise interfere with the Service
              or its underlying APIs.
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection n={5} title="No warranty; limitation of liability">
        <p>
          The Service is provided <strong>&ldquo;as is&rdquo; and &ldquo;as
          available,&rdquo;</strong> without warranties of any kind. Analytics are derived
          from match data and may be incomplete or inaccurate. To the maximum extent
          permitted by law, premier.gg is not liable for any indirect, incidental, or
          consequential damages, or for any loss of data, arising from your use of the
          Service.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Accounts and termination">
        <p>
          You may <strong>unlink</strong> your Riot account or use{" "}
          <strong>delete my data</strong> at any time from Settings; doing so revokes our
          access and removes your stored data. We may suspend or terminate access if you
          breach these terms or if required to comply with Riot&rsquo;s policies. Sections
          that by their nature should survive termination (such as disclaimers and
          liability limits) will continue to apply.
        </p>
      </LegalSection>

      <LegalSection n={7} title="Changes to terms">
        <p>
          We may update these terms as the product evolves. Changes are effective when
          posted here with an updated date; continued use of the Service after a change
          means you accept the revised terms.
        </p>
      </LegalSection>

      <LegalSection n={8} title="Contact">
        <p>
          Questions about these terms? Contact us at <strong>{CONTACT}</strong>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
