"use client";

import { ReactorData } from "@/types/reactor";

interface Props { data: ReactorData }

function Gauge({ label, value, unit, warn, crit }: { label: string; value: string | number; unit: string; warn?: boolean; crit?: boolean }) {
  const color = crit ? "var(--red)" : warn ? "var(--yellow)" : "var(--green)";
  return (
    <div style={{ flex: 1, minWidth: 70, background: "#060e18", border: "1px solid var(--border)", borderRadius: 4, padding: 8, textAlign: "center" }}>
      <div style={{ fontSize: 9, color: "var(--text)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: "bold", color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 9, color: "var(--text)", marginTop: 2 }}>{unit}</div>
    </div>
  );
}

function Bar({ label, value, pct, unit = "%", warn = false, crit = false }: { label: string; value: number; pct: number; unit?: string; warn?: boolean; crit?: boolean }) {
  const color = crit ? "var(--red)" : warn ? "var(--yellow)" : "var(--green)";
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 3, color: "var(--bright)" }}>
        <span>{label}</span>
        <span style={{ color }}>{Math.round(value)}{unit}</span>
      </div>
      <div style={{ height: 8, background: "#060e18", border: "1px solid var(--border)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${Math.max(0, Math.min(100, pct))}%`, background: color, transition: "width 0.5s", boxShadow: `0 0 6px ${color}` }} />
      </div>
    </div>
  );
}

export default function LeftPanel({ data }: Props) {
  const deltaT = Math.round(data.t_hot - data.t_cold);
  const contPct = ((data.cont_pressure - 1) / 4) * 100;

  return (
    <div style={{ background: "var(--panel)", border: "1px solid var(--border)", padding: 16, overflowY: "auto" }}>
      <div style={{ color: "var(--cyan)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", borderBottom: "1px solid var(--border)", paddingBottom: 8, marginBottom: 12 }}>
        REACTOR PARAMETERS
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <Gauge label="Thermal Power" value={Math.round(data.power)} unit="%" warn={data.power > 105} crit={data.power > 115} />
        <Gauge label="Neutron Flux" value={data.flux.toFixed(1)} unit="×10¹³ n/cm²s" />
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <Gauge label="Core Temp" value={Math.round(data.core_temp)} unit="°C" warn={data.core_temp > 340} crit={data.core_temp > 360} />
        <Gauge label="Pressure" value={data.pressure.toFixed(1)} unit="bar" warn={data.pressure > 163} crit={data.pressure > 175} />
      </div>

      <Bar label="Control Rods" value={data.rods} pct={data.rods} />
      <Bar label="Coolant Flow" value={data.flow} pct={data.flow} warn={data.flow < 50} crit={data.flow < 20} />
      <Bar label="Steam Gen. Level" value={data.sg_level} pct={data.sg_level} warn={data.sg_level < 20} crit={data.sg_level < 10} />
      <Bar label="Turbine Load" value={data.turbine} pct={data.turbine} />
      <Bar label="Containment Press." value={data.cont_pressure} pct={contPct} unit=" bar" warn={contPct > 50} crit={contPct > 80} />

      <div style={{ marginTop: 12 }}>
        <div style={{ color: "var(--cyan)", fontSize: 11, letterSpacing: 2, borderBottom: "1px solid var(--border)", paddingBottom: 8, marginBottom: 8 }}>
          PRIMARY LOOP TEMPS
        </div>
        <div style={{ fontSize: 11, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
          <div>T-hot: <span style={{ color: "var(--orange)" }}>{Math.round(data.t_hot)}°C</span></div>
          <div>T-cold: <span style={{ color: "var(--cyan)" }}>{Math.round(data.t_cold)}°C</span></div>
          <div>ΔT: <span style={{ color: "var(--green)" }}>{deltaT}°C</span></div>
          <div>Flow: <span style={{ color: "var(--green)" }}>{(data.flow * 0.856).toFixed(1)} t/h</span></div>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ color: "var(--cyan)", fontSize: 11, letterSpacing: 2, borderBottom: "1px solid var(--border)", paddingBottom: 8, marginBottom: 8 }}>
          SAFETY SYSTEMS
        </div>
        <div style={{ height: 140, overflowY: "auto", fontSize: 10 }}>
          {data.safety_systems.map((s) => (
            <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 0", borderBottom: "1px solid #0d1f30" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, boxShadow: `0 0 4px ${s.color}`, flexShrink: 0 }} />
              <span style={{ color: s.color }}>{s.name}: {s.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
