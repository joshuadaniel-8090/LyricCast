import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  AppState,
  ServicePlan,
  ContentTree,
  Slide,
  ContentItem,
} from "@/types";

// 🔥 Broadcast channel for syncing between control panel & projector
const channel =
  typeof window !== "undefined" ? new BroadcastChannel("worship-sync") : null;

// --- AppStore interface ---
interface AppStore extends AppState {
  setCurrentView: (view: "files" | "preview" | "service-plan") => void;
  setContent: (content: ContentTree) => void;
  createServicePlan: (title: string, date: string) => ServicePlan;
  setCurrentServicePlan: (plan: ServicePlan | null) => void;
  addToServicePlan: (contentItem: ContentItem) => void;
  removeFromServicePlan: (itemId: string) => void;
  reorderServicePlan: (fromIndex: number, toIndex: number) => void;
  setCurrentSlide: (slide: Slide | null) => void;
  goToNextSlide: () => void;
  previousSlide: () => void;
  goToSlide: (slideIndex: number) => void;
  toggleProjector: () => void;
  toggleBlank: () => void;
  toggleLogo: () => void;
  toggleTimer: () => void;
  saveServicePlan: (plan: ServicePlan) => void;
  loadServicePlans: () => void;
}

// --- Zustand store ---
export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      currentView: "service-plan",
      servicePlans: [],
      currentServicePlan: null,
      currentSlide: null,
      nextSlide: null,
      content: {
        songs: {},
        verses: {},
        "custom-templates": {},
      }, // ✅ Correctly typed ContentTree object
      isProjectorOpen: false,
      showBlank: false,
      showLogo: false,
      showTimer: false,

      setCurrentView: (view) => set({ currentView: view }),
      setContent: (content: ContentTree) => set({ content }),

      createServicePlan: (title, date) => {
        const plan: ServicePlan = {
          id: `plan-${Date.now()}`,
          title,
          date,
          items: [],
          currentSlideIndex: 0,
          isActive: true,
        };

        const { servicePlans } = get();
        const updatedPlans = servicePlans.map((p) => ({
          ...p,
          isActive: false,
        }));
        updatedPlans.push(plan);

        set({
          servicePlans: updatedPlans,
          currentServicePlan: plan,
          currentSlide: null,
          nextSlide: null,
          showBlank: false,
          showLogo: false,
          showTimer: false,
        });

        if (channel)
          channel.postMessage({ currentSlide: null, nextSlide: null });

        return plan;
      },

      setCurrentServicePlan: (plan) => {
        if (!plan) {
          set({
            currentServicePlan: null,
            currentSlide: null,
            nextSlide: null,
          });
          if (channel)
            channel.postMessage({ currentSlide: null, nextSlide: null });
          return;
        }

        if (plan.items.length === 0) {
          set({
            currentServicePlan: plan,
            currentSlide: null,
            nextSlide: null,
          });
          if (channel)
            channel.postMessage({ currentSlide: null, nextSlide: null });
          return;
        }

        const firstSlide = plan.items[0]?.slides[0] || null;
        const secondSlide =
          plan.items[0]?.slides[1] || plan.items[1]?.slides[0] || null;

        set({
          currentServicePlan: plan,
          currentSlide: firstSlide,
          nextSlide: secondSlide,
        });

        if (channel)
          channel.postMessage({
            currentSlide: firstSlide,
            nextSlide: secondSlide,
          });
      },

      addToServicePlan: (contentItem) => {
        const { currentServicePlan } = get();
        if (!currentServicePlan) return;

        const planItem = {
          id: `item-${Date.now()}`,
          contentId: contentItem.id,
          title: contentItem.title,
          type: contentItem.type,
          slides: contentItem.slides,
          order: currentServicePlan.items.length,
        };

        const newItems = [...currentServicePlan.items, planItem];

        const firstSlide = planItem.slides[0] || null;
        const secondSlide = planItem.slides[1] || null;

        set({
          currentServicePlan: {
            ...currentServicePlan,
            items: newItems,
            currentSlideIndex: firstSlide
              ? 0
              : currentServicePlan.currentSlideIndex,
          },
          currentSlide: firstSlide,
          nextSlide: secondSlide,
        });

        if (channel)
          channel.postMessage({
            currentSlide: firstSlide,
            nextSlide: secondSlide,
          });
      },

      removeFromServicePlan: (itemId) => {
        const { currentServicePlan } = get();
        if (!currentServicePlan) return;

        set({
          currentServicePlan: {
            ...currentServicePlan,
            items: currentServicePlan.items.filter(
              (item) => item.id !== itemId
            ),
          },
        });
      },

      reorderServicePlan: (fromIndex, toIndex) => {
        const { currentServicePlan } = get();
        if (!currentServicePlan) return;

        const items = [...currentServicePlan.items];
        const [movedItem] = items.splice(fromIndex, 1);
        items.splice(toIndex, 0, movedItem);

        set({
          currentServicePlan: {
            ...currentServicePlan,
            items: items.map((item, index) => ({ ...item, order: index })),
          },
        });
      },

      setCurrentSlide: (slide) => {
        set({ currentSlide: slide });
        if (channel) channel.postMessage({ currentSlide: slide });
      },

      goToNextSlide: () => {
        const { currentServicePlan } = get();
        if (!currentServicePlan) return;

        const allSlides = currentServicePlan.items.flatMap(
          (item) => item.slides
        );
        const currentIndex = currentServicePlan.currentSlideIndex || 0;

        if (currentIndex < allSlides.length - 1) {
          const nextIndex = currentIndex + 1;
          const currentSlide = allSlides[nextIndex];
          const nextSlide = allSlides[nextIndex + 1] || null;

          set({
            currentServicePlan: {
              ...currentServicePlan,
              currentSlideIndex: nextIndex,
            },
            currentSlide,
            nextSlide,
          });

          if (channel) channel.postMessage({ currentSlide, nextSlide });
        }
      },

      previousSlide: () => {
        const { currentServicePlan } = get();
        if (!currentServicePlan) return;

        const allSlides = currentServicePlan.items.flatMap(
          (item) => item.slides
        );
        const currentIndex = currentServicePlan.currentSlideIndex || 0;

        if (currentIndex > 0) {
          const prevIndex = currentIndex - 1;
          const currentSlide = allSlides[prevIndex];
          const nextSlide = allSlides[prevIndex + 1] || null;

          set({
            currentServicePlan: {
              ...currentServicePlan,
              currentSlideIndex: prevIndex,
            },
            currentSlide,
            nextSlide,
          });

          if (channel) channel.postMessage({ currentSlide, nextSlide });
        }
      },

      goToSlide: (slideIndex) => {
        const { currentServicePlan } = get();
        if (!currentServicePlan) return;

        const allSlides = currentServicePlan.items.flatMap(
          (item) => item.slides
        );
        if (slideIndex >= 0 && slideIndex < allSlides.length) {
          const currentSlide = allSlides[slideIndex];
          const nextSlide = allSlides[slideIndex + 1] || null;

          set({
            currentServicePlan: {
              ...currentServicePlan,
              currentSlideIndex: slideIndex,
            },
            currentSlide,
            nextSlide,
          });

          if (channel) channel.postMessage({ currentSlide, nextSlide });
        }
      },

      toggleProjector: () => {
        const isOpen = get().isProjectorOpen;
        if (isOpen) set({ isProjectorOpen: false });
        else {
          window.open(
            "/projector",
            "projector",
            "fullscreen=yes,scrollbars=no"
          );
          set({ isProjectorOpen: true });
        }
      },

      toggleBlank: () =>
        set((state) => {
          const showBlank = !state.showBlank;
          if (channel) channel.postMessage({ showBlank });
          return { showBlank };
        }),

      toggleLogo: () =>
        set((state) => {
          const showLogo = !state.showLogo;
          if (channel) channel.postMessage({ showLogo });
          return { showLogo };
        }),

      toggleTimer: () =>
        set((state) => {
          const showTimer = !state.showTimer;
          if (channel) channel.postMessage({ showTimer });
          return { showTimer };
        }),

      saveServicePlan: (plan) => {
        const { servicePlans } = get();
        const existingIndex = servicePlans.findIndex((p) => p.id === plan.id);

        if (existingIndex >= 0) {
          const updatedPlans = [...servicePlans];
          updatedPlans[existingIndex] = plan;
          set({ servicePlans: updatedPlans });
        } else {
          set({ servicePlans: [...servicePlans, plan] });
        }
      },

      loadServicePlans: () => {
        // Zustand persist handles rehydration automatically
      },
    }),
    {
      name: "worship-app-storage",
      partialize: (state) => ({
        servicePlans: state.servicePlans,
        currentServicePlan: state.currentServicePlan,
        currentSlide: state.currentSlide,
        nextSlide: state.nextSlide,
        showBlank: state.showBlank,
        showLogo: state.showLogo,
        showTimer: state.showTimer,
      }),
    }
  )
);

// 🔥 Broadcast listener
if (channel) {
  channel.onmessage = (event) => {
    const data = event.data as Partial<AppState>;
    useAppStore.setState((state) => ({
      ...state,
      ...data,
      currentServicePlan: data.currentServicePlan || state.currentServicePlan,
    }));
  };
}
