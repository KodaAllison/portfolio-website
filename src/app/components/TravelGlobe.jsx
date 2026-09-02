const VISITED_POINTS = [
  [91, 82], [105, 72], [77, 104], [130, 96], [151, 80], [166, 88], [175, 101],
  [158, 118], [178, 132], [193, 98], [211, 111], [224, 145], [246, 185], [174, 169],
];

export default function TravelGlobe() {
  return (
    <svg viewBox="0 0 320 320" className="mx-auto aspect-square w-full max-w-[360px]" role="img" aria-label="Globe marking fourteen countries visited across four continents">
      <defs>
        <clipPath id="globe-sphere"><circle cx="160" cy="160" r="132" /></clipPath>
      </defs>

      <circle cx="160" cy="160" r="132" fill="var(--surface-sunken)" stroke="var(--border-strong)" strokeWidth="1.5" />
      <g clipPath="url(#globe-sphere)" className="globe-drift">
        <g fill="none" stroke="var(--border)" strokeWidth="1">
          <ellipse cx="160" cy="160" rx="132" ry="44" />
          <ellipse cx="160" cy="160" rx="132" ry="88" />
          <ellipse cx="160" cy="160" rx="52" ry="132" />
          <ellipse cx="160" cy="160" rx="98" ry="132" />
          <line x1="28" y1="160" x2="292" y2="160" />
          <line x1="160" y1="28" x2="160" y2="292" />
        </g>

        <g fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="1">
          <path d="M48 91 63 66 91 49 124 52 137 68 125 84 103 91 93 113 73 122 58 111Z" />
          <path d="M106 129 128 137 139 158 131 181 119 199 113 230 98 250 91 219 82 190 88 157Z" />
          <path d="M144 72 166 59 187 66 188 79 171 88 158 84Z" />
          <path d="M148 101 175 94 196 107 202 137 188 164 180 205 159 226 145 198 137 164 143 135Z" />
          <path d="M186 71 221 59 258 73 278 98 267 122 238 118 222 135 199 119 190 94Z" />
          <path d="M233 190 258 183 276 198 269 221 243 229 225 213Z" />
          <path d="M278 139 288 144 284 158 276 153Z" />
        </g>

        <path d="M91 82 C 124 51, 144 110, 166 88 S 214 78, 246 185" fill="none" stroke="var(--accent-dim)" strokeWidth="1.5" strokeDasharray="3 6" className="globe-route" />
        {VISITED_POINTS.map(([x, y], index) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={index === 4 ? 4 : 2.8} fill="var(--accent)" opacity={index === 4 ? 1 : 0.78} />
        ))}
      </g>
      <circle cx="160" cy="160" r="132" fill="none" stroke="var(--border-strong)" strokeWidth="1.5" />
      <circle cx="151" cy="80" r="10" fill="none" stroke="var(--accent)" strokeOpacity="0.28" className="globe-home-pulse" />
    </svg>
  );
}
