import { getTranslations } from "next-intl/server";
import LegalPage, { LegalSection, LegalList } from "@/components/legal/LegalPage";

export const metadata = {
  title: "Privacy Policy — premier.gg",
  description:
    "How premier.gg accesses, uses, and protects your VALORANT Premier match data. Draft for legal review.",
};

const CONTACT = "[your contact email]";

export default async function PrivacyPage() {
  const t = await getTranslations();
  const disclaimer = t("disclaimer");

  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy" updated="Draft — pre-launch">
      <LegalSection n={1} title="Who we are">
        <p>
          premier.gg (&ldquo;premier.gg,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) is an
          independent web app for reviewing your own VALORANT Premier match history.
          It is currently a <strong>mock-data demonstration</strong> and does not yet
          read live Riot data. This policy describes how the live product will handle
          your data once Riot Sign-On access is approved.
        </p>
        <p>{disclaimer}</p>
      </LegalSection>

      <LegalSection n={2} title="What data we access">
        <p>
          You sign in with <strong>Riot Sign-On (RSO)</strong>. With your authorization,
          we access <strong>only your own Premier match history</strong> through Riot&rsquo;s
          official match API, plus Riot&rsquo;s content API for asset names and minimap
          images. We do not access your email, friends list, chat, ranked ladder data,
          payment information, or any match queue other than Premier.
        </p>
        <p>
          We never collect a Riot password — RSO authenticates you with Riot directly and
          returns only a scoped access token to us.
        </p>
      </LegalSection>

      <LegalSection n={3} title="How teammates and opponents appear">
        <p>
          premier.gg uses a <strong>single-captain model</strong>: one team captain signs
          in, and we reconstruct the team from the matches that captain personally played.
        </p>
        <LegalList
          items={[
            <>
              Any in-match stats shown for teammates and opponents come{" "}
              <strong>only from matches the signed-in captain actually played in</strong> —
              the same scoreboard data the captain already sees in their own Riot match
              history.
            </>,
            <>
              Opponents appear <strong>only as a by-product of co-played matches</strong>.
              This is retrospective review of matches you played, not pre-match scouting.
            </>,
            <>
              <strong>What we do not do:</strong> there is no player or team search, no
              arbitrary lookup, and no way to query a player or team you have not played
              against. We never fetch the history of anyone other than the signed-in user.
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection n={4} title="What we store and how long we keep it">
        <p>
          In the live product we store the raw and parsed Premier matches we retrieve for
          your account (so dashboards load quickly), your RSO tokens for as long as your
          account is linked, and minimal account metadata. We keep this data while your
          account is linked. If you unlink or delete your data, we remove your stored
          matches and revoke your tokens (see below).
        </p>
        <p>
          In this mock demo, no live Riot data is read or stored — all data shown is
          fictional fixture data held in your browser session only.
        </p>
      </LegalSection>

      <LegalSection n={5} title="Your controls">
        <LegalList
          items={[
            <>
              <strong>Unlink</strong> your Riot account at any time from Settings, which
              revokes our access tokens.
            </>,
            <>
              <strong>Delete my data</strong> permanently removes your stored matches and
              account record.
            </>,
            <>
              <strong>Export</strong> (planned) — a future release will let you download a
              copy of the data we hold for you.
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection n={6} title="Third parties">
        <p>
          We rely on a small number of third parties to operate the service:
        </p>
        <LegalList
          items={[
            <>
              <strong>Vercel</strong> — hosting and content delivery for the web app.
            </>,
            <>
              <strong>Riot Games APIs</strong> — Riot Sign-On and the VALORANT match and
              content APIs. Your use of Riot Sign-On is also governed by Riot&rsquo;s own
              terms and privacy policy.
            </>,
          ]}
        />
        <p>
          We do not sell your data, and we do not use it for advertising.
        </p>
      </LegalSection>

      <LegalSection n={7} title="Eligibility and children">
        <p>
          premier.gg is intended for VALORANT players who are old enough to hold a Riot
          account in their region and meet Riot&rsquo;s age requirements. It is not
          directed at children below those thresholds, and we do not knowingly collect
          data from them.
        </p>
      </LegalSection>

      <LegalSection n={8} title="Changes to this policy">
        <p>
          We may update this policy as the product evolves. Material changes will be
          reflected here with a new &ldquo;last updated&rdquo; date, and where appropriate
          we will notify linked accounts before the change takes effect.
        </p>
      </LegalSection>

      <LegalSection n={9} title="Contact">
        <p>
          Questions about this policy or your data? Contact us at{" "}
          <strong>{CONTACT}</strong>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
