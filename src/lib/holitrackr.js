const HOLITRACKR_STATS_URL =
  process.env.HOLITRACKR_STATS_URL ??
  "https://myatlasio.vercel.app/api/public/stats";

function isCountry(country) {
  return country !== null
    && typeof country === "object"
    && typeof country.alpha3 === "string"
    && /^[A-Z]{3}$/.test(country.alpha3)
    && typeof country.alpha2 === "string"
    && /^[A-Z]{2}$/.test(country.alpha2)
    && typeof country.name === "string"
    && country.name.length > 0
    && typeof country.continent === "string"
    && country.continent.length > 0;
}

export function normalizePublicStats(payload) {
  const countryCodes = Array.isArray(payload?.countries)
    ? new Set(payload.countries.map((country) => country?.alpha3))
    : new Set();
  const derivedContinents = Array.isArray(payload?.countries)
    ? [...new Set(payload.countries.map((country) => country?.continent))].sort()
    : [];
  const declaredContinents = Array.isArray(payload?.continents)
    ? [...new Set(payload.continents)].sort()
    : [];
  const valid = payload !== null
    && typeof payload === "object"
    && Array.isArray(payload.countries)
    && payload.countries.every(isCountry)
    && countryCodes.size === payload.countries.length
    && Number.isInteger(payload.countryCount)
    && payload.countryCount === payload.countries.length
    && Number.isInteger(payload.continentCount)
    && Array.isArray(payload.continents)
    && payload.continents.every((continent) => typeof continent === "string")
    && declaredContinents.length === payload.continents.length
    && JSON.stringify(derivedContinents) === JSON.stringify(declaredContinents)
    && payload.continentCount === payload.continents.length
    && typeof payload.generatedAt === "string"
    && !Number.isNaN(Date.parse(payload.generatedAt));

  if (!valid) throw new Error("Invalid HoliTrackr public stats response");

  return {
    countries: payload.countries.map(({ alpha3, alpha2, name, continent }) => ({
      alpha3,
      alpha2,
      name,
      continent,
    })),
    countryCount: payload.countryCount,
    continentCount: payload.continentCount,
    continents: [...payload.continents],
    generatedAt: payload.generatedAt,
  };
}

export async function fetchHoliTrackrStats() {
  const response = await fetch(HOLITRACKR_STATS_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`HoliTrackr public stats failed: ${response.status}`);
  }

  return normalizePublicStats(await response.json());
}
