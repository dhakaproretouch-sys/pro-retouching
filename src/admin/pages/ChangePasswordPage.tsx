import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { KeyRound, ShieldCheck } from 'lucide-react';
import api, { getApiErrorMessage } from '../../lib/api';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';
import { TextField } from '../resource/fields';

interface ChangePasswordValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const STRENGTH_LABELS = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['bg-red-300', 'bg-red-400', 'bg-amber-400', 'bg-lime-400', 'bg-emerald-500'];

function scorePassword(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(score, 4);
}

export const ChangePasswordPage: React.FC = () => {
  const methods = useForm<ChangePasswordValues>({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const { register, handleSubmit, formState, watch, reset } = methods;
  const newPassword = watch('newPassword', '');
  const strength = scorePassword(newPassword);

  const mutation = useMutation({
    mutationFn: async (values: { currentPassword: string; newPassword: string }) => {
      await api.put('/auth/change-password', values);
    },
    onSuccess: () => {
      toast.success('Password updated');
      reset();
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Failed to update password')),
  });

  const onSubmit = handleSubmit((values) => {
    mutation.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  });

  return (
    <div className="max-w-xl">
      <PageHeader
        title="Change Password"
        description="Update your admin account password."
      />

      <Card>
        <form onSubmit={(event) => { event.preventDefault(); void onSubmit(); }} noValidate className="space-y-5">
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-xs text-amber-700">
              Use at least 8 characters. A mix of letters, numbers and symbols is recommended.
            </p>
          </div>

          <TextField
            label="Current Password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Enter current password"
            error={formState.errors.currentPassword?.message}
            {...register('currentPassword', {
              required: 'Current password is required',
            })}
          />

          <div>
            <TextField
              label="New Password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Enter new password"
              error={formState.errors.newPassword?.message}
              {...register('newPassword', {
                required: 'New password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />
            {newPassword && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${STRENGTH_COLORS[strength]}`}
                    style={{ width: `${(strength / 4) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 w-16 text-right">
                  {STRENGTH_LABELS[strength]}
                </span>
              </div>
            )}
          </div>

          <TextField
            label="Confirm New Password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Re-enter new password"
            error={formState.errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your new password',
              validate: (value) =>
                value === watch('newPassword') || 'Passwords do not match',
            })}
          />

          <div className="flex justify-end pt-2">
            <Button type="submit" icon={<KeyRound className="w-4 h-4" />} loading={mutation.isPending}>
              Update Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ChangePasswordPage;
