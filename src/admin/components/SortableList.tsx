import React from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableRowProps {
  id: string;
  busy?: boolean;
  children: React.ReactNode;
  label: string;
}

const SortableRow: React.FC<SortableRowProps> = ({ id, busy, children, label }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    position: 'relative',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 bg-white border-b border-slate-100 last:border-b-0 ${
        isDragging ? 'shadow-lg rounded-xl ring-2 ring-amber-300' : ''
      } ${busy ? 'opacity-60' : ''}`}
    >
      <button
        type="button"
        className="p-2 -ml-1 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 cursor-grab active:cursor-grabbing touch-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        aria-label={`Reorder: ${label}`}
        disabled={busy}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4" />
      </button>
      {children}
    </div>
  );
};

interface SortableListProps {
  ids: string[];
  labels: Record<string, string>;
  busy?: boolean;
  onReorder: (activeId: string, overId: string) => void;
  children: React.ReactNode;
}

/** dnd-kit vertical list wrapper used by ResourceManager rows. */
export const SortableList: React.FC<SortableListProps> = ({
  ids,
  labels,
  busy = false,
  onReorder,
  children,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || busy) return;
    onReorder(String(active.id), String(over.id));
  };

  const rows = React.Children.toArray(children);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="relative">
          {rows.map((row, index) => (
            <SortableRow key={ids[index]} id={ids[index]} busy={busy} label={labels[ids[index]] || ''}>
              {row}
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default SortableList;
