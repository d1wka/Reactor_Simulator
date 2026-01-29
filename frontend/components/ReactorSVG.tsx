"use client";

import { ReactorData, ComponentInfo } from "@/types/reactor";

interface Props {
  data: ReactorData;
  onHover: (info: ComponentInfo | null) => void;
}

const INFO: Record<string, ComponentInfo> = {
  rpv: {
    title: "Reactor Pressure Vessel (RPV)",
    info: "The RPV is the primary pressure boundary — a 11.8 m tall, 4.5 m diameter steel vessel (300 mm thick walls). Contains the core, reflector, and control rod drives. Designed to withstand 160 bar and retain integrity in Design Basis Accidents.",
  },
  "pipe-hot": {
    title: "Hot Leg — Primary Loop",
    info: "Carries superheated primary coolant (325°C, 157 bar) from the reactor pressure vessel to the steam generator. High pressure prevents boiling despite temperatures well above 100°C.",
  },
  "pipe-cold": {
    title: "Cold Leg — Primary Loop",
    info: "Returns cooled primary coolant (293°C) from the steam generator back to the reactor. Main circulation pump drives flow through this circuit continuously.",
  },
  pressurizer: {
    title: "Pressurizer",
    info: "Maintains constant primary system pressure at 157 bar (±0.5 bar). Electric heaters raise pressure when it drops; spray system lowers pressure when it rises. Critical for keeping primary coolant liquid.",
  },
  steamGenerator: {
    title: "Steam Generator (SG-1)",
    info: "Horizontal U-tube heat exchanger (VVER design). 11,000 steam tubes transfer heat from primary (radioactive, 325°C) to secondary (clean) loop. Secondary water boils to steam at ~6.2 MPa, 278°C.",
  },
  mcp: {
    title: "Main Circulation Pump (MCP)",
    info: "Drives primary coolant circulation at 85,600 t/h against 157 bar. Motor power: 8 MW. Loss of all MCPs triggers automatic SCRAM. Flywheel ensures 30-second flow coast-down.",
  },
  turbine: {
    title: "Steam Turbine (LP+HP)",
    info: "Two-cylinder turbine (1 HP + 3 LP) converts steam enthalpy to rotation at 3000 rpm. Steam expands from 62 bar to ~0.06 bar in the condenser. Rated at 1200 MW electrical.",
  },
  generator: {
    title: "Synchronous Generator",
    info: "Turbine shaft drives a 3-phase synchronous generator (hydrogen-cooled) producing 1200 MW at 24 kV, 50 Hz. Step-up transformer feeds the 330/500 kV grid.",
  },
  condenser: {
    title: "Main Condenser",
    info: "Converts exhaust steam (0.06 bar, 36°C) back to liquid water using cooling water. Creates vacuum that maximises turbine work output. Condenser vacuum loss = turbine trip.",
  },
  eccs: {
    title: "Emergency Core Cooling System (ECCS)",
    info: "Passive safety system using high-pressure accumulators filled with borated water. In a LOCA, accumulators inject into the core automatically at 60 bar — no pumps needed.",
  },
  coolingTower: {
    title: "Cooling Tower",
    info: "Natural-draft hyperbolic cooling tower (165 m tall) removes waste heat. Upward air draft evaporates ~3% of water, cooling the rest by ~10°C. The visible plume is pure water vapour — not radioactive.",
  },
  "steam-line": {
    title: "Main Steam Line",
    info: "Carries steam at 62 bar, 278°C from steam generators to the turbine stop valves. Main Steam Isolation Valves (MSIV) can close in <5 seconds on high radiation signal.",
  },
  feedwater: {
    title: "Feedwater System",
    info: "High-pressure feedwater pumps return condensate from the condenser hotwell back to the steam generators. Feedwater heaters increase thermal efficiency from ~28% to ~33%.",
  },
  "exhaust-line": {
    title: "Turbine Exhaust (Low Pressure Steam)",
    info: "Steam exits the LP turbine at only 0.06 bar — nearly vacuum. This extreme pressure drop is what makes turbines efficient. Steam quality is typically 85-90% (wet steam).",
  },
  sfp: {
    title: "Spent Fuel Pool (SFP)",
    info: "Irradiated fuel assemblies stored underwater for 5-7 years. Water provides biological shielding (10 m deep) and decay heat removal. Decay heat continues for years after shutdown.",
  },
};

