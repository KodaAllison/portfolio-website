const LITERAL_API = "https://literal.club/graphql/";
const CACHE_SECONDS = 3600;

const PROFILE_QUERY = `
  query PortfolioLiteralProfile($handle: String!) {
    profileByHandle(handle: $handle) {
      id
    }
  }
`;

const BOOKSHELF_QUERY = `
  query PortfolioBookshelf($profileId: String!) {
    current: booksByReadingStateAndProfile(
      profileId: $profileId
      readingStatus: IS_READING
      limit: 1
      offset: 0
    ) {
      id
      slug
      title
      authors { name }
    }
    finished: booksByReadingStateAndProfile(
      profileId: $profileId
      readingStatus: FINISHED
      limit: 4
      offset: 0
    ) {
      id
      slug
      title
      authors { name }
    }
  }
`;

function portfolioBook(book) {
  if (!book?.id || !book?.slug || !book?.title) return undefined;

  return {
    id: book.id,
    title: book.title.trim(),
    author: (book.authors ?? [])
      .map((author) => author?.name?.trim())
      .filter(Boolean)
      .join(", "),
    url: `https://literal.club/book/${encodeURIComponent(book.slug)}`,
  };
}

async function literalRequest(query, variables) {
  const response = await fetch(LITERAL_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: CACHE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Literal API failed: ${response.status}`);
  }

  const payload = await response.json();
  if (payload.errors?.length) {
    throw new Error("Literal API returned GraphQL errors");
  }

  return payload.data;
}

export async function fetchLiteralBookshelf(
  handle = process.env.LITERAL_PROFILE_HANDLE
) {
  const publicHandle = handle?.trim();
  if (!publicHandle) return undefined;

  const profileData = await literalRequest(PROFILE_QUERY, {
    handle: publicHandle,
  });
  const profileId = profileData?.profileByHandle?.id;
  if (!profileId) return undefined;

  const bookData = await literalRequest(BOOKSHELF_QUERY, { profileId });
  const current = portfolioBook(bookData?.current?.[0]);
  const finished = (bookData?.finished ?? [])
    .map(portfolioBook)
    .filter((book) => book && book.id !== current?.id);
  if (!current && finished.length === 0) return undefined;

  return {
    current,
    finished,
    profileUrl: `https://literal.club/${encodeURIComponent(publicHandle)}`,
  };
}
