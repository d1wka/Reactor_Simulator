import asyncio
from typing import Callable, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from reactor import ReactorState


async def _delay():
    await asyncio.sleep(3.0)


async def run_loca(state: "ReactorState"):
    state.add_log("SCENARIO: Loss of Coolant Accident (LOCA)", "crit")
    state.add_log("Primary loop pipe rupture detected — pressure dropping", "crit")
    state.scenario = "loca"
    await _delay()
    state.pressure -= 15
    state.flow = 60
    state.add_log("Coolant inventory decreasing — primary pressure 142 bar", "warn")
    await _delay()
    state.pressure -= 25
    state.flow = 30
    state.add_log("Low pressure signal — ECCS injection INITIATING", "crit")
    eccs = next((s for s in state.safety_systems if "Accumulator A" in s.name), None)
    if eccs:
        eccs.status = "INJECTING"
        eccs.color = "#ffdd00"
    await _delay()
    state.scram()
    state.pressure = 60
    state.add_log("ECCS accumulators injecting borated water into core", "warn")
    state.add_log("Reactor SCRAM confirmed — k_eff < 0.99", "ok")
    await _delay()
    state.flow = 10
    state.pressure = 40
    state.add_log("Core uncovery partially prevented by ECCS injection", "info")
    state.add_log("Emergency diesel generators online — powering RHR system", "ok")
    await _delay()
    state.add_log("Residual heat removal (RHR) system cooling core — decay heat = 1.8%", "info")
    state.add_log("Containment intact — no radioactive release to environment", "ok")


async def run_lofw(state: "ReactorState"):
    state.scenario = "lofw"
    state.add_log("SCENARIO: Loss of Feedwater (LOFW)", "crit")
    state.add_log("All feedwater pumps tripped — steam generator level dropping", "warn")
    await _delay()
    state.add_log(f"SG level falling: {int(state.sg_level)}%", "warn")
    await _delay()
    state.add_log(f"SG level CRITICAL: {int(state.sg_level)}% — trip signal", "crit")
    await _delay()
    state.scram()
    state.add_log("Reactor trip on low SG level", "crit")
    state.add_log("Auxiliary feedwater system actuated", "ok")
    await _delay()
    state.sg_level = min(state.sg_level + 5, 75)
    state.scenario = None
    state.add_log(f"Auxiliary feedwater restoring SG level — {int(state.sg_level)}%", "ok")
    await _delay()
    state.add_log("SG inventory stable — decay heat removal in progress", "info")
    state.add_log("Root cause: feedwater pump seal failure — maintenance required", "warn")


async def run_lop(state: "ReactorState"):
    state.add_log("SCENARIO: Station Blackout (Loss of All AC Power)", "crit")
    state.add_log("Grid connection lost — turbine and generator tripped", "crit")
    state.turbine = 0
    await _delay()
    state.flow = 50
    state.add_log("MCP coasting down — flywheel provides 30 seconds of flow", "warn")
    state.add_log("Emergency diesel generators starting...", "info")
    await _delay()
    state.scram()
    state.flow = 20
    state.add_log("Reactor SCRAM on turbine trip", "warn")
    state.add_log("Diesel generators failed to start — STATION BLACKOUT", "crit")
    for dg in state.safety_systems:
        if "Diesel" in dg.name:
            dg.status = "FAILED"
            dg.color = "#ff2244"
    await _delay()
    state.flow = 0
    state.add_log("ALL AC POWER LOST — passive safety systems now only option", "crit")
    state.add_log("Natural circulation establishing in primary loop", "info")
    await _delay()
    state.flow = 8
    state.add_log("Natural circulation flow: ~8% of normal — adequate for decay heat", "ok")
    state.add_log("Passive core flooding tanks pressurising — ready to inject", "info")
    await _delay()
    state.add_log("Battery-backed instruments operational — monitoring continuing", "info")
    state.add_log("Passive safety systems maintaining core cooling without AC power", "ok")
    state.add_log("External power restoration estimated: 4-8 hours", "warn")


async def run_chernobyl(state: "ReactorState"):
    state.add_log("SCENARIO: Positive Void Coefficient (RBMK-type, not VVER)", "crit")
    state.add_log("[NOTE: VVER has negative void coefficient — this cannot occur in VVER]", "warn")
    state.add_log("Simulating RBMK positive feedback for educational purposes only", "info")
    await _delay()
    state.flow = 30
    state.rods = 95
    state.add_log("Steam voids forming in coolant channels — reactivity INCREASING", "crit")
    await _delay()
    state.power = 115
    state.add_log("Power excursion: coolant boiling creates more steam → MORE reactivity → runaway", "crit")
    state.add_log("Delayed neutron fraction insufficient to control rise rate", "crit")
    await _delay()
    state.power = 130
    state.core_temp = 380
    state.add_log("POWER: 130% — CORE TEMP: 380°C — FUEL DAMAGE OCCURRING", "crit")
    state.add_log("Zircaloy cladding reacting with steam: Zr + 2H₂O → ZrO₂ + 2H₂", "crit")
    await _delay()
    state.power = 150
    state.core_temp = 450
    state.cont_pressure = 2.5
    state.add_log("HYDROGEN EXPLOSION — CORE DESTRUCTION", "crit")
    state.add_log("VVER safety: negative void coefficient prevents this — power decreases as voids form", "ok")
    await _delay()
    state.scram()
    state.add_log("Educational note: Negative temperature & void coefficients are fundamental VVER safety features", "info")
    state.add_log("PWR/VVER physics: as coolant boils, neutron moderation decreases → chain reaction slows automatically", "ok")


