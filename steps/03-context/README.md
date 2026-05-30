# Step 03 — context

**Goal** — Tools let the agent *fetch* information; context *pre-loads* the important parts so it doesn't have to. We inject the buggy file plus the test (via `loadContext()`) straight into the conversation, so the agent understands the task in one shot.

**What's new vs the previous step** — Pre-loads the problem as `messages` context and hands over the full `fsTools` set (read + write), instead of relying on the agent to fetch.

**Run it**
```bash
OPENROUTER_API_KEY=$KEY npx tsx steps/03-context/run.ts
```

**What to look for**
- A one-sentence diagnosis of the bug (it should pinpoint `total` starting at `1` instead of `0`).
- No fix is written — the prompt says "Do NOT write the fix yet."

**Try this** — Edit `agent/context.md` to add or remove framing around the problem and see how the diagnosis changes with richer/leaner context.
