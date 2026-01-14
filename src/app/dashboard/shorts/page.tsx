import ShortsManager from './ShortsManager';

export default function ShortsPage() {
  // TODO: replace with real workspaceId from auth/session or route params
  const workspaceId = 'opsvantage-workspace-id';
  return (
    <section>
      <h1 className="text-3xl font-bold p-8">Shorts Manager</h1>
      <ShortsManager workspaceId={workspaceId} />
    </section>
  );
}
