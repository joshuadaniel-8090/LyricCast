"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login"); // 👈 redirect back to login after signout
  };

  return (
    <Button
      onClick={handleSignOut}
      className="w-full bg-red-500/80 text-white hover:bg-red-600 transition-colors"
    >
      Sign Out
    </Button>
  );
}