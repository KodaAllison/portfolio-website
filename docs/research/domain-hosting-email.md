# Production setup for `kodaallison.dev`

_Research checked against official sources on 2026-08-30. Prices can change; confirm the final checkout price before buying. GBP VAT calculations below assume the standard UK rate of 20% and are explicitly marked where they are inferences._

## Recommendation in one minute

For this repository, the pragmatic production setup is:

- **Hosting:** keep the site on Vercel and attach `kodaallison.dev`. The app is already deployed there, uses Vercel Analytics, and has request-time Next.js rendering. Vercel Hobby is appropriate only while this remains a genuinely personal, non-commercial portfolio; use Pro if it becomes a freelance/business lead-generation site.
- **Registrar and DNS:** use **Cloudflare Registrar + Cloudflare DNS** if `kodaallison.dev` is available in its checkout. Its official API example currently reports `.dev` at **US$10.11/year for registration and renewal**, sold at registry/ICANN cost with no markup. Cloudflare requires its nameservers. **Porkbun** is the best simple alternative: **US$8.75 first year, US$12.87 renewal**, with ICANN fees included and flexible nameservers.
- **Email:** buying the domain does **not** create a mailbox. Given that this repo currently publishes `kodaallison@icloud.com`, the best tailored choice is **iCloud+ Custom Email Domain** if the owner already subscribes to iCloud+: it may have no incremental cost. Otherwise the UK 50 GB plan is **£0.99/month, tax included**, and can send and receive as addresses such as `hello@kodaallison.dev`.
- **Address:** use `hello@kodaallison.dev` publicly and optionally `koda@kodaallison.dev` for direct correspondence. Keep the old iCloud address working during the transition.

This keeps registration, hosting, and mail separable. Moving any one service later does not require moving the other two.

## What the repository actually needs

The repository is a **Next.js 16 App Router** application, not a static export:

- `/` and `/run` render per request because `src/lib/strava.js` fetches with `cache: "no-store"`.
- GitHub activity is fetched server-side and cached for one hour with `unstable_cache`.
- Strava data comes from an existing Cloudflare Worker, so no Strava credentials live in this deployment.
- `GITHUB_TOKEN` is optional; `STRAVA_DATA_URL` has a live default.
- `@vercel/analytics` is already mounted in the root layout.
- `src/lib/site.js` intentionally points canonical metadata, Open Graph, robots and sitemap output at the current `vercel.app` URL until the custom domain is live.
- The contact page reads `kodaallison@icloud.com` from `src/data/social-links.json`; `src/data/about.json` also contains that address.

The site is therefore already close to production. Attaching a domain requires no hosting rewrite. After DNS and HTTPS work, the two required content changes are to switch the canonical `siteUrl` to `https://kodaallison.dev` and replace the published contact address if custom-domain mail has been configured.

