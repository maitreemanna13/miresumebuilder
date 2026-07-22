"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { useAIPanelStore } from "@/store/aiPanelStore";
import { applyRefineUpdates } from "@/lib/ai/refine";
import { AITurn } from "./AITurn";
import { TailorToJobForm } from "./TailorToJobForm";
import { Textarea } from "@/components/ui/Textarea";

export function AIPanel() {
  const resume = useResumeStore((s) => s.resume);
  const updateResume = useResumeStore((s) => s.updateResume);
  const snapshotBeforeChange = useResumeStore((s) => s.snapshotBeforeChange);

  const turns = useAIPanelStore((s) => s.turns);
  const hasHydrated = useAIPanelStore((s) => s.hasHydrated);
  const addPendingTurn = useAIPanelStore((s) => s.addPendingTurn);
  const resolveTurn = useAIPanelStore((s) => s.resolveTurn);
  const failTurn = useAIPanelStore((s) => s.failTurn);
  const markAccepted = useAIPanelStore((s) => s.markAccepted);
  const markRejected = useAIPanelStore((s) => s.markRejected);

  const [instruction, setInstruction] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submitTurn(turnInstruction: string, jobDescription?: string) {
    if (submitting) return;

    setSubmitting(true);
    const id = addPendingTurn(turnInstruction);

    try {
      const res = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, instruction: turnInstruction, jobDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Request failed");
      resolveTurn(id, data.explanation, data.updates);
    } catch (err) {
      failTurn(id, err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmit() {
    const trimmed = instruction.trim();
    if (!trimmed) return;
    setInstruction("");
    submitTurn(trimmed);
  }

  function handleAccept(id: string) {
    const turn = turns.find((t) => t.id === id);
    if (!turn?.updates) return;
    snapshotBeforeChange();
    updateResume((draft) => applyRefineUpdates(draft, turn.updates!));
    markAccepted(id);
  }

  if (!hasHydrated) return null;

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
        {turns.length === 0 ? (
          <p className="text-sm text-zinc-400">
            Ask for changes, e.g. &quot;Make my summary punchier&quot; or &quot;Tailor this for a
            backend role&quot;.
          </p>
        ) : null}
        {turns.map((turn, i) => (
          <AITurn
            key={turn.id}
            turn={turn}
            resumeBeforeTurn={resume}
            canResolve={i === turns.length - 1}
            onAccept={() => handleAccept(turn.id)}
            onReject={() => markRejected(turn.id)}
          />
        ))}
      </div>
      <TailorToJobForm onSubmit={submitTurn} disabled={submitting} />
      <div className="flex gap-2">
        <Textarea
          rows={2}
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="Tell the assistant what to change..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || !instruction.trim()}
          className="self-end rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
}
