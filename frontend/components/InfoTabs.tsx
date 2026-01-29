"use client";

import { useState } from "react";

const TABS = [
  { id: "reactor", label: "REACTOR VIEW" },
  { id: "process", label: "PROCESS FLOW" },
  { id: "physics", label: "NUCLEAR PHYSICS" },
  { id: "safety", label: "SAFETY SYSTEMS" },
];

const CONTENT: Record<string, React.ReactNode> = {
  reactor: (
    <>
      <strong style={{ color: "var(--cyan)" }}>VVER-1200</strong> — pressurized water reactor, 3200 MW thermal / 1200 MW electric.
      Primary coolant at <strong style={{ color: "var(--cyan)" }}>157 bar</strong> remains liquid above 325°C.
      Hover over any reactor component for detailed information and live status.
    </>
  ),
  process: (
    <>
      <strong style={{ color: "var(--cyan)" }}>Thermodynamic cycle:</strong> Fission heat → primary coolant (loop 1) →
      steam generator (heat exchanger) → secondary steam loop → turbine → generator → condenser → feedwater pump →
      steam generator. Two isolated loops prevent radioactive contamination of the turbine.
    </>
  ),
  physics: (
    <>
      <strong style={{ color: "var(--cyan)" }}>Nuclear fission:</strong> ²³⁵U absorbs a slow (thermal) neutron →
      unstable ²³⁶U → splits into two fission fragments + 2–3 fast neutrons + ~200 MeV energy. Water moderator slows
      neutrons (eV range). Control rods (B₄C/Hf) absorb neutrons to regulate chain reaction. k<sub>eff</sub> = 1.000 at criticality.
    </>
  ),
  safety: (
    <>
      <strong style={{ color: "var(--cyan)" }}>Defence-in-depth:</strong> 1) Fuel ceramic matrix · 2) Zircaloy cladding ·
      3) Reactor pressure vessel (steel, 30 cm) · 4) Primary circuit · 5) Containment building (prestressed concrete, 1.2 m).
      ECCS, passive core flood tanks, emergency boration, and auto SCRAM protect against all design-basis accidents.
    </>
  ),
};

export default function InfoTabs() {
  const [active, setActive] = useState("reactor");

  return (
    <div style={{ width: "100%", maxWidth: 640 }}>
      <div style={{ display: "flex", border: "1px solid var(--border)", marginBottom: 10 }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            style={{
              flex: 1,
              padding: "6px 4px",
              fontSize: 9,
              letterSpacing: 1,
              textAlign: "center",
              cursor: "pointer",
              color: active === t.id ? "var(--bright)" : "var(--text)",
              background: active === t.id ? "var(--border)" : "transparent",
              border: "none",
              fontFamily: "'Courier New', monospace",
              textTransform: "uppercase",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div
        style={{
          background: "#060e18",
          border: "1px solid var(--border)",
          padding: 10,
          fontSize: 11,
          lineHeight: 1.7,
          color: "var(--bright)",
        }}
      >
        {CONTENT[active]}
      </div>
    </div>
  );
}
