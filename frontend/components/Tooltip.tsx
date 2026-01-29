"use client";

import { useEffect, useRef } from "react";
import { ComponentInfo } from "@/types/reactor";

interface Props {
  info: ComponentInfo | null;
  mousePos: { x: number; y: number };
}

export default function Tooltip({ info, mousePos }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !info) return;
    const el = ref.current;
    let x = mousePos.x + 16;
    let y = mousePos.y - 8;
    if (x + 320 > window.innerWidth) x = mousePos.x - 330;
    if (y + 220 > window.innerHeight) y = mousePos.y - 200;
    el.style.left = x + "px";
    el.style.top = y + "px";
  }, [mousePos, info]);

  if (!info) return null;

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        background: "rgba(5,20,35,0.97)",
        border: "1px solid var(--cyan)",
        borderRadius: 6,
        padding: "12px 16px",
        maxWidth: 300,
        zIndex: 1000,
        pointerEvents: "none",
        fontSize: 12,
        lineHeight: 1.6,
        boxShadow: "0 0 20px rgba(0,212,255,0.2)",
      }}
    >
      <div style={{ color: "var(--cyan)", fontWeight: "bold", fontSize: 13, marginBottom: 6, letterSpacing: 1 }}>
        {info.title}
      </div>
      <div style={{ color: "var(--bright)" }}>{info.info}</div>
      {info.status && (
        <div
          style={{
            marginTop: 8,
            paddingTop: 8,
            borderTop: "1px solid var(--border)",
            color: "var(--green)",
            fontSize: 11,
          }}
        >
          STATUS: {info.status}
        </div>
      )}
    </div>
  );
}
