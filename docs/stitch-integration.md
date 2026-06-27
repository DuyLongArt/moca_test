# Stitch ↔ React integration

Google **Stitch** designs the UI; **React + Query + Zustand** implements behavior.

## Setup (one time)

### 1. API key (do not commit)

```bash
# ~/.zshrc or ~/.bashrc
export STITCH_API_KEY="your-key-from-stitch.withgoogle.com"
```

Restart **Cursor** so MCP loads `stitch` from `~/.cursor/mcp.json`:

```json
"stitch": {
  "command": "npx",
  "args": ["-y", "@_davideast/stitch-mcp", "proxy"],
  "env": { "STITCH_API_KEY": "${env:STITCH_API_KEY}" }
}
```

Verify:

```bash
npx @_davideast/stitch-mcp doctor
npx @_davideast/stitch-mcp view --projects
```

### 2. Project link

`.stitch/project.json` → MoCA Stitch project **React Question Form**.

Screen map: `frontend/src/stitch/screens.ts`

## Design → code workflow

```text
Stitch canvas (design)
    ↓ MCP: get_screen_code / get_screen_image
frontend/stitch-reference/*.html   (visual reference, gitignored)
    ↓ tokens in stitch-tokens.css
React components (behavior + Query/Zustand)
```

| Stitch tool | Use |
|-------------|-----|
| `list_screens` | See all screens + IDs |
| `get_screen_code` | Download HTML reference |
| `get_screen_image` | Screenshot for compare |
| `generate_screen_from_text` | New screen from prompt |
| `build_site` | Bulk export HTML per route |

## Screen ↔ route map

| React route | Stitch screen |
|-------------|---------------|
| `/login` | Login - Assessment Pro |
| `/patient` | Assessment Form - Multiple Test Types |
| `/patient/test` | MoCA Naming / Clock / Memory tasks |
| `/patient/results` | MoCA - Results Summary |
| empty state | Empty State - Tests |

## Sync reference HTML

```bash
cd frontend
npm run stitch:sync
```

Outputs to `stitch-reference/` (local only).

## In Cursor chat (after MCP restart)

```text
@DuyLongSkills
Use Stitch MCP get_screen_code for login screen.
Port layout to LoginPage.tsx — keep useAuthStore, match stitch-tokens.
```

## Tokens

`frontend/src/styles/stitch-tokens.css` — CSS variables from Stitch **Functional Clarity** (primary `#4f46e5`, Geist).

Do not copy Stitch HTML wholesale into React — extract layout + tokens; keep Query/Zustand logic.
