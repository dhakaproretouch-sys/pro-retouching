import React from 'react';
import { useForm } from 'react-hook-form';
import { MessageSquareQuote } from 'lucide-react';
import type { Testimonial } from '../../lib/types';
import { ResourceManager } from '../resource/ResourceManager';
import { useResourceManager } from '../resource/useResourceManager';
import { FormModal } from '../resource/FormModal';
import { TextField, TextAreaField } from '../resource/fields';

interface TestimonialFormValues {
  name: string;
  role: string;
  text: string;
}

const TestimonialFormModal: React.FC<{
  open: boolean;
  item: Testimonial | null;
  onClose: () => void;
  onSaved: () => void;
}> = ({ open, item, onClose, onSaved }) => {
  const isEdit = Boolean(item);
  const methods = useForm<TestimonialFormValues>({
    defaultValues: { name: '', role: '', text: '' },
  });

  const { register, formState, reset } = methods;

  React.useEffect(() => {
    if (!open) return;
    reset({
      name: item?.name || '',
      role: item?.role || '',
      text: item?.text || '',
    });
  }, [open, item, reset]);

  return (
    <FormModal<TestimonialFormValues>
      open={open}
      item={item}
      resource="testimonials"
      title={isEdit ? 'Edit Testimonial' : 'Add Testimonial'}
      description="Customer reviews shown on the public site."
      methods={methods}
      onClose={onClose}
      onSaved={onSaved}
      toPayload={(values) => ({
        name: values.name.trim(),
        role: values.role.trim(),
        text: values.text.trim(),
      })}
      validate={(values) => {
        if (!values.name.trim()) return 'Customer name is required';
        if (!values.text.trim()) return 'Testimonial text is required';
        return null;
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <TextField
          label="Customer Name"
          required
          placeholder="e.g. Sarah Johnson"
          error={formState.errors.name?.message}
          {...register('name', { required: 'Name is required' })}
        />
        <TextField
          label="Role / Company"
          hint="Optional job title or brand."
          placeholder="e.g. Amazon Seller"
          {...register('role')}
        />
      </div>

      <TextAreaField
        label="Testimonial"
        required
        rows={4}
        placeholder="What did the customer say about your work?"
        error={formState.errors.text?.message}
        {...register('text', { required: 'Testimonial text is required' })}
      />
    </FormModal>
  );
};

export const TestimonialsManager: React.FC = () => {
  const hook = useResourceManager<Testimonial>({
    resource: 'testimonials',
    queryKey: 'testimonials',
    canReorder: true,
    searchKeys: ['name', 'role', 'text'],
  });

  return (
    <ResourceManager<Testimonial>
      hook={hook}
      title="Testimonials"
      description="Customer reviews and quotes. Drag rows to reorder."
      singular="Testimonial"
      icon={MessageSquareQuote}
      emptyTitle="No testimonials yet"
      emptyDescription="Add customer reviews to build social proof."
      canReorder
      searchPlaceholder="Search testimonials…"
      rowLabel={(item) => item.name}
      FormModal={TestimonialFormModal}
      columns={[
        {
          key: 'name',
          header: 'Customer',
          render: (item) => (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">{item.name}</p>
              {item.role && <p className="text-[11px] text-slate-400 truncate">{item.role}</p>}
            </div>
          ),
          className: 'md:flex-[2]',
        },
        {
          key: 'text',
          header: 'Review',
          render: (item) => (
            <p className="text-xs text-slate-500 line-clamp-2">"{item.text}"</p>
          ),
          className: 'hidden lg:block',
        },
      ]}
    />
  );
};

export default TestimonialsManager;