function hoverProps(id: string, onHover: Props["onHover"]) {
  return {
    onMouseEnter: () => onHover(INFO[id] ?? null),
    onMouseLeave: () => onHover(null),
    style: { cursor: "pointer" } as React.CSSProperties,
  };
}

export default function ReactorSVG({ data, onHover }: Props) {
  const rodLen = Math.max(8, (1 - data.rods / 100) * 210);
  const sgWaterH = Math.max(0, (data.sg_level / 100) * 104);
  const sgWaterY = 364 - sgWaterH;
  const coreOpacity = data.scrammed ? 0 : data.power / 100;
  const rpvGlowColor = data.scrammed ? "none" : data.core_temp > 345 ? "drop-shadow(0 0 10px rgba(255,34,68,0.8))" : data.power > 103 ? "drop-shadow(0 0 6px rgba(255,221,0,0.6))" : "drop-shadow(0 0 4px rgba(0,255,136,0.4))";
  const elPower = data.el_power;

  return (
    <svg viewBox="0 0 900 600" style={{ width: "100%", height: "100%", maxWidth: 900 }}>
      <defs>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00ff88" stopOpacity={coreOpacity * 0.4} />
          <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="vesselGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1a3a5a" />
          <stop offset="50%" stopColor="#243d5c" />
          <stop offset="100%" stopColor="#1a3a5a" />
        </linearGradient>
        <linearGradient id="steamGenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1a2a3a" />
          <stop offset="100%" stopColor="#2a3a4a" />
        </linearGradient>
        <linearGradient id="hotLeg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#cc4400" />
          <stop offset="100%" stopColor="#ff6600" />
        </linearGradient>
        <linearGradient id="coldLeg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#005588" />
          <stop offset="100%" stopColor="#0088cc" />
        </linearGradient>
        <linearGradient id="turbineGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#1a2a3a" />
          <stop offset="100%" stopColor="#2a4a6a" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <marker id="arrowBlue" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#0088cc" />
        </marker>
        <marker id="arrowRed" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#ff6600" />
        </marker>
      </defs>

      {/* Background */}
      <rect width="900" height="600" fill="#050a0f" />
      <g stroke="#0a1a28" strokeWidth="1" opacity="0.5">
        {Array.from({ length: 11 }, (_, i) => <line key={`h${i}`} x1="0" y1={(i + 1) * 50} x2="900" y2={(i + 1) * 50} />)}
        {Array.from({ length: 17 }, (_, i) => <line key={`v${i}`} x1={(i + 1) * 50} y1="0" x2={(i + 1) * 50} y2="600" />)}
      </g>

      {/* Containment outline */}
      <ellipse cx="230" cy="300" rx="190" ry="260" fill="none" stroke="#1a3a5a" strokeWidth="2" strokeDasharray="8,4" opacity="0.6" />
      <text x="230" y="26" fill="#1a3a5a" fontSize="9" textAnchor="middle" letterSpacing="2">CONTAINMENT</text>

      {/* Hot leg */}
      <g {...hoverProps("pipe-hot", onHover)}>
        <path d="M 305 280 Q 340 280 360 260 L 380 260" stroke="url(#hotLeg)" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M 305 280 Q 340 280 360 260 L 380 260" stroke="#ff6600" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.5" strokeDasharray="8,4">
          <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="0.8s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Cold leg */}
      <g {...hoverProps("pipe-cold", onHover)}>
        <path d="M 382 330 L 360 330 Q 340 330 320 340 L 310 340 L 295 320" stroke="url(#coldLeg)" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M 382 330 L 360 330 Q 340 330 320 340 L 310 340 L 295 320" stroke="#0088cc" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.5" strokeDasharray="8,4">
          <animate attributeName="stroke-dashoffset" from="0" to="24" dur="1.2s" repeatCount="indefinite" />
        </path>
      </g>

      {/* RPV */}
      <g {...hoverProps("rpv", onHover)} style={{ cursor: "pointer", filter: rpvGlowColor }}>
        <rect x="215" y="130" width="90" height="340" rx="12" fill="url(#vesselGrad)" stroke="#2a5a8a" strokeWidth="2" />
        <rect x="221" y="136" width="78" height="328" rx="10" fill="#060e18" />
        <ellipse cx="260" cy="300" rx="35" ry="80" fill="url(#coreGlow)">
          <animate attributeName="rx" values="30;38;30" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
        </ellipse>
        {/* Fuel rods */}
        {[235, 248, 261, 274].map((x, i) => (
          <rect key={i} x={x} y={215 + i * 2} width="8" height={145 - i * 2} rx="2" fill="#22aa66" opacity="0.9" />
        ))}
        <rect x="287" y="225" width="5" height="130" rx="2" fill="#22aa66" opacity="0.9" />
        <rect x="228" y="225" width="5" height="130" rx="2" fill="#22aa66" opacity="0.9" />
        {/* Neutron flashes */}
        <circle cx="260" cy="290" r="3" fill="#ffffff" opacity="0">
          <animate attributeName="opacity" values="0;0.8;0" dur="0.3s" repeatCount="indefinite" begin="0s" />
        </circle>
        <circle cx="252" cy="310" r="2" fill="#aaffcc" opacity="0">
          <animate attributeName="opacity" values="0;1;0" dur="0.4s" repeatCount="indefinite" begin="0.15s" />
        </circle>
        <circle cx="272" cy="280" r="2" fill="#aaffcc" opacity="0">
          <animate attributeName="opacity" values="0;1;0" dur="0.35s" repeatCount="indefinite" begin="0.25s" />
        </circle>
        {/* Control rods — height driven by state */}
        <rect x="236" y="136" width="6" height={rodLen} rx="2" fill="#4488aa" />
        <rect x="249" y="136" width="6" height={rodLen} rx="2" fill="#4488aa" />
        <rect x="262" y="136" width="6" height={rodLen} rx="2" fill="#4488aa" />
        <rect x="275" y="136" width="6" height={rodLen} rx="2" fill="#4488aa" />
        <rect x="288" y="136" width="4" height={rodLen} rx="2" fill="#4488aa" />
        <text x="260" y="490" fill="#2a5a8a" fontSize="8" textAnchor="middle">RPV</text>
      </g>

      {/* RPV head */}
      <rect x="220" y="118" width="80" height="18" rx="4" fill="#1a3a5a" stroke="#2a5a8a" strokeWidth="1.5"
        onMouseEnter={() => onHover({ title: "Reactor Upper Head & CRDM", info: "Houses Control Rod Drive Mechanisms (CRDMs). Upon loss of power, rods fall by gravity into the core (fail-safe). Head is opened during refuelling outages every 12-18 months." })}
        onMouseLeave={() => onHover(null)}
        style={{ cursor: "pointer" }}
      />

      {/* Pressurizer */}
      <g {...hoverProps("pressurizer", onHover)}>
        <rect x="100" y="170" width="40" height="90" rx="6" fill="#1a2a3a" stroke="#2a4a6a" strokeWidth="1.5" />
        <rect x="104" y="174" width="32" height="82" rx="4" fill="#060e18" />
        <rect x="104" y="215" width="32" height="41" rx="2" fill="#004488" opacity="0.6" />
        <ellipse cx="120" cy="210" rx="14" ry="4" fill="#223344" opacity="0.5" />
        <line x1="140" y1="250" x2="215" y2="310" stroke="#2a5a8a" strokeWidth="4" strokeLinecap="round" />
        <text x="120" y="275" fill="#2a5a8a" fontSize="8" textAnchor="middle">PRZ</text>
      </g>

      {/* Steam Generator */}
      <g {...hoverProps("steamGenerator", onHover)}>
        <rect x="380" y="220" width="130" height="150" rx="8" fill="url(#steamGenGrad)" stroke="#2a4a6a" strokeWidth="2" />
        <rect x="386" y="226" width="118" height="138" rx="6" fill="#060e18" />
        {/* U-tubes */}
        <g stroke="#1a4a6a" strokeWidth="1.5" fill="none">
          <path d="M 400 310 L 400 260 Q 400 245 415 245 Q 430 245 430 260 L 430 310" />
          <path d="M 415 310 L 415 265 Q 415 255 425 255 Q 435 255 435 265 L 435 310" />
          <path d="M 432 310 L 432 262 Q 432 250 445 250 Q 458 250 458 262 L 458 310" />
          <path d="M 458 310 L 458 260 Q 458 248 470 248 Q 482 248 482 260 L 482 310" />
        </g>
        {/* Water level — driven by state */}
        <rect x="386" y={sgWaterY} width="118" height={sgWaterH} rx="4" fill="#003355" opacity="0.4" style={{ transition: "all 0.5s" }} />
        {/* Boiling bubbles */}
        {[{ cx: 410, delay: "0s" }, { cx: 440, delay: "0.4s" }, { cx: 470, delay: "0.8s" }].map((b) => (
          <circle key={b.cx} cx={b.cx} r="2" fill="#aaddff" cy="280" opacity="0">
            <animate attributeName="cy" from="310" to="255" dur="1.5s" repeatCount="indefinite" begin={b.delay} />
            <animate attributeName="opacity" values="0;0.7;0" dur="1.5s" repeatCount="indefinite" begin={b.delay} />
          </circle>
        ))}
        <text x="445" y="375" fill="#2a4a6a" fontSize="8" textAnchor="middle">STEAM GEN</text>
      </g>

      {/* MCP */}
      <g {...hoverProps("mcp", onHover)}>
        <circle cx="335" cy="355" r="22" fill="#1a2a3a" stroke="#2a5a8a" strokeWidth="2" />
        <circle cx="335" cy="355" r="16" fill="#060e18" />
        <g>
          <line x1="335" y1="345" x2="335" y2="365" stroke="#0088cc" strokeWidth="2">
            <animateTransform attributeName="transform" type="rotate" from="0 335 355" to="360 335 355" dur="0.5s" repeatCount="indefinite" />
          </line>
          <line x1="325" y1="355" x2="345" y2="355" stroke="#0088cc" strokeWidth="2">
            <animateTransform attributeName="transform" type="rotate" from="0 335 355" to="360 335 355" dur="0.5s" repeatCount="indefinite" />
          </line>
          <line x1="328" y1="348" x2="342" y2="362" stroke="#0055aa" strokeWidth="1.5">
            <animateTransform attributeName="transform" type="rotate" from="0 335 355" to="360 335 355" dur="0.5s" repeatCount="indefinite" />
          </line>
        </g>
        <text x="335" y="390" fill="#2a5a8a" fontSize="8" textAnchor="middle">MCP</text>
      </g>

      {/* Steam line */}
      <g {...hoverProps("steam-line", onHover)}>
        <path d="M 510 250 L 580 250 L 580 200 L 630 200" stroke="#446688" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M 510 250 L 580 250 L 580 200 L 630 200" stroke="#aaccee" strokeWidth="3" fill="none" strokeDasharray="10,5" opacity="0.4">
          <animate attributeName="stroke-dashoffset" from="0" to="-30" dur="1s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Turbine */}
      <g {...hoverProps("turbine", onHover)}>
        <rect x="630" y="155" width="110" height="90" rx="6" fill="url(#turbineGrad)" stroke="#2a4a6a" strokeWidth="2" />
        <g stroke="#1a4a6a" strokeWidth="1">
          {[650, 665, 680, 695, 710, 725].map((x) => <line key={x} x1={x} y1="165" x2={x} y2="235" />)}
        </g>
        <circle cx="685" cy="200" r="18" fill="none" stroke="#0066aa" strokeWidth="1.5" strokeDasharray="5,5">
          <animateTransform attributeName="transform" type="rotate" from="0 685 200" to="360 685 200" dur="0.6s" repeatCount="indefinite" />
        </circle>
        <text x="685" y="258" fill="#2a4a6a" fontSize="8" textAnchor="middle">TURBINE</text>
      </g>

      {/* Generator */}
      <g {...hoverProps("generator", onHover)}>
        <rect x="755" y="165" width="80" height="70" rx="5" fill="#111a25" stroke="#2a5a2a" strokeWidth="2" />
        <rect x="760" y="170" width="70" height="60" rx="3" fill="#060e18" />
        <text x="795" y="196" fill="#2a5a2a" fontSize="8" textAnchor="middle">GENERATOR</text>
        <text x="795" y="208" fill="#00ff88" fontSize="9" textAnchor="middle">{elPower} MW</text>
        <text x="795" y="222" fill="#446688" fontSize="7" textAnchor="middle">24 kV · 50 Hz</text>
        <path d="M 780 228 L 788 218 L 784 225 L 792 215 L 800 228" fill="none" stroke="#ffdd00" strokeWidth="1.5" />
      </g>

      {/* Power output to grid */}
      <path d="M 835 200 L 870 200 L 870 180 L 895 180" stroke="#ffdd00" strokeWidth="3" strokeDasharray="6,3">
        <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="0.6s" repeatCount="indefinite" />
      </path>
      <text x="885" y="170" fill="#ffdd00" fontSize="9" textAnchor="middle">GRID</text>
      <text x="885" y="180" fill="#ffdd00" fontSize="8" textAnchor="middle">330kV</text>

      {/* Exhaust line */}
      <g {...hoverProps("exhaust-line", onHover)}>
        <path d="M 685 245 L 685 340" stroke="#2a4a5a" strokeWidth="8" fill="none" />
      </g>

      {/* Condenser */}
      <g {...hoverProps("condenser", onHover)}>
        <rect x="630" y="340" width="110" height="55" rx="5" fill="#0a1a25" stroke="#2a3a4a" strokeWidth="1.5" />
        <g stroke="#0a2a3a" strokeWidth="1">
          {[645, 658, 671, 684, 697, 710, 723].map((x) => <line key={x} x1={x} y1="350" x2={x} y2="385" />)}
        </g>
        <text x="685" y="408" fill="#2a3a4a" fontSize="8" textAnchor="middle">CONDENSER</text>
      </g>

      {/* Feedwater */}
      <g {...hoverProps("feedwater", onHover)}>
        <path d="M 685 395 L 685 440 L 510 440 L 510 360" stroke="#004488" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M 685 395 L 685 440 L 510 440 L 510 360" stroke="#0088cc" strokeWidth="2" fill="none" strokeDasharray="8,4" opacity="0.5">
          <animate attributeName="stroke-dashoffset" from="0" to="24" dur="1.5s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Cooling tower */}
      <g {...hoverProps("coolingTower", onHover)}>
        <path d="M 820 450 L 790 340 L 820 300 L 850 340 L 820 450" fill="#0a1520" stroke="#2a3a4a" strokeWidth="1.5" />
        <ellipse cx="820" cy="450" rx="30" ry="8" fill="none" stroke="#2a3a4a" strokeWidth="1.5" />
        <ellipse cx="820" cy="300" rx="16" ry="4" fill="none" stroke="#2a4a5a" strokeWidth="1" />
        {[{ cx: 812, dur: "3s", begin: "0s" }, { cx: 820, dur: "2.5s", begin: "0.5s" }, { cx: 828, dur: "3.5s", begin: "1s" }].map((v) => (
          <circle key={v.cx} cx={v.cx} r="4" fill="#aaddff" cy="285" opacity="0">
            <animate attributeName="cy" from="295" to="255" dur={v.dur} repeatCount="indefinite" begin={v.begin} />
            <animate attributeName="opacity" values="0.4;0" dur={v.dur} repeatCount="indefinite" begin={v.begin} />
          </circle>
        ))}
        <text x="820" y="472" fill="#2a3a4a" fontSize="8" textAnchor="middle">COOLING TWR</text>
      </g>

      {/* Condenser cooling water */}
      <path d="M 740 362 Q 780 362 780 410 Q 780 450 820 450" stroke="#004060" strokeWidth="4" fill="none" strokeDasharray="6,3">
        <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M 820 450 Q 820 480 760 490 Q 700 490 685 415" stroke="#003a55" strokeWidth="4" fill="none" strokeDasharray="6,3" opacity="0.6">
        <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="2s" repeatCount="indefinite" />
      </path>

      {/* ECCS */}
      <g {...hoverProps("eccs", onHover)}>
        <rect x="90" y="390" width="55" height="70" rx="5" fill="#0a1a25" stroke="#2a5a2a" strokeWidth="1.5" />
        <rect x="95" y="395" width="45" height="60" rx="3" fill="#003310" opacity="0.5" />
        <text x="117" y="425" fill="#2a5a2a" fontSize="7" textAnchor="middle">ECCS</text>
        <text x="117" y="437" fill="#00ff88" fontSize="7" textAnchor="middle">READY</text>
        <text x="117" y="449" fill="#2a5a2a" fontSize="6" textAnchor="middle">60 bar</text>
        <path d="M 145 430 L 215 360" stroke="#2a5a2a" strokeWidth="3" strokeDasharray="5,3" />
      </g>

      {/* Spent Fuel Pool */}
      <g {...hoverProps("sfp", onHover)}>
        <rect x="90" y="480" width="55" height="40" rx="4" fill="#0a1525" stroke="#1a3a5a" strokeWidth="1.5" />
        <rect x="94" y="484" width="47" height="32" rx="3" fill="#002244" opacity="0.6" />
        <text x="117" y="499" fill="#1a3a5a" fontSize="7" textAnchor="middle">SPENT</text>
        <text x="117" y="509" fill="#1a3a5a" fontSize="7" textAnchor="middle">FUEL POOL</text>
      </g>

      {/* Moving neutron particles */}
      <circle cx="248" cy="250" r="1.5" fill="#00ff88" opacity="0">
        <animate attributeName="cx" values="248;265;272;258;248" dur="0.8s" repeatCount="indefinite" />
        <animate attributeName="cy" values="250;260;280;310;250" dur="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.9;0.9;0;0" dur="0.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="270" cy="270" r="1.5" fill="#00ff88" opacity="0">
        <animate attributeName="cx" values="270;255;245;260;270" dur="1s" repeatCount="indefinite" begin="0.2s" />
        <animate attributeName="cy" values="270;285;300;320;270" dur="1s" repeatCount="indefinite" begin="0.2s" />
        <animate attributeName="opacity" values="0;0.9;0.9;0;0" dur="1s" repeatCount="indefinite" begin="0.2s" />
      </circle>

      {/* Section labels */}
      <text x="445" y="590" fill="#1a3a5a" fontSize="8" textAnchor="middle">SECONDARY LOOP (NON-RADIOACTIVE)</text>
      <text x="148" y="310" fill="#446688" fontSize="8" textAnchor="middle">PRIMARY LOOP</text>
    </svg>
  );
}
