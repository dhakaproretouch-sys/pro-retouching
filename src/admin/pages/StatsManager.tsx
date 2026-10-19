import React from 'react';
import { useForm } from 'react-hook-form';
import { BarChart3 } from 'lucide-react';
import type { StatItem } from '../../lib/types';
import { ResourceManager } from '../resource/ResourceManager';
import { useResourceManager } from '../resource/useResourceManager';
import { FormModal } from '../resource/FormModal';
import { TextField } from '../resource/fields';

interface StatFormValues {
  label: string;
  value: string;
  suffix: string;
}

const StatFormModal: React.FC<{
  open: boolean;
  item: StatItem | null;
  onClose: () => void;
  onSaved: () => void;
}> = ({ open, item, onClose, onSaved }) => {
  const isEdit = Boolean(item);
  const methods = useForm<StatFormValues>({
    defaultValues: { label: '', value: '', suffix: '' },
  });

  const { register, formState, reset } = methods;

  React.useEffect(() => {
    if (!open) return;
    reset({
      label: item?.label || '',
      value: item?.value !== undefined && item?.value !== null ? String(item.value) : '',
      suffix: item?.suffix || '',
    });
  }, [open, item, reset]);

  return (
    <FormModal<StatFormValues>
      open={open}
      item={item}
      resource="site-stats"
      title={isEdit ? 'Edit Stat' : 'Add Stat'}
      description="Counter shown on the homepage (e.g. 5,000+ Happy Clients)."
      methods={methods}
      onClose={onClose}
      onSaved={onSaved}
      toPayload={(values) => ({
        label: values.label.trim(),
        value: Number(values.value),
        suffix: values.suffix.trim(),
      })}
      validate={(values) => {
        if (!values.label.trim()) return 'Label is required';
        if (values.value.trim() === '' || Number.isNaN(Number(values.value)))
          return 'Value must be a number';
        return null;
      }}
    >
      <TextField
        label="Label"
        required
        placeholder="e.g. Happy Clients"
        error={formState.errors.label?.message}
        {...register('label', { required: 'Label is required' })}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <TextField
          label="Value"
          required
          type="number"
          min="0"
          placeholder="5000"
          error={formState.errors.value?.message}
          {...register('value', { required: 'Value is required' })}
        />
        <TextField
          label="Suffix"
          hint="Optional symbol or text after the number."
          placeholder="+"
          {...register('suffix')}
        />
      </div>
    </FormModal>
  );
};

export const StatsManager: React.FC = () => {
  const hook = useResourceManager<StatItem>({
    resource: 'site-stats',
    queryKey: 'site-stats',
    canReorder: true,
    searchKeys: ['label'],
  });

  return (
    <ResourceManager<StatItem>
      hook={hook}
      title="Site Stats"
      description="Homepage counter numbers. Drag rows to reorder."
      singular="Stat"
      icon={BarChart3}
      emptyTitle="No stats yet"
      emptyDescription="Add stats to display achievement counters on the homepage."
      canReorder
      searchPlaceholder="Search stats…"
      rowLabel={(item) => item.label}
      FormModal={StatFormModal}
      columns={[
        {
          key: 'label',
          header: 'Stat',
          render: (item) => (
            <p className="text-sm font-semibold text-slate-700 truncate">{item.label}</p>
          ),
          className: 'md:flex-[2]',
        },
        {
          key: 'value',
          header: 'Value',
          render: (item) => (
            <p className="text-sm font-bold text-brand-navy">
              {item.value}
              {item.suffix && (
                <span className="ml-0.5 text-amber-500">{item.suffix}</span>
              )}
            </p>
          ),
          className: 'w-28 shrink-0',
        },
      ]}
    />
  );
};

export default StatsManager;
