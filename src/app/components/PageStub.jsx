import Navbar from "./Navbar";
import TerminalWindow from "./TerminalWindow";
import StatusChip from "./StatusChip";

/**
 * <PageStub>
 * Placeholder route used during the redesign. Will be replaced per-page in
 * subsequent PRs. Lives here so we don't sprinkle stubs across route folders.
 */
const PageStub = ({ route, file, summary }) => {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <section className="mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop pt-24 pb-16">
        <div className="mb-6 font-mono text-label-sm text-outline">
          /* {route} */
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-extrabold tracking-tighter">
          <span className="text-signal">~/</span>
          <span className="text-terminal">{route.replace(/^\//, "")}</span>
        </h1>
        <p className="mt-6 max-w-xl font-mono text-body-md text-on-surface-variant">
          <span className="text-cyan">// </span>
          {summary}
        </p>

        <div className="mt-12 max-w-xl">
          <TerminalWindow title={file} subtitle="404 → soon">
            <div className="flex items-center gap-3">
              <StatusChip color="signal" pulse>building</StatusChip>
              <span className="font-mono text-sm text-on-surface-variant">
                this route ships in a follow-up PR.
              </span>
            </div>
            <div className="mt-6 font-mono text-sm">
              <span className="text-terminal">$</span>{" "}
              <span className="text-on-surface-variant">git checkout</span>{" "}
              <span className="text-cyan">redesign{route}</span>
              <span className="blink-cursor" />
            </div>
          </TerminalWindow>
        </div>
      </section>
    </main>
  );
};

export default PageStub;
