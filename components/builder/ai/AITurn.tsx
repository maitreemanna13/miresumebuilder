import type { AITurn as AITurnType } from "@/store/aiPanelStore";
import type { RefineUpdates } from "@/lib/ai/refine";
import type { Resume } from "@/lib/schema/resume";
import { DiffField } from "./DiffField";

const FIELD_ORDER: Array<keyof RefineUpdates> = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
];

export function AITurn({
  turn,
  resumeBeforeTurn,
  canResolve,
  onAccept,
  onReject,
}: {
  turn: AITurnType;
  resumeBeforeTurn: Resume;
  canResolve: boolean;
  onAccept: () => void;
  onReject: () => void;
}) {
  const changedFields = turn.updates
    ? FIELD_ORDER.filter((f) => {
        const value = turn.updates![f];
        return value !== undefined && (typeof value === "string" || value.length > 0);
      })
    : [];

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-3">
      <p className="text-sm font-medium text-zinc-900">{turn.instruction}</p>

      {turn.status === "pending" ? <p className="text-sm text-zinc-400">Thinking…</p> : null}

      {turn.status === "error" ? <p className="text-sm text-red-600">{turn.errorMessage}</p> : null}

      {turn.explanation ? <p className="text-sm text-zinc-600">{turn.explanation}</p> : null}

      {turn.status === "explained" && turn.updates ? (
        <>
          {changedFields.length > 0 ? (
            <div className="flex flex-col gap-2">
              {changedFields.map((f) => (
                <DiffField key={f} field={f} before={resumeBeforeTurn} after={turn.updates!} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-400">No changes proposed.</p>
          )}

          {changedFields.length > 0 && canResolve ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onAccept}
                className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={onReject}
                className="rounded-md border border-zinc-300 px-3 py-1 text-xs text-zinc-600 hover:border-zinc-400"
              >
                Reject
              </button>
            </div>
          ) : null}

          {changedFields.length > 0 && !canResolve ? (
            <p className="text-xs text-zinc-400">Superseded by a later message.</p>
          ) : null}
        </>
      ) : null}

      {turn.status === "accepted" ? <p className="text-xs text-emerald-600">Accepted</p> : null}
      {turn.status === "rejected" ? <p className="text-xs text-zinc-400">Rejected</p> : null}
    </div>
  );
}
