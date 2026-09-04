import test from "node:test";
import assert from "node:assert/strict";
import { fetchLiteralBookshelf } from "./literal.js";

test("omits the bookshelf when no Literal profile is configured", async () => {
  assert.equal(await fetchLiteralBookshelf(""), undefined);
});

test("returns the current public Literal book in the portfolio shape", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const requests = [];
  const responses = [
    { data: { profileByHandle: { id: "profile-123" } } },
    {
      data: {
        current: [
          {
            id: "book-456",
            slug: "iron-gold-pierce-brown",
            title: "Iron Gold",
            authors: [{ name: "Pierce Brown" }],
          },
        ],
      },
    },
  ];

  globalThis.fetch = async (url, options) => {
    requests.push({ url, ...JSON.parse(options.body) });
    return new Response(JSON.stringify(responses.shift()), {
      headers: { "Content-Type": "application/json" },
    });
  };

  assert.deepEqual(await fetchLiteralBookshelf("koda"), {
    id: "book-456",
    title: "Iron Gold",
    author: "Pierce Brown",
    url: "https://literal.club/book/iron-gold-pierce-brown",
    profileUrl: "https://literal.club/koda",
  });
  assert.equal(requests.length, 2);
  assert.deepEqual(requests[0].variables, { handle: "koda" });
  assert.deepEqual(requests[1].variables, { profileId: "profile-123" });
});
