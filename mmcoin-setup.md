# MMCoin Demo — Setup Instructions

This is a single-file React app. No backend, no database, no API keys required.
These instructions assume **WSL (Windows Subsystem for Linux)** as the baseline for Windows users.
Mac and Linux users can skip straight to Step 1.

---

## Step 0: Install WSL (Windows users only)

If you already have WSL set up, skip to Step 1.

1. Open **PowerShell as Administrator** (right-click → "Run as administrator").
2. Run:
   ```powershell
   wsl --install
   ```
3. Restart your computer when prompted.
4. After restart, open **Ubuntu** from the Start menu.
5. Create a Linux username and password when prompted (separate from your Windows login).

---

## Step 1: Install Node.js and npm

Open your WSL/Ubuntu terminal (or your regular terminal on Mac/Linux) and run:

```bash
# Update package lists
sudo apt update

# Install curl
sudo apt install -y curl

# Install Node Version Manager (nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Reload your shell
source ~/.bashrc

# Install the latest LTS version of Node.js
nvm install --lts

# Confirm installation — both should print version numbers
node -v
npm -v
```

### What gets installed

| Package | Purpose | How installed |
|---|---|---|
| Node.js v18+ | JavaScript runtime | `nvm install --lts` |
| npm | Package manager | Bundled with Node.js |
| react, react-dom | UI framework | Auto-installed by `create-react-app` |

No Docker, no database, no cloud account, no API keys needed anywhere.

---

## Step 2: Get the demo files

Download these two files (attached to the Substack post):
- `mmcoin-demo-App.js` — the full application
- `mmcoin-setup.md` — this guide

If downloaded via a Windows browser, find them in WSL at:
```
/mnt/c/Users/<your-windows-username>/Downloads/
```

---

## Step 3: Create the React app and run it

```bash
# Create a new React project (takes 1–2 minutes)
npx create-react-app mmcoin-demo
cd mmcoin-demo

# Copy the demo file in — adjust the path to match where you saved it
cp /mnt/c/Users/<your-windows-username>/Downloads/mmcoin-demo-App.js src/App.js

# Start the app
npm start
```

Your browser should open automatically at `http://localhost:3000`.
If it doesn't, navigate there manually.

---

## Step 4: Explore the five tabs

The app opens on **Retail remittance** and has five tabs across the top:

| # | Tab | What it shows |
|---|---|---|
| 1 | **Retail remittance** | Consumer sends US↔India via SwiftSend; live fee breakdown |
| 2 | **B2B treasury** | Corporate transfer via GlobalFirst Bank; FX spread and settlement |
| 3 | **MMCoin Labs Console** | Issuer view — reserve health, mint/burn controls, fee breakdown per transaction |
| 4 | **KYC / Compliance** | Five compliance scenarios from clean pass to sanctions hit |
| 5 | **Dual approval** | Maker-checker workflow; role-switcher guides you through each step |

**Tips:**
- Change the **FX rate** at the top — all calculations across all tabs update instantly
- After sending money on any tab, switch to **MMCoin Labs Console** to see the mint and burn activity
- On the **Dual approval** tab, follow the ①②③ instructions next to the role switcher

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `command not found: npx` or `npm` | Run `source ~/.bashrc`, or close and reopen the terminal |
| Browser shows "Edit src/App.js and save to reload" | File wasn't copied correctly — confirm it's at `src/App.js` not `src/App.jsx` |
| Blank white page | Open browser DevTools (F12) → Console tab → look for a red error |
| `npm start` never opens a browser | Navigate manually to `http://localhost:3000` |
| Permission error during install | Avoid `sudo npm` — fix with: `sudo chown -R $(whoami) ~/.npm` |

---

## What this demo is and isn't

This is an educational simulation. It does **not** move real money, connect to real banking rails, or run real KYC/AML vendor checks — those are modelled with realistic but fully synthetic logic. All state lives in your browser's memory and resets on page refresh. It is a tool for building intuition for how the pieces of a stablecoin ecosystem fit together before engaging with real regulatory frameworks or vendor documentation.
