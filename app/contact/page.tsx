import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with HoldLens. Email for feedback, press, partnerships, bug reports, or data corrections.",
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Contact</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">Get in touch</h1>
      <p className="text-muted text-lg mb-10">
        HoldLens is built by one person. You get a real human, usually within 24 hours.
      </p>

      <div className="space-y-6">
        <ContactRow
          category="General feedback, questions, ideas"
          email="hello@holdlens.com"
          desc="Say hi. Tell us what&rsquo;s missing, what&rsquo;s broken, or what you&rsquo;d like to see next."
        />
        <ContactRow
          category="Bug reports & data corrections"
          email="hello@holdlens.com"
          desc="Found a wrong number, a broken page, or a stale filing? Please include the URL so we can investigate fast."
        />
        <ContactRow
          category="Press & media"
          email="hello@holdlens.com"
          desc={
            <>
              For quotes, data requests, or coverage, see the <a href="/press-kit" className="text-brand underline">press kit</a> first, then email us.
            </>
          }
        />
        <ContactRow
          category="Partnerships & integrations"
          email="hello@holdlens.com"
          desc="If you run a newsletter, podcast, or tool that would benefit from HoldLens data, reach out."
        />
        <ContactRow
          category="Privacy, legal, data requests"
          email="hello@holdlens.com"
          desc={
            <>
              For privacy inquiries or requests to access/delete your data, see our <a href="/privacy" className="text-brand underline">Privacy Policy</a>.
            </>
          }
        />
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">About the builder</div>
        <h2 className="text-xl font-bold mb-2">HoldLens is an independent project</h2>
        <p className="text-sm text-muted">
          No VC money, no sponsored content, no hidden agenda. Just SEC filings, conviction scoring, and
          honest commentary. If you have something to say, say it — we read every email.
        </p>
      </div>

      <p className="text-xs text-dim pt-8 border-t border-border mt-12">
        HoldLens does not provide investment advice. See our <a href="/terms" className="underline">Terms of Service</a>.
      </p>
    </div>
  );
}

function ContactRow({ category, email, desc }: { category: string; email: string; desc: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-panel p-5">
      <div className="text-xs uppercase tracking-widest text-dim font-semibold mb-2">{category}</div>
      <a href={`mailto:${email}`} className="text-brand underline font-mono text-sm">
        {email}
      </a>
      <p className="text-sm text-muted mt-2">{desc}</p>
    </div>
  );
}
