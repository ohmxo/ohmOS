# .codex/ — ohmOS Project Configuration

This directory contains project-specific Codex CLI and oh-my-codex (OMX) configuration for the ohmOS repository.

## Structure

```
.codex/
├── README.md          # This file
├── hooks.json         # OMX hook registry
└── hooks/             # Hook scripts
    ├── user-prompt-submit.sh  # Keyword detection & routing
    ├── session-start.sh       # Session initialization
    └── pre-tool-use.sh        # Pre-tool guardrails
```

## Hooks

### UserPromptSubmit
Routes keywords to skills and workflows:
- `$code-review` → code review workflow
- `$plan` → planning workflow
- `$analyze` → deep analysis
- `$deep-interview` → requirements clarification
- `$team` / `$swarm` → multi-agent execution
- Project-specific: ie, branding, agpl, docs, task, status

### SessionStart
Verifies `.codex/` config integrity on session start.

### PreToolUse
Guardrails for safe operations — prevents destructive git actions outside main, warns on large writes.

## Skills

Project-level skills and prompts are loaded from:
- `~/.codex/skills/` — user-global skills
- `~/.codex/agents/` — user-global agent definitions
- `~/.codex/prompts/` — user-global prompt files

See `AGENTS.md` for the full orchestration contract.
