"use client";

import { ReactorData, LogEntry } from "@/types/reactor";

interface Props {
  data: ReactorData;
  onRods: (v: number) => void;
  onFlow: (v: number) => void;
  onTurbine: (v: number) => void;
  onScram: () => void;
  onReset: () => void;
  onScenario: (name: string) => void;
}

const SCENARIOS = [
  { id: "loca", label: "LOCA — Loss of Coolant", danger: false },
  { id: "lofw", label: "LOFW — Loss of Feedwater", danger: false },
  { id: "lop", label: "LOP — Station Blackout", danger: false },
  { id: "chernobyl", label: "PWR Positive Void (Chernobyl)", danger: true },
  { id: "fukushima", label: "SBO + Tsunami (Fukushima)", danger: true },
  { id: "steamline", label: "Main Steam Line Break", danger: false },
  { id: "rod_ejection", label: "Rod Ejection Accident", danger: false },
];

function Slider({ label, value, hint, onChange }: { label: string; value: number; hint?: string; onChange: (v: number) => void }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 10, color: "var(--cyan)", letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={{ fontSize: 11, color: "var(--green)", minWidth: 36, textAlign: "right" }}>{Math.round(value)}%</span>
      </div>
      {hint && <div style={{ fontSize: 9, color: "#446688", marginTop: 3 }}>{hint}</div>}
    </div>
  );
}

const LOG_COLORS: Record<string, string> = {
  info: "var(--cyan)",
  warn: "var(--yellow)",
  crit: "var(--red)",
  ok: "var(--green)",
  "": "var(--text)",
};

export default function RightPanel({ data, onRods, onFlow, onTurbine, onScram, onReset, onScenario }: Props) {
  return (
    <div style={{ background: "var(--panel)", border: "1px solid var(--border)", padding: 16, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <div style={{ color: "var(--cyan)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", borderBottom: "1px solid var(--border)", paddingBottom: 8, marginBottom: 12 }}>
        OPERATOR CONTROLS
      </div>

      <Slider label="Control Rods — Insertion Depth" value={data.rods} hint="0% = fully inserted (shutdown) · 100% = fully withdrawn" onChange={onRods} />
      <Slider label="Coolant Pump Speed" value={data.flow} onChange={onFlow} />
      <Slider label="Turbine Governor" value={data.turbine} onChange={onTurbine} />

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button className="btn btn-green" onClick={onReset}>NORMAL</button>
        <button className="btn btn-red" onClick={onScram}>SCRAM</button>
        <button className="btn btn-yellow" onClick={onReset}>RESET</button>
      </div>

      <div style={{ color: "var(--cyan)", fontSize: 11, letterSpacing: 2, borderBottom: "1px solid var(--border)", paddingBottom: 8, marginBottom: 8 }}>
        INCIDENT SCENARIOS
      </div>

      {SCENARIOS.map((s) => (
        <button
          key={s.id}
          onClick={() => onScenario(s.id)}
          style={{
            display: "block",
            width: "100%",
            marginBottom: 6,
            padding: "7px 10px",
            fontFamily: "'Courier New', monospace",
            fontSize: 10,
            letterSpacing: 1,
            textAlign: "left",
            border: `1px solid ${s.danger ? "#3a0a10" : "var(--border)"}`,
            background: "#060e18",
            color: s.danger ? "#884455" : "var(--text)",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.borderColor = s.danger ? "var(--red)" : "var(--orange)";
            (e.target as HTMLButtonElement).style.color = s.danger ? "var(--red)" : "var(--orange)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.borderColor = s.danger ? "#3a0a10" : "var(--border)";
            (e.target as HTMLButtonElement).style.color = s.danger ? "#884455" : "var(--text)";
          }}
        >
          {s.label}
        </button>
      ))}

      <div style={{ color: "var(--cyan)", fontSize: 11, letterSpacing: 2, borderBottom: "1px solid var(--border)", paddingBottom: 8, margin: "12px 0 8px" }}>
        SYSTEM LOG
      </div>
      <div style={{ flex: 1, overflowY: "auto", fontSize: 10, lineHeight: 1.6, border: "1px solid var(--border)", padding: "6px 8px", background: "#020810", minHeight: 100 }}>
        {data.logs.map((entry: LogEntry, i) => (
          <div key={i} style={{ color: LOG_COLORS[entry.type] ?? "var(--text)" }}>
            [{entry.time}] {entry.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
