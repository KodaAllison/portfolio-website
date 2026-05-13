import PageStub from "../components/PageStub";

export const metadata = { title: "Run | Koda Allison" };

export default function RunPage() {
  return (
    <PageStub
      route="/run"
      file="run.log"
      summary="activity heatmap, monospace progress bars, PR list, status chips. backed by hardcoded run.json initially; strava integration is a follow-up."
    />
  );
}
