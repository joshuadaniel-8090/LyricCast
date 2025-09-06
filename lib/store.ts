import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, ServicePlan, ContentItem, Slide } from '@/types';

interface AppStore extends AppState {
  setCurrentView: (view: 'files' | 'preview' | 'service-plan') => void;
  setContent: (content: ContentItem[]) => void;
  createServicePlan: (title: string, date: string) => ServicePlan;
  setCurrentServicePlan: (plan: ServicePlan | null) => void;
  addToServicePlan: (contentItem: ContentItem) => void;
  removeFromServicePlan: (itemId: string) => void;
  reorderServicePlan: (fromIndex: number, toIndex: number) => void;
  setCurrentSlide: (slide: Slide | null) => void;
  nextSlide: () => void;
  previousSlide: () => void;
  goToSlide: (slideIndex: number) => void;
  toggleProjector: () => void;
  toggleBlank: () => void;
  toggleLogo: () => void;
  toggleTimer: () => void;
  saveServicePlan: (plan: ServicePlan) => void;
  loadServicePlans: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      currentView: 'service-plan',
      servicePlans: [],
      currentServicePlan: null,
      currentSlide: null,
      nextSlide: null,
      content: [],
      isProjectorOpen: false,
      showBlank: false,
      showLogo: false,
      showTimer: false,

      setCurrentView: (view) => set({ currentView: view }),

      setContent: (content) => set({ content }),

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
        const updatedPlans = servicePlans.map(p => ({ ...p, isActive: false }));
        updatedPlans.push(plan);
        
        set({ 
          servicePlans: updatedPlans,
          currentServicePlan: plan 
        });
        
        return plan;
      },

      setCurrentServicePlan: (plan) => {
        set({ currentServicePlan: plan });
        if (plan && plan.items.length > 0) {
          const firstSlide = plan.items[0]?.slides[0];
          const secondSlide = plan.items[0]?.slides[1] || plan.items[1]?.slides[0];
          set({ 
            currentSlide: firstSlide || null,
            nextSlide: secondSlide || null 
          });
        }
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

        const updatedPlan = {
          ...currentServicePlan,
          items: [...currentServicePlan.items, planItem],
        };

        set({ currentServicePlan: updatedPlan });
      },

      removeFromServicePlan: (itemId) => {
        const { currentServicePlan } = get();
        if (!currentServicePlan) return;

        const updatedPlan = {
          ...currentServicePlan,
          items: currentServicePlan.items.filter(item => item.id !== itemId),
        };

        set({ currentServicePlan: updatedPlan });
      },

      reorderServicePlan: (fromIndex, toIndex) => {
        const { currentServicePlan } = get();
        if (!currentServicePlan) return;

        const items = [...currentServicePlan.items];
        const [movedItem] = items.splice(fromIndex, 1);
        items.splice(toIndex, 0, movedItem);

        const updatedPlan = {
          ...currentServicePlan,
          items: items.map((item, index) => ({ ...item, order: index })),
        };

        set({ currentServicePlan: updatedPlan });
      },

      setCurrentSlide: (slide) => set({ currentSlide: slide }),

      nextSlide: () => {
        const { currentServicePlan } = get();
        if (!currentServicePlan) return;

        const allSlides = currentServicePlan.items.flatMap(item => item.slides);
        const currentIndex = get().currentServicePlan?.currentSlideIndex || 0;
        
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
        }
      },

      previousSlide: () => {
        const { currentServicePlan } = get();
        if (!currentServicePlan) return;

        const allSlides = currentServicePlan.items.flatMap(item => item.slides);
        const currentIndex = get().currentServicePlan?.currentSlideIndex || 0;
        
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
        }
      },

      goToSlide: (slideIndex) => {
        const { currentServicePlan } = get();
        if (!currentServicePlan) return;

        const allSlides = currentServicePlan.items.flatMap(item => item.slides);
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
        }
      },

      toggleProjector: () => {
        const isOpen = get().isProjectorOpen;
        if (isOpen) {
          // Close projector window
          set({ isProjectorOpen: false });
        } else {
          // Open projector window
          window.open('/projector', 'projector', 'fullscreen=yes,scrollbars=no');
          set({ isProjectorOpen: true });
        }
      },

      toggleBlank: () => set(state => ({ showBlank: !state.showBlank })),
      toggleLogo: () => set(state => ({ showLogo: !state.showLogo })),
      toggleTimer: () => set(state => ({ showTimer: !state.showTimer })),

      saveServicePlan: (plan) => {
        const { servicePlans } = get();
        const existingIndex = servicePlans.findIndex(p => p.id === plan.id);
        
        if (existingIndex >= 0) {
          const updatedPlans = [...servicePlans];
          updatedPlans[existingIndex] = plan;
          set({ servicePlans: updatedPlans });
        } else {
          set({ servicePlans: [...servicePlans, plan] });
        }
      },

      loadServicePlans: () => {
        // This will be called on app initialization
        // Plans are automatically loaded from localStorage via persist middleware
      },
    }),
    {
      name: 'worship-app-storage',
      partialize: (state) => ({
        servicePlans: state.servicePlans,
        currentServicePlan: state.currentServicePlan,
      }),
    }
  )
);