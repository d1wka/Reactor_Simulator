"use client";

import { ReactorData } from "@/types/reactor";

interface Props { data: ReactorData }

export default function BottomBar({ data }: Props) {
  const metrics = [
    { label: "REACTOR POWER", val: `${Math.round(data.power)}%`, pct: Math.min(100, data.power), warn: data.power > 105, crit: data.power > 115 },
    { label: "CORE TEMP", val: `${Math.round(data.core_temp)}°C`, pct: Math.min(100, ((data.core_temp - 270) / 120) * 100), warn: data.core_temp > 340, crit: data.core_temp > 360 },
    { label: "PRIMARY P", val: `${data.pressure.toFixed(1)} bar`, pct: Math.min(100, (data.pressure / 180) * 100), warn: data.pressure > 163, crit: data.pressure > 175 },
    { label: "NEUTRON FLUX", val: `${data.flux}×10¹³`, pct: Math.min(100, data.power), warn: false, crit: false },
    { label: "GRID OUTPUT", val: `${data.el_power} MW`, pct: Math.min(100, data.power), warn: false, crit: false },
  ];

  const modeColor = data.scrammed ? "var(--red)" : "var(--green)";

  return (
    <div
      style={{
        background: "var(--panel)",
        borderTop: "2px solid var(--border)",
        padding: "10px 24px",
        display: "flex",
        gap: 24,
        alignItems: "center",
        overflowX: "auto",
        flexShrink: 0,
      }}
    >
      {metrics.map((m) => (
        <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 140 }}>
          <div style={{ fontSize: 9, color: "var(--text)", letterSpacing: 1, whiteSpace: "nowrap" }}>{m.label}</div>
          <div style={{ flex: 1, height: 6, background: "#060e18", border: "1px solid var(--border)", borderRadius: 2, overflow: "hidden", minWidth: 60 }}>
            <div
              style={{
                height: "100%",
                width: `${Math.max(0, m.pct)}%`,
                background: m.crit ? "var(--red)" : m.warn ? "var(--yellow)" : "var(--green)",
                transition: "width 0.5s",
              }}
            />
          </div>
          <div style={{ fontSize: 10, color: m.crit ? "var(--red)" : m.warn ? "var(--yellow)" : "var(--green)", minWidth: 60, textAlign: "right" }}>
            {m.val}
          </div>
        </div>
      ))}

      <div style={{ marginLeft: "auto", display: "flex", gap: 20, alignItems: "center" }}>
        <div style={{ fontSize: 10, color: "var(--text)" }}>
          k<sub>eff</sub>:{" "}
          <span style={{ color: data.scrammed ? "var(--cyan)" : "var(--green)" }}>{data.keff.toFixed(3)}</span>
        </div>
        <div style={{ fontSize: 10, color: "var(--text)" }}>
          DOUBLING TIME: <span style={{ color: "var(--cyan)" }}>{data.power > 100.5 && !data.scrammed ? "45s" : "∞"}</span>
        </div>
        <div style={{ fontSize: 10, color: "var(--text)" }}>
          MODE: <span style={{ color: modeColor }}>{data.op_mode}</span>
        </div>
      </div>
    </div>
  );
}
