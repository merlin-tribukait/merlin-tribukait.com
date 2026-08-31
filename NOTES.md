# Engineering Notes & Architecture Reference: merlin-tribukait.com

> Technical field notes, architecture design, and operational guide for `https://merlin-tribukait.com/` and the Merlin Tribukait ecosystem.

---

## 1. Portfolio Architecture & Ecosystem Map

| Domain / System | Focus & Role |
|---|---|
| **`https://merlin-tribukait.com/`** | Official developer portfolio, capabilities showcase, and engineering field notes |
| **`https://docs.merlin-tribukait.com/`** | Central technical documentation, protocol intelligence, and blueprints |
| **`https://games-reborn.com/`** | Production multi-realm MMORPG platform and player web hub |
| **`https://brands.games-reborn.com/`** | Brand design system, SVG vector tokens, and component showcase |
| **`mu3-server`** | Clean-room C++17 private game daemon core (541 opcodes, 4,221 DTO schemas, 85 systems) |

---

## 2. Frontend Design System & JavaScript Engine

- **Cyber-Glass Obsidian Theme**: High-contrast dark obsidian palette with cyan (`#00f0ff`), crimson (`#ff2d55`), and purple (`#9d4edd`) accents.
- **Interactive Cursor Spotlight**: Real-time pointer tracking illuminating glassmorphism card surfaces dynamically.
- **3D Card Tilt Physics**: Perspective rotation on hover with smooth damping.
- **Web Audio API Synthesizer**: Native micro-sound effects (toggleable via header speaker button).
- **CRT Scanlines Mode**: Retro phosphor scanline texture (toggleable via `crt` command).
- **Responsive Mobile First**: Fluid `clamp()` typography, slide-down drawer, touch-friendly 48px tap targets, and iOS Safari zoom prevention.

---

## 3. Reverse-Engineering Intel Scope

- **Network Protocol**: 541 reverse-engineered network opcodes across 85 core systems.
- **Data Transfer Objects**: 4,221 mapped binary DTO serialization schemas.
- **Tooling**: Wireshark packet dissection, Ghidra disassembly, and IL2CPP metadata extraction.

---

## 4. Deployment & Build Workflow

To update the production portfolio site:

```bash
# 1. Edit source files in repository
cd /home/admin/merlin-tribukait.com

# 2. Synchronize to webroot
sudo cp -r /home/admin/merlin-tribukait.com/* /var/www/merlin-tribukait.com/
sudo chown -R www-data:www-data /var/www/merlin-tribukait.com/

# 3. Commit and push updates to GitHub
git add -A
git commit -m "Update portfolio content"
git push origin main
```

---

© 2026 Merlin Felix Tribukait. All rights reserved.
