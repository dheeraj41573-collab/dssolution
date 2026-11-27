# DS Solution Website

A responsive DS Solution agency website built with Next.js, React and Tailwind CSS v4.

## Getting started

1. Install Node.js and npm.
2. Run `npm install`.
3. Run `npm run dev` to start the local site.
4. Run `npm run build` to create a production build.
5. Run `npm start` to serve the production build locally, or use `npm run build:cpanel` to prepare a GoDaddy cPanel deployment.

## Brand and theme

- Site content and contact details: `src/content`
- Navigation and global metadata: `src/config`
- Theme colors and fonts: `src/config/theme.json`
- The supplied logo is stored at `public/images/ds-solution-logo.png`.
- Light/dark theme selection is available in the header and remembered in the browser.
- The Next.js App Router lives in `app`; content remains in `src/content`.
- Add the contact and Stripe environment variables from `.env.example` to the cPanel Node.js application's environment settings.

The contact form sends each submission to the admin inbox configured by `CONTACT_NOTIFICATION_EMAIL` (defaults to `info@thedssolution.com`) through the Resend API. Set `RESEND_API_KEY`, authenticate the sending domain in Resend, and set `CONTACT_NOTIFICATION_FROM` to a sender address on that verified domain. The contact form does not require GoHighLevel credentials.

Booking and other integrations may require their own server environment variables.

## Deploy to Cloudflare Workers

This Next.js app uses the OpenNext Cloudflare adapter. The regular `npm run build` remains the Node.js build for cPanel; use the Cloudflare-specific commands to create and deploy the Worker.

1. Install dependencies with `npm ci`.
2. Set `NEXT_PUBLIC_CMS_API_URL` as a build variable in Cloudflare Workers Builds; it is embedded during the build. Add any required server-side API keys as Worker secrets in the Cloudflare dashboard.
3. For Cloudflare Workers Builds, set the build command to `npm run build:cloudflare` and the deploy command to `npx wrangler deploy`. This generates `.open-next/worker.js` before Wrangler deploys it.
4. For local preview, run `npm run preview:cloudflare`. To deploy from your machine, authenticate Wrangler with `npx wrangler login`, then run `npm run deploy:cloudflare`.

The Wrangler config and OpenNext adapter are already set up in `wrangler.jsonc` and `open-next.config.ts`. For local Worker preview, create `.dev.vars` with `NEXTJS_ENV=development` and any required development variables; keep secrets out of source control. The `WORKER_SELF_REFERENCE` service binding must retain the same name as the Worker (`dssolution`) for OpenNext revalidation.

## Deploy to GoDaddy cPanel

The client uses Next.js server rendering, middleware, and route handlers, so it must run as a Node.js application; uploading it as static HTML is not sufficient. The GoDaddy plan must provide cPanel's **Setup Node.js App** or equivalent feature.

1. Use Node.js 22.13 or newer. From this directory, install dependencies with `npm ci`.
2. Set `NEXT_PUBLIC_CMS_API_URL` in the local build environment to the Render API URL. `NEXT_PUBLIC_*` values are included in the build output.
3. Run `npm run build:cpanel`. This prepares `.next/standalone` with `server.js`, required dependencies, `public/`, and `.next/static/`.
4. In cPanel, create a production Node.js application for the site's domain. Set its application root to the uploaded bundle directory and its startup file to `server.js`.
5. Upload the **contents** of `.next/standalone` to that application root. Set `NODE_ENV=production` and the required runtime variables from `.env.example` in cPanel; set `NEXT_PUBLIC_CMS_API_URL` both before building and in cPanel. Do not upload `.env` files.
6. Restart the Node.js application in cPanel after uploading the bundle or changing environment variables.

The frontend continues to use the CMS API on Render. For each frontend release, rebuild the bundle and replace the application files while retaining the cPanel environment settings.

## Services API

The services directory and detail pages load published records from the CMS at `NEXT_PUBLIC_CMS_API_URL/services`. Each service should include `slug`, `title`, `summary`, `category`, `icon`, and `capabilities` (an array of strings). An optional `price` string is displayed on the card; cards without one show “Custom quote.” The `slug` is used by the service detail URL.

The same records are available through the client proxy at `/api/services`.

## Industries directory

The searchable, filterable industries directory loads published records from the CMS at `NEXT_PUBLIC_CMS_API_URL/industries`. Each published industry slug supplies its `/industries/[slug]` detail route.
