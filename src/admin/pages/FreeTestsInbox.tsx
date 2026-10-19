import React from 'react';
import { FlaskConical } from 'lucide-react';
import type { FreeTest } from '../../lib/types';
import { useInbox } from '../inbox/useInbox';
import { InboxPage } from '../inbox/InboxPage';
import { FREE_TEST_STATUS_OPTIONS } from '../inbox/status';

export const FreeTestsInbox: React.FC = () => {
  const hook = useInbox<FreeTest>({ resource: 'free-tests', queryKey: 'free-tests' });

  return (
    <InboxPage<FreeTest>
      hook={hook}
      title="Free Test Requests"
      description="Free trial edit submissions with image uploads."
      icon={FlaskConical}
      emptyTitle="No free test requests"
      emptyDescription="New free test submissions will appear here."
      exportName="free-test-requests"
      exportFields={(item) => ({
        name: item.name,
        email: item.email,
        whatsapp: item.whatsapp,
        service: item.service,
        fileCount: item.files?.length || 0,
        status: item.status,
        createdAt: item.createdAt,
      })}
      columns={[
        {
          key: 'name',
          header: 'Customer',
          render: (item) => (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">{item.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{item.email}</p>
            </div>
          ),
          grow: 2,
        },
        {
          key: 'service',
          header: 'Service',
          render: (item) => (
            <p className="text-xs text-slate-500 truncate">{item.service || '—'}</p>
          ),
        },
        {
          key: 'files',
          header: 'Files',
          render: (item) => (
            <div className="flex items-center gap-1">
              {(item.files || []).slice(0, 3).map((file) => (
                <span
                  key={file.url}
                  className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0"
                >
                  <img src={file.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                </span>
              ))}
              {!item.files?.length && <span className="text-xs text-slate-400">—</span>}
              {(item.files?.length || 0) > 3 && (
                <span className="text-[10px] text-slate-400 font-semibold">
                  +{item.files!.length - 3}
                </span>
              )}
            </div>
          ),
        },
        {
          key: 'date',
          header: 'Date',
          render: (item) => (
            <p className="text-xs text-slate-400 whitespace-nowrap">
              {new Date(item.createdAt).toLocaleDateString()}
            </p>
          ),
        },
      ]}
      statusOptions={FREE_TEST_STATUS_OPTIONS}
      statusFor={(item) => item.status}
      filesFor={(item) => item.files}
      titleFor={(item) => item.name}
      subtitleFor={(item) => item.email}
      detailRows={(item) => [
        { label: 'Name', value: item.name },
        { label: 'Email', value: item.email || '—' },
        { label: 'WhatsApp', value: item.whatsapp || '—' },
        { label: 'Service', value: item.service || '—' },
        { label: 'Files', value: `${item.files?.length || 0} uploaded` },
        {
          label: 'Submitted',
          value: new Date(item.createdAt).toLocaleString(),
        },
      ]}
    />
  );
};

export default FreeTestsInbox;
