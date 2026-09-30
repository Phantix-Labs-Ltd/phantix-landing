import React from "react";

/*
 * Privacy architecture — data flows one way, into your database, and never back
 * out. This is the page's core argument, so it's drawn rather than sourced: the
 * AI-generated version came back with a fake "transparent" checkerboard baked
 * into opaque pixels (those tools can't emit real alpha), and an inline SVG is
 * both exact to the palette and a fraction of the weight.
 *
 * Motion is CSS-only and fully gated behind prefers-reduced-motion.
 */
export default function PrivacyDiagram() {
  return (
    <div className="relative overflow-hidden rounded-md border border-phantix-700 bg-phantix-950">
      <svg
        viewBox="0 0 520 360"
        className="block w-full"
        role="img"
        aria-label="Your database sits on the left. The SecureGraph engine sits on the right. Data flows from the database into the engine. Nothing leaves the boundary."
      >
        <defs>
          <linearGradient id="pd-wire" x1="0" x2="1">
            <stop offset="0%" stopColor="#52525B" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#E8B54D" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#E8B54D" stopOpacity="0.85" />
          </linearGradient>
          <radialGradient id="pd-halo">
            <stop offset="0%" stopColor="#E8B54D" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#E8B54D" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ambient halo behind the database */}
        <circle cx="150" cy="180" r="120" fill="url(#pd-halo)" />

        {/* protection rings — the boundary that nothing crosses outward */}
        <g fill="none" stroke="#27272A">
          <circle className="pd-ring" cx="150" cy="180" r="96" />
          <circle className="pd-ring pd-ring-2" cx="150" cy="180" r="116" />
        </g>

        {/* database */}
        <g stroke="#A1A1AA" strokeWidth="2" fill="#09090B">
          <ellipse cx="150" cy="132" rx="52" ry="17" />
          <path d="M98 132v72c0 9.4 23.3 17 52 17s52-7.6 52-17v-72" />
          <path d="M98 168c0 9.4 23.3 17 52 17s52-7.6 52-17" />
          <path d="M98 192c0 9.4 23.3 17 52 17s52-7.6 52-17" />
        </g>

        {/* connector */}
        <line x1="204" y1="180" x2="356" y2="180" stroke="url(#pd-wire)" strokeWidth="2.5" />

        {/* the travelling packet — always left to right, never the reverse */}
        <circle className="pd-packet" cx="204" cy="180" r="4.5" fill="#F3CD7E" />

        {/* engine */}
        <g transform="translate(356 136)">
          <rect width="88" height="88" rx="6" fill="#09090B" stroke="#E8B54D" strokeOpacity="0.5" strokeWidth="2" />
          <rect x="24" y="24" width="40" height="40" rx="4" fill="none" stroke="#E8B54D" strokeOpacity="0.8" strokeWidth="2" />
          {/* pins */}
          <g stroke="#52525B" strokeWidth="2">
            {[18, 34, 50, 66].map((y) => (
              <React.Fragment key={y}>
                <line x1="-10" y1={y} x2="0" y2={y} />
                <line x1="88" y1={y} x2="98" y2={y} />
              </React.Fragment>
            ))}
            {[18, 34, 50, 66].map((x) => (
              <React.Fragment key={`v${x}`}>
                <line x1={x} y1="-10" x2={x} y2="0" />
                <line x1={x} y1="88" x2={x} y2="98" />
              </React.Fragment>
            ))}
          </g>
        </g>

        {/* labels */}
        <text x="150" y="272" textAnchor="middle" fill="#71717A" fontSize="12" letterSpacing="1.6">
          YOUR DATABASE
        </text>
        <text x="400" y="272" textAnchor="middle" fill="#71717A" fontSize="12" letterSpacing="1.6">
          SECUREGRAPH ENGINE
        </text>
      </svg>

      <p className="border-t border-phantix-800 px-5 py-3 text-center font-mono text-[12px] text-slate-600">
        One direction only. Nothing leaves the boundary.
      </p>
    </div>
  );
}
