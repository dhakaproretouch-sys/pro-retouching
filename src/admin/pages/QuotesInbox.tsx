import React from 'react';
import { Inbox } from 'lucide-react';
import type { Quote } from '../../lib/types';
import { useInbox } from '../inbox/useInbox';
import { InboxPage } from '../inbox/InboxPage';
import { QUOTE_STATUS_OPTIONS } from '../inbox/status';

export const QuotesInbox: React.FC = () => {
  const hook = useInbox<Quote>({ resource: 'quotes', queryKey: 'quotes' });

  return (
    <InboxPage<Quote>
      hook={hook}
      title="Quote Requests"
      description="Incoming quote requests from the public quote form."
      icon={Inbox}
      emptyTitle="No quote requests"
      emptyDescription="New quote submissions will appear here."
      exportName="quote-requests"
      exportFields={(item) => ({
        email: item.email,
        service: item.service,
        quantity: item.quantity,
        status: item.status,
        createdAt: item.createdAt,
      })}
      columns={[
        {
          key: 'email',
          header: 'Customer',
          render: (item) => (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">{item.email}</p>
            </div>
          ),
          grow: 2,
        },
        {
          key: 'service',
          header: 'Service',
          render: (item) => (
            <p className="text-xs text-slate-500 truncate">
              {item.service || '—'}
              {item.quantity ? ` · qty ${item.quantity}` : ''}
            </p>
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
      statusOptions={QUOTE_STATUS_OPTIONS}
      statusFor={(item) => item.status}
      titleFor={(item) => item.email}
      subtitleFor={() => undefined}
      detailRows={(item) => [
        { label: 'Email', value: item.email || '—' },
        { label: 'Service', value: item.service || '—' },
        { label: 'Quantity', value: item.quantity || '—' },
        {
          label: 'Submitted',
          value: new Date(item.createdAt).toLocaleString(),
        },
      ]}
    />
  );
};

export default QuotesInbox;
