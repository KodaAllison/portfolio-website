// Month formatting shared by anything that renders a "YYYY-MM" from the data
// files. Kept here rather than in either caller so the hero chart and the
// timeline cannot drift into formatting the same month two different ways.

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** "2025-09" -> "sep 2025". Total for any well-formed YYYY-MM. */
export function monthLabel(month) {
  const [y, m] = month.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
}