async def run_fukushima(state: "ReactorState"):
    state.add_log("SCENARIO: Station Blackout + Tsunami (Fukushima-type)", "crit")
    state.add_log("M9.0 earthquake — SCRAM initiated automatically on seismic signal", "warn")
    state.scram()
    await _delay()
    state.add_log("Tsunami inundating diesel generator room (elevation +10m, wave +14m)", "crit")
    for dg in state.safety_systems:
        if "Diesel" in dg.name:
            dg.status = "FAILED"
            dg.color = "#ff2244"
    await _delay()
    state.flow = 0
    state.add_log("ALL AC POWER LOST — batteries provide 8 hours of instrumentation", "crit")
    state.add_log("DC-driven RCIC system injecting steam-driven coolant — operating", "ok")
    await _delay()
    state.add_log("Battery power exhausted — RCIC trips — core cooling lost", "crit")
    state.add_log("Core water level falling — fuel rods uncovering", "crit")
    await _delay()
    state.core_temp = 400
    state.add_log("Fuel cladding oxidation: hydrogen generation in core", "crit")
    state.add_log("Containment venting required to reduce pressure — radioactive release", "crit")
    state.cont_pressure = 3.5
    await _delay()
    state.add_log("HYDROGEN EXPLOSION IN REACTOR BUILDING (not containment)", "crit")
    state.add_log("VVER-1200 improvements: passive H₂ recombiners, 72h passive cooling — prevent this", "info")
    state.add_log("Generation III+ designs learned from Fukushima", "ok")


async def run_steamline(state: "ReactorState"):
    state.add_log("SCENARIO: Main Steam Line Break (MSLB)", "crit")
    state.add_log("Steam line rupture outside containment — rapid pressure drop", "warn")
    await _delay()
    state.sg_level = max(0, state.sg_level - 20)
    state.add_log("SG blowing down — level dropping rapidly", "crit")
    state.add_log("Core cooling by secondary side compromised", "warn")
    await _delay()
    state.add_log("Main Steam Isolation Valves (MSIV) closing — 3 seconds", "info")
    state.add_log("High steam line differential pressure signal: MSIV TRIP", "ok")
    state.scram()
    await _delay()
    state.add_log("All MSIVs closed — steam line break isolated", "ok")
    state.add_log("Intact SGs available for residual heat removal via Auxiliary FW", "info")
    await _delay()
    state.add_log("Emergency feedwater to intact SGs — core cooling re-established", "ok")
    state.add_log("Worst-case MSLB results in overcooling transient — must be managed", "warn")
    await _delay()
    state.add_log("Boric acid injection prevents return to criticality during cooldown", "ok")
    state.add_log("Plant in cold shutdown — MSLB successfully mitigated", "ok")


async def run_rod_ejection(state: "ReactorState"):
    state.add_log("SCENARIO: Rod Ejection Accident", "crit")
    state.add_log("Control rod drive mechanism housing failure — rapid rod ejection", "crit")
    await _delay()
    state.rods = 95
    state.add_log("Positive reactivity insertion — power spike initiating", "crit")
    state.power = 130
    await _delay()
    state.core_temp = 380
    state.add_log("Prompt power excursion — Doppler broadening providing negative feedback", "warn")
    state.add_log("As fuel heats, ²³⁸U resonance absorption increases — natural power limit", "info")
    await _delay()
    state.power = 80
    state.add_log("Doppler effect reduced power spike from 200% to 80% within 0.1 seconds", "ok")
    state.add_log("Fuel pin local temperature exceedance possible — primary circuit activity monitor", "warn")
    await _delay()
    state.scram()
    state.add_log("Reactor SCRAM on high neutron flux", "crit")
    state.add_log("Primary coolant activity monitoring for fuel damage signature", "info")
    await _delay()
    state.add_log("Power spike mitigated by Doppler broadening — core intact", "ok")
    state.add_log("Key lesson: Prompt negative reactivity feedbacks are essential safety features", "ok")


SCENARIO_MAP = {
    "loca": run_loca,
    "lofw": run_lofw,
    "lop": run_lop,
    "chernobyl": run_chernobyl,
    "fukushima": run_fukushima,
    "steamline": run_steamline,
    "rod_ejection": run_rod_ejection,
}


class ScenarioRunner:
    def __init__(self, state: "ReactorState"):
        self.state = state
        self._task: Optional[asyncio.Task] = None

    def start(self, name: str):
        self.cancel()
        fn = SCENARIO_MAP.get(name)
        if fn:
            self._task = asyncio.create_task(fn(self.state))

    def cancel(self):
        if self._task and not self._task.done():
            self._task.cancel()
        self._task = None
