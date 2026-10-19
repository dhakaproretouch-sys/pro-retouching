import React from 'react';
import { useForm } from 'react-hook-form';
import { Sparkles } from 'lucide-react';
import type { Service } from '../../lib/types';
import { ResourceManager, Thumb, ActiveBadge } from '../resource/ResourceManager';
import { useResourceManager } from '../resource/useResourceManager';
import { FormModal } from '../resource/FormModal';
import { TextField, TextAreaField, SwitchField } from '../resource/fields';
import { ImageField } from '../components/ImageField';
import { ListEditor } from '../components/ListEditor';
import { slugify } from '../resource/slugify';

interface ServiceFormValues {
  title: string;
  slug: string;
  shortDesc: string;
  description: string;
  bullets: string[];
  image: string;
  beforeImage: string;
  afterImage: string;
  isActive: boolean;
}

const DEFAULT_BULLETS = [
  '100% hand-drawn manual editing',
  'Marketplace compliant pure white background',
  '12-24 hours standard turnaround',
  'Free unlimited revisions',
];

const ServiceFormModal: React.FC<{
  open: boolean;
  item: Service | null;
  onClose: () => void;
  onSaved: () => void;
}> = ({ open, item, onClose, onSaved }) => {
  const isEdit = Boolean(item);
  const methods = useForm<ServiceFormValues>({
    defaultValues: {
      title: '',
      slug: '',
      shortDesc: '',
      description: '',
      bullets: [],
      image: '',
      beforeImage: '',
      afterImage: '',
      isActive: true,
    },
  });

  const { register, formState, reset, watch, setValue, getValues } = methods;
  const titleValue = watch('title');
  const slugTouched = React.useRef(false);

  React.useEffect(() => {
    if (!open) return;
    slugTouched.current = Boolean(item?.slug);
    reset({
      title: item?.title || '',
      slug: item?.slug || '',
      shortDesc: item?.shortDesc || '',
      description: item?.description || '',
      bullets: item?.bullets || [],
      image: item?.image || '',
      beforeImage: item?.beforeImage || '',
      afterImage: item?.afterImage || '',
      isActive: item ? item.isActive : true,
    });
  }, [open, item, reset]);

  // Auto-generate slug from title until the admin edits it manually.
  React.useEffect(() => {
    if (!isEdit && !slugTouched.current) {
      setValue('slug', slugify(titleValue || ''));
    }
  }, [titleValue, isEdit, setValue]);

  return (
    <FormModal<ServiceFormValues>
      open={open}
      item={item}
      resource="services"
      title={isEdit ? 'Edit Service' : 'Add Service'}
      description="Shown on the Services page and homepage."
      methods={methods}
      onClose={onClose}
      onSaved={onSaved}
      size="lg"
      toPayload={(values) => ({
        title: values.title.trim(),
        slug: values.slug.trim() || slugify(values.title),
        shortDesc: values.shortDesc.trim(),
        description: values.description.trim(),
        bullets: values.bullets,
        image: values.image,
        beforeImage: values.beforeImage,
        afterImage: values.afterImage,
        isActive: values.isActive,
      })}
      validate={(values) => {
        if (!values.title.trim()) return 'Title is required';
        return null;
      }}
    >
      <TextField
        label="Title"
        required
        placeholder="e.g. Background Removal"
        error={formState.errors.title?.message}
        {...register('title', { required: 'Title is required' })}
      />

      <TextField
        label="Slug"
        hint="Auto-generated from the title. Used in the URL."
        placeholder="background-removal"
        {...register('slug', {
          onChange: () => {
            slugTouched.current = true;
          },
        })}
      />

      <TextAreaField
        label="Short Description"
        rows={2}
        placeholder="One-line summary shown on cards"
        {...register('shortDesc')}
      />

      <TextAreaField
        label="Full Description"
        rows={4}
        placeholder="Detailed service description"
        {...register('description')}
      />

      <ListEditor
        label="Bullets"
        items={watch('bullets')}
        onChange={(items) => setValue('bullets', items)}
        suggestions={DEFAULT_BULLETS}
        placeholder="e.g. Pure white Amazon FBA background"
      />

      <ImageField
        label="Main Image"
        value={watch('image')}
        onChange={(url) => setValue('image', url)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <ImageField
          label="Before Image"
          value={watch('beforeImage')}
          onChange={(url) => setValue('beforeImage', url)}
          hint="Original / unedited photo"
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
        hint="Hidden services do not appear on the public site."
        checked={watch('isActive')}
        onChange={(checked) => setValue('isActive', checked)}
      />
    </FormModal>
  );
};

export const ServicesManager: React.FC = () => {
  const hook = useResourceManager<Service>({
    resource: 'services',
    queryKey: 'services',
    hasToggle: true,
    canReorder: true,
    searchKeys: ['title', 'slug', 'shortDesc'],
  });

  return (
    <ResourceManager<Service>
      hook={hook}
      title="Services"
      description="Manage the services offered. Drag rows to reorder."
      singular="Service"
      icon={Sparkles}
      emptyTitle="No services yet"
      emptyDescription="Add your first service to show it on the Services page."
      canReorder
      hasToggle
      searchPlaceholder="Search services…"
      rowLabel={(item) => item.title}
      FormModal={ServiceFormModal}
      columns={[
        {
          key: 'title',
          header: 'Service',
          render: (item) => (
            <div className="flex items-center gap-3 min-w-0">
              <Thumb src={item.image || item.afterImage} alt={item.title} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-700 truncate">{item.title}</p>
                <p className="text-[11px] text-slate-400 truncate">/{item.slug}</p>
              </div>
            </div>
          ),
          className: 'md:flex-[2]',
        },
        {
          key: 'shortDesc',
          header: 'Description',
          render: (item) => (
            <p className="text-xs text-slate-500 line-clamp-2">{item.shortDesc || '—'}</p>
          ),
          className: 'hidden lg:block',
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

export default ServicesManager;
