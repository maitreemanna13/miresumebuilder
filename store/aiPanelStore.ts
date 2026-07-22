import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RefineUpdates } from "@/lib/ai/refine";

export type AITurnStatus = "pending" | "explained" | "accepted" | "rejected" | "error";

export interface AITurn {
  id: string;
  instruction: string;
  status: AITurnStatus;
  explanation?: string;
  updates?: RefineUpdates;
  errorMessage?: string;
}

interface AIPanelState {
  turns: AITurn[];
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  addPendingTurn: (instruction: string) => string;
  resolveTurn: (id: string, explanation: string, updates: RefineUpdates) => void;
  failTurn: (id: string, errorMessage: string) => void;
  markAccepted: (id: string) => void;
  markRejected: (id: string) => void;
}

export const useAIPanelStore = create<AIPanelState>()(
  persist(
    (set) => ({
      turns: [],
      hasHydrated: false,

      setHasHydrated: (value) => set({ hasHydrated: value }),

      addPendingTurn: (instruction) => {
        const id = crypto.randomUUID();
        set((state) => ({
          turns: [...state.turns, { id, instruction, status: "pending" }],
        }));
        return id;
      },

      resolveTurn: (id, explanation, updates) =>
        set((state) => ({
          turns: state.turns.map((t) =>
            t.id === id ? { ...t, status: "explained", explanation, updates } : t
          ),
        })),

      failTurn: (id, errorMessage) =>
        set((state) => ({
          turns: state.turns.map((t) =>
            t.id === id ? { ...t, status: "error", errorMessage } : t
          ),
        })),

      markAccepted: (id) =>
        set((state) => ({
          turns: state.turns.map((t) => (t.id === id ? { ...t, status: "accepted" } : t)),
        })),

      markRejected: (id) =>
        set((state) => ({
          turns: state.turns.map((t) => (t.id === id ? { ...t, status: "rejected" } : t)),
        })),
    }),
    {
      name: "resume-builder:ai-panel:v1",
      version: 1,
      partialize: (state) => ({ turns: state.turns }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
