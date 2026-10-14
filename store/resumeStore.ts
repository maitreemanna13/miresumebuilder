import { create } from "zustand";
import { persist } from "zustand/middleware";
import { EMPTY_RESUME, type Resume } from "@/lib/schema/resume";

const MAX_HISTORY = 20;

interface ResumeState {
  resume: Resume;
  selectedTemplateId: string;
  // null means "use the template's own default accent".
  selectedAccentColor: string | null;
  hasHydrated: boolean;
  undoStack: Resume[];
  redoStack: Resume[];

  setHasHydrated: (value: boolean) => void;
  setResume: (resume: Resume) => void;
  updateResume: (updater: (draft: Resume) => Resume) => void;
  replaceResume: (resume: Resume) => void;
  setSelectedTemplateId: (id: string) => void;
  setSelectedAccentColor: (color: string | null) => void;
  snapshotBeforeChange: () => void;
  undo: () => void;
  redo: () => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      resume: EMPTY_RESUME,
      selectedTemplateId: "classic",
      selectedAccentColor: null,
      hasHydrated: false,
      undoStack: [],
      redoStack: [],

      setHasHydrated: (value) => set({ hasHydrated: value }),

      setResume: (resume) => set({ resume }),

      updateResume: (updater) =>
        set((state) => ({ resume: updater(state.resume) })),

      // Used by AI-applied edits and destructive actions (e.g. resume
      // replacement from an upload) so they can be undone — there is no
      // server-side version history to fall back on.
      snapshotBeforeChange: () =>
        set((state) => ({
          undoStack: [...state.undoStack, state.resume].slice(-MAX_HISTORY),
          redoStack: [],
        })),

      replaceResume: (resume) => {
        get().snapshotBeforeChange();
        set({ resume });
      },

      setSelectedTemplateId: (id) => set({ selectedTemplateId: id }),

      setSelectedAccentColor: (color) => set({ selectedAccentColor: color }),

      undo: () =>
        set((state) => {
          const previous = state.undoStack.at(-1);
          if (!previous) return state;
          return {
            resume: previous,
            undoStack: state.undoStack.slice(0, -1),
            redoStack: [...state.redoStack, state.resume].slice(-MAX_HISTORY),
          };
        }),

      redo: () =>
        set((state) => {
          const next = state.redoStack.at(-1);
          if (!next) return state;
          return {
            resume: next,
            redoStack: state.redoStack.slice(0, -1),
            undoStack: [...state.undoStack, state.resume].slice(-MAX_HISTORY),
          };
        }),
    }),
    {
      name: "resume-builder:v1",
      version: 2,
      // Only persist the actual resume data + selection, not transient UI
      // state like hydration flag or undo/redo stacks.
      partialize: (state) => ({
        resume: state.resume,
        selectedTemplateId: state.selectedTemplateId,
        selectedAccentColor: state.selectedAccentColor,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      // v2 added `projects` to each experience entry — backfill it so
      // resumes saved before then don't hit `undefined.map` in the forms
      // and templates.
      migrate: (persistedState) => {
        const state = persistedState as ResumeState;
        if (!state?.resume?.experience) return state;
        return {
          ...state,
          resume: {
            ...state.resume,
            experience: state.resume.experience.map((e) => ({
              ...e,
              projects: e.projects ?? [],
            })),
          },
        };
      },
    }
  )
);
