# MMCoin Demo — Publishing Package

Everything needed to publish the MMCoin stablecoin demo on Substack and cross-post to LinkedIn.

## Contents

```
substack-package/
├── README.md                      ← this file
├── substack-article.md            ← full article, paste into Substack editor
├── linkedin-post.md               ← two post variants + posting notes
├── mmcoin-demo-App.js             ← the app (attach as downloadable file)
├── mmcoin-setup.md                ← setup guide (attach as downloadable file)
└── images/
    ├── 01-retail-remittance.png
    ├── 02-b2b-treasury.png
    ├── 03-mmcoin-labs-console.png
    ├── 04-kyc-compliance.png
    └── 05-dual-approval.png
```

Screenshots are live captures from the running React app — not mockups.

## Publishing on Substack

1. Create a new post. Paste `substack-article.md` into the editor. Substack accepts Markdown formatting when pasted.
2. Upload the five images from `images/` at the positions marked `![...](images/...)` in the article.
3. Attach `mmcoin-demo-App.js` and `mmcoin-setup.md` as downloadable file attachments so readers can grab them directly.
4. Set the **featured image** to `03-mmcoin-labs-console.png` — the expanded fee breakdown row is the most distinctive hook for link previews.
5. Publish, then copy the URL for the LinkedIn post.

## Cross-posting to LinkedIn

1. Open `linkedin-post.md` and pick Option A (short) or Option B (narrative).
2. Replace `[LINK TO YOUR SUBSTACK POST]` with your live URL.
3. Paste into a new LinkedIn post — the link preview card will auto-generate from your Substack featured image.
4. Post 1–2 hours after Substack goes live.

## Tab order in the app (for reference)

| # | Tab name | Scenario |
|---|---|---|
| 1 | Retail remittance | Consumer US↔India via SwiftSend |
| 2 | B2B treasury | Corporate transfer via GlobalFirst Bank |
| 3 | MMCoin Labs Console | Issuer reserve dashboard + mint/burn |
| 4 | KYC / Compliance | Five compliance scenarios |
| 5 | Dual approval | Maker-checker workflow |
