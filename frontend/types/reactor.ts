export interface LogEntry {
  time: string;
  msg: string;
  type: "info" | "warn" | "crit" | "ok" | "";
}

export interface SafetySystem {
  name: string;
  status: string;
  color: string;
}

export interface ReactorData {
  power: number;
  rods: number;
  flow: number;
  turbine: number;
  core_temp: number;
  pressure: number;
  sg_level: number;
  cont_pressure: number;
  scrammed: boolean;
  t_hot: number;
  t_cold: number;
  keff: number;
  el_power: number;
  flux: number;
  scenario: string | null;
  main_status: string;
  coolant_status: string;
  op_mode: string;
  logs: LogEntry[];
  safety_systems: SafetySystem[];
}

export interface ComponentInfo {
  title: string;
  info: string;
  status?: string;
}
