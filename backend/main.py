import asyncio
import json
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from reactor import ReactorState
from scenarios import ScenarioRunner, SCENARIO_MAP


reactor = ReactorState()
runner = ScenarioRunner(reactor)
clients: list[WebSocket] = []


async def broadcast():
    if not clients:
        return
    payload = json.dumps(reactor.to_dict())
    dead = []
    for ws in clients:
        try:
            await ws.send_text(payload)
        except Exception:
            dead.append(ws)
    for ws in dead:
        clients.remove(ws)


async def simulation_loop():
    while True:
        reactor.update()
        await broadcast()
        await asyncio.sleep(0.5)


@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(simulation_loop())
    yield
    task.cancel()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.websocket("/ws")
async def ws_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        if websocket in clients:
            clients.remove(websocket)


class ControlValue(BaseModel):
    value: float


@app.post("/control/rods")
async def set_rods(body: ControlValue):
    reactor.rods = max(0.0, min(100.0, body.value))
    reactor.add_log(f"Control rods set to {int(reactor.rods)}% withdrawn", "info")
    return {"ok": True}


@app.post("/control/flow")
async def set_flow(body: ControlValue):
    reactor.flow = max(0.0, min(100.0, body.value))
    if reactor.flow < 50:
        reactor.add_log("MCP speed low — coolant flow reduced", "warn")
    return {"ok": True}


@app.post("/control/turbine")
async def set_turbine(body: ControlValue):
    reactor.turbine = max(0.0, min(100.0, body.value))
    return {"ok": True}


@app.post("/control/scram")
async def do_scram():
    reactor.scram()
    runner.cancel()
    reactor.add_log("MANUAL REACTOR SCRAM — ALL RODS INSERTED", "crit")
    reactor.add_log("Emergency core cooling system: ARMED", "warn")
    reactor.add_log("Decay heat removal: INITIATING", "info")
    eccs = next((s for s in reactor.safety_systems if "Accumulator A" in s.name), None)
    if eccs:
        eccs.status = "INJECTING"
        eccs.color = "#ffdd00"
    return {"ok": True}


@app.post("/control/reset")
async def do_reset():
    runner.cancel()
    reactor.reset()
    reactor.add_log("System reset to normal operation", "ok")
    return {"ok": True}


@app.post("/scenario/{name}")
async def run_scenario(name: str):
    if name not in SCENARIO_MAP:
        return {"ok": False, "error": "Unknown scenario"}
    runner.cancel()
    reactor.reset()
    reactor.add_log(f"Loading scenario: {name.upper()}", "info")
    await asyncio.sleep(0.1)
    runner.start(name)
    return {"ok": True}


@app.get("/state")
async def get_state():
    return reactor.to_dict()