`.dev` is an HTTPS-required namespace. Google Registry requires registrars to warn that browsers will only load `.dev` sites over HTTPS. Vercel provisions TLS automatically after domain verification, so the proposed setup satisfies this requirement without buying a separate certificate. [Google Registry `.dev` policy](https://www.registry.google/policies/registration/dev/) · [Vercel custom-domain setup](https://vercel.com/docs/domains/set-up-custom-domain)

## Hosting assessment

| Provider | Current cost | Fit for this repo | Main caveat | Verdict |
|---|---:|---|---|---|
| **Vercel Hobby** | **US$0** | Native Next.js deployment, existing project and Analytics, automatic previews and TLS; no migration | Officially limited to **personal, non-commercial use** | **Best current fit** if the portfolio remains personal/non-commercial |
| **Vercel Pro** | **US$20/month** including one deploying seat, US$20 usage credit; VAT added where required | Same zero-change fit with professional/commercial terms | From 2026-04-01 Vercel collects international VAT where required; a UK consumer should budget about **US$24/month equivalent** at 20% VAT, plus card FX (inference) | Best low-risk choice if the site promotes paid services or a business |
| **Netlify Free** | **US$0**, 300 credits/month hard cap | Officially supports commercial projects and major Next.js features with zero configuration | Site pauses until the next cycle at the cap; moving loses/replaces the existing Vercel Analytics setup | **Best free commercial alternative**, but migration has little benefit today |
| **Cloudflare Workers Free** | **US$0**, currently 100,000 requests/day and 10 ms CPU/request on Free | Could consolidate the portfolio with the existing Strava Worker | Cloudflare's recommended Next.js 16 path is currently `vinext`, which its docs label **beta**; compatibility should be tested, especially `unstable_cache` and request-time rendering | Cheapest consolidation path, not the best immediate production move |
| **Cloudflare Workers Paid** | **US$5/month minimum**, with included usage and no egress charge | More headroom than Workers Free | Still requires a Next.js adapter/migration | Reconsider only if deliberately consolidating infrastructure |

Sources: [Vercel pricing](https://vercel.com/pricing), [Vercel Hobby terms and limits](https://vercel.com/docs/plans/hobby), [Vercel tax handling](https://vercel.com/docs/pricing/taxes), [Netlify pricing](https://www.netlify.com/pricing/), [Netlify commercial-use statement](https://www.netlify.com/blog/introducing-netlify-free-plan/), [Netlify Next.js support](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/), [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), [Cloudflare Workers limits](https://developers.cloudflare.com/workers/platform/limits/), [Cloudflare's Next.js 16 guidance](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/).

### Is a portfolio “commercial” on Vercel Hobby?

Vercel's published rule is “personal, non-commercial use”; it does not provide a portfolio-specific safe harbour. This repo presently has no shop, paid product, lead form or advertising, and describes itself as a personal site. That supports Hobby use. If it starts offering freelance services, collecting sales leads, or supporting a business, Pro is the conservative interpretation. Ask Vercel support if the intended use sits between those cases rather than relying on an assumption.

## Registrar and DNS assessment

| Registrar | `.dev` price checked 2026-08-30 | Renewal behaviour | Important constraints | Verdict |
|---|---:|---|---|---|
| **Cloudflare Registrar** | Official API example: **US$10.11 registration and US$10.11 renewal**; run the live availability/price check before purchase | Registry + ICANN cost, no markup; auto-renew on by default | Must use Cloudflare nameservers while registered there; registration/renewal is non-refundable | **Best long-run price/control** if the live checkout agrees |
| **Porkbun** | **US$8.75 first-year sale; US$12.87 regular registration/renewal/transfer** | Transparent renewal, fees included | Prices are USD; promotional first-year price may change | **Best simple alternative** and more flexible than Cloudflare on nameservers |
| **Namecheap** | **US$10.98 first-year sale** plus possibly US$0.20 ICANN fee | **US$20.98 renewal**, plus possibly US$0.20 ICANN fee | “Free email” is only a one-month trial | Good UI/support, materially worse renewal value here |
| **Vercel Domains** | Live price only | Automatic domain and certificate renewal | Convenient, but still no email service; registration/renewal is final | Simplest single dashboard, not the clearest price/control choice |

Sources: [Cloudflare Registrar API/pricing](https://developers.cloudflare.com/registrar/registrar-api/), [Cloudflare Registrar FAQ](https://developers.cloudflare.com/registrar/faq/), [Cloudflare renewals](https://developers.cloudflare.com/registrar/account-options/renew-domains/), [Porkbun `.dev`](https://porkbun.com/tld/dev/), [Porkbun domain price terms](https://porkbun.com/products/domains/), [Namecheap `.dev`](https://www.namecheap.com/domains/registration/gtld/dev/), [Vercel domains](https://vercel.com/docs/domains/working-with-domains).

The domain did not return A/AAAA or NS records during the local check on 2026-08-30, consistent with the repo comment that it does not yet resolve. DNS non-resolution does **not** prove that a name is available to register; only the registrar's live availability check is authoritative at purchase time.

## Does the domain include `@kodaallison.dev` email?

No. Domain registration gives control over the name and its DNS records. A working mailbox needs a mail provider, then MX and authentication records in DNS. Vercel explicitly states that it does not provide mail service for domains bought or transferred there. Porkbun includes up to 20 inbound forwards with a domain, but forwarding is not a full mailbox or an independent outbound sending service; its mailbox product is separate. [Vercel on email and domains](https://vercel.com/docs/domains/working-with-domains) · [Porkbun email options](https://porkbun.com/products/email)

Once mail hosting is configured, the owner can create an address such as `hello@kodaallison.dev`. The domain itself is not an email account.

## Email provider shortlist for one UK professional

| Provider | Current price / tax note | What it provides | Best for | Caveats |
|---|---:|---|---|---|
| **iCloud+ Custom Email Domain** | **£0.99/month** for 50 GB, UK tax included; **£0 incremental** if already subscribed | Up to 5 custom domains and 3 active addresses per domain, send/receive in Apple Mail and iCloud.com; catch-all available | **Best tailored value here** because the site already uses iCloud mail | Addresses share the personal iCloud mailbox; less business administration, audit/compliance tooling and support than Workspace/Exchange; mail consumes iCloud storage |
| **Microsoft 365 Business Basic** | **£4.60/user/month paid yearly, ex VAT** = **£5.52 inc VAT**; monthly plan £5.52 ex VAT = £6.624 inc VAT | Custom-domain Exchange, 1 TB OneDrive, web/mobile Office, Teams | **Best exact-priced business suite value** | More administration than a solo mailbox needs; annual price requires annual commitment |
| **Google Workspace Starter** | **£5.90/user/month** on one-year commitment or **£7 flexible**, GBP; taxes may be added. At 20% VAT: about £7.08 or £8.40/month (inference) | Custom-domain Gmail, 30 GB pooled storage, Meet/Docs and admin controls | Best if Gmail and Google collaboration are already the preferred workflow | Highest priced mainstream starter in this shortlist; annual discount is a commitment |
| **Fastmail Individual / Standard** | Official page is geo/dynamic and confirms prices are tax-exclusive; exact UK checkout price was not exposed reliably | Focused mail/calendar, custom domains, many aliases, third-party mail-client support, 60 GB on current Individual plan | **Best email-first UX candidate** if Apple integration is not wanted | Verify exact GBP + VAT at checkout; fewer office-suite features |
| **Proton Mail Plus** | Exact GBP checkout price was not exposed reliably; paid plan required | 15 GB, 10 addresses, 1 custom domain, privacy-focused mail | Best privacy choice | Custom-domain mail is paid; desktop third-party clients rely on Proton Bridge; verify current GBP/VAT checkout |
| **Zoho Mail** | Generic official price: 5 GB Mail Lite **US$1/user/month annually**; UK-local checkout not reliably exposed | Low-cost custom-domain business mail | Budget managed mailbox | Free custom-domain tier is only in selected data centres and lacks IMAP/POP/ActiveSync; use a separate service for bulk/transactional mail |
| **Purelymail** | **US$10/year** simple pricing | Very inexpensive mailbox with users/domains and normal mail protocols | Lowest-cost functional option | Small-provider/support/polish trade-off; no clear official UK VAT statement found |

Sources: [Apple iCloud+ UK pricing](https://support.apple.com/en-gb/108047), [Apple custom-domain limits](https://support.apple.com/en-gb/102540), [Apple catch-all](https://support.apple.com/en-gb/guide/icloud/mm9e3ee0680f/icloud), [Microsoft 365 UK pricing](https://www.microsoft.com/en-gb/microsoft-365/business/microsoft-365-business-basic), [Google Workspace UK pricing](https://workspace.google.com/intl/en_gb/business/), [Google tax terms](https://workspace.google.com/intl/en_uk/terms/premier_terms/), [Fastmail pricing/features](https://www.fastmail.com/pricing/us/), [Proton pricing/features](https://proton.me/pricing), [Zoho pricing/features](https://www.zoho.com/mail/zohomail-pricing.html), [Purelymail pricing](https://smtp.purelymail.com/pricing).

### Why iCloud+ is the tailored recommendation

The public address is already an `@icloud.com` mailbox, which suggests that keeping the same inbox and apps has real migration value. iCloud+ can send and receive directly as the custom address, not merely forward inbound mail. It can also accept all otherwise-unconfigured addresses through catch-all. For a one-person portfolio, those features cover the likely need at £0 incremental cost if an iCloud+ subscription already exists, or £11.88/year including UK tax at the entry tier.

Choose Microsoft 365 instead if this identity is intended to become a small business with separate users, shared calendars, business administration and Office/OneDrive. Choose Google Workspace if Gmail/Drive is worth the extra cost. Choose Fastmail if focused email UX and aliases matter more than either office suite. Proton is a privacy-led choice rather than the default professional-value winner.

## Deliverability: the provider is only half the setup

For normal one-to-one professional correspondence, use the mailbox provider's prescribed MX, SPF and DKIM records and publish DMARC. Gmail requires SPF **or** DKIM even for all senders and recommends all three; unauthenticated mail is more likely to be rejected or treated as spam. Do not copy generic DNS values from this note—use the records generated for the actual account, because selectors and verification tokens are provider/account specific. [Gmail sender requirements](https://support.google.com/mail/answer/81126) · [Google Workspace SPF](https://support.google.com/a/answer/33786) · [Microsoft SPF/DKIM/DMARC guidance](https://learn.microsoft.com/en-us/defender-office-365/email-authentication-about) · [Proton anti-spoofing setup](https://proton.me/support/anti-spoofing-custom-domain) · [Fastmail manual DNS](https://www.fastmail.help/hc/en-us/articles/360060591153-Manual-DNS-configuration)

Practical rules:

1. Configure SPF and DKIM before sending publicly.
2. Start DMARC at `p=none` with reports, validate every legitimate sender, then move to `quarantine` or `reject`.
3. Keep human mailbox traffic separate from future contact-form, newsletter or transactional mail. Those should use a dedicated sending provider/subdomain.
4. Avoid a receive-only forwarder if replies must reliably come **from** `@kodaallison.dev`; use a real mailbox provider.
5. Keep low-volume, wanted mail habits. No provider can guarantee inbox placement because recipient filtering also considers domain/IP reputation, content and user feedback.

## Recommended rollout

1. **Register the domain.** Enable registrar 2FA, domain lock and auto-renew; store recovery codes separately. Do not make the new domain mailbox the only recovery address for the registrar that controls it.
2. **Attach both hostnames in Vercel.** Add `kodaallison.dev` and `www.kodaallison.dev` to the existing project and set one to permanently redirect to the canonical hostname. The clean recommendation is apex canonical (`kodaallison.dev`) with `www` redirecting to it.
3. **Add the DNS records Vercel currently requests.** Vercel's generic values are apex `A 76.76.21.21` and `www CNAME cname.vercel-dns-0.com`, but `vercel domains inspect kodaallison.dev` / the dashboard is authoritative for this project. If using Cloudflare DNS in front of Vercel, start these as **DNS only**, because Cloudflare warns that proxying unsupported SaaS hosts can produce SSL or redirect failures. [Vercel setup](https://vercel.com/docs/domains/set-up-custom-domain) · [Cloudflare SaaS proxy caveat](https://developers.cloudflare.com/dns/proxy-status/use-cases/)
4. **Wait for Vercel verification and automatic TLS**, then test apex, `www`, all routes, assets, sitemap and robots over HTTPS.
5. **Set up mail separately.** For the tailored path, subscribe to/confirm iCloud+, add the owned domain in iCloud settings, then add Apple's generated MX/TXT/CNAME records at the DNS provider. Create `hello@kodaallison.dev`, retain the old address, and send tests both ways to Gmail, Outlook and iCloud. [Apple setup](https://support.apple.com/en-gb/guide/icloud/mma473945269/icloud)
6. **Update the repository only after the domain works.** Change `src/lib/site.js` to `https://kodaallison.dev`; update both JSON files containing the old email address; deploy. That updates canonical metadata, Open Graph URL, robots, sitemap and the contact UI together.
7. **Verify operational details.** Confirm Vercel Analytics receives production traffic, submit the new sitemap to relevant search consoles, check SPF/DKIM/DMARC on received message headers, and schedule a yearly reminder ahead of domain renewal even with auto-renew enabled.

## Bottom line

There is no benefit in rebuilding this site merely to use the new domain. The strongest setup today is **Cloudflare Registrar/DNS → existing Vercel project → iCloud+ mail**. It is low-maintenance, preserves the app's dynamic Next.js behaviour and current analytics, and is unusually cost-effective for this owner because the existing published mailbox is already on iCloud.

If the portfolio becomes explicitly commercial, the key decision changes: either pay for **Vercel Pro** to preserve the zero-change deployment, or move to **Netlify Free** after testing to retain free commercial hosting. Email and domain registration remain independent of that hosting choice.
