# Claude Code Architecture - Complete Guide

> A comprehensive guide to understanding Claude Code's architecture, created from an interactive learning session.

---

## Table of Contents

1. [Overview](#overview)
2. [The Four Layers](#the-four-layers)
3. [Interactive Layer](#1-interactive-layer)
4. [Agent Layer](#2-agent-layer)
5. [Execution Layer](#3-execution-layer)
6. [Governance Layer](#4-governance-layer)
7. [How Layers Work Together](#how-layers-work-together)
8. [When to Use Skill vs Command vs Subagent](#when-to-use-skill-vs-command-vs-subagent)
9. [Configuration Files Reference](#configuration-files-reference)
10. [Quick Reference](#quick-reference)

---

## Overview

Claude Code is Anthropic's AI-powered terminal tool for software development. It operates through four interconnected layers:

```
┌─────────────────────────────────────────────────────────────────────┐
│                           YOU                                        │
│                            │                                         │
│                            ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                  INTERACTIVE LAYER                              ││
│  │        (How you communicate with Claude Code)                   ││
│  └──────────────────────────────┬──────────────────────────────────┘│
│                                 │                                    │
│                                 ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                    AGENT LAYER                                  ││
│  │           (Who does the work - Claude, subagents, skills)       ││
│  └──────────────────────────────┬──────────────────────────────────┘│
│                                 │                                    │
│                                 ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                 GOVERNANCE LAYER (Wrapper)                      ││
│  │         (Permissions, hooks, CLAUDE.md - controls access)       ││
│  └──────────────────────────────┬──────────────────────────────────┘│
│                                 │                                    │
│                                 ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                   EXECUTION LAYER                               ││
│  │              (Tools and MCP servers - actual actions)           ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

### Key Insight: Governance Wraps Execution

The layers are NOT a pyramid. Governance **wraps** execution like a security checkpoint:

```
Agent decides → Governance validates → Execution happens → Governance validates → Result returns
```

---

## The Four Layers

| Layer | Purpose | Key Components |
|-------|---------|----------------|
| **Interactive** | How you communicate | Commands, shortcuts, input methods |
| **Agent** | Who does the work | Main agent, subagents, skills |
| **Governance** | What's allowed | Permissions, hooks, CLAUDE.md |
| **Execution** | What can be done | Tools, MCP servers |

---

## 1. Interactive Layer

**How you communicate with Claude Code.**

### Slash Commands

#### Essential Built-in Commands

| Command | Purpose |
|---------|---------|
| `/help` | Get help on commands and usage |
| `/clear` | Clear conversation history |
| `/model` | Switch between models (opus, sonnet, haiku) |
| `/context` | Visualize token usage |
| `/cost` | Check spending |
| `/config` | Open settings interface |
| `/resume` | Resume past session |
| `/rename <name>` | Name current session |
| `/export` | Save conversation |
| `/plan` | Enter plan mode |
| `/mcp` | Manage MCP servers |
| `/permissions` | View/edit permissions |
| `/vim` | Enable vim mode |
| `/doctor` | Run diagnostics |

#### Custom Commands

Create your own in `.claude/commands/`:

```markdown
# .claude/commands/deploy.md
---
description: Deploy to staging environment
allowed-tools: Bash
---

Deploy the current branch to staging:
1. Run tests first
2. Build the project
3. Deploy using `npm run deploy:staging`
```

**Features:**
- `$ARGUMENTS` or `$1, $2, $3` for arguments
- `` !`git status` `` executes bash inline
- `@file.js` includes file content

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+C` | Cancel/interrupt |
| `Ctrl+D` | Exit Claude Code |
| `Esc Esc` | Rewind conversation |
| `Ctrl+R` | Search command history |
| `Shift+Tab` | Toggle permission modes |
| `Alt+P` / `Option+P` | Switch model |
| `Alt+T` / `Option+T` | Toggle extended thinking |
| `Ctrl+V` | Paste image |
| `\` + `Enter` | Multi-line input (all terminals) |
| `Shift+Enter` | Multi-line input (iTerm2, WezTerm, Ghostty, Kitty) |

### Input Methods

| Method | Example |
|--------|---------|
| Text | Just type and press Enter |
| File reference | `@src/auth.ts` |
| Image | Drag & drop or Ctrl+V |
| Bash mode | `!npm test` |
| Piping | `cat file.txt \| claude -p "explain"` |

### CLI Flags

```bash
# Starting sessions
claude                    # New session
claude "task"             # Start with prompt
claude -p "query"         # One-shot (no session)
claude -c                 # Continue last session
claude --resume "name"    # Resume by name

# Configuration
--model opus|sonnet|haiku
--permission-mode plan    # Read-only analysis
--permission-mode auto    # Auto-accept everything
--tools "Read,Grep"       # Only allow these
--max-budget-usd 5.00     # Stop at $5
--add-dir ../other-repo   # Add more context
```

---

## 2. Agent Layer

**Who does the work in Claude Code.**

### Main Claude Agent

The central AI that runs your session:
- Processes your requests
- Decides which tools to use
- Delegates to subagents when needed
- Applies relevant skills automatically

#### Memory Loading (at startup)

```
┌─────────────────────────────────────────┐
│ Enterprise CLAUDE.md  (IT-managed)      │  ← Highest priority
├─────────────────────────────────────────┤
│ Project CLAUDE.md     (team-shared)     │
├─────────────────────────────────────────┤
│ Project rules         (.claude/rules/)  │
├─────────────────────────────────────────┤
│ User CLAUDE.md        (~/.claude/)      │  ← Lowest priority
└─────────────────────────────────────────┘
```

### Subagents

**Specialized workers that run in isolation.**

| Feature | Main Agent | Subagent |
|---------|------------|----------|
| Context | Your conversation | Separate/isolated |
| Output | You see everything | Only summary returns |
| Tools | All available | Can be restricted |
| Model | Your chosen model | Can use different model |

#### Built-in Subagents

| Name | Purpose | Model |
|------|---------|-------|
| **Explore** | Read-only research | Haiku (fast) |
| **Plan** | Analysis before changes | Inherited |
| **General-purpose** | Complex multi-step work | Inherited |

#### Creating Custom Subagents

`.claude/agents/code-reviewer.md`:
```yaml
---
name: code-reviewer
description: Reviews code for quality and security
tools: Read, Grep, Glob, Bash
model: sonnet
---

You are a senior code reviewer. When invoked:
1. Run `git diff` to see changes
2. Check for security issues, bugs, performance
3. Organize feedback by priority
```

### Skills

**Specialized knowledge that Claude discovers automatically.**

| Skills | Slash Commands |
|--------|----------------|
| Claude triggers automatically | You type `/command` |
| Based on description matching | Explicit invocation |
| Guidance/knowledge | Workflows/shortcuts |

#### Creating Skills

`.claude/skills/commit-messages/SKILL.md`:
```yaml
---
name: commit-messages
description: Generate clear commit messages from staged changes
allowed-tools: Bash, Read
---

# Writing Commit Messages

1. Run `git diff --staged`
2. Create message with:
   - Summary under 50 chars
   - Detailed description
   - Affected components
```

#### Skill Locations

| Scope | Path | Who uses it |
|-------|------|-------------|
| Personal | `~/.claude/skills/` | You, all projects |
| Project | `.claude/skills/` | Team (via git) |
| Enterprise | System path | All org users |

### How They Interact

```
┌─────────────────────────────────────────────────────────────┐
│                     MAIN AGENT                               │
│                                                              │
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │     SKILLS      │    │         SUBAGENTS               │ │
│  │                 │    │                                 │ │
│  │ - Same context  │    │ - Isolated context              │ │
│  │ - Guidance      │    │ - Returns summary only          │ │
│  │ - Auto-applied  │    │ - Can run in parallel           │ │
│  │                 │    │ - Different tools/model         │ │
│  └────────┬────────┘    └────────────┬────────────────────┘ │
│           │                          │                       │
│           └──────────┬───────────────┘                       │
│                      ↓                                       │
│              TOOLS (execution)                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Execution Layer

**What Claude can actually do - the primitive actions.**

### Built-in Tools

| Tool | Purpose | Needs Permission? |
|------|---------|-------------------|
| **Bash** | Run shell commands | Yes |
| **Read** | Read files (+ images, PDFs) | No |
| **Write** | Create/overwrite files | Yes |
| **Edit** | Targeted find/replace | Yes |
| **Glob** | Find files by pattern | No |
| **Grep** | Search file contents | No |
| **WebFetch** | Fetch URL content | Yes |
| **WebSearch** | Search the web | Yes |
| **Task** | Run subagents | No |
| **Skill** | Execute skills/commands | Yes |
| **TodoWrite** | Manage task lists | No |
| **NotebookEdit** | Edit Jupyter notebooks | Yes |
| **AskUserQuestion** | Ask you questions | No |

### File Tools

| Tool | Purpose | Use When |
|------|---------|----------|
| **Read** | View file contents | Need to see a file |
| **Write** | Create or completely replace | New files, complete rewrites |
| **Edit** | Surgical modifications | Small targeted changes |

### Search Tools

**Glob** - Find files by pattern:
```bash
**/*.ts           # All TypeScript files
src/**/*.test.js  # Test files in src
{*.md,*.txt}      # Multiple extensions
```

**Grep** - Search file contents:
```bash
log.*Error        # "log" followed by "Error"
function\s+\w+    # Function declarations
```

### MCP Servers

**Model Context Protocol - connects Claude to external tools/APIs.**

```
┌─────────────────────────────────────────────────────────────┐
│  CLAUDE CODE                                                 │
│       │                                                      │
│       ▼                                                      │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   MCP LAYER                             ││
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  ││
│  │  │ GitHub   │  │ Sentry   │  │ Database │  │ Custom │  ││
│  │  └──────────┘  └──────────┘  └──────────┘  └────────┘  ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

#### Transport Types

| Type | Use Case | Example |
|------|----------|---------|
| **HTTP** | Cloud services | `claude mcp add --transport http notion https://mcp.notion.com/mcp` |
| **SSE** | Server-sent events | `claude mcp add --transport sse asana https://mcp.asana.com/sse` |
| **stdio** | Local processes | `claude mcp add --transport stdio db -- python db-server.py` |

#### MCP Scopes

| Scope | Location | Who uses it |
|-------|----------|-------------|
| Local | `~/.claude.json` | You, this project |
| Project | `.mcp.json` | Team (via git) |
| User | `~/.claude.json` | You, all projects |

#### Managing MCP

```bash
claude mcp add <name> <url>     # Add server
claude mcp list                  # List all
claude mcp remove <name>         # Remove
/mcp                             # In-session management
```

**Tool naming:** `mcp__<server>__<tool>` (e.g., `mcp__github__search_repositories`)

---

## 4. Governance Layer

**What controls and validates everything Claude does.**

### Permissions System

#### Three Permission Levels

| Level | Behavior | Example |
|-------|----------|---------|
| **allow** | Runs immediately, no prompt | Safe commands |
| **ask** | Prompts you to confirm | Default for most |
| **deny** | Blocked completely | Dangerous operations |

**Evaluation order:** `deny` → `ask` → `allow` (deny always wins)

#### Permission Modes

| Mode | Behavior |
|------|----------|
| `default` | Standard - asks on first use |
| `acceptEdits` | Auto-approves file edits |
| `plan` | Read-only, no modifications |
| `dontAsk` | Auto-denies unless pre-allowed |
| `bypassPermissions` | Skips all checks (dangerous) |

#### Rule Syntax

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run:*)",
      "Bash(git commit:*)",
      "Read"
    ],
    "deny": [
      "Bash(rm -rf:*)",
      "Read(.env)",
      "WebFetch"
    ]
  }
}
```

### Hooks System

**Scripts that run at specific lifecycle events.**

#### Hook Events

| Event | When | Use Case |
|-------|------|----------|
| **PreToolUse** | Before tool runs | Validate, modify, block |
| **PostToolUse** | After tool completes | Format, lint, notify |
| **UserPromptSubmit** | When you submit | Add context, validate |
| **SessionStart** | Session begins | Setup environment |
| **SessionEnd** | Session ends | Cleanup |
| **Stop** | Claude finishes | Force continue? |

#### Hook Configuration

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "prettier --write",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

#### Hook Exit Codes

- `exit 0` - Allow (can include JSON for decisions)
- `exit 2` - Block (stderr shown as error)

### CLAUDE.md Files

**Project memory that Claude loads automatically.**

#### Loading Hierarchy

```
HIGHEST PRIORITY
├── Enterprise: /Library/Application Support/ClaudeCode/CLAUDE.md
├── Project: ./CLAUDE.md or ./.claude/CLAUDE.md
├── Project Local: ./CLAUDE.local.md (gitignored)
├── User: ~/.claude/CLAUDE.md
└── Rules: .claude/rules/*.md
LOWEST PRIORITY
```

#### Example CLAUDE.md

```markdown
# My Project

## Tech Stack
- Frontend: React 19, TypeScript, Vite
- Backend: Node.js, Express

## Commands
- Dev: `npm run dev`
- Test: `npm test`

## Conventions
- 2-space indentation
- Functional components with hooks

## Important Files
@src/config.ts
@docs/architecture.md
```

### Managed/Enterprise Settings

**For organizations - cannot be overridden:**

Location: `/Library/Application Support/ClaudeCode/managed-settings.json`

```json
{
  "permissions": {
    "deny": ["WebFetch", "Bash(curl:*)"]
  },
  "allowManagedHooksOnly": true
}
```

---

## How Layers Work Together

### Complete Flow

```
You type: "Fix the bug in auth.ts"
                    │
                    ▼
        ┌───────────────────────┐
        │   INTERACTIVE LAYER   │
        │   Parse your input    │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │     AGENT LAYER       │
        │  1. Load CLAUDE.md    │
        │  2. Check for Skills  │
        │  3. Decide actions    │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   GOVERNANCE LAYER    │
        │  PreToolUse Hook ─────│─→ Validate
        │  Permission Check ────│─→ Allow/Ask/Deny
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   EXECUTION LAYER     │
        │  Tool runs:           │
        │  Read("auth.ts")      │
        │  Edit("auth.ts",...)  │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   GOVERNANCE LAYER    │
        │  PostToolUse Hook ────│─→ Format/Validate
        └───────────┬───────────┘
                    │
                    ▼
            Result to you
```

---

## When to Use Skill vs Command vs Subagent

### Decision Tree

```
Do you want Claude to use it AUTOMATICALLY?
│
├─ YES → SKILL
│        (Claude discovers and applies when relevant)
│
└─ NO, I'll invoke it manually
         │
         ├─ Does it need ISOLATED context?
         │  │
         │  ├─ YES → SUBAGENT
         │  │
         │  └─ NO → COMMAND
         │
         └─ Is it a one-liner prompt?
            │
            ├─ YES → COMMAND
            │
            └─ NO, complex → SKILL (user-invocable: true)
```

### Comparison Table

| Aspect | Command | Skill | Subagent |
|--------|---------|-------|----------|
| **Triggered by** | You type `/name` | Claude auto-discovers | Claude delegates |
| **Context** | Same conversation | Same conversation | **Isolated** |
| **Best for** | Workflows, shortcuts | Knowledge, guidance | Heavy/parallel work |
| **Complexity** | Simple (1 file) | Can be complex | Medium (1 file) |
| **Location** | `.claude/commands/` | `.claude/skills/` | `.claude/agents/` |

### When to Use Each

| Your Need | Use This |
|-----------|----------|
| "I want a shortcut I control" | **Command** |
| "Claude should always know this" | **Skill** |
| "This produces lots of output" | **Subagent** |
| "Team should all use this" | **Command** or **Skill** in `.claude/` |
| "Just for me, all projects" | Put in `~/.claude/` |

---

## Configuration Files Reference

```
YOUR PROJECT
├── CLAUDE.md                      ← Project context
├── .claude/
│   ├── settings.json              ← Project permissions & hooks
│   ├── settings.local.json        ← Your local overrides (gitignored)
│   ├── commands/                  ← Custom slash commands
│   │   └── deploy.md
│   ├── skills/                    ← Project skills
│   │   └── review/SKILL.md
│   ├── agents/                    ← Custom subagents
│   │   └── debugger.md
│   └── rules/                     ← Modular rules
│       ├── frontend.md
│       └── security.md
└── .mcp.json                      ← MCP server config

YOUR HOME (~/)
├── .claude/
│   ├── settings.json              ← Global settings
│   ├── CLAUDE.md                  ← Personal preferences
│   ├── commands/                  ← Personal commands
│   ├── skills/                    ← Personal skills
│   └── rules/                     ← Personal rules
└── .claude.json                   ← MCP servers (user scope)

SYSTEM (Enterprise)
└── /Library/Application Support/ClaudeCode/
    ├── managed-settings.json      ← Cannot override
    └── CLAUDE.md                  ← Org-wide context
```

---

## Quick Reference

### Most Important Commands

| Command | Purpose |
|---------|---------|
| `/help` | See all commands |
| `/model` | Switch AI model |
| `/clear` | Fresh conversation |
| `/resume` | Continue past session |
| `/config` | Open settings |
| `/permissions` | View/edit permissions |
| `/mcp` | Manage integrations |
| `/context` | Check token usage |

### Most Important Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+C` | Cancel |
| `Ctrl+D` | Exit |
| `Esc Esc` | Rewind |
| `Shift+Tab` | Toggle permission mode |
| `Alt+P` | Switch model |

### Mental Model

| Role | Component | Function |
|------|-----------|----------|
| **CEO** | Main Agent | Makes decisions, delegates |
| **Specialists** | Subagents | Deep work in isolation |
| **Consultants** | Skills | Expert knowledge on demand |
| **Handbook** | CLAUDE.md | Company policies & context |
| **Security** | Permissions | Access control rules |
| **Compliance** | Hooks | Validate every action |
| **Tools** | Execution Layer | Actual capabilities |
| **Partners** | MCP Servers | External integrations |

---

## Summary

Claude Code's architecture provides:

- **Flexibility** - Customize everything
- **Safety** - Multiple layers of control
- **Power** - Extend with MCP, skills, subagents
- **Consistency** - Team-shared configurations

The core principle: **Governance wraps Execution**. Every tool call passes through permissions AND hooks before it can execute.

---

*Guide created: January 2026*
