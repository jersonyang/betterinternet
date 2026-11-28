# BetterInternet — Final 1.2 preview

Smarter networks. Better connections.

BetterInternet is an independent school network planning companion. The Final 1.2 preview consolidates its existing planning engine into a canvas-first workspace with optional Quick Start, floor tabs, direct edits, local drawing detection, optional connection measurements, professional printable reports and revision-protected private share copies.

See [SETUP.md](SETUP.md) for exact deployment steps, usage, limitations and required live verification. This preview preserves the existing Firebase web configuration through the Vercel `FIREBASE_WEB_CONFIG` environment variable. No administrator credentials are needed.

## Build

`node build.mjs` generates a static `dist/` directory. With no Firebase configuration it runs in guest mode. Serve the built site over HTTPS (or a development HTTP origin); direct file opening does not support every module/worker feature. Use the included Vercel routing config.

## Tests

Run `node tests/capacity.test.js`, `node tests/planning31.test.js`, `node tests/optimizer33.test.js`, `node tests/quick34.test.js`, `node tests/trace12.test.js`, and `node tests/worker12.test.js`.

## Scope and safety

This is a development preview, not an official site survey or a purchasing authorization. Predictive performance estimates use assumed geometry, demand and radio conditions; measured device speed is separate. Automatic trace only proposes rectangular enclosed spaces. The optimizer is still primarily additive, with contextual diagnostic guidance and sensitivity analysis rather than a comprehensive multi-vendor replacement optimizer. Private shares are separate versioned documents, not direct live collaboration on the owner's school. Validate real authentication, sharing access restrictions and external dependency availability before using any school data. Use fictional data for validation. See SETUP.md.

## External components

- Firebase Web SDK 11.10.0: authentication and Firestore, when configured.
- PDF.js 6.5.438 (Apache-2.0): lazy-loaded local PDF rendering via jsDelivr; https://github.com/mozilla/pdf.js.
- Cloudflare public test endpoints: optional approximate connection checks, https://github.com/cloudflare/speedtest. No external service receives your floor plan from these features.
