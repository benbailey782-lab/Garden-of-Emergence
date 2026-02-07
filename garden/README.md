# Garden of Emergence

A meditative generative art ecosystem where digital organisms grow, compete, and evolve on 3D surfaces.

## Quick Start

```bash
chmod +x serve.sh
./serve.sh
# Open http://localhost:8080
```

Or use any HTTP server — ES modules require one (can't use `file://`).

## Project Structure

```
garden/
├── index.html              ← HTML + CSS + landing page script
├── app.js                  ← Main application (Three.js module)
├── serve.sh                ← Local dev server (Python)
├── models/
│   ├── manifest.json       ← Model registry (add new models here)
│   ├── coral/              ← Coral seed GLB models
│   │   └── anemone-01.glb  ← Drop your first model here
│   ├── fungal/             ← Fungal seed GLB models
│   └── hero/               ← Hero substrate models
└── README.md
```

## Adding Models

1. Generate a GLB model in Meshy (or any 3D tool)
2. Drop the `.glb` file in the appropriate folder (e.g. `models/coral/`)
3. Add an entry to `models/manifest.json`:

```json
{
  "id": "coral-branch-01",
  "file": "coral/coral-branch-01.glb",
  "targetHeight": 0.25,
  "weight": 0.30,
  "sway": { "strength": 0.004, "speed": 0.8 },
  "material": {
    "roughness": 0.78,
    "emissiveIntensity": 0.25,
    "transparent": false,
    "opacity": 1.0
  },
  "palette": ["#ffb36b", "#ff6aa2", "#ffd36a", "#7fe3d4", "#b59cff", "#ff7f50"]
}
```

4. Refresh the page — the model appears automatically.

### Manifest Fields

| Field | Description |
|-------|-------------|
| `id` | Unique identifier (used as registry key) |
| `file` | Path relative to `basePath` |
| `targetHeight` | Normalized height in world units (0.10–0.35 typical) |
| `weight` | Spawn probability weight (higher = more common) |
| `sway.strength` | How far tips displace (0 = static, 0.03 = flowing) |
| `sway.speed` | Oscillation speed (0.4 = gentle, 1.5 = active) |
| `material.*` | PBR material properties |
| `palette` | Array of hex colors for per-instance tinting |

### Sway Guide

| Type | Strength | Speed | Effect |
|------|----------|-------|--------|
| Brain coral | 0.001 | 0.5 | Nearly static, subtle pulse |
| Branching coral | 0.003–0.005 | 0.8 | Gentle rigid sway |
| Mushroom | 0.008–0.012 | 0.6 | Soft cap wobble |
| Anemone | 0.020–0.030 | 1.5 | Flowing tentacles |
| Shelf fungus | 0.002 | 0.4 | Barely perceptible |

## How It Works

**Model Loading:** On game start, `modelRegistry.loadFromManifest()` fetches the manifest, then parallel-loads all GLB files. Missing files are silently skipped — the system falls back to procedural geometry if no models are available.

**Sway Animation:** Each model gets a `aHeightNorm` vertex attribute (0 at base, 1 at tip). The custom shader displaces vertices by `height² × sin(time + phase)`, so bases stay planted while tips flow. Each instance gets a random phase so they don't move in unison.

**Instancing:** All models use `InstancedMesh` for performance. 2600 instances per variant type, each with per-instance color and sway phase.

## Architecture Notes

- **No build step required** — uses ES module importmap with CDN-hosted Three.js
- **Graceful degradation** — works with zero GLB models (procedural fallback)
- **Scale-ready** — manifest supports unlimited model variants per seed type
