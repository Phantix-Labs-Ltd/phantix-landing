import React from "react";
import {
  Landmark,
  CreditCard,
  HeartPulse,
  Radio,
  Factory,
  ShoppingCart,
  GraduationCap,
  Building2,
  Scale,
  Truck,
  Zap,
  ShieldCheck,
} from "lucide-react";

/*
 * E9 — organization marquee (v3 plan §5, row 3).
 *
 * Note on content: SecureGraph has no named customers yet, and the repo's
 * "contributors" entries are literal placeholders ("Contributor name" /
 * "Organization"). A fabricated logo wall is the fastest way to lose a security
 * buyer, so this ticker runs the *real* sector list the product actually
 * onboards (the industry options in the Platform's registration form) under an
 * honest label — "built for", not "trusted by".
 *
 * When real partner logos exist, swap SECTORS for them; the marquee mechanics
 * below don't change.
 */

const SECTORS = [
  { label: "Financial services", icon: Landmark },
  { label: "Fintech", icon: CreditCard },
  { label: "Healthcare", icon: HeartPulse },
  { label: "Telecommunications", icon: Radio },
  { label: "Manufacturing", icon: Factory },
  { label: "Ecommerce", icon: ShoppingCart },
  { label: "Education", icon: GraduationCap },
  { label: "Government", icon: Building2 },
  { label: "Legal", icon: Scale },
  { label: "Logistics", icon: Truck },
  { label: "Energy", icon: Zap },
  { label: "Insurance", icon: ShieldCheck },
];

export default function Marquee() {
  // Duplicated track: the copy scrolls in behind the original for a seamless loop.
  const track = [...SECTORS, ...SECTORS];

  return (
    <section aria-label="Sectors that SecureGraph supports" className="relative border-y border-phantix-800/60 py-10">
      <p className="mb-7 text-center text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        SecureGraph is built for security teams in these sectors
      </p>

      {/* Edge fades so items dissolve rather than clipping at the viewport edge. */}
      <div className="marquee-mask relative overflow-hidden">
        <div className="marquee-track flex w-max items-center gap-14">
          {track.map((s, i) => {
            const Icon = s.icon;
            return (
              <span
                key={`${s.label}-${i}`}
                aria-hidden={i >= SECTORS.length}
                className="flex shrink-0 items-center gap-2.5 text-slate-500 transition-colors duration-200 hover:text-slate-300"
              >
                <Icon size={18} className="text-gold-400/70" />
                <span className="whitespace-nowrap font-display text-lg font-semibold tracking-tight">
                  {s.label}
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
