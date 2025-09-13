// presentation/page.tsx
import { loadContent } from "@/lib/content";
import ClientContentLoader from "@/components/control-panel/ClientContentLoader";
import Dock from "@/components/dock/Dock";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default async function PresentationPage() {
  // Server-side content loading
  const content = await loadContent();
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <Image src="/logo.svg" alt="Logo" width={36} height={36} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-800"
            >
              <Menu className="h-6 w-6 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-gray-900 border border-gray-700"
          >
            <DropdownMenuLabel className="text-white">
              {session?.user?.email || "Guest"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem asChild>
              <SignOutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Client component handles interactivity */}
        <ClientContentLoader content={content} />
      </main>

      {/* Dock */}
      <div className="fixed bottom-6 left-[-5rem] transform -translate-x-1/2 z-50">
        <Dock />
      </div>
    </div>
  );
}
