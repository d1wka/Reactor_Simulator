# Nuclear Reactor Simulator — VVER-1200

An educational, interactive simulator of a VVER-1200 pressurized water reactor control room. Adjust control rods, coolant flow and turbine load, watch plant parameters respond in real time, trigger a SCRAM, or run historical and design-basis accident scenarios.

> This is a simplified teaching model, not a physics-accurate engineering tool.

## Features

- **Live plant parameters**: thermal and electrical power, core temperature, primary pressure, hot/cold leg temperatures, steam generator level, containment pressure, k_eff and neutron flux
- **Operator controls**: control rod withdrawal, main coolant pump flow, turbine load, manual SCRAM and reset
- **Automatic protection**: SCRAM on high core temperature or low SG level, safety relief valve on overpressure
- **Safety systems panel**: ECCS accumulators, emergency boration, containment spray, passive core flooding, diesel generators, relief valve
- **Accident scenarios**:
  | Key | Scenario |
  |---|---|
  | `loca` | Loss of Coolant Accident |
  | `lofw` | Loss of Feedwater |
  | `lop` | Station Blackout (loss of all AC power) |
  | `steamline` | Main Steam Line Break |
  | `rod_ejection` | Rod Ejection Accident |
  | `chernobyl` | Positive void coefficient excursion (RBMK-type, for comparison) |
  | `fukushima` | Station blackout + tsunami |
- **Event log** with info / warning / critical messages
- **Info tabs** explaining the reactor, process flow, physics and safety concepts

## Project structure

```
.
├── index.html        # Standalone single-file version (no backend needed)
├── backend/          # FastAPI simulation server
│   ├── main.py       # REST + WebSocket API, 0.5 s simulation loop
│   ├── reactor.py    # Reactor state model and alarm logic
│   ├── scenarios.py  # Scripted accident scenarios
│   └── requirements.txt
└── frontend/         # Next.js 15 / React 19 UI
    ├── app/
    ├── components/   # Header, panels, ReactorSVG, InfoTabs, BottomBar...
    ├── hooks/useReactor.ts   # WebSocket client + control API calls
    └── types/reactor.ts
```

## Getting started

### Option 1: Standalone

Open `index.html` in a browser. Everything runs client-side.

### Option 2: Backend + frontend

Requirements: Python 3.10+, Node.js 18+.

**Backend** (runs on `http://localhost:8000`):

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend** (runs on `http://localhost:3000`):

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000. The frontend connects to `ws://localhost:8000/ws` and reconnects automatically if the backend restarts.

## API

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `WS` | `/ws` | — | Streams full reactor state as JSON every 0.5 s |
| `GET` | `/state` | — | Current reactor state |
| `POST` | `/control/rods` | `{"value": 0-100}` | Control rod withdrawal (%) |
| `POST` | `/control/flow` | `{"value": 0-100}` | Coolant flow (%) |
| `POST` | `/control/turbine` | `{"value": 0-100}` | Turbine load (%) |
| `POST` | `/control/scram` | — | Manual reactor trip |
| `POST` | `/control/reset` | — | Reset to normal operation |
| `POST` | `/scenario/{name}` | — | Run a scenario (see keys above) |

## Tech stack

- **Backend**: Python, FastAPI, Uvicorn, WebSockets, Pydantic
- **Frontend**: Next.js 15, React 19, TypeScript
