# Step 09 — version the harness

**Goal** — Snapshot the *whole* agent (model + prompt + context + skills) into a content-hashed record under `agent/versions/`, tagged with the version from `agent/harness.config.json` and stamped with the latest eval score. This makes iteration measurable — each version is a comparable point.

**What's new vs the previous step** — Captures everything as one immutable, hashed version record (vs. step 08 which just publishes a single score).

**Run it**
```bash
npx tsx steps/09-version/run.ts
```

**What to look for**
- `recorded: agent/versions/<version>+<hash>.json` (e.g. `0.0.1+<12-char-hash>.json`).
- A printed JSON object with `version`, `hash`, `model`, `skills` (array), and `eval` (the latest scores, or null if you haven't run eval).

**Try this** — Bump `"version"` in `agent/harness.config.json` (or change the prompt/skill), re-run, and watch a new hashed record appear alongside the old one.
