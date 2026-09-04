# Automatic bookshelf data sources

_Checked against official sources on 2026-09-04._

## Decision

Use **Literal** as the source of truth if choosing a reading tracker for the portfolio. It has an official public GraphQL API, public reading-state queries need no authentication, and the product explicitly supports integrations and widgets. A public profile can supply the current book and finished books without storing a secret on the site.

If Goodreads is already the established tracker, its public shelf RSS can be a low-effort bridge, but it should not be the long-term dependency: Goodreads stopped issuing API keys in 2020 and announced that its API would be retired. Do not scrape its pages.

Use **Hardcover** instead when richer private reading data or progress is worth maintaining a server-side token. Its API is capable, but is still described as beta and in flux.

## Supported options

| Service | Official integration surface | Authentication and freshness | Fit for this site |
| --- | --- | --- | --- |
| **Literal** | Public GraphQL API at `https://literal.club/graphql/`. `profileByHandle` resolves a profile; `booksByReadingStateAndProfile` returns any public profile's books for `IS_READING`, `FINISHED`, and other states, including title, author, cover, and slug. [Developer documentation](https://literal.club/developers) | Most public reads need no authentication. Private reads and writes use a bearer JWT. Results reflect the service's current stored state; no freshness SLA is documented, and clients are asked to cache. | **Best default.** Official, secret-free, server-rendering friendly. Literal also offers CSV export and says its apps and website sync in real time. [Tracker and export details](https://literal.club/book-tracker-app) |
| **Goodreads** | Legacy public shelf RSS still exists in practice; Literal's official importer currently consumes a public Goodreads RSS feed. [Literal Goodreads importer](https://literal.club/import/goodreads) | No token for a public feed. Goodreads no longer issues developer keys and planned to retire its API. [Official developer group](https://www.goodreads.com/group/show/8095-goodreads-developers) | **Bridge only.** Suitable for a small current/recent shelf while it works, but undocumented and without an API support commitment. Goodreads terms prohibit robots and data mining, so never fall back to HTML scraping. [Goodreads terms](https://www.goodreads.com/about/terms) |
| **Hardcover** | Official GraphQL API used by its own web and mobile clients. `me { user_books ... }` exposes status, progress, book metadata, and covers. [Getting started](https://github.com/hardcoverapp/hardcover-docs/blob/main/src/content/docs/api/Getting-Started.mdx), [status query guide](https://github.com/hardcoverapp/hardcover-docs/blob/main/src/content/docs/api/guides/GettingBooksWithStatus.mdx) | Scoped personal access token, with user-selected expiry; backend only. Free allowance is 5,000 requests/day and 60/minute. Data is current per request, with no stated freshness SLA. | **Best rich/private option.** Keep the token in Vercel environment variables. The API is beta/in flux. Public use of user-uploaded cover images brings a takedown-policy requirement; text-only spines avoid that issue. |
| **Open Library** | Public JSON reading-log endpoints: `/people/{user}/books/currently-reading.json` and `/already-read.json`. Entries include title, authors, cover ID, and logged date. [My Books API](https://openlibrary.org/dev/docs/api/mybooks) | No authentication for public logs. Cache responses, identify the application with a descriptive `User-Agent`, and stay within 1 request/second by default (3 when identified). [API guidelines](https://openlibrary.org/developers/api) | **Simplest REST fallback.** Open and secret-free, but less polished as a personal tracker. `logged_date` records the shelf action and is not necessarily the actual finish date. |
| **BookWyrm** | Official RSS for public shelves, including `/user/{name}/books/read/rss`, plus review and activity feeds. [RSS documentation](https://docs.joinbookwyrm.com/rss-feeds.html) | No authentication for public shelves; feed changes when public shelf activity changes. | Strong open-source/RSS alternative if a federated tracker appeals. |
| **StoryGraph** | No supported public API; its official API request remains marked **Long-term**, and public RSS is still a feature request. [API roadmap](https://roadmap.thestorygraph.com/features/posts/an-api), [RSS request](https://roadmap.thestorygraph.com/requests-ideas/posts/rss-feed-of-reading-journal-entries) | CSV export is a manual workflow rather than an automatic feed. | Excellent tracker, poor automated source today. Do not scrape it. |
| **Fable** | No official public API, RSS feed, or routine automatic export was found. It supports importing a Goodreads CSV. [Import help](https://help.fable.co/article/131-can-i-import-my-goodreads-data-from-a-csv-file) | Fable's terms explicitly prohibit automated scripts, bots, scrapers, and systematic data extraction. [Fable terms](https://fable.co/terms) | Not suitable for a reliable portfolio integration. |
| **LibraryThing** | A browser-oriented JSON Books API for widgets, plus manual JSON/Excel/TSV exports. [JSON Books API](https://www.librarything.com/developer/documentation/bookjson), [export](https://www.librarything.com/import_export.php) | The JSON API is licensed for browser/widget use and is not an export or backup API. | Viable as an embedded widget, but less natural than a server-side data module and carries tighter reuse terms. |

## Recommended portfolio architecture

1. Track reading in Literal and keep the profile public. Resolve its public profile ID from the handle, then query `IS_READING` and `FINISHED` through the official GraphQL endpoint.
2. Add a server-only bookshelf data module, parallel to the site's GitHub and Strava modules. Normalize every source to a small shape such as `{ title, author, coverUrl, sourceId, status, loggedAt }` so the UI is not coupled to Literal.
3. Fetch during server rendering with Next.js revalidation (roughly hourly is ample for reading activity). This updates the portfolio without a redeploy while respecting Literal's request to cache.
4. Return `null` on network, schema, or empty-data failure and omit the bookshelf module, matching the redesign's existing live-data rule. If a last-known-good value is ever served, expose its age rather than calling it live.
5. Treat covers as optional. The current art direction can render book spines from title/author, avoiding broken cover URLs and third-party image-policy concerns.

A public Literal query can request both states in one call after the profile ID is known:

```graphql
query PortfolioBooks {
  current: booksByReadingStateAndProfile(
    profileId: "PUBLIC_PROFILE_ID"
    readingStatus: IS_READING
    limit: 1
    offset: 0
  ) {
    id
    slug
    title
    cover
    authors { name }
  }

  finished: booksByReadingStateAndProfile(
    profileId: "PUBLIC_PROFILE_ID"
    readingStatus: FINISHED
    limit: 5
    offset: 0
  ) {
    id
    slug
    title
    cover
    authors { name }
  }
}
```

Literal's public reading-state query does not document its result ordering. Before labelling the first `FINISHED` result as the most recently finished book, verify the returned order or use an authenticated query that explicitly supports recency sorting. The current-reading item does not have that ambiguity.

## Practical recommendation

- **Starting fresh:** Literal → public GraphQL → cached server component.
- **Already committed to Goodreads:** consume only the published RSS feed as a temporary adapter, with graceful omission on failure; migrate to Literal when convenient. Literal can import the public Goodreads RSS directly and can be re-run later to sync additions.
- **Want private profiles or reading progress:** Hardcover → scoped PAT stored only on the server.
