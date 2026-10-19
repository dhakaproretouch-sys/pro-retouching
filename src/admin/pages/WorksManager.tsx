import React from 'react';
import { useForm } from 'react-hook-form';
import { FolderOpen } from 'lucide-react';
import type { Work } from '../../lib/types';
import { ResourceManager, Thumb, ActiveBadge } from '../resource/ResourceManager';
import { useResourceManager } from '../resource/useResourceManager';
import { FormModal } from '../resource/FormModal';
import { TextField, SelectField, SwitchField } from '../resource/fields';
import { ImageField } from '../components/ImageField';

export const WORK_CATEGORIES = [
  'Clipping Path',
  'Ghost Mannequin',
  'Retouching',
  'Shadow',
  'Color Correction',
];

interface WorkFormValues {
  title: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  isActive: boolean;
}

const WorkFormModal: React.FC<{
  open: boolean;
  item: Work | null;
  onClose: () => void;
  onSaved: () => void;
}> = ({ open, item, onClose, onSaved }) => {
  const isEdit = Boolean(item);
  const methods = useForm<WorkFormValues>({
    defaultValues: {
      title: '',
      category: WORK_CATEGORIES[0],
      beforeImage: '',
      afterImage: '',
      isActive: true,
    },
  });

  const { register, formState, reset, watch, setValue } = methods;

  React.useEffect(() => {
    if (!open) return;
    reset({
      title: item?.title || '',
      category: item?.category || WORK_CATEGORIES[0],
      beforeImage: item?.beforeImage || '',
      afterImage: item?.afterImage || '',
      isActive: item ? item.isActive : true,
    });
  }, [open, item, reset]);

  return (
    <FormModal<WorkFormValues>
      open={open}
      item={item}
      resource="works"
      title={isEdit ? 'Edit Work' : 'Add Work'}
      description="Portfolio entries shown on the Our Works page."
      methods={methods}
      onClose={onClose}
      onSaved={onSaved}
      toPayload={(values) => ({
        title: values.title.trim(),
        category: values.category,
        beforeImage: values.beforeImage,
        afterImage: values.afterImage,
        isActive: values.isActive,
      })}
      validate={(values) => (!values.title.trim() ? 'Title is required' : null)}
    >
      <TextField
        label="Title"
        required
        placeholder="e.g. Luxury Leather Handbag"
        error={formState.errors.title?.message}
        {...register('title', { required: 'Title is required' })}
      />

      <SelectField
        label="Category"
        options={WORK_CATEGORIES.map((category) => ({ value: category, label: category }))}
        {...register('category')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <ImageField
          label="Before Image"
          value={watch('beforeImage')}
          onChange={(url) => setValue('beforeImage', url)}
          hint="Original photo"
        />
        <ImageField
          label="After Image"
          value={watch('afterImage')}
          onChange={(url) => setValue('afterImage', url)}
          hint="Edited result"
        />
      </div>

      <SwitchField
        label="Active"
        hint="Hidden works do not appear in the public portfolio."
        checked={watch('isActive')}
        onChange={(checked) => setValue('isActive', checked)}
      />
    </FormModal>
  );
};

export const WorksManager: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = React.useState('all');

  const hook = useResourceManager<Work>({
    resource: 'works',
    queryKey: 'works',
    hasToggle: true,
    canReorder: true,
    searchKeys: ['title', 'category'],
    extraFilter: (item) => categoryFilter === 'all' || item.category === categoryFilter,
  });

  return (
    <ResourceManager<Work>
      hook={hook}
      title="Our Works"
      description="Portfolio gallery with before/after images. Drag rows to reorder."
      singular="Work"
      icon={FolderOpen}
      emptyTitle="No works yet"
      emptyDescription="Add portfolio entries to showcase your editing results."
      canReorder
      hasToggle
      searchPlaceholder="Search works…"
      rowLabel={(item) => item.title}
      FormModal={WorkFormModal}
      toolbar={
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {WORK_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      }
      columns={[
        {
          key: 'title',
          header: 'Work',
          render: (item) => (
            <div className="flex items-center gap-3 min-w-0">
              <Thumb src={item.afterImage || item.beforeImage} alt={item.title} />
              <p className="text-sm font-semibold text-slate-700 truncate">{item.title}</p>
            </div>
          ),
          className: 'md:flex-[2]',
        },
        {
          key: 'category',
          header: 'Category',
          render: (item) => (
            <span className="inline-flex px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
              {item.category || 'Uncategorized'}
            </span>
          ),
          className: 'hidden md:flex w-36 shrink-0',
        },
        {
          key: 'images',
          header: 'Before / After',
          render: (item) => (
            <div className="flex items-center gap-1.5">
              <Thumb src={item.beforeImage} alt={`${item.title} before`} className="w-12 h-9" />
              <Thumb src={item.afterImage} alt={`${item.title} after`} className="w-12 h-9" />
            </div>
          ),
          className: 'hidden lg:flex w-32 shrink-0',
        },
        {
          key: 'status',
          header: 'Status',
          render: (item) => <ActiveBadge isActive={item.isActive} />,
          className: 'hidden md:flex w-20 shrink-0',
        },
      ]}
    />
  );
};

export default WorksManager;
