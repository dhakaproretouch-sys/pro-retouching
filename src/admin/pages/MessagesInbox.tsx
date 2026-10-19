import React from 'react';
import { Mail } from 'lucide-react';
import type { Message } from '../../lib/types';
import { useInbox } from '../inbox/useInbox';
import { InboxPage } from '../inbox/InboxPage';
import { Badge } from '../components/Badge';

export const MessagesInbox: React.FC = () => {
  const hook = useInbox<Message>({ resource: 'messages', queryKey: 'messages' });

  // Mark a message as read as soon as its drawer is opened.
  const selectedId = hook.selected?._id;
  const selectedIsRead = hook.selected?.isRead;
  const markRead = hook.markRead;
  React.useEffect(() => {
    if (selectedId && selectedIsRead === false) {
      markRead(selectedId);
    }
  }, [selectedId, selectedIsRead, markRead]);

  return (
    <InboxPage<Message>
      hook={hook}
      title="Messages"
      description="General contact-form messages."
      icon={Mail}
      emptyTitle="No messages"
      emptyDescription="Contact-form submissions will appear here."
      exportName="messages"
      exportFields={(item) => ({
        name: item.name,
        email: item.email,
        phone: item.phone,
        service: item.service,
        message: item.message,
        isRead: item.isRead ? 'yes' : 'no',
        createdAt: item.createdAt,
      })}
      columns={[
        {
          key: 'name',
          header: 'From',
          render: (item) => (
            <div className="min-w-0">
              <p
                className={`text-sm truncate ${
                  item.isRead ? 'text-slate-600' : 'font-bold text-slate-800'
                }`}
              >
                {item.name}
                {!item.isRead && (
                  <Badge tone="red" className="ml-2 align-middle">
                    Unread
                  </Badge>
                )}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{item.email}</p>
            </div>
          ),
          grow: 2,
        },
        {
          key: 'message',
          header: 'Message',
          render: (item) => (
            <p className={`text-xs truncate ${item.isRead ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>
              {item.message || '—'}
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
      titleFor={(item) => item.name}
      subtitleFor={(item) => item.email}
      detailRows={(item) => [
        { label: 'Name', value: item.name },
        { label: 'Email', value: item.email || '—' },
        { label: 'Phone', value: item.phone || '—' },
        { label: 'Service', value: item.service || '—' },
        { label: 'Message', value: <span className="whitespace-pre-wrap">{item.message}</span> },
        {
          label: 'Submitted',
          value: new Date(item.createdAt).toLocaleString(),
        },
      ]}
    />
  );
};

export default MessagesInbox;
