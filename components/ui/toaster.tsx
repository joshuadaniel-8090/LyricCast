"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            className="relative flex w-[340px] items-start gap-3 rounded-2xl 
                       bg-black/70 backdrop-blur-md border border-white/10 p-4 shadow-lg 
                       text-white transition-all duration-300
                       data-[state=open]:animate-slideIn
                       data-[state=closed]:animate-slideOut"
          >
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="text-base font-semibold text-white/90">
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className="text-sm text-white/70">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="absolute right-3 top-3 text-white/50 hover:text-white transition" />
          </Toast>
        );
      })}
      <ToastViewport className="fixed bottom-0 right-0 flex flex-col gap-2 w-96 max-w-full p-4 z-[100] outline-none" />
    </ToastProvider>
  );
}
