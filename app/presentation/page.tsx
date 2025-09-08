import { loadContent } from "@/lib/content";
import Dock from "@/components/dock/Dock";
import ClientContentLoader from "@/components/control-panel/ClientContentLoader";

export default async function PresentationPage() {
  const content = await loadContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen p-6 pb-24">
        <header className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">LyricCast</h1>
          <p className="text-gray-400 text-lg">
            Professional presentation software for worship services
          </p>
        </header>

        <main className="overflow-y-auto">
          {/* ✅ Hydrate Zustand store & handle animations on client */}
          <ClientContentLoader content={content} />
        </main>
      </div>

      {/* Dock */}
      <Dock />
    </div>
  );
}
