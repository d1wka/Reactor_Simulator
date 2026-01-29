"use client";

import { useEffect, useState } from "react";
import { ReactorData } from "@/types/reactor";

interface Props {
  data: ReactorData;
  connected: boolean;
}

export default function Header({ data, connected }: Props) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleString("en-GB"));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const mainLedClass = data.scrammed ? "led led-red" : data.main_status === "ABNORMAL CONDITION" ? "led led-yellow" : "led led-green";
  const coolantLedClass = data.flow < 50 ? "led led-yellow" : "led led-green";

  return (
    <header
      style={{
        background: "var(--panel)",
        borderBottom: "2px solid var(--border)",
        padding: "12px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <div style={{ color: "var(--green)", fontSize: 18, fontWeight: "bold", letterSpacing: 3 }}>
        VVER-1200 · UNIT 1 · NPP SIMULATOR
      </div>
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        <StatusLed ledClass={mainLedClass} label={data.main_status} />
        <StatusLed ledClass="led led-yellow" label="MCC ONLINE" />
        <StatusLed ledClass={coolantLedClass} label={data.coolant_status} />
        <StatusLed ledClass={connected ? "led led-green" : "led led-red"} label={connected ? "WS CONNECTED" : "WS OFFLINE"} />
        <div style={{ color: "var(--cyan)", fontSize: 12 }}>{time}</div>
      </div>
    </header>
  );
}

function StatusLed({ ledClass, label }: { ledClass: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
      <div className={ledClass} />
      <span>{label}</span>
    </div>
  );
}
