# dfl-harness-workshop 🥋

A **kata** — a tiny, hands-on version of the
[`dfl-harness`](https://github.com/devfellowship/dfl-harness) (the agent OS for
DFL). You build an AI agent **one capability at a time**, point it at a real
bug, **eval** it, **publish** your score, **version** your harness, and
**iterate** to beat it.

> The whole arc: **model → prompt → tool → context → MCP → skill → solve → eval → publish → version → iterate.**

Each capability lives in its own folder under [`steps/`](steps/) with a README.
Nothing is hidden — read the `run.ts`, run it, watch the agent grow.

---

## 1. Open it — no org membership needed

This repo is **public**. You do **not** need to be a member of `devfellowship`.
Pick whichever is easiest:

- **GitHub Codespaces (recommended):** click **`< > Code` → Codespaces → Create
  codespace**. The devcontainer builds in ~1 min and runs `npm install` for you.
  Runs on *your* personal free Codespaces quota.
- **VS Code locally:** clone, then **"Reopen in Container"** (needs Docker +
  the Dev Containers extension). Same devcontainer.
- **No container:** clone + Node 20+, then `npm install`.

> **Want to keep your work / appear on the leaderboard?** **Fork** this repo
> first, then open the Codespace **on your fork**. Forks work with Codespaces
> exactly the same way — and you get a place to commit your `agent/` changes.

## 2. Get the key

The workshop uses one shared **OpenRouter** key (works for any model). Grab it
from this 1Password link (expires ~24h after the event):

**🔑 https://share.1password.com/s#Fur3ZQuR_Otbb9Up7kQPsOowbiC4zyUbgBjUCOkdyQg**

Then either export it:

```bash
export OPENROUTER_API_KEY=sk-or-v1-...
```

…or copy `.env.example` to `.env` and paste it there (`.env` is gitignored):

```bash
cp .env.example .env   # then edit .env
```

## 3. Run the steps in order

```bash
npm install                              # once (the devcontainer does this for you)
npx tsx steps/00-model/run.ts            # ...then 01, 02, 03, ...
```

Each `steps/NN-*/README.md` tells you what to run and what to watch for. The
short version:

| Step | You'll see |
|------|------------|
| `00-model` | a raw model answer |
| `01-prompt` | the agent knows its job (but can't act yet) |
| `02-tool` | the agent calls `read_file` to inspect the bug |
| `03-context` | the agent diagnoses the bug from injected context |
| `04-mcp` | the agent calls a tool from a bundled **MCP server** (`run_tests`) |
| `05-skill` | the agent follows a loaded **skill** procedure |
| `06-solution` | the full agent **writes the fix** to `agent/solution/buggy-math.ts` |
| `07-eval` | score it: **tests + LLM judge + human** |
| `08-publish` | POST your score to the **moltbook** leaderboard |
| `09-version` | snapshot your whole harness as a versioned record |
| `10-iterate` | compare versions and improve |

**Try the eval before and after step 06** to feel the loop:

```bash
npm run eval -- tests        # before solving → FAIL (deterministic, no key needed)
npx tsx steps/06-solution/run.ts
npm run eval                 # after → PASS, judge 10/10
```

## 4. The problem & your agent

- [`problem/`](problem/) — the bug to fix (`sum()` returns the wrong total) and
  the tests that define "correct".
- [`agent/`](agent/) — **your harness**, the unit you version & iterate:
  - `harness.config.json` — model + version + temperature
  - `prompt.md` — the agent's approach
  - `context.md` — what you feed it about the problem
  - `skills/` — reusable procedures (start with `fix-failing-test`)
  - `mcp/` — the bundled MCP server
  - `solution/` — where the agent writes its fix (gitignored)
  - `versions/` — recorded harness snapshots (step 09)

## The eval (3 graders)

| Grader | What | Needs the key? |
|--------|------|----------------|
| `tests` | runs `problem/buggy-math.test.ts` — deterministic pass/fail | no |
| `llm-judge` | a model scores the solution 0–10 against a rubric | yes |
| `human` | you rate it 1–5 (`HUMAN_SCORE=5 npm run eval`, or a TTY prompt) | no |

```bash
npm run eval                       # all three
npm run eval -- tests llm-judge    # pick graders
HUMAN_SCORE=5 npm run eval         # record a human score non-interactively
```

## Stack

TypeScript · [Vercel AI SDK v5](https://sdk.vercel.ai) (`ai`) ·
`@ai-sdk/openai-compatible` pointed at OpenRouter · `@modelcontextprotocol/sdk`
for the MCP step · run with `tsx`. Zero build step.
