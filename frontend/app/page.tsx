"use client";

import { useState, useCallback } from "react";
import { ComponentInfo } from "@/types/reactor";
import { useReactor } from "@/hooks/useReactor";
import Header from "@/components/Header";
import LeftPanel from "@/components/LeftPanel";
import RightPanel from "@/components/RightPanel";
import BottomBar from "@/components/BottomBar";
import ReactorSVG from "@/components/ReactorSVG";
import InfoTabs from "@/components/InfoTabs";
import Tooltip from "@/components/Tooltip";

export default function Page() {
  const { data, connected, setRods, setFlow, setTurbine, scram, reset, runScenario } = useReactor();
  const [tooltip, setTooltip] = useState<ComponentInfo | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}
      onMouseMove={handleMouseMove}
    >
      {/* SCRAM overlay */}
      {data.scrammed && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 500,
            pointerEvents: "none",
            animation: "scram-flash 0.5s ease-in-out infinite",
            background: "rgba(255,0,30,0.05)",
          }}
        />
      )}

      <Header data={data} connected={connected} />

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr 280px", gridTemplateRows: "auto 1fr", flex: 1, overflow: "hidden" }}>
        {/* Left panel */}
        <div style={{ gridColumn: 1, gridRow: "1 / 3", overflow: "hidden" }}>
          <LeftPanel data={data} />
        </div>

        {/* Center top: info tabs */}
        <div
          style={{
            gridColumn: 2,
            gridRow: 1,
            background: "var(--dark)",
            borderBottom: "1px solid var(--border)",
            borderLeft: "1px solid var(--border)",
            borderRight: "1px solid var(--border)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 12,
          }}
        >
          <InfoTabs />
        </div>

        {/* Reactor diagram */}
        <div
          style={{
            gridColumn: 2,
            gridRow: 2,
            background: "var(--dark)",
            borderLeft: "1px solid var(--border)",
            borderRight: "1px solid var(--border)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <ReactorSVG data={data} onHover={setTooltip} />
        </div>

        {/* Right panel */}
        <div style={{ gridColumn: 3, gridRow: "1 / 3", overflow: "hidden" }}>
          <RightPanel
            data={data}
            onRods={setRods}
            onFlow={setFlow}
            onTurbine={setTurbine}
            onScram={scram}
            onReset={reset}
            onScenario={runScenario}
          />
        </div>
      </div>

      <BottomBar data={data} />

      <Tooltip info={tooltip} mousePos={mousePos} />
    </div>
  );
}
