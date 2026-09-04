import assert from "node:assert/strict";
import test from "node:test";
import { fetchWithTimeout } from "./fetch.js";

test("fetchWithTimeout preserves request options and adds an abort signal", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  let request;
  globalThis.fetch = async (input, init) => {
    request = { input, init };
    return "ok";
  };

  const result = await fetchWithTimeout("https://example.com/data", {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  assert.equal(result, "ok");
  assert.equal(request.input, "https://example.com/data");
  assert.equal(request.init.cache, "no-store");
  assert.deepEqual(request.init.headers, { Accept: "application/json" });
  assert.ok(request.init.signal instanceof AbortSignal);
});

test("fetchWithTimeout combines a caller abort signal with its timeout", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  let signal;
  globalThis.fetch = async (_input, init) => {
    signal = init.signal;
    return "ok";
  };

  const controller = new AbortController();
  await fetchWithTimeout("https://example.com/data", { signal: controller.signal });
  controller.abort();

  assert.equal(signal.aborted, true);
});
