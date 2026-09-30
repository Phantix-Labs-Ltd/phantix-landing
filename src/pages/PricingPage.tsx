import React from "react";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import { BackLink } from "@/components/BackLink";
import { Section, fadeUp } from "@/components/Section";
import { Pricing, FinalCTA } from "@/components/Pricing";
import { PricingComparison } from "@/components/PricingComparison";
import { FAQ } from "@/components/FAQ";

export default function PricingPage() {
  return (
    <PageShell>
      <Section className="pb-6 pt-28 md:pt-36">
        <BackLink />
        {/* De-centred (Hallmark fix): left-biased block, no eyebrow pill —
            the heading carries the page's identity on its own. */}
        <motion.div {...fadeUp} className="mt-10 max-w-2xl">
          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
            Simple pricing for assessment and continuous security
          </h1>
          <p className="mt-5 text-[15px] leading-7 text-slate-400">
            Free helps you find your exposure. Starter runs vulnerability assessment and
            penetration testing with verified findings. Growth keeps testing continuously.
            We quote Enterprise on request.
          </p>
        </motion.div>
      </Section>

      <Pricing showHeading={false} />
      <PricingComparison />
      <FAQ />
      <FinalCTA />
    </PageShell>
  );
}
