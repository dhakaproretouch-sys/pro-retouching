import React from 'react';
import { useForm } from 'react-hook-form';
import { Images } from 'lucide-react';
import type { ClientLogo } from '../../lib/types';
import { ResourceManager, Thumb } from '../resource/ResourceManager';
import { useResourceManager } from '../resource/useResourceManager';
import { FormModal } from '../resource/FormModal';
import { TextField } from '../resource/fields';
import { ImageField } from '../components/ImageField';

interface LogoFormValues {
  name: string;
  image: string;
}

const LogoFormModal: React.FC<{
  open: boolean;
  item: ClientLogo | null;
  onClose: () => void;
  onSaved: () => void;
}> = ({ open, item, onClose, onSaved }) => {
  const isEdit = Boolean(item);
  const methods = useForm<LogoFormValues>({
    defaultValues: { name: '', image: '' },
  });

  const { register, formState, reset, watch, setValue } = methods;

  React.useEffect(() => {
    if (!open) return;
    reset({
      name: item?.name || '',
      image: item?.image || '',
    });
  }, [open, item, reset]);

  return (
    <FormModal<LogoFormValues>
      open={open}
      item={item}
      resource="logos"
      title={isEdit ? 'Edit Logo' : 'Add Logo'}
      description="Client logos shown in the public trust strip."
      methods={methods}
      onClose={onClose}
      onSaved={onSaved}
      toPayload={(values) => ({
        name: values.name.trim(),
        image: values.image,
      })}
      validate={(values) => (!values.name.trim() ? 'Client name is required' : null)}
    >
      <TextField
        label="Client Name"
        required
        placeholder="e.g. Amazon"
        error={formState.errors.name?.message}
        {...register('name', { required: 'Client name is required' })}
      />

      <ImageField
        label="Logo Image"
        value={watch('image')}
        onChange={(url) => setValue('image', url)}
        hint="Transparent PNG or SVG works best."
      />
    </FormModal>
  );
};

export const LogosManager: React.FC = () => {
  const hook = useResourceManager<ClientLogo>({
    resource: 'logos',
    queryKey: 'logos',
    canReorder: true,
    searchKeys: ['name'],
  });

  return (
    <ResourceManager<ClientLogo>
      hook={hook}
      title="Client Logos"
      description="Brand logos shown to build trust. Drag rows to reorder."
      singular="Logo"
      icon={Images}
      emptyTitle="No client logos yet"
      emptyDescription="Add client logos to display on the public site."
      canReorder
      searchPlaceholder="Search clients…"
      rowLabel={(item) => item.name}
      FormModal={LogoFormModal}
      columns={[
        {
          key: 'name',
          header: 'Client',
          render: (item) => (
            <div className="flex items-center gap-3 min-w-0">
              <Thumb src={item.image} alt={item.name} className="w-16 h-10" />
              <p className="text-sm font-semibold text-slate-700 truncate">{item.name}</p>
            </div>
          ),
          className: 'md:flex-[2]',
        },
      ]}
    />
  );
};

export default LogosManager;
