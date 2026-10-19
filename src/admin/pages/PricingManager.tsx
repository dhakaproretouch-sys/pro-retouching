import React from 'react';
import { useForm } from 'react-hook-form';
import { DollarSign } from 'lucide-react';
import type { PricingPlan } from '../../lib/types';
import { ResourceManager } from '../resource/ResourceManager';
import { useResourceManager } from '../resource/useResourceManager';
import { FormModal } from '../resource/FormModal';
import { TextField, SwitchField } from '../resource/fields';
import { ListEditor } from '../components/ListEditor';

interface PricingFormValues {
  name: string;
  price: string;
  unit: string;
  features: string[];
  isPopular: boolean;
}

const DEFAULT_FEATURES = [
  '100% pure white background',
  'Hand-drawn clipping paths',
  '12-24 hours turnaround',
  'Free unlimited revisions',
];

const PricingFormModal: React.FC<{
  open: boolean;
  item: PricingPlan | null;
  onClose: () => void;
  onSaved: () => void;
}> = ({ open, item, onClose, onSaved }) => {
  const isEdit = Boolean(item);
  const methods = useForm<PricingFormValues>({
    defaultValues: {
      name: '',
      price: '',
      unit: '',
      features: [],
      isPopular: false,
    },
  });

  const { register, formState, reset, watch, setValue } = methods;

  React.useEffect(() => {
    if (!open) return;
    reset({
      name: item?.name || '',
      price: item?.price || '',
      unit: item?.unit || '',
      features: item?.features || [],
      isPopular: item?.isPopular ?? false,
    });
  }, [open, item, reset]);

  return (
    <FormModal<PricingFormValues>
      open={open}
      item={item}
      resource="pricing"
      title={isEdit ? 'Edit Plan' : 'Add Plan'}
      description="Pricing cards shown on the Pricing page."
      methods={methods}
      onClose={onClose}
      onSaved={onSaved}
      toPayload={(values) => ({
        name: values.name.trim(),
        price: values.price.trim(),
        unit: values.unit.trim(),
        features: values.features,
        isPopular: values.isPopular,
      })}
      validate={(values) => {
        if (!values.name.trim()) return 'Plan name is required';
        if (!values.price.trim()) return 'Price is required';
        return null;
      }}
    >
      <TextField
        label="Plan Name"
        required
        placeholder="e.g. Basic"
        error={formState.errors.name?.message}
        {...register('name', { required: 'Plan name is required' })}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <TextField
          label="Price"
          required
          type="number"
          min="0"
          step="0.01"
          placeholder="0.29"
          error={formState.errors.price?.message}
          {...register('price', { required: 'Price is required' })}
        />
        <TextField
          label="Unit"
          hint="Per-image / per-hour etc."
          placeholder="per image"
          {...register('unit')}
        />
      </div>

      <ListEditor
        label="Features"
        items={watch('features')}
        onChange={(items) => setValue('features', items)}
        suggestions={DEFAULT_FEATURES}
        placeholder="e.g. 12-24 hours turnaround"
      />

      <div className="space-y-3">
        <SwitchField
          label="Popular"
          hint="Highlights this card as the most popular plan."
          checked={watch('isPopular')}
          onChange={(checked) => setValue('isPopular', checked)}
        />
      </div>
    </FormModal>
  );
};

export const PricingManager: React.FC = () => {
  const hook = useResourceManager<PricingPlan>({
    resource: 'pricing',
    queryKey: 'pricing',
    canReorder: true,
    searchKeys: ['name', 'unit'],
  });

  return (
    <ResourceManager<PricingPlan>
      hook={hook}
      title="Pricing Plans"
      description="Manage pricing cards and their features. Drag rows to reorder."
      singular="Plan"
      icon={DollarSign}
      emptyTitle="No pricing plans yet"
      emptyDescription="Add plans to show pricing on the public site."
      canReorder
      searchPlaceholder="Search plans…"
      rowLabel={(item) => item.name}
      FormModal={PricingFormModal}
      columns={[
        {
          key: 'name',
          header: 'Plan',
          render: (item) => (
            <div className="min-w-0 flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-700 truncate">{item.name}</p>
              {item.isPopular && (
                <span className="shrink-0 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                  Popular
                </span>
              )}
            </div>
          ),
          className: 'md:flex-[2]',
        },
        {
          key: 'price',
          header: 'Price',
          render: (item) => (
            <p className="text-sm font-bold text-brand-navy">
              ${item.price}
              {item.unit && (
                <span className="ml-1 text-xs font-medium text-slate-400">{item.unit}</span>
              )}
            </p>
          ),
          className: 'w-32 shrink-0',
        },
        {
          key: 'features',
          header: 'Features',
          render: (item) => (
            <p className="text-xs text-slate-500 line-clamp-1">
              {item.features?.length ? `${item.features.length} features` : '—'}
            </p>
          ),
          className: 'hidden lg:block w-28 shrink-0',
        },
      ]}
    />
  );
};

export default PricingManager;
