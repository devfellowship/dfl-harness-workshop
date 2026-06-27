# dfl-harness-workshop 🥋 — `web3` branch

> **🌶️ This is the `web3` tempero (flavor).** Same harness, same step-by-step
> arc — but the bug is now a **real ERC-4337 userOp false-negative from
> production** (Pods/Deframe). A withdrawal **succeeded on-chain** but the UI
> showed **"failed"**, because the frontend read the `handleOps` **batch** status
> (`receipt.receipt.status`) instead of the userOp's **own** result
> (`receipt.success`). The agent's job: fetch the on-chain **ground truth** via a
> **read-only query tool** and fix the read-path to trust `receipt.success`.
>
> Unifies two real cases — **§1.1** "give the agent a read-only tool" +
> **§2.2** "the ERC-4337 userOp receipt false-negative." See [`WEB3.md`](WEB3.md).
>
> **Runs with Node 20+ only** — no Foundry, no Anvil, no Docker, no RPC. The
> userOp receipts are local JSON fixtures under [`problem/fixtures/`](problem/fixtures/).

A **kata** — a tiny, hands-on version of the
[`dfl-harness`](https://github.com/devfellowship/dfl-harness) (the agent OS for
DFL). You build an AI agent **one capability at a time**, point it at a real
bug, **eval** it, **publish** your score, **version** your harness, and
**iterate** to beat it.

> The whole arc: **model → prompt → tool → context → MCP → skill → solve → eval → publish → version → iterate.**

Each capability lives in its own folder under [`steps/`](steps/) with a README.
Nothing is hidden — read the `run.ts`, run it, watch the agent grow.

---

## ⚡ Quick commands (copy-paste, in order)

Everything an attendee runs, top to bottom. Node 20+ only — `npx`/`npm`, zero
global install. (Prefer **Codespaces** if your local Node is older than 20 — see
[§1](#1-open-it--no-org-membership-needed).)

**1. Clone + install**

```bash
git clone -b web3 https://github.com/devfellowship/dfl-harness-workshop.git
cd dfl-harness-workshop
npm install
```

**2. Set the key** (grab it from the 1Password link in [§2](#2-get-the-key) — expires ~24h after the event)

```bash
export OPENROUTER_API_KEY=sk-or-v1-...
```

> **Model note:** the harness already defaults to `anthropic/claude-haiku-4.5`
> (set in `agent/harness.config.json`). If the shared key runs low, fall back to
> the OSS model: `export OPENROUTER_MODEL=qwen/qwen-2.5-72b-instruct`.

**3. Run the steps in order** (each prints what it does — read the `steps/NN-*/README.md` alongside)

```bash
npx tsx steps/00-model/run.ts
npx tsx steps/01-prompt/run.ts
npx tsx steps/02-tool/run.ts
npx tsx steps/03-context/run.ts
npx tsx steps/04-mcp/run.ts
npx tsx steps/05-skill/run.ts
npx tsx steps/06-solution/run.ts
npx tsx steps/07-eval/run.ts
npx tsx steps/08-publish/run.ts
npx tsx steps/09-version/run.ts
npx tsx steps/10-iterate/run.ts
```

**4. The read-only query tool** (the §1.1 pattern — reads LOCAL fixtures, no chain, no key)

```bash
npm run query -- list
npm run query -- receipt 0xfa11ed     # the false-negative userOp receipt
# (equivalent: node tools/query.mjs receipt 0xfa11ed)
```

**5. Eval** (run it before *and* after `steps/06-solution` to feel the loop)

```bash
npm run eval -- tests          # deterministic, no key needed → red until you fix it
npm run eval                   # all graders (needs the key)
```

---

## 1. Open it — no org membership needed

This repo is **public**. You do **not** need to be a member of `devfellowship`.
Pick whichever is easiest:

- **GitHub Codespaces (recommended):** click **`< > Code` → Codespaces → Create
  codespace**. The devcontainer builds in ~1 min and runs `npm install` for you.
  Runs on *your* personal free Codespaces quota.
- **VS Code locally:** clone, then **"Reopen in Container"** (needs Docker +
  the Dev Containers extension). Same devcontainer.
- **No container:** clone + Node 20+, then `npm install`. See **Run it locally** below.

### Run it locally

**Requirements: Node 20+ (Node 22 recommended) and git. That's it.** **No Docker
required** for this path — Docker is only needed if you choose the devcontainer
option above. Works on Windows / macOS / Linux (no native dependencies).

```bash
git clone -b web3 https://github.com/devfellowship/dfl-harness-workshop.git
cd dfl-harness-workshop
npm install            # zero build step — everything runs via tsx
export OPENROUTER_API_KEY=sk-or-v1-...   # from the 1Password link below
npx tsx steps/00-model/run.ts            # then 01, 02, 03, ...
```

Quick smoke of the read-only query tool (no key needed):

```bash
npm run query -- receipt 0xfa11ed        # the false-negative userOp receipt → exit 0
npm run query -- receipt 0xnope          # missing hash → exit 3
npm run eval -- tests                     # deterministic tests → FAIL until you fix it
```

> **Tip:** if your Node is older than 20, use **Codespaces** instead — it removes
> all local setup and runs on your free quota (avoids "works on my machine").

> **Want to keep your work / appear on the leaderboard?** **Fork** this repo
> first, then open the Codespace **on your fork**. Forks work with Codespaces
> exactly the same way — and you get a place to commit your `agent/` changes.

## 2. Get the key

The workshop uses one shared **OpenRouter** key (works for any model). Grab it
from this 1Password link (expires ~24h after the event):

**🔑 https://share.1password.com/s#mm65JxTig6gCPqmr1SQowuEHDWxS5Ss6d58t259-YLY**

Then either export it:

```bash
export OPENROUTER_API_KEY=sk-or-v1-...
```

…or copy `.env.example` to `.env` and paste it there (`.env` is gitignored):

```bash
cp .env.example .env   # then edit .env
```

> **Model note:** the harness defaults to `anthropic/claude-haiku-4.5`
> (`agent/harness.config.json`). If the shared key runs low, fall back to the OSS
> model with `OPENROUTER_MODEL=qwen/qwen-2.5-72b-instruct` (an open tool-calling
> model). e.g. `OPENROUTER_MODEL=qwen/qwen-2.5-72b-instruct npx tsx steps/06-solution/run.ts`.

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
| `02-tool` | the agent calls `read_file` (and the read-only `tools/query.mjs`) to inspect the bug + fetch the userOp receipt |
| `03-context` | the agent diagnoses the bug from injected context |
| `04-mcp` | the agent calls tools from a bundled **MCP server** (`run_tests` + `get_userop_receipt`) |
| `05-skill` | the agent follows a loaded **skill** procedure (verify ground truth, trust `receipt.success`) |
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

- [`problem/`](problem/) — the bug to fix (`isUserOpSuccess()` reads the batch
  status instead of the userOp's own `receipt.success`) and the tests that
  define "correct". [`problem/fixtures/`](problem/fixtures/) holds the userOp
  receipts (on-chain ground truth) served by `tools/query.mjs`.
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
