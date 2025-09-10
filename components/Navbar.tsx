"use client";

import { motion } from "framer-motion";
import { Home, Users, Wallet } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (id: string) => {
    if (pathname === "/") {
      // Already on homepage → just scroll
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // Not on homepage → go there and then scroll
      router.push(`/#${id}`);
    }
  };

  return (
    <motion.div
      className="fixed top-6 left-0 right-0 z-50 flex justify-center"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="flex items-center gap-6 text-white bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl px-6 py-3 shadow-lg">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition-all"
          onClick={() => handleNavigation("hero")}
        >
          <Home size={20} /> Home
        </button>

        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition-all"
          onClick={() => handleNavigation("features")}
        >
          <Users size={20} /> Features
        </button>

        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition-all"
          onClick={() => handleNavigation("features")}
        >
          <Wallet size={20} /> Pricing
        </button>

        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 transition-all font-medium shadow-lg"
          onClick={() => router.push("/auth/login")}
        >
          Join Beta
        </button>
      </div>
    </motion.div>
  );
}
