from dataclasses import dataclass, field
from typing import Optional
from datetime import datetime


@dataclass
class SafetySystem:
    name: str
    status: str
    color: str

    def to_dict(self) -> dict:
        return {"name": self.name, "status": self.status, "color": self.color}


@dataclass
class LogEntry:
    time: str
    msg: str
    type: str

    def to_dict(self) -> dict:
        return {"time": self.time, "msg": self.msg, "type": self.type}


def default_safety_systems() -> list[SafetySystem]:
    return [
        SafetySystem("ECCS Accumulator A", "ARMED", "#00ff88"),
        SafetySystem("ECCS Accumulator B", "ARMED", "#00ff88"),
        SafetySystem("Emergency Boration", "READY", "#00ff88"),
        SafetySystem("Containment Spray", "STANDBY", "#00ff88"),
        SafetySystem("Passive Core Flood", "ARMED", "#00ff88"),
        SafetySystem("Diesel Gen A", "STANDBY", "#ffdd00"),
        SafetySystem("Diesel Gen B", "STANDBY", "#ffdd00"),
        SafetySystem("Safety Relief Valve", "CLOSED", "#00ff88"),
    ]


class ReactorState:
    def __init__(self):
        self.power: float = 100.0
        self.rods: float = 80.0
        self.flow: float = 100.0
        self.turbine: float = 100.0
        self.core_temp: float = 325.0
        self.pressure: float = 157.0
        self.sg_level: float = 65.0
        self.cont_pressure: float = 1.0
        self.scrammed: bool = False
        self.t_hot: float = 325.0
        self.t_cold: float = 293.0
        self.scenario: Optional[str] = None
        self.safety_systems: list[SafetySystem] = default_safety_systems()
        self.logs: list[LogEntry] = []

    def _calc_power(self) -> float:
        if self.scrammed:
            return 0.0
        rod_factor = (self.rods / 100) ** 0.6
        flow_factor = min(1.0, self.flow / 80)
        return min(120.0, rod_factor * flow_factor * 100)

    def update(self):
        self.power = self._calc_power()

        target_core_temp = 280 + (self.power / 100) * 80
        self.core_temp += (target_core_temp - self.core_temp) * 0.05

        if self.flow < 10:
            target_pressure = 157 + (100 - self.flow) * 0.2
        else:
            target_pressure = 157 - max(0.0, (100 - self.flow) * 0.05)
        if self.scrammed:
            target_pressure -= 0.5
        self.pressure += (target_pressure - self.pressure) * 0.03
        self.pressure = max(0.0, self.pressure)

        target_sg = 45 + (self.turbine / 100) * 30
        self.sg_level += (target_sg - self.sg_level) * 0.02
        if self.scenario == "lofw":
            self.sg_level = max(0.0, self.sg_level - 0.5)

        target_t_hot = 280 + (self.power / 100) * 55
        target_t_cold = 265 + (self.flow / 100) * 35
        self.t_hot += (target_t_hot - self.t_hot) * 0.04
        self.t_cold += (target_t_cold - self.t_cold) * 0.04

        self._check_alarms()

    def _check_alarms(self):
        if self.core_temp > 360 and not self.scrammed:
            self.add_log("HIGH CORE TEMPERATURE — SCRAM INITIATED", "crit")
            self.scram()

        if self.pressure > 175:
            self.add_log("OVERPRESSURE — SAFETY RELIEF VALVE OPENING", "crit")
            srv = next((s for s in self.safety_systems if "Relief" in s.name), None)
            if srv:
                srv.status = "OPEN"
                srv.color = "#ff2244"
        else:
            srv = next((s for s in self.safety_systems if "Relief" in s.name), None)
            if srv and srv.status == "OPEN":
                srv.status = "CLOSED"
                srv.color = "#00ff88"

        if self.sg_level < 10 and not self.scrammed:
            self.add_log("STEAM GENERATOR LOW LEVEL — TRIP", "crit")
            self.scram()

    def add_log(self, msg: str, log_type: str = ""):
        ts = datetime.now().strftime("%H:%M:%S")
        entry = LogEntry(time=ts, msg=msg, type=log_type)
        self.logs.insert(0, entry)
        if len(self.logs) > 60:
            self.logs.pop()

    def scram(self):
        if self.scrammed:
            return
        self.scrammed = True
        self.rods = 0.0

    def reset(self):
        self.__init__()

    @property
    def keff(self) -> float:
        if self.scrammed:
            return 0.990
        return round(0.990 + (self.rods / 100) * 0.015, 3)

    @property
    def flux(self) -> float:
        return round((self.power / 100) * 3.2, 2)

    @property
    def el_power(self) -> int:
        return int(self.power * 11.97)

    @property
    def main_status(self) -> str:
        if self.scrammed:
            return "REACTOR SHUTDOWN"
        if self.core_temp > 340:
            return "ABNORMAL CONDITION"
        return "NORMAL OPERATION"

    @property
    def coolant_status(self) -> str:
        if self.flow < 50:
            return "COOLANT FLOW: LOW"
        return "COOLANT FLOW: OK"

    @property
    def op_mode(self) -> str:
        if self.scrammed:
            return "HOT SHUTDOWN"
        if self.power < 5:
            return "SUBCRITICAL"
        if self.power < 50:
            return "LOW POWER"
        return "POWER OPERATION"

    def to_dict(self) -> dict:
        return {
            "power": round(self.power, 2),
            "rods": round(self.rods, 1),
            "flow": round(self.flow, 1),
            "turbine": round(self.turbine, 1),
            "core_temp": round(self.core_temp, 1),
            "pressure": round(self.pressure, 2),
            "sg_level": round(self.sg_level, 1),
            "cont_pressure": round(self.cont_pressure, 2),
            "scrammed": self.scrammed,
            "t_hot": round(self.t_hot, 1),
            "t_cold": round(self.t_cold, 1),
            "keff": self.keff,
            "el_power": self.el_power,
            "flux": self.flux,
            "scenario": self.scenario,
            "main_status": self.main_status,
            "coolant_status": self.coolant_status,
            "op_mode": self.op_mode,
            "logs": [e.to_dict() for e in self.logs[:25]],
            "safety_systems": [s.to_dict() for s in self.safety_systems],
        }
