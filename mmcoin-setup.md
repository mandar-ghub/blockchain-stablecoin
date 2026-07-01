# MMCoin Demo — Setup Instructions

This is a single-file React app with no backend, no database, and no API keys required. These instructions assume you are starting from a completely fresh machine, using **WSL (Windows Subsystem for Linux)** as the baseline for Windows users. Mac and Linux users can skip to "Step 1: Install Node.js and npm."

---

## Step 0: Install WSL (Windows users only)

If you already have WSL set up, skip to Step 1.

1. Open **PowerShell as Administrator** (right-click → "Run as administrator").
2. Run:
   ```powershell
   wsl --install
   ```
3. Restart your computer when prompted.
4. After restart, search for "Ubuntu" in the Start menu and open it.
5. The first time you open it, you'll be asked to create a Linux username and password — these are separate from your Windows login and can be anything you like.

---

## Step 1: Install Node.js and npm

Open your WSL/Ubuntu terminal (or, on Mac/Linux, your regular terminal) and run:

```bash
# Update package lists
sudo apt update

# Install curl (needed to install nvm)
sudo apt install -y curl

# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Reload your shell so nvm is available
source ~/.bashrc

# Install the latest LTS version of Node.js
nvm install --lts

# Confirm installation
node -v
npm -v
```

You should see version numbers for both commands (e.g., `v22.x.x` for node, `10.x.x` for npm). If both print a version, you're ready for Step 2.

### Required packages — summary

| Package | Purpose | How it's installed |
|---|---|---|
| Node.js (v18+) | JavaScript runtime | via `nvm install --lts` above |
| npm | Package manager (bundled with Node.js) | comes with Node.js |
| react, react-dom | UI framework | installed automatically by `create-react-app` |

No Docker, no database, no cloud account, and no API keys are needed anywhere in this setup.

---

## Step 2: Get the demo files

You should have two files:
- `mmcoin-demo-App.js` — the application code
- `mmcoin-setup.md` — this file

If you downloaded them via a Windows browser, they're typically in:
```
/mnt/c/Users/<your-windows-username>/Downloads/
```
when accessed from inside WSL.

---

## Step 3: Create the React app

```bash
# Create a new React app (takes 1-2 minutes)
npx create-react-app mmcoin-demo
cd mmcoin-demo

# Copy the demo code into place — adjust the source path as needed
cp /mnt/c/Users/<your-windows-username>/Downloads/mmcoin-demo-App.js src/App.js

# Start the app
npm start
```

This should automatically open `http://localhost:3000` in your default browser. If it doesn't open automatically, navigate there manually.

---

## Step 4: Use the demo

Five tabs across the top:
1. **KYC / Compliance** — pick one of 5 scenarios and watch identity + AML checks run
2. **Retail remittance** — send money US↔India and see the live fee breakdown
3. **B2B treasury** — GlobalFirst Bank's corporate transfer portal
4. **Dual approval** — maker-checker workflow for large transfers
5. **Issuer console** — MMCoin Labs' reserve dashboard; click any transaction to expand the fee math

Try adjusting the FX rate at the top of the page — every calculation across all tabs updates live.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `command not found: npx` | Run `source ~/.bashrc` again, or close and reopen the terminal |
| Browser shows "Edit src/App.js and save to reload" placeholder | The file wasn't copied to the right location — confirm it's at `src/App.js` (not `.jsx`) |
| Blank white page after `npm start` | Open browser DevTools (press F12) → Console tab → look for a red error |
| `npm start` never opens a browser | Manually visit `http://localhost:3000` |
| Permission errors during `npm install` | Avoid using `sudo` with npm; if needed, fix ownership with `sudo chown -R $(whoami) ~/.npm` |

---

## What this is and isn't

This demo simulates a stablecoin ecosystem for educational purposes. It does not move real money, connect to real banking rails, or perform real KYC/AML checks — those are realistic-looking but fully synthetic for the purposes of demonstration. All state lives in your browser's memory and resets on page refresh.
