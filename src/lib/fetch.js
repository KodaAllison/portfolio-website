const DEFAULT_TIMEOUT_MS = 3_000;

// External portfolio data is optional. Bound each request so an unavailable
// provider cannot consume the whole server-rendering time budget.
export function fetchWithTimeout(input, init = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const timeout = AbortSignal.timeout(timeoutMs);
  const signal = init.signal
    ? AbortSignal.any([init.signal, timeout])
    : timeout;

  return fetch(input, { ...init, signal });
}
