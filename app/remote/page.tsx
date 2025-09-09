"use client";

import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io("/", { path: "/api/socketio" });

export default function Remote() {
  const [slide, setSlide] = useState<any>(null);

  useEffect(() => {
    socket.on("slide-update", (data) => setSlide(data));
    return () => {
      socket.off("slide-update");
    };
  }, []);

  const sendCommand = (cmd: string) => {
    socket.emit("remote-command", cmd);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white flex flex-col gap-6 items-center">
      <h1 className="text-2xl font-bold">🎛 Remote Control</h1>

      {slide ? (
        <div className="p-4 bg-black/30 rounded-xl w-full text-center">
          <p className="text-lg font-semibold">{slide.content}</p>
          {slide.notes && (
            <p className="text-sm text-yellow-400 mt-2">Note: {slide.notes}</p>
          )}
        </div>
      ) : (
        <p>No slide data</p>
      )}

      <div className="grid grid-cols-3 gap-4 w-full">
        <button
          onClick={() => sendCommand("previous-slide")}
          className="p-4 bg-gray-700 rounded-lg"
        >
          ◀ Prev
        </button>
        <button
          onClick={() => sendCommand("next-slide")}
          className="p-4 bg-blue-600 rounded-lg"
        >
          ▶ Next
        </button>
        <button
          onClick={() => sendCommand("toggle-blank")}
          className="p-4 bg-red-600 rounded-lg"
        >
          Blank
        </button>
        <button
          onClick={() => sendCommand("toggle-logo")}
          className="p-4 bg-yellow-500 rounded-lg col-span-2"
        >
          Logo
        </button>
        <button
          onClick={() => sendCommand("toggle-timer")}
          className="p-4 bg-green-500 rounded-lg col-span-3"
        >
          Timer
        </button>
      </div>
    </div>
  );
}
