"use client";

import { motion } from "framer-motion";
import {
  Files,
  ListMusic,
  Monitor,
  CheckCircle,
  Home,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: ListMusic,
    title: "Manage Service Plans",
    description:
      "Create, edit, and organize your service plans effortlessly with drag & drop support.",
  },
  {
    icon: Files,
    title: "Upload & Organize Files",
    description:
      "Easily add songs, slides, and custom templates in a clean, organized interface.",
  },
  {
    icon: Monitor,
    title: "Real-time Preview",
    description:
      "Preview your service in real-time before the presentation to ensure perfection.",
  },
  {
    icon: CheckCircle,
    title: "Collaboration",
    description:
      "Work together with your team to finalize the service plans efficiently.",
  },
];

const workflow = [
  "Upload songs & slides",
  "Arrange & manage service plans",
  "Preview & present",
  "Collaborate & share",
];

export default function LandingPage() {
  const router = useRouter();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:50px_50px]" />
      </div>

      {/* Centered Dock / Navbar */}
      <motion.div
        className="fixed top-6 left-0 right-0 z-50 flex justify-center"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex items-center gap-6 bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl px-6 py-3 shadow-lg">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition-all"
            onClick={() => scrollToSection("hero")}
          >
            <Home size={20} /> Home
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition-all"
            onClick={() => scrollToSection("features")}
          >
            <Users size={20} /> Features
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 transition-all font-medium shadow-lg"
            onClick={() => router.push("/presentation")}
          >
            Join Beta
          </button>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section
        className="relative z-10 flex flex-col items-center justify-center text-center py-32 px-6"
        id="hero"
      >
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          LyricCast
        </motion.h1>
        <motion.p
          className="text-gray-400 text-lg md:text-xl max-w-2xl mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Professional presentation software for worship services. Manage
          slides, songs, and service plans all in one place.
        </motion.p>
        <motion.div
          className="flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.button
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 transition-all font-medium shadow-lg"
            onClick={() => router.push("/presentation")}
          >
            Try Beta
          </motion.button>
          <button
            className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-all font-medium"
            onClick={() => scrollToSection("features")}
          >
            Learn More
          </button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32 px-6" id="features">
        <h2 className="text-4xl font-bold text-center mb-16">
          Our Best Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                className="bg-black/20 backdrop-blur-xl p-6 rounded-2xl border border-white/10 text-center flex flex-col items-center gap-4 hover:scale-105 transition-transform shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
              >
                <div className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Workflow Section */}
      <section
        className="relative z-10 py-32 px-6 bg-black/10 backdrop-blur-xl"
        id="workflow"
      >
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-20">
          {workflow.map((step, idx) => (
            <motion.div
              key={idx}
              className="bg-black/20 backdrop-blur-xl p-6 rounded-2xl border border-white/10 text-center flex flex-col items-center gap-4 w-56"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
            >
              <div className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <CheckCircle size={28} />
              </div>
              <p className="font-medium">{step}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative z-10 py-32 px-6 text-center" id="cta">
        <motion.h2
          className="text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Ready to Get Started?
        </motion.h2>
        <motion.p
          className="text-gray-400 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Join our beta program today and simplify your worship presentations.
        </motion.p>
        <motion.button
          className="px-10 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 transition-all font-medium shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onClick={() => router.push("/presentation")}
        >
          Join Beta
        </motion.button>
      </section>

      {/* Footer */}
      <footer
        className="relative z-10 py-10 text-center text-gray-400"
        id="footer"
      >
        © 2025 LyricCast. All rights reserved.
      </footer>
    </div>
  );
}
