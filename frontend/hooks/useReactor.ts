"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ReactorData } from "@/types/reactor";

const API = "http://localhost:8000";
const WS_URL = "ws://localhost:8000/ws";

const DEFAULT_STATE: ReactorData = {
  power: 100,
  rods: 80,
  flow: 100,
  turbine: 100,
  core_temp: 325,
  pressure: 157,
  sg_level: 65,
  cont_pressure: 1.0,
  scrammed: false,
  t_hot: 325,
  t_cold: 293,
  keff: 1.0,
  el_power: 1197,
  flux: 3.2,
  scenario: null,
  main_status: "NORMAL OPERATION",
  coolant_status: "COOLANT FLOW: OK",
  op_mode: "POWER OPERATION",
  logs: [],
  safety_systems: [],
};

export function useReactor() {
  const [data, setData] = useState<ReactorData>(DEFAULT_STATE);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onmessage = (e) => {
      try {
        setData(JSON.parse(e.data));
      } catch {}
    };
    ws.onclose = () => {
      setConnected(false);
      reconnectTimer.current = setTimeout(connect, 2000);
    };
    ws.onerror = () => ws.close();
  }, []);

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, [connect]);

  const post = useCallback(async (path: string, body?: object) => {
    await fetch(`${API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
  }, []);

  const setRods = useCallback((v: number) => post("/control/rods", { value: v }), [post]);
  const setFlow = useCallback((v: number) => post("/control/flow", { value: v }), [post]);
  const setTurbine = useCallback((v: number) => post("/control/turbine", { value: v }), [post]);
  const scram = useCallback(() => post("/control/scram"), [post]);
  const reset = useCallback(() => post("/control/reset"), [post]);
  const runScenario = useCallback((name: string) => post(`/scenario/${name}`), [post]);

  return { data, connected, setRods, setFlow, setTurbine, scram, reset, runScenario };
}
