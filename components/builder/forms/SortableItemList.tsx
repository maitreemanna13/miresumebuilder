"use client";

import type { ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemListProps<T extends { id: string }> {
  items: T[];
  onReorder: (items: T[]) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
  addLabel: string;
  renderItem: (item: T) => ReactNode;
}

export function SortableItemList<T extends { id: string }>({
  items,
  onReorder,
  onRemove,
  onAdd,
  addLabel,
  renderItem,
}: SortableItemListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    onReorder(arrayMove(items, oldIndex, newIndex));
  }

  return (
    <div className="flex flex-col gap-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id} onRemove={() => onRemove(item.id)}>
              {renderItem(item)}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
      {items.length === 0 ? (
        <p className="text-sm text-zinc-400">Nothing here yet.</p>
      ) : null}
      <button
        type="button"
        onClick={onAdd}
        className="self-start rounded-md border border-dashed border-zinc-300 px-3 py-1.5 text-sm text-zinc-600 hover:border-zinc-400 hover:text-zinc-900"
      >
        + {addLabel}
      </button>
    </div>
  );
}

function SortableItem({
  id,
  onRemove,
  children,
}: {
  id: string;
  onRemove: () => void;
  children: ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab select-none px-1 text-zinc-400 hover:text-zinc-600"
          aria-label="Drag to reorder"
        >
          ⠿
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="flex items-center gap-1 rounded-md border border-transparent px-2 py-1 text-xs font-medium text-red-500 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          </svg>
          Remove
        </button>
      </div>
      {children}
    </div>
  );
}
