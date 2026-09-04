import test from "node:test";
import assert from "node:assert/strict";
import { normalizePublicStats } from "./holitrackr.js";

test("normalizes the closed HoliTrackr public stats shape", () => {
  const payload = {
    countries: [
      { alpha3: "GBR", alpha2: "GB", name: "United Kingdom", continent: "Europe" },
      { alpha3: "USA", alpha2: "US", name: "United States of America", continent: "North America" },
    ],
    countryCount: 2,
    continentCount: 2,
    continents: ["Europe", "North America"],
    generatedAt: "2026-09-02T16:38:50.509Z",
  };

  assert.deepEqual(normalizePublicStats(payload), payload);
});

test("rejects a mismatched or incomplete HoliTrackr response", () => {
  assert.throws(() => normalizePublicStats({ countries: [], countryCount: 14 }));
  assert.throws(() => normalizePublicStats({
    countries: [{ alpha3: "AUS", alpha2: "AU", name: "Australia" }],
    countryCount: 1,
    continentCount: 1,
    continents: ["Oceania"],
    generatedAt: "2026-09-02T16:38:50.509Z",
  }));
});

test("rejects duplicate countries and contradictory continent totals", () => {
  const country = { alpha3: "GBR", alpha2: "GB", name: "United Kingdom", continent: "Europe" };
  assert.throws(() => normalizePublicStats({
    countries: [country, country],
    countryCount: 2,
    continentCount: 1,
    continents: ["Europe"],
    generatedAt: "2026-09-02T16:38:50.509Z",
  }));
  assert.throws(() => normalizePublicStats({
    countries: [country],
    countryCount: 1,
    continentCount: 1,
    continents: ["North America"],
    generatedAt: "2026-09-02T16:38:50.509Z",
  }));
});
