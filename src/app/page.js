import Navbar from "./components/Navbar";
import TerminalWindow from "./components/TerminalWindow";
import StatusChip from "./components/StatusChip";
import SyntaxTag from "./components/SyntaxTag";
import CommitHeatmap from "./components/CommitHeatmap";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      <section className="mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop pt-24 pb-16">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <StatusChip pulse glow>online</StatusChip>
          <span className="font-mono text-label-sm text-on-surface-variant">
            newcastle-upon-tyne
          </span>
          <span className="text-outline">•</span>
          <span className="font-mono text-label-sm text-cyan">
            54.97°N 1.61°W
          </span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tighter">
          <span className="block text-terminal">koda allison</span>
          <span className="block text-cyan">portfolio_os</span>
          <span className="block italic text-on-surface">// rebuilding.</span>
        </h1>

        <p className="mt-6 max-w-xl font-mono text-body-md text-on-surface-variant">
          <span className="text-cyan">// </span>
          phase 1 + 2 foundation. shared chrome and primitives are in. landing,
          projects, run, and contact pages will land in their own PRs.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          <SyntaxTag color="terminal" variant="flag">next-16</SyntaxTag>
          <SyntaxTag color="cyan" variant="flag">tailwind-3</SyntaxTag>
          <SyntaxTag color="signal" variant="flag">dark-only</SyntaxTag>
          <SyntaxTag variant="bracket">react-18</SyntaxTag>
          <SyntaxTag variant="bracket">resend</SyntaxTag>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-container-max gap-gutter px-margin-mobile md:px-margin-desktop pb-24 md:grid-cols-2">
        <TerminalWindow title="primitives.jsx" subtitle="80x24" glow>
          <div className="space-y-1 text-sm leading-relaxed">
            <div>
              <span className="text-purple-400">export</span>{" "}
              <span className="text-purple-400">const</span>{" "}
              <span className="text-yellow-300">primitives</span>{" "}
              <span className="text-on-surface-variant">=</span> [
            </div>
            <div className="pl-4">
              <span className="text-cyan">"TerminalWindow"</span>,
            </div>
            <div className="pl-4">
              <span className="text-cyan">"StatusBar"</span>,
            </div>
            <div className="pl-4">
              <span className="text-cyan">"StatusChip"</span>,
            </div>
            <div className="pl-4">
              <span className="text-cyan">"SyntaxTag"</span>,
            </div>
            <div className="pl-4">
              <span className="text-cyan">"CommitHeatmap"</span>,
            </div>
            <div>];</div>
            <div className="pt-3">
              <span className="text-terminal">$</span>{" "}
              <span className="blink-cursor" />
            </div>
          </div>
        </TerminalWindow>

        <TerminalWindow title="activity.heatmap" subtitle="48 cells">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-on-surface">
                placeholder activity
              </h3>
              <p className="font-mono text-[11px] text-outline">
                seeded sample · real data lands with /run
              </p>
            </div>
            <StatusChip color="cyan" pulse>live</StatusChip>
          </div>
          <CommitHeatmap columns={8} rows={6} seed={42} />
        </TerminalWindow>
      </section>
    </main>
  );
}
